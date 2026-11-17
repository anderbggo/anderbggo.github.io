import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { Moon, Sun, Volume2, VolumeX } from "lucide-react";
import HomeLink from "../HomeLink";
import {
  getInitialLanguageSpanishFirst,
  getInitialThemePreference,
  saveLanguagePreference,
  saveThemePreference,
  type SiteLanguage as Language,
  type SiteThemePreference as ThemePreference,
} from "../sitePreferences";
import { copy } from "./content";
import { Light, useLightNote, type LightNoteLabels } from "./lightNote";
import { CandleIcon, LanternIcon } from "./lights";
import { Lullaby } from "./music";
import PhotoAlbum from "./PhotoAlbum";
import RokoSilhouette from "./RokoSilhouette";
import {
  createTribute,
  fetchTributes,
  hasWords,
  tributeLimits,
  tributeRank,
  type Tribute,
  type TributeCounts,
  type TributeKind,
} from "./tributes";

type ExplicitTheme = Exclude<ThemePreference, "system">;
type LoadState = "loading" | "ready" | "error";
type SendState = "idle" | "sending" | "success" | "error" | "cooldown";

const farewellDate = new Date(2021, 9, 24);
const cooldownKey = "roko-last-tribute";
const cooldownMs = 30_000;
const maxLanterns = 60;
const maxCandles = 90;

function getSystemTheme(): ExplicitTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getMemorialInfo(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return {
    days: Math.round((today.getTime() - farewellDate.getTime()) / 86_400_000),
    years: now.getFullYear() - farewellDate.getFullYear(),
    isAnniversary: now.getMonth() === farewellDate.getMonth() && now.getDate() === farewellDate.getDate(),
  };
}

/** Stable pseudo-random number in [0, 1) so each light keeps its place between visits. */
function seeded(id: string, salt: number) {
  let hash = 2166136261 ^ salt;
  for (let index = 0; index < id.length; index++) {
    hash ^= id.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 10_000) / 10_000;
}

/**
 * When there are more lights than room: first those with a message, then those with just a name, then the rest;
 * newest first within each group.
 */
function pickLights(tributes: Tribute[], kind: TributeKind, max: number) {
  const ofKind = tributes.filter((tribute) => tribute.kind === kind);
  const picked = new Set(
    [...ofKind].sort((a, b) => tributeRank(a) - tributeRank(b) || b.createdAt.localeCompare(a.createdAt)).slice(0, max),
  );
  return ofKind.filter((tribute) => picked.has(tribute));
}

function HandCircle() {
  return (
    <svg className="roko-hand-circle" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      <path d="M12 30C2 22 10 6 48 4c36-2 50 8 48 18-2 12-30 16-56 15C16 36 4 28 8 18 11 10 26 6 40 6" pathLength={1} />
    </svg>
  );
}

function WaxSeal() {
  return (
    <svg className="roko-seal" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path
        className="roko-seal-wax"
        d="M50 3c8 0 11 6 18 7s13-1 16 6 0 12 4 18 10 9 8 17-8 9-9 16 3 13-3 18-12 2-18 6-8 10-16 9-10-6-17-8-14 2-18-4-1-12-5-18-11-8-10-16 7-10 7-17-6-12 0-18 12-2 18-6S42 3 50 3Z"
      />
      <circle className="roko-seal-ring" cx="50" cy="50" r="31" />
      <g className="roko-seal-paw">
        <ellipse cx="50" cy="58" rx="12" ry="10" />
        <ellipse cx="34" cy="44" rx="5.5" ry="7" transform="rotate(-20 34 44)" />
        <ellipse cx="44" cy="36" rx="5.5" ry="7.5" transform="rotate(-6 44 36)" />
        <ellipse cx="56" cy="36" rx="5.5" ry="7.5" transform="rotate(6 56 36)" />
        <ellipse cx="66" cy="44" rx="5.5" ry="7" transform="rotate(20 66 44)" />
      </g>
    </svg>
  );
}


