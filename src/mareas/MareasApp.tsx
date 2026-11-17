import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChartSpline,
  EyeOff,
  Heart,
  LocateFixed,
  MapPinned,
  Moon,
  Palette,
  Smartphone,
  Sun,
  SunMoon,
  TriangleAlert,
  Waves,
} from "lucide-react";
import HomeLink from "../HomeLink";
import {
  getInitialLanguageSpanishFirst,
  getInitialThemePreference,
  saveLanguagePreference,
  saveThemePreference,
  type SiteLanguage,
  type SiteThemePreference,
} from "../sitePreferences";
import {
  contributePath,
  dataSources,
  homePath,
  libraries,
  privacyPath,
  privacySections,
  screenshots,
  text,
} from "./content";

const isPrivacyPage = window.location.pathname.startsWith("/mareasES/privacy");
type ExplicitTheme = Exclude<SiteThemePreference, "system">;
const featureIcons = [Waves, ChartSpline, MapPinned, SunMoon, Heart, Palette];
const principleIcons = [Smartphone, LocateFixed, EyeOff];

function getSystemTheme(): ExplicitTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function screenshotSrc(language: SiteLanguage, theme: ExplicitTheme, key: string) {
  return `/mareasES/screenshots/${language}-${theme}-${key}.jpg`;
}

export default function MareasApp() {
  const [language, setLanguage] = useState<SiteLanguage>(getInitialLanguageSpanishFirst);
  const [themePreference, setThemePreference] = useState<SiteThemePreference>(getInitialThemePreference);
  const [systemTheme, setSystemTheme] = useState<ExplicitTheme>(getSystemTheme);
  const activeTheme = themePreference === "system" ? systemTheme : themePreference;
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
    document.title = isPrivacyPage ? `${copy.policyTitle} · Mareas España` : "Mareas España";
    const description = isPrivacyPage ? copy.policyIntro : copy.lead;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", activeTheme === "dark" ? "#000000" : "#EFF4F7");
  }, [language, themePreference, activeTheme, copy]);

  return (
    <div className="mareas-site">
      <a className="skip-link" href="#main-content">{copy.skip}</a>
      <SiteHeader language={language} setLanguage={setLanguage} theme={activeTheme} setTheme={setThemePreference} />
      {isPrivacyPage ? (
        <PrivacyPage key={language} language={language} />
      ) : (
        <ProductPage key={language} language={language} theme={activeTheme} />
      )}
      <footer className="site-footer">
        <div className="footer-brand">
          <img src="/mareasES/mareas_icon.svg" alt="" width="32" height="32" />
          <div>
            <span className="footer-name">{copy.footer}</span>
            <p>{copy.independent}</p>
          </div>
        </div>
        <nav className="footer-links" aria-label={language === "es" ? "Enlaces del pie" : "Footer links"}>
          <a href={privacyPath}>{copy.privacyLink}</a>
          <a href={contributePath}>{copy.contributeLink}</a>
          <span>© {new Date().getFullYear()} anderbggo</span>
        </nav>
      </footer>
    </div>
  );
}

