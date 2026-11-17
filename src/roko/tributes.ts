export type TributeKind = "candle" | "lantern";

export type Tribute = {
  id: string;
  kind: TributeKind;
  name: string;
  message: string;
  createdAt: string;
};

export type TributeDraft = Pick<Tribute, "kind" | "name" | "message">;
export type TributeCounts = Record<TributeKind, number>;
export type TributeSnapshot = { tributes: Tribute[]; counts: TributeCounts };

export const tributeLimits = { name: 40, message: 280 } as const;

const collectionId = "roko_tributes";
/** Every light in one document, so a visit costs one read however many lights there are. */
const skyPath = "/roko_summary/sky";
/** Fallback page size; matches what the sky can show at once (60 lanterns + 90 candles). */
const pageSize = 150;
const signedPageSize = 500;
const localStorageKey = "roko-tributes";
const cacheKey = "roko-tributes-cache";
/** Reloads within this window reuse the last result instead of asking Firestore again. */
const cacheMs = 2 * 60_000;

export function hasWords(tribute: Pick<Tribute, "message">) {
  return tribute.message.trim().length > 0;
}

export function hasName(tribute: Pick<Tribute, "name">) {
  return tribute.name.trim().length > 0;
}

/** 0 = left a message, 1 = only signed, 2 = anonymous and silent. Lower shows first when the sky is full. */
export function tributeRank(tribute: Tribute) {
  return hasWords(tribute) ? 0 : hasName(tribute) ? 1 : 2;
}

const projectId = (import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined)?.trim();
const apiKey = (import.meta.env.VITE_FIREBASE_API_KEY as string | undefined)?.trim();
const documentsPath = `projects/${projectId}/databases/(default)/documents`;
const apiBase = `https://firestore.googleapis.com/v1/${documentsPath}`;

/** Without a Firebase project the page still works, but tributes stay in this browser. */
export const usesSharedStore = Boolean(projectId);

type FirestoreValue = {
  stringValue?: string;
  timestampValue?: string;
  integerValue?: string;
  mapValue?: { fields?: Record<string, FirestoreValue> };
};
type FirestoreDocument = { name: string; createTime?: string; fields?: Record<string, FirestoreValue> };

class FirestoreError extends Error {
  constructor(readonly status: number) {
    super(`Firestore request failed with ${status}`);
  }
}

function isTributeKind(value: unknown): value is TributeKind {
  return value === "candle" || value === "lantern";
}

function clip(value: string, max: number) {
  const clipped = value.trim().slice(0, max);
  return /[\uD800-\uDBFF]$/.test(clipped) ? clipped.slice(0, -1) : clipped;
}

