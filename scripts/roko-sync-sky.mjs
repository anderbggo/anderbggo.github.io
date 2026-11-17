// Copies into the summary document (roko_summary/sky) every light that isn't there yet.
// Run it once after publishing the rules, and again if lights ever end up missing from the summary
// (the page then falls back to reading the whole collection, which costs many more reads).
// Uses the same public API and rules as the website, so it needs no admin credentials.
//
//   npm run roko:sync-sky
import { readFileSync } from "node:fs";

function readEnv() {
  const env = { ...process.env };
  try {
    for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (match && !env[match[1]]) env[match[1]] = match[2];
    }
  } catch {
    // No .env.local: rely on the environment.
  }
  return env;
}

const env = readEnv();
const projectId = env.VITE_FIREBASE_PROJECT_ID?.trim();
const apiKey = env.VITE_FIREBASE_API_KEY?.trim();
if (!projectId) {
  console.error("Missing VITE_FIREBASE_PROJECT_ID (in .env.local or the environment).");
  process.exit(1);
}

const documentsPath = `projects/${projectId}/databases/(default)/documents`;
const apiBase = `https://firestore.googleapis.com/v1/${documentsPath}`;

function endpoint(path, params = {}) {
  const url = new URL(`${apiBase}${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  if (apiKey) url.searchParams.set("key", apiKey);
  return url.toString();
}

async function request(url, init) {
  const response = await fetch(url, { ...init, headers: { "Content-Type": "application/json" } });
  if (!response.ok) {
    const error = new Error(`${response.status} ${await response.text()}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function listTributes() {
  const documents = [];
  let pageToken;
  do {
    const page = await request(endpoint("/roko_tributes", { pageSize: "300", ...(pageToken ? { pageToken } : {}) }));
    documents.push(...(page.documents ?? []));
    pageToken = page.nextPageToken;
  } while (pageToken);
  return documents;
}

async function readSky() {
  try {
    const document = await request(endpoint("/roko_summary/sky"));
    return new Set(Object.keys(document.fields?.lights?.mapValue?.fields ?? {}));
  } catch (error) {
    if (error.status === 404) return new Set();
    throw error;
  }
}

const idOf = (document) => document.name.split("/").pop();
const tributes = await listTributes();
const inSky = await readSky();
const missing = tributes
  .filter((document) => !inSky.has(idOf(document)))
  .sort((a, b) => (a.fields?.createdAt?.timestampValue ?? "").localeCompare(b.fields?.createdAt?.timestampValue ?? ""));

console.log(`${tributes.length} lights, ${inSky.size} already in the summary, ${missing.length} to add.`);

let added = 0;
for (const document of missing) {
  const id = idOf(document);
  const entry = `lights.\`${id}\``;
  try {
    // The rules require an exact copy of the light, so its fields are sent untouched.
    await request(endpoint(":commit"), {
      method: "POST",
      body: JSON.stringify({
        writes: [
          {
            update: {
              name: `${documentsPath}/roko_summary/sky`,
              fields: {
                lastId: { stringValue: id },
                lights: { mapValue: { fields: { [id]: { mapValue: { fields: document.fields } } } } },
              },
            },
            updateMask: { fieldPaths: ["lastId", entry] },
          },
        ],
      }),
    });
    added++;
  } catch (error) {
    console.error(`Could not add ${id}: ${error.message}`);
  }
}

console.log(`Added ${added} of ${missing.length}.`);
if (added < missing.length) process.exit(1);