function SiteHeader({ language, setLanguage, theme, setTheme }: {
  language: SiteLanguage;
  setLanguage: (language: SiteLanguage) => void;
  theme: ExplicitTheme;
  setTheme: (theme: ExplicitTheme) => void;
}) {
  const copy = text[language];
  const anchor = (id: string) => (isPrivacyPage ? `${homePath}#${id}` : `#${id}`);

  return (
    <header className="site-header">
      <HomeLink language={language} />
      <a className="brand" href={homePath} aria-label="Mareas España">
        <img src="/mareasES/mareas_icon.svg" alt="" width="36" height="36" />
        <span>Mareas España</span>
      </a>
      <nav key={language} className="primary-nav language-transition-control" aria-label="Mareas España">
        <a href={anchor("features")}>{copy.features}</a>
        <a href={anchor("gallery")}>{copy.gallery}</a>
        <a href={anchor("privacy")}>{copy.privacy}</a>
        <a href={anchor("credits")}>{copy.credits}</a>
      </nav>
      <div className="header-controls">
        <div className={`segmented ${language === "en" ? "segmented--second" : ""}`} role="group" aria-label={copy.language}>
          {(["es", "en"] as const).map((option) => (
            <button key={option} type="button" aria-label={option === "es" ? "Español" : "English"} aria-pressed={language === option} onClick={() => setLanguage(option)}>
              {option.toUpperCase()}
            </button>
          ))}
        </div>
        <div className={`segmented ${theme === "dark" ? "segmented--second" : ""}`} role="group" aria-label={copy.theme}>
          <button type="button" title={copy.light} aria-label={copy.light} aria-pressed={theme === "light"} onClick={() => setTheme("light")}>
            <Sun size={16} aria-hidden="true" />
          </button>
          <button type="button" title={copy.dark} aria-label={copy.dark} aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>
            <Moon size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}

function ProductPage({ language, theme }: { language: SiteLanguage; theme: ExplicitTheme }) {
  const copy = text[language];

  return (
    <main id="main-content" className="language-transition" tabIndex={-1}>
      <section className="hero">
        <svg className="hero-waves" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 120 C 240 60, 480 60, 720 120 S 1200 180, 1440 120 L 1440 220 L 0 220 Z" />
          <path d="M0 160 C 240 110, 480 110, 720 160 S 1200 210, 1440 160 L 1440 220 L 0 220 Z" />
        </svg>
        <div className="hero-inner">
          <div className="hero-copy reveal">
            <img className="hero-icon" src="/mareasES/mareas_icon.svg" alt="" width="84" height="84" />
            <span className="eyebrow eyebrow--hero">{copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p className="hero-lead">{copy.lead}</p>
            <div className="hero-actions">
              <span className="store-badge">
                <Smartphone size={18} aria-hidden="true" />
                {copy.store}
              </span>
            </div>
          </div>
          <figure className="phone reveal reveal--late">
            <img src={screenshotSrc(language, theme, "detail")} alt={copy.heroAlt} width="720" height="1423" />
          </figure>
        </div>
      </section>

      <section className="content-section" id="features">
        <SectionHeading title={copy.featuresTitle} />
        <div className="features-grid">
          {copy.featureList.map((feature, index) => {
            const Icon = featureIcons[index];
            return (
              <article className="card" key={feature.title}>
                <span className="feature-icon"><Icon size={22} aria-hidden="true" /></span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-section gallery-section" id="gallery">
        <SectionHeading title={copy.galleryTitle} intro={copy.galleryNote} />
        <div className="screenshot-rail" role="list">
          {screenshots.map((shot, index) => {
            const [alt, caption] = shot[language];
            return (
              <figure className="screenshot-item" role="listitem" key={shot.key}>
                <img src={screenshotSrc(language, theme, shot.key)} alt={alt} width="720" height="1423" loading={index > 1 ? "lazy" : "eager"} />
                <figcaption>{caption}</figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      <section className="content-section method-section">
        <div>
          <SectionHeading title={copy.methodTitle} />
          {copy.methodBody.map((paragraph) => <p className="method-text" key={paragraph}>{paragraph}</p>)}
        </div>
        <aside className="disclaimer" role="note">
          <TriangleAlert size={22} aria-hidden="true" />
          <h3>{copy.disclaimerTitle}</h3>
          <p>{copy.disclaimer}</p>
        </aside>
      </section>

      <section className="content-band" id="privacy">
        <div className="band-inner">
          <SectionHeading title={copy.privacyTitle} />
          <div className="principles-grid">
            {copy.principles.map((principle, index) => {
              const Icon = principleIcons[index];
              return (
                <article key={principle.title}>
                  <Icon size={22} aria-hidden="true" />
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </article>
              );
            })}
          </div>
          <a className="button" href={privacyPath}>{copy.privacyLink} <ArrowRight size={17} aria-hidden="true" /></a>
        </div>
      </section>

      <section className="content-section" id="credits">
        <SectionHeading title={copy.creditsTitle} />
        <h3 className="list-title">{copy.dataTitle}</h3>
        <div className="sources-list">
          {dataSources.map((source) => (
            <article className="card source" key={source.name}>
              <div className="source-head">
                <h4>{source.name}</h4>
                <span className="license-pill">{source.license}</span>
              </div>
              <p>{source.role[language]}</p>
              <div className="source-links">
                {source.links.map((link) => (
                  <a href={link.url} key={link.url} target="_blank" rel="noreferrer">
                    {link.label} <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
        <p className="credits-note">{copy.nonCommercial}</p>
        <h3 className="list-title">{copy.librariesTitle}</h3>
        <div className="credits-list">
          {libraries.map(([name, spanishRole, englishRole, license, href]) => (
            <a href={href} key={name} target="_blank" rel="noreferrer">
              <span className="credit-name">{name}</span>
              <span>{language === "es" ? spanishRole : englishRole}</span>
              <strong>{license}</strong>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section className="contribution-band">
        <div className="band-inner">
          <SectionHeading title={copy.contributeTitle} intro={copy.contributeIntro} />
          <a className="button button--accent" href={contributePath}>
            <Heart size={17} aria-hidden="true" /> {copy.contributeLink}
          </a>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

function PrivacyPage({ language }: { language: SiteLanguage }) {
  const copy = text[language];
  const sections = privacySections[language];

  return (
    <main id="main-content" className="document-page language-transition" tabIndex={-1}>
      <header className="document-hero">
        <a className="back-link" href={homePath}><ArrowLeft size={17} aria-hidden="true" /> {copy.back}</a>
        <h1>{copy.policyTitle}</h1>
        <p>{copy.policyIntro}</p>
        <span className="document-meta">{copy.updated}</span>
      </header>
      <div className="document-layout">
        <nav className="document-index" aria-label={copy.contents}>
          <strong>{copy.contents}</strong>
          {sections.map((section, index) => (
            <a href={`#policy-${index + 1}`} key={section.title}>{section.title}</a>
          ))}
        </nav>
        <article className="policy-document">
          {sections.map((section, index) => (
            <section id={`policy-${index + 1}`} key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.links && (
                <div className="source-links">
                  {section.links.map((link) => (
                    <a href={link.url} key={link.url} target="_blank" rel="noreferrer">
                      {link.label} <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