function normalizeDraft(draft: TributeDraft): TributeDraft {
  return {
    kind: draft.kind,
    name: clip(draft.name.replace(/\s+/g, " "), tributeLimits.name),
    message: clip(draft.message.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n"), tributeLimits.message),
  };
}

function countTributes(tributes: Tribute[]): TributeCounts {
  return {
    candle: tributes.filter((tribute) => tribute.kind === "candle").length,
    lantern: tributes.filter((tribute) => tribute.kind === "lantern").length,
  };
}

function newestFirst(a: Tribute, b: Tribute) {
  return b.createdAt.localeCompare(a.createdAt);
}

function endpoint(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${apiBase}${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  if (apiKey) url.searchParams.set("key", apiKey);
  return url.toString();
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) throw new FirestoreError(response.status);
  return (await response.json()) as T;
}

function parseFields(id: string, fields: Record<string, FirestoreValue>, fallbackDate?: string): Tribute | null {
  const kind = fields.kind?.stringValue;
  if (!isTributeKind(kind)) return null;

  return {
    id,
    kind,
    name: fields.name?.stringValue ?? "",
    message: fields.message?.stringValue ?? "",
    createdAt: fields.createdAt?.timestampValue ?? fallbackDate ?? new Date().toISOString(),
  };
}

function parseDocument(document: FirestoreDocument): Tribute | null {
  return parseFields(document.name.split("/").pop() ?? document.name, document.fields ?? {}, document.createTime);
}

type FieldFilter = { fieldFilter: { field: { fieldPath: string }; op: string; value: FirestoreValue } };

const kindFilter = (kind: TributeKind): FieldFilter => ({
  fieldFilter: { field: { fieldPath: "kind" }, op: "EQUAL", value: { stringValue: kind } },
});

// A != filter only needs Firestore's automatic single-field index, so no composite index has to be deployed.
const notEmpty = (fieldPath: "message" | "name"): FieldFilter => ({
  fieldFilter: { field: { fieldPath }, op: "NOT_EQUAL", value: { stringValue: "" } },
});

async function countShared(where?: FieldFilter) {
  const results = await requestJson<Array<{ result?: { aggregateFields?: Record<string, FirestoreValue> } }>>(
    endpoint(":runAggregationQuery"),
    {
      method: "POST",
      body: JSON.stringify({
        structuredAggregationQuery: {
          structuredQuery: { from: [{ collectionId }], ...(where ? { where } : {}) },
          aggregations: [{ alias: "total", count: {} }],
        },
      }),
    },
  );
  const total = results.find((entry) => entry.result)?.result?.aggregateFields?.total?.integerValue;
  return Number(total ?? 0);
}

/**
 * Every light with a message or a name, however old: they go first when the sky is full, so they must not
 * depend on being among the latest page.
 */
async function fetchSharedWhere(where: FieldFilter) {
  const results = await requestJson<Array<{ document?: FirestoreDocument }>>(endpoint(":runQuery"), {
    method: "POST",
    body: JSON.stringify({
      structuredQuery: { from: [{ collectionId }], where, limit: signedPageSize },
    }),
  });
  return results.flatMap((entry) => (entry.document ? [entry.document] : []));
}

/** The old way: the latest page plus every older light with a message or a name. Costs one read per light. */
async function fetchCollection(): Promise<TributeSnapshot> {
  const [list, candles, lanterns] = await Promise.all([
    requestJson<{ documents?: FirestoreDocument[] }>(
      endpoint(`/${collectionId}`, { pageSize: String(pageSize), orderBy: "createdAt desc" }),
    ),
    countShared(kindFilter("candle")).catch(() => null),
    countShared(kindFilter("lantern")).catch(() => null),
  ]);
  const latest = list.documents ?? [];

  // Older lights with a message or a name only exist outside the latest page once it's full; skipping these
  // queries otherwise avoids reading the same documents twice.
  const older =
    latest.length < pageSize
      ? []
      : (
          await Promise.all([
            fetchSharedWhere(notEmpty("message")).catch(() => []),
            fetchSharedWhere(notEmpty("name")).catch(() => []),
          ])
        ).flat();

  const byId = new Map<string, Tribute>();
  [...latest, ...older].forEach((document) => {
    const tribute = parseDocument(document);
    if (tribute) byId.set(tribute.id, tribute);
  });
  const tributes = [...byId.values()].sort(newestFirst);
  const listedCounts = countTributes(tributes);

  return {
    tributes,
    counts: {
      candle: Math.max(candles ?? 0, listedCounts.candle),
      lantern: Math.max(lanterns ?? 0, listedCounts.lantern),
    },
  };
}

async function fetchSky(): Promise<Tribute[] | null> {
  try {
    const document = await requestJson<FirestoreDocument>(endpoint(skyPath));
    const lights = document.fields?.lights?.mapValue?.fields ?? {};
    return Object.entries(lights).flatMap(([id, value]) => {
      const tribute = parseFields(id, value.mapValue?.fields ?? {});
      return tribute ? [tribute] : [];
    });
  } catch (error) {
    if (error instanceof FirestoreError && error.status === 404) return null;
    throw error;
  }
}

/**
 * Two reads per visit: the summary document and a count of the whole collection. The summary is only trusted when it
 * holds every light; otherwise (not migrated yet, or a light that was saved without it) the collection is read instead.
 */
async function fetchShared(): Promise<TributeSnapshot> {
  const [sky, total] = await Promise.all([fetchSky().catch(() => null), countShared().catch(() => null)]);
  if (sky && total !== null && sky.length >= total) {
    const tributes = sky.sort(newestFirst);
    return { tributes, counts: countTributes(tributes) };
  }
  return fetchCollection();
}

function tributeFields(draft: TributeDraft) {
  return {
    kind: { stringValue: draft.kind },
    name: { stringValue: draft.name },
    message: { stringValue: draft.message },
  };
}

async function commitTribute(id: string, draft: TributeDraft, withSky: boolean) {
  const writes: unknown[] = [
    {
      update: { name: `${documentsPath}/${collectionId}/${id}`, fields: tributeFields(draft) },
      updateTransforms: [{ fieldPath: "createdAt", setToServerValue: "REQUEST_TIME" }],
      currentDocument: { exists: false },
    },
  ];
  if (withSky) {
    // Same commit, same REQUEST_TIME: the summary entry is an exact copy, which is what the rules check.
    const entry = `lights.\`${id}\``;
    writes.push({
      update: {
        name: `${documentsPath}${skyPath}`,
        fields: {
          lastId: { stringValue: id },
          lights: { mapValue: { fields: { [id]: { mapValue: { fields: tributeFields(draft) } } } } },
        },
      },
      updateMask: { fieldPaths: ["lastId", entry] },
      updateTransforms: [{ fieldPath: `${entry}.createdAt`, setToServerValue: "REQUEST_TIME" }],
    });
  }
  return requestJson<{ commitTime?: string; writeResults?: Array<{ transformResults?: FirestoreValue[] }> }>(
    endpoint(":commit"),
    { method: "POST", body: JSON.stringify({ writes }) },
  );
}

async function createShared(draft: TributeDraft): Promise<Tribute> {
  const id = crypto.randomUUID();
  let result;
  try {
    result = await commitTribute(id, draft, true);
  } catch (error) {
    // Rejected because of the summary (rules not published yet, or the document is full): save the light alone.
    if (!(error instanceof FirestoreError) || (error.status !== 400 && error.status !== 403)) throw error;
    result = await commitTribute(id, draft, false);
  }

  return {
    id,
    ...draft,
    createdAt:
      result.writeResults?.[0]?.transformResults?.[0]?.timestampValue ?? result.commitTime ?? new Date().toISOString(),
  };
}

function isStoredTribute(value: unknown): value is Tribute {
  if (!value || typeof value !== "object") return false;
  const tribute = value as Record<string, unknown>;
  return (
    typeof tribute.id === "string" &&
    isTributeKind(tribute.kind) &&
    typeof tribute.name === "string" &&
    typeof tribute.message === "string" &&
    typeof tribute.createdAt === "string"
  );
}

function readLocal(): Tribute[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(localStorageKey) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isStoredTribute) : [];
  } catch {
    return [];
  }
}

