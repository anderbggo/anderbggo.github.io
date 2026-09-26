import { useEffect, useState } from "react";
import {
  contributePath,
  libraries,
  privacyPath,
  privacySections,
  screenshots,
  text,
  type Language,
  type ThemePreference,
} from "./content";
import {
  getInitialLanguage,
  getInitialThemePreference,
  saveLanguagePreference,
  saveThemePreference,
} from "../sitePreferences";

const isPrivacyPage = window.location.pathname.includes("/vestige/privacy");
type ExplicitTheme = Exclude<ThemePreference, "system">;

function getSystemTheme(): ExplicitTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function VestigeApp() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [themePreference, setThemePreference] = useState<ThemePreference>(getInitialThemePreference);
  const [systemTheme, setSystemTheme] = useState<ExplicitTheme>(getSystemTheme);
  const copy = text[language];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => setSystemTheme(mediaQuery.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", updateSystemTheme);
    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.siteTheme = themePreference;
    saveLanguagePreference(language);
    saveThemePreference(themePreference);
    document.title = isPrivacyPage
      ? language === "es"
        ? "Política de privacidad"
        : "Privacy policy"
      : "Vestige";
  }, [language, themePreference]);

  const activeTheme = themePreference === "system" ? systemTheme : themePreference;

  return (
    <div className="vestige-site">
      <a className="skip-link" href="#main-content">{copy.skip}</a>
      <SiteHeader
        language={language}
        setLanguage={setLanguage}
        theme={activeTheme}
        setTheme={setThemePreference}
      />
      {isPrivacyPage ? (
        <PrivacyPage key={language} language={language} />
      ) : (
        <ProductPage key={language} language={language} />
      )}
      <footer className="site-footer">
        <div className="footer-brand">
          <img src="/vestige/vestige_icon.svg" alt="" />
          <span>{copy.footer}</span>
        </div>
        <div className="footer-links">
          <a href={contributePath}>{copy.contribute}</a>
          <a href={privacyPath}>{copy.privacy}</a>
          <span>© {new Date().getFullYear()} anderbggo</span>
        </div>
      </footer>
    </div>
  );
}