export default function RokoApp() {
  const [language, setLanguage] = useState<Language>(getInitialLanguageSpanishFirst);
  const [themePreference, setThemePreference] = useState<ThemePreference>(getInitialThemePreference);
  const [systemTheme, setSystemTheme] = useState<ExplicitTheme>(getSystemTheme);
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [counts, setCounts] = useState<TributeCounts>({ candle: 0, lantern: 0 });
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [kind, setKind] = useState<TributeKind>("lantern");
  const [name, setName] = useState("");
  const [withWords, setWithWords] = useState(true);
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [sendState, setSendState] = useState<SendState>("idle");
  const [freshId, setFreshId] = useState<string | null>(null);
  const [wagging, setWagging] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const music = useRef<Lullaby>();
  const wagTimer = useRef<number>();
  const messageField = useRef<HTMLTextAreaElement>(null);
  const focusMessage = useRef(false);
  const text = copy[language];
  const memorial = useMemo(() => getMemorialInfo(), []);
  const numberFormat = useMemo(() => new Intl.NumberFormat(language), [language]);
  const dateFormat = useMemo(() => new Intl.DateTimeFormat(language, { dateStyle: "long" }), [language]);
  const { active: activeLight, handlers: lightHandlers } = useLightNote();
  const noteLabels: LightNoteLabels = useMemo(
    () => ({ formatDate: (iso: string) => dateFormat.format(new Date(iso)) }),
    [dateFormat],
  );
  const lightProps = { labels: noteLabels, active: activeLight, handlers: lightHandlers };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => setSystemTheme(mediaQuery.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", updateSystemTheme);
    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.siteTheme = themePreference;
    document.title = text.pageTitle;
    saveLanguagePreference(language);
    saveThemePreference(themePreference);
  }, [language, text.pageTitle, themePreference]);

  useEffect(() => () => window.clearTimeout(wagTimer.current), []);

  useEffect(() => () => music.current?.stop(), []);

  const toggleMusic = () => {
    music.current ??= new Lullaby();
    if (musicOn) {
      music.current.stop();
      setMusicOn(false);
    } else {
      setMusicOn(true);
      music.current.start().catch(() => setMusicOn(false));
    }
  };

  useEffect(() => {
    // Only when the visitor opens the letter themselves; focusing on load would jump the page to the form.
    if (withWords && focusMessage.current) messageField.current?.focus();
    focusMessage.current = false;
  }, [withWords]);

  const load = useCallback(async () => {
    setLoadState("loading");
    try {
      const snapshot = await fetchTributes();
      setTributes(snapshot.tributes);
      setCounts(snapshot.counts);
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const totalLights = counts.candle + counts.lantern;

  const resetStatus = () => setSendState((current) => (current === "sending" ? current : "idle"));
  const hasMessage = withWords && message.trim().length > 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sendState === "sending") return;

    const lastTribute = Number(window.localStorage.getItem(cooldownKey) ?? 0);
    if (Date.now() - lastTribute < cooldownMs) {
      setSendState("cooldown");
      return;
    }

    setSendState("sending");
    try {
      // Bots tend to fill every field; pretend it worked without saving anything.
      if (honeypot) {
        setSendState("success");
        return;
      }
      const tribute = await createTribute({
        kind,
        name: withWords ? name : "",
        message: hasMessage ? message : "",
      });
      window.localStorage.setItem(cooldownKey, String(Date.now()));
      setTributes((current) => [tribute, ...current]);
      setCounts((current) => ({ ...current, [tribute.kind]: current[tribute.kind] + 1 }));
      setFreshId(tribute.id);
      setMessage("");
      setSendState("success");
      setWagging(true);
      window.clearTimeout(wagTimer.current);
      wagTimer.current = window.setTimeout(() => setWagging(false), 4000);
    } catch {
      setSendState("error");
    }
  };

  const activeTheme = themePreference === "system" ? systemTheme : themePreference;
  const lanterns = pickLights(tributes, "lantern", maxLanterns);
  const candles = pickLights(tributes, "candle", maxCandles);
  const statusMessage =
    sendState === "success" ? text.success : sendState === "error" ? text.error : sendState === "cooldown" ? text.cooldown : "";

  return (
    <div className={`roko-site ${memorial.isAnniversary ? "is-anniversary" : ""}`}>
      <a className="roko-skip" href="#roko-main">
        {text.skip}
      </a>

      <header className="roko-header">
        <HomeLink language={language} />
        <div className="roko-toggles">
          <div role="group" aria-label={text.languageLabel}>
            {(["es", "en"] as const).map((option) => (
              <button key={option} type="button" aria-pressed={language === option} onClick={() => setLanguage(option)}>
                {option}
              </button>
            ))}
          </div>
          <div role="group" aria-label={text.themeLabel}>
            {(["light", "dark"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={activeTheme === option}
                aria-label={text[option]}
                title={text[option]}
                onClick={() => setThemePreference(option)}
              >
                {option === "light" ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="roko-music"
            aria-pressed={musicOn}
            aria-label={text.musicLabel}
            title={text.musicLabel}
            onClick={toggleMusic}
          >
            {musicOn ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <main id="roko-main">
        <section id="roko-sky" className="roko-scene" aria-labelledby="roko-title" aria-busy={loadState === "loading"}>
          <div className="roko-lanterns">
            {lanterns.map((tribute) => {
              const isFresh = tribute.id === freshId;
              const worded = hasWords(tribute);
              const style = {
                "--x": `${3 + seeded(tribute.id, 1) * 94}%`,
                "--scale": ((worded ? 0.8 : 0.55) + seeded(tribute.id, 2) * (worded ? 0.45 : 0.5)).toFixed(2),
                "--duration": `${26 + seeded(tribute.id, 3) * 18}s`,
                "--delay": isFresh ? "0s" : `-${(seeded(tribute.id, 4) * 44).toFixed(1)}s`,
                "--sway": `${3 + seeded(tribute.id, 5) * 3}s`,
              } as CSSProperties;
              return (
                <Light
                  key={tribute.id}
                  tribute={tribute}
                  prefix={text.lightPrefix.lantern}
                  className={`roko-lantern ${isFresh ? "is-fresh" : ""}`}
                  style={style}
                  {...lightProps}
                >
                  <LanternIcon withLetter={worded} />
                </Light>
              );
            })}
          </div>

          <div className="roko-scene-copy">
            <p className="roko-date">{text.date}</p>
            <h1 id="roko-title">Roko</h1>
            <p className="roko-epitaph">{text.epitaph}</p>
            <p className="roko-days">
              {memorial.isAnniversary
                ? text.anniversary(memorial.years)
                : text.daysSince(numberFormat.format(memorial.days))}
            </p>
            <p className="roko-progress" aria-live="polite">
              {loadState === "loading" && text.loading}
              {loadState === "ready" && text.progress(numberFormat.format(totalLights), totalLights)}
              {loadState === "error" && (
                <>
                  {text.loadError}{" "}
                  <button type="button" className="roko-retry" onClick={() => void load()}>
                    {text.retry}
                  </button>
                </>
              )}
            </p>
            <a className="roko-write-link" href="#roko-letter">
              {text.writeLink} <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="roko-hill">
            <svg className="roko-hill-shape" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 48C14 22 32 16 48 28s30 30 52 10V100H0Z" />
            </svg>
            <RokoSilhouette label={text.rokoLabel} phrases={text.rokoPhrases} wagging={wagging} />
            <div className="roko-candles">
              {candles.map((tribute) => (
                <Light
                  key={tribute.id}
                  tribute={tribute}
                  prefix={text.lightPrefix.candle}
                  className={`roko-candle ${tribute.id === freshId ? "is-fresh" : ""}`}
                  style={
                    {
                      "--flicker": `-${(seeded(tribute.id, 6) * 2).toFixed(2)}s`,
                      "--lift": `${Math.round(seeded(tribute.id, 7) * 10)}px`,
                    } as CSSProperties
                  }
                  {...lightProps}
                >
                  <CandleIcon withLetter={hasWords(tribute)} />
                </Light>
              ))}
            </div>
          </div>
        </section>

        <PhotoAlbum
          photos={text.photos}
          labels={{
            title: text.albumTitle,
            open: text.albumOpen,
            close: text.albumClose,
            previous: text.albumPrevious,
            next: text.albumNext,
          }}
        />

        <section id="roko-letter" className="roko-letter" aria-labelledby="roko-letter-title">
          <form className={`roko-letter-form ${sendState === "success" ? "is-sent" : ""}`} onSubmit={handleSubmit}>
            <h2 id="roko-letter-title">{text.lightTitle}</h2>

            <div role="radiogroup" aria-labelledby="roko-letter-title" className="roko-kind">
              {(["lantern", "candle"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={kind === option}
                  className={`roko-kind-option roko-kind-option--${option}`}
                  onClick={() => setKind(option)}
                >
                  <span className="roko-kind-art" aria-hidden="true">
                    {option === "lantern" ? <LanternIcon withLetter={hasMessage} /> : <CandleIcon withLetter={hasMessage} />}
                  </span>
                  <span className="roko-kind-name">
                    {text[option]}
                    {kind === option && <HandCircle />}
                  </span>
                  <span className="roko-kind-hint">{option === "lantern" ? text.lanternHint : text.candleHint}</span>
                </button>
              ))}
            </div>

            <div className={`roko-words ${withWords ? "is-open" : ""}`}>
              <button
                type="button"
                role="switch"
                aria-checked={withWords}
                aria-controls="roko-words-panel"
                className="roko-words-switch"
                onClick={() => {
                  focusMessage.current = !withWords;
                  setWithWords((current) => !current);
                  resetStatus();
                }}
              >
                <span className="roko-switch-track" aria-hidden="true">
                  <span className="roko-switch-thumb" />
                </span>
                <span className="roko-words-label">{text.addWords}</span>
                <span className="roko-optional-tag">{text.optionalTag}</span>
              </button>
              {withWords && <p className="roko-words-hint">{text.addWordsHint}</p>}

              {withWords && (
                <div id="roko-words-panel" className="roko-words-panel">
                  <p className="roko-letter-greeting" aria-hidden="true">
                    {text.letterGreeting}
                  </p>
                  <label className="roko-letter-body">
                    <span className="roko-sr-only">{text.messageLabel}</span>
                    <textarea
                      ref={messageField}
                      value={message}
                      maxLength={tributeLimits.message}
                      rows={4}
                      placeholder={text.messagePlaceholder}
                      onChange={(event) => {
                        setMessage(event.target.value);
                        resetStatus();
                      }}
                    />
                    <span className="roko-letter-count" aria-hidden="true">
                      {text.remaining(tributeLimits.message - message.length)}
                    </span>
                  </label>

                  <p className="roko-letter-line roko-signature">
                    <label htmlFor="roko-name">{text.signed}</label>{" "}
                    <input
                      id="roko-name"
                      type="text"
                      value={name}
                      maxLength={tributeLimits.name}
                      placeholder={text.namePlaceholder}
                      autoComplete="nickname"
                      aria-label={text.nameLabel}
                      onChange={(event) => {
                        setName(event.target.value);
                        resetStatus();
                      }}
                    />
                  </p>
                </div>
              )}
            </div>

            <label className="roko-honeypot" aria-hidden="true">
              Website
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
            </label>

            <div className="roko-letter-footer">
              <button
                className={`roko-send ${hasMessage ? "is-sealed" : ""} ${sendState === "sending" ? "is-sending" : ""}`}
                type="submit"
                disabled={sendState === "sending"}
              >
                <span className="roko-send-icon" aria-hidden="true">
                  {hasMessage ? <WaxSeal /> : kind === "lantern" ? <LanternIcon /> : <CandleIcon />}
                </span>
                <span>{sendState === "sending" ? text.sending : text.submit(kind, hasMessage)}</span>
              </button>
              <div className="roko-letter-notes">
                <p className={`roko-status roko-status--${sendState}`} role="status" aria-live="polite">
                  {statusMessage}{" "}
                  {sendState === "success" && (
                    <a href="#roko-sky" className="roko-look-up">
                      {text.lookUp} <span aria-hidden="true">↑</span>
                    </a>
                  )}
                </p>
              </div>
            </div>
          </form>
        </section>

      </main>
    </div>
  );
}
