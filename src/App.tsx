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

const projects = [
  {
    href: "/vestige/",
    icon: "/vestige/vestige_icon.svg",
    name: "Vestige",
    tagline: { es: "Un segundo al día.", en: "A second every day." },
  },
  {
    href: "/mareasES/",
    icon: "/mareasES/mareas_icon.svg",
    name: "Mareas España",
    tagline: { es: "Mareas de 4.484 playas, sin conexión.", en: "Tides for 4,484 beaches, offline." },
  },
  {
    href: "/gpmatcher/",
    icon: "/gpmatcher/photo.ico",
    name: "Google Photos Matcher",
    tagline: {
      es: "Devuelve las fechas a tus fotos de Google Takeout.",
      en: "Gives your Google Takeout photos their dates back.",
    },
  },
] as const;

const copy = {
  es: {
    pageTitle: "anderbggo",
    heading: "Proyectos",
    projects: "Proyectos",
    memoryLabel: "En memoria de",
    memoryDate: "24 · Octubre · 2021",
    memoryAction: "Enciéndele una luz",
  },
  en: {
    pageTitle: "anderbggo",
    heading: "Projects",
    projects: "Projects",
    memoryLabel: "In memory of",
    memoryDate: "24 · October · 2021",
    memoryAction: "Light something for him",
  },
} as const;

function Candle() {
  return (
    <svg className="home-candle" viewBox="0 0 24 48" aria-hidden="true" focusable="false">
      <ellipse className="home-candle-glow" cx="12" cy="12" rx="11" ry="12" />
      <g className="home-candle-flame">
        <path d="M12 2c3.6 4.6 5 7.4 5 10.2A5 5 0 0 1 12 17a5 5 0 0 1-5-4.8C7 9.4 8.4 6.6 12 2Z" fill="#ffb93d" />
        <path d="M12 8c1.8 2.3 2.4 3.7 2.4 5a2.4 2.4 0 0 1-4.8 0c0-1.3.6-2.7 2.4-5Z" fill="#fff4c9" />
      </g>
      <path d="M12 16.5v3.5" stroke="#3b2a1d" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="6" y="20" width="12" height="26" rx="2" fill="#f8f1e4" />
    </svg>
  );
}

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
    <main className="home-page">
      <div className="home-content">
        <span className="home-domain">anderbggo.github.io</span>
        <h1>{text.heading}</h1>

        <nav aria-label={text.projects}>
          <ol className="home-projects">
            {projects.map((project, index) => (
              <li key={project.href}>
                <a href={project.href}>
                  <span className="home-project-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <img src={project.icon} alt="" width="44" height="44" />
                  <span className="home-project-text">
                    <span className="home-project-name">{project.name}</span>
                    <span className="home-project-tagline">{project.tagline[language]}</span>
                  </span>
                  <span className="home-project-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <a className="home-memory" href="/roko/">
          <span className="home-memory-sky" aria-hidden="true">
            <Candle />
          </span>
          <span className="home-memory-text">
            <span className="home-memory-label">{text.memoryLabel}</span>
            <span className="home-memory-name">Roko</span>
            <span className="home-memory-date">{text.memoryDate}</span>
          </span>
          <span className="home-memory-action">
            {text.memoryAction} <span aria-hidden="true">→</span>
          </span>
        </a>
      </div>
    </main>
  );
}

export default App;