function SiteHeader({
  language,
  setLanguage,
  theme,
  setTheme,
}: {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: ExplicitTheme;
  setTheme: (theme: ExplicitTheme) => void;
}) {
  const copy = text[language];

  return (
    <header className="site-header">
      <a className="brand" href="/vestige/" aria-label="Vestige">
        <img src="/vestige/vestige_icon.svg" alt="" />
        <span>Vestige</span>
      </a>
      {!isPrivacyPage && (
        <nav key={language} className="primary-nav language-transition-control" aria-label="Vestige">
          <a href="#how-it-works">{copy.product}</a>
          <a href="#privacy">{copy.privacy}</a>
          <a href="#credits">{copy.credits}</a>
          <a href="#contribute">{copy.contribute}</a>
        </nav>
      )}
      <div className="header-controls">
        <div
          className={`segmented ${language === "en" ? "segmented--second" : ""}`}
          aria-label={copy.language}
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
          className={`segmented theme-control ${theme === "dark" ? "segmented--second" : ""}`}
          aria-label={copy.theme}
        >
          {(["light", "dark"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={theme === option}
              onClick={() => setTheme(option)}
              title={copy[option]}
            >
              <span className={`theme-symbol theme-symbol--${option}`} aria-hidden="true" />
              <span className="control-label">{copy[option]}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function ProductPage({ language }: { language: Language }) {
  const copy = text[language];

  return (
    <main id="main-content" className="language-transition">
      <section className="product-hero" id="product">
        <div className="hero-copy reveal reveal--one">
          <span className="eyebrow eyebrow--inverse">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p className="hero-description">{copy.lead}</p>
          <div className="hero-actions">
            <a className="text-link text-link--inverse" href={privacyPath}>
              {copy.readPrivacy} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <figure className="hero-preview reveal">
          <img
            src="/vestige/vestige_icon.svg"
            alt={language === "es" ? "Logo de Vestige" : "Vestige logo"}
          />
        </figure>
      </section>

      <section className="content-section recall-section">
        <div className="recall-heading">
          <span className="eyebrow">{copy.recallEyebrow}</span>
          <h2>{copy.recallTitle}</h2>
        </div>
        <div className="recall-body">
          <p>{copy.recallExplanation}</p>
          <p>{copy.recallReflection}</p>
          <div className="recall-sources">
            <a href="https://doi.org/10.1038/ncomms8462" target="_blank" rel="noreferrer" title="Evidence for holistic episodic recollection via hippocampal pattern completion">
              Horner et al. (2015)
            </a>
            <a href="https://www.microsoft.com/en-us/research/publication/do-life-logging-technologies-support-memory-for-the-past-an-experimental-study-using-sensecam/" target="_blank" rel="noreferrer" title="Do life-logging technologies support memory for the past? An experimental study using SenseCam">
              Sellen et al. (2007)
            </a>
          </div>
        </div>
      </section>

      <section className="content-band privacy-band" id="privacy">
        <div className="section-heading section-heading--wide">
          <span className="eyebrow">{copy.privacyEyebrow}</span>
          <h2>{copy.privacyTitle}</h2>
          <p>{copy.privacyIntro}</p>
          <a className="button button--primary" href={privacyPath}>{copy.privacyLink}</a>
        </div>
        <div className="principles-grid">
          <Principle number="01" title={copy.storageTitle} body={copy.storageBody} />
          <Principle number="02" title={copy.networkTitle} body={copy.networkBody} />
          <Principle number="03" title={copy.controlTitle} body={copy.controlBody} />
        </div>
      </section>

      <section className="content-section gallery-section" id="how-it-works">
        <SectionHeading title={copy.galleryTitle} />
        <div className="screenshot-rail" role="list">
          {screenshots.map(([filename, spanishAlt, englishAlt, spanishCaption, englishCaption], index) => (
            <figure className="screenshot-item" role="listitem" key={filename}>
              <img
                src={`/vestige/screenshots/${filename}`}
                alt={language === "es" ? spanishAlt : englishAlt}
                loading={index > 1 ? "lazy" : "eager"}
              />
              <figcaption>{language === "es" ? spanishCaption : englishCaption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <CreditsSection language={language} />

      <section className="content-band contribution-band" id="contribute">
        <div className="section-heading section-heading--wide">
          <span className="eyebrow">{copy.contributeEyebrow}</span>
          <h2>{copy.contributeTitle}</h2>
          <p>{copy.contributeIntro}</p>
          <a className="button button--primary" href={contributePath}>
            {copy.contributeLink} <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <div className="section-heading">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

function Principle({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <article>
      <span className="principle-number">{number}</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

function PrivacyPage({ language }: { language: Language }) {
  const copy = text[language];
  const spanish = language === "es";
  const title = spanish ? "Política de privacidad" : "Privacy policy";

  return (
    <main id="main-content" className="document-page language-transition">
      <header className="document-hero">
        <a className="back-link" href="/vestige/"><span aria-hidden="true">←</span> {copy.back}</a>
        <h1>{title}</h1>
        <p>
          {spanish
            ? "Esta página pública y permanente explica cómo Vestige trata tus datos y archivos."
            : "This public, permanent page explains how Vestige handles your data and files."}
        </p>
        <div className="document-meta">
          <span>{copy.verified}</span>
        </div>
      </header>
      <div className="document-layout">
        <aside className="document-index" aria-label={title}>
          <strong>{spanish ? "Contenido" : "Contents"}</strong>
          {privacySections.map((section, index) => (
            <a href={`#policy-${index + 1}`} key={section.title.en}>{section.title[language]}</a>
          ))}
        </aside>
        <article className="policy-document">
          {privacySections.map((section, index) => (
            <section id={`policy-${index + 1}`} key={section.title.en}>
              <h2>{section.title[language]}</h2>
              {section.paragraphs[language].map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}

function CreditsSection({ language }: { language: Language }) {
  const copy = text[language];

  return (
    <section className="content-section" id="credits">
      <SectionHeading eyebrow={copy.creditsEyebrow} title={copy.creditsTitle} />
      <div className="credits-list">
        {libraries.map(([name, spanishRole, englishRole, license, href]) => (
          <a href={href} key={name} target="_blank" rel="noreferrer">
            <span className="credit-name">{name}</span>
            <span>{language === "es" ? spanishRole : englishRole}</span>
            <strong>{license}</strong>
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
