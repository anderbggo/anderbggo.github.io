import { useEffect, useState } from "react";
import {
  getInitialLanguage,
  getInitialThemePreference,
  saveLanguagePreference,
  saveThemePreference,
  type SiteLanguage,
  type SiteThemePreference,
} from "./sitePreferences";
import "./root.css";

const copy = {
  es: {
    pageTitle: "En construcción",
    heading: "En construcción.",
    body: "Este espacio está tomando forma.",
    link: "Visitar Vestige",
  },
  en: {
    pageTitle: "Under construction",
    heading: "Under construction.",
    body: "This space is taking shape.",
    link: "Visit Vestige",
  },
} as const;

function App() {
  const [language] = useState<SiteLanguage>(getInitialLanguage);
  const [themePreference] = useState<SiteThemePreference>(getInitialThemePreference);
  const text = copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.siteTheme = themePreference;
    document.title = text.pageTitle;
    saveLanguagePreference(language);
    saveThemePreference(themePreference);
  }, [language, text.pageTitle, themePreference]);

  return (
    <main className="construction-page">
      <section className="construction-content">
        <span className="construction-domain">anderbggo.github.io</span>
        <h1>{text.heading}</h1>
        <p>{text.body}</p>
        <a href="/vestige/">
          {text.link} <span aria-hidden="true">→</span>
        </a>
      </section>
    </main>
  );
}

export default App;
