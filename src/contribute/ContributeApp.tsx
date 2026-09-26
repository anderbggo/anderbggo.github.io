import { useEffect, useState } from "react";
import {
  getInitialLanguage,
  getInitialThemePreference,
  saveLanguagePreference,
  saveThemePreference,
  type SiteLanguage as Language,
  type SiteThemePreference as ThemePreference,
} from "../sitePreferences";

type ExplicitTheme = Exclude<ThemePreference, "system">;

const supportUrl = "https://buymeacoffee.com/anderbggo";

const copy = {
  es: {
    pageTitle: "Donaciones",
    skip: "Saltar al contenido",
    home: "Inicio",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
    title: "Apoya mis proyectos",
    intro: "Si alguno te resulta útil, puedes hacer una aportación voluntaria.",
    coffeeTitle: "Invítame a un café",
    coffeeBody: "Elige el importe y completa el pago en Buy Me a Coffee.",
    action: "Donar en Buy Me a Coffee",
  },
  en: {
    pageTitle: "Donations",
    skip: "Skip to content",
    home: "Home",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    title: "Support my projects",
    intro: "If one is useful to you, you can make a voluntary contribution.",
    coffeeTitle: "Buy me a coffee",
    coffeeBody: "Choose an amount and complete the payment on Buy Me a Coffee.",
    action: "Donate on Buy Me a Coffee",
  },
} as const;

function getSystemTheme(): ExplicitTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ContributeApp() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [themePreference, setThemePreference] = useState<ThemePreference>(getInitialThemePreference);
  const [systemTheme, setSystemTheme] = useState<ExplicitTheme>(getSystemTheme);
  const text = copy[language];

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

  const activeTheme = themePreference === "system" ? systemTheme : themePreference;

  return (
    <div className="contribute-site">
      <a className="contribute-skip" href="#support">
        {text.skip}
      </a>
      <header className="contribute-header">
        <nav aria-label={text.pageTitle}>
          <a href="/">{text.home}</a>
          <div className="contribute-controls">
            <div
              className={`preference-switch ${language === "en" ? "preference-switch--second" : ""}`}
              aria-label={language === "es" ? "Idioma" : "Language"}
            >
              {(["es", "en"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={language === option}
                  onClick={() => setLanguage(option)}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>
            <div
              className={`preference-switch theme-switch ${activeTheme === "dark" ? "preference-switch--second" : ""}`}
              aria-label={text.theme}
            >
              {(["light", "dark"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={activeTheme === option}
                  onClick={() => setThemePreference(option)}
                  title={text[option]}
                >
                  <span className={`support-theme-symbol support-theme-symbol--${option}`} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main id="support" key={language} className="contribute-main">
        <section className="contribute-hero">
          <div className="contribute-heading">
            <h1>{text.title}</h1>
            <p>{text.intro}</p>
          </div>

          <aside className="support-method" aria-labelledby="support-method-title">
            <h2 id="support-method-title">{text.coffeeTitle}</h2>
            <p>{text.coffeeBody}</p>
            <a className="coffee-action" href={supportUrl} target="_blank" rel="noreferrer">
              <img
                src="/contribute/buy-me-a-coffee.png"
                alt={language === "es" ? "Invítame a un café" : "Buy me a coffee"}
              />
              <span>{text.action} ↗</span>
            </a>
          </aside>
        </section>
      </main>

      <footer className="contribute-footer">
        <span>© {new Date().getFullYear()} anderbggo</span>
      </footer>
    </div>
  );
}