type CachedSnapshot = { savedAt: number; snapshot: TributeSnapshot };

function readCache(): CachedSnapshot | null {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(cacheKey) ?? "null") as CachedSnapshot | null;
    const snapshot = parsed?.snapshot;
    if (
      typeof parsed?.savedAt !== "number" ||
      !Array.isArray(snapshot?.tributes) ||
      typeof snapshot.counts?.candle !== "number" ||
      typeof snapshot.counts?.lantern !== "number"
    ) {
      return null;
    }
    return { savedAt: parsed.savedAt, snapshot: { ...snapshot, tributes: snapshot.tributes.filter(isStoredTribute) } };
  } catch {
    return null;
  }
}

function writeCache(snapshot: TributeSnapshot, savedAt = Date.now()) {
  try {
    window.localStorage.setItem(cacheKey, JSON.stringify({ savedAt, snapshot }));
  } catch {
    // Storage full or blocked: the page simply fetches again next time.
  }
}

export async function fetchTributes(): Promise<TributeSnapshot> {
  if (!usesSharedStore) {
    const tributes = readLocal().sort(newestFirst);
    return { tributes, counts: countTributes(tributes) };
  }

  const cached = readCache();
  if (cached && Date.now() - cached.savedAt < cacheMs) return cached.snapshot;
  try {
    const snapshot = await fetchShared();
    writeCache(snapshot);
    return snapshot;
  } catch (error) {
    // If Firestore is unreachable (or the daily quota ran out), an older sky is better than an empty one.
    if (cached) return cached.snapshot;
    throw error;
  }
}

export async function createTribute(draft: TributeDraft): Promise<Tribute> {
  const normalized = normalizeDraft(draft);
  if (usesSharedStore) {
    const tribute = await createShared(normalized);
    // Keep the cached sky in step so a reload still shows the light that was just sent.
    const cached = readCache();
    if (cached) {
      const { tributes, counts } = cached.snapshot;
      writeCache(
        { tributes: [tribute, ...tributes], counts: { ...counts, [tribute.kind]: counts[tribute.kind] + 1 } },
        cached.savedAt,
      );
    }
    return tribute;
  }

  const tribute: Tribute = { id: crypto.randomUUID(), ...normalized, createdAt: new Date().toISOString() };
  window.localStorage.setItem(localStorageKey, JSON.stringify([tribute, ...readLocal()]));
  return tribute;
}
