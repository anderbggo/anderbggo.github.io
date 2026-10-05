import { useEffect, useState } from "react";
import HomeLink from "../HomeLink";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CodeXml,
  Download,
  FileImage,
  FileJson,
  Files,
  Folder,
  HardDrive,
  Heart,
  MapPin,
  Monitor,
  Moon,
  Plus,
  ScanEye,
  ShieldCheck,
  Sun,
  UserRound,
  WifiOff,
} from "lucide-react";
import {
  getInitialLanguage,
  getInitialThemePreference,
  saveLanguagePreference,
  saveThemePreference,
  type SiteLanguage,
  type SiteThemePreference,
} from "../sitePreferences";
import { contributePath, downloadUrl, libraries, privacyPath, privacySections, sourceUrl, text } from "./content";

const isPrivacyPage = window.location.pathname.startsWith("/gpmatcher/privacy");
type ExplicitTheme = Exclude<SiteThemePreference, "system">;
const featureIcons = [CalendarDays, MapPin, Files, ScanEye];
const principleIcons = [HardDrive, UserRound, WifiOff];

function getSystemTheme(): ExplicitTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function GPMatcherApp() {
  const [language, setLanguage] = useState<SiteLanguage>(getInitialLanguage);
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
    document.title = isPrivacyPage
      ? `Google Photos Matcher · ${copy.policyTitle}`
      : "Google Photos Matcher";
    const description = isPrivacyPage ? copy.policyIntro : copy.lead;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", activeTheme === "dark" ? "#111719" : "#F2F4F5");
  }, [language, themePreference, activeTheme, copy]);

  return (
    <div className="gpmatcher-site">
      <a className="skip-link" href="#main-content">{copy.skip}</a>
      <SiteHeader language={language} setLanguage={setLanguage} theme={activeTheme} setTheme={setThemePreference} />
      {isPrivacyPage ? (
        <PrivacyPage key={language} language={language} />
      ) : (
        <ProductPage key={language} language={language} theme={activeTheme} />
      )}
      <footer className="site-footer">
        <div className="content-width footer-inner">
          <div className="footer-brand">
            <a className="brand" href="/gpmatcher/">
              <img src="/gpmatcher/photo.ico" alt="" width="32" height="32" />
              <span>GPMatcher</span>
            </a>
            <p>{copy.independent}</p>
          </div>
          <nav className="footer-links" aria-label={language === "es" ? "Enlaces del pie" : "Footer links"}>
            <a href="/">{copy.home}</a>
            <a href={privacyPath}>{copy.privacy}</a>
            <a href={contributePath}>{copy.contributeLink}</a>
            <a href={sourceUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true" /></a>
          </nav>
          <span className="copyright">© {new Date().getFullYear()} anderbggo</span>
        </div>
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

  return (
    <header className="site-header">
      <HomeLink language={language} />
      <a className="brand" href="/gpmatcher/" aria-label="Google Photos Matcher">
        <img src="/gpmatcher/photo.ico" alt="" width="32" height="32" />
        <span>GPMatcher</span>
      </a>
      <nav className="primary-nav" aria-label="Google Photos Matcher">
        <a href={isPrivacyPage ? "/gpmatcher/#how-it-works" : "#how-it-works"}>{copy.productNav}</a>
        <a href={isPrivacyPage ? "/gpmatcher/#privacy" : "#privacy"}>{copy.privacyNav}</a>
        <a href={sourceUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true" /></a>
      </nav>
      <div className="header-controls">
        <div className={`segmented ${language === "en" ? "segmented--second" : ""}`} role="group" aria-label={copy.language}>
          {(["es", "en"] as const).map((option) => (
            <button key={option} type="button" aria-label={option === "es" ? "Español" : "English"} aria-pressed={language === option} onClick={() => setLanguage(option)}>
              {option.toUpperCase()}
            </button>
          ))}
        </div>
        <div className={`segmented theme-control ${theme === "dark" ? "segmented--second" : ""}`} role="group" aria-label={copy.theme}>
          <button type="button" title={copy.light} aria-label={copy.light} aria-pressed={theme === "light"} onClick={() => setTheme("light")}>
            <Sun size={17} aria-hidden="true" />
          </button>
          <button type="button" title={copy.dark} aria-label={copy.dark} aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>
            <Moon size={17} aria-hidden="true" />
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
      <section className="product-intro">
        <div className="content-width intro-content">
          <span className="eyebrow">{copy.version}</span>
          <h1><span>Google Photos</span> <span>Matcher</span></h1>
          <p className="intro-description">{copy.lead}</p>
          <a className="download-button" href={downloadUrl}>
            <Download size={24} aria-hidden="true" />
            <span>{copy.download}</span>
          </a>
          <p className="download-note">{copy.downloadNote}</p>
        </div>
      </section>

      <section className="preview-section" aria-label={theme === "dark" ? copy.screenDarkCaption : copy.screenLightCaption}>
        <figure className="app-preview">
          <figcaption><Monitor size={16} aria-hidden="true" /> {theme === "dark" ? copy.screenDarkCaption : copy.screenLightCaption}</figcaption>
          <img
            src={theme === "dark" ? "/gpmatcher/interface-v3-dark.png" : "/gpmatcher/interface-v3.png"}
            alt={theme === "dark" ? copy.screenDarkAlt : copy.screenLightAlt}
            width="900"
            height="680"
          />
        </figure>
      </section>

      <section className="content-section content-width explanation-section" id="how-it-works">
        <div className="section-heading">
          <span className="eyebrow">{copy.problemEyebrow}</span>
          <h2>{copy.problemTitle}</h2>
          <p>{copy.problemIntro}</p>
        </div>
        <div className="file-flow">
          <div className="file-flow-item">
            <FileImage size={30} aria-hidden="true" />
            <span>{copy.photoLabel}</span>
            <code>IMG_2048.jpg</code>
          </div>
          <Plus className="flow-symbol" size={22} aria-hidden="true" />
          <div className="file-flow-item">
            <FileJson size={30} aria-hidden="true" />
            <span>{copy.jsonLabel}</span>
            <code>IMG_2048.jpg.json</code>
          </div>
          <ArrowRight className="flow-symbol flow-arrow" size={24} aria-hidden="true" />
          <div className="file-flow-item file-flow-result">
            <ShieldCheck size={30} aria-hidden="true" />
            <span>{copy.resultLabel}</span>
            <p>{copy.resultCaption}</p>
          </div>
        </div>
        <div className="features-grid">
          {copy.features.map((feature, index) => {
            const Icon = featureIcons[index];
            return (
              <article key={feature.title}>
                <Icon size={23} aria-hidden="true" />
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-section content-width results-section">
        <div className="section-heading"><h2>{copy.resultsTitle}</h2><p>{copy.resultsIntro}</p></div>
        <div className="folders-grid">
          <article><Folder size={24} aria-hidden="true" /><h3>MatchedMedia</h3><p>{copy.matchedBody}</p></article>
          <article><Folder size={24} aria-hidden="true" /><h3>EditedRaw</h3><p>{copy.editedBody}</p></article>
        </div>
        <p className="results-note">{copy.resultsNote}</p>
      </section>

      <section className="content-band privacy-band" id="privacy">
        <div className="content-width privacy-layout">
          <div className="section-heading">
            <span className="eyebrow">{copy.privacyEyebrow}</span>
            <h2>{copy.privacyTitle}</h2>
            <p>{copy.privacyIntro}</p>
            <a className="button button--primary" href={privacyPath}>{copy.privacyLink} <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
          <div className="principles-list">
            {copy.principles.map((principle, index) => {
              const Icon = principleIcons[index];
              return (
                <article key={principle.title}>
                  <Icon size={23} aria-hidden="true" />
                  <div><h3>{principle.title}</h3><p>{principle.body}</p></div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="content-section content-width faq-section">
        <div className="section-heading"><h2>{copy.faqTitle}</h2></div>
        <div className="faq-list">
          {copy.faqs.map((faq) => (
            <details className="faq-item" key={faq.question}>
              <summary>{faq.question}<Plus size={20} aria-hidden="true" /></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="content-band credits-band" id="credits">
        <div className="content-width">
          <div className="section-heading">
            <span className="eyebrow">{copy.creditsEyebrow}</span>
            <h2>{copy.creditsTitle}</h2>
            <p>{copy.creditsIntro}</p>
            <a className="text-link" href={sourceUrl} target="_blank" rel="noreferrer"><CodeXml size={18} aria-hidden="true" />{copy.source}<ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
          <dl className="libraries-list">
            {libraries.map((library, index) => (
              <div key={library.name}>
                <dt><a href={library.url} target="_blank" rel="noreferrer">{library.name}<ArrowUpRight size={14} aria-hidden="true" /></a></dt>
                <dd>{copy.libraryRoles[index]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="content-band contribution-band">
        <div className="content-width contribution-layout">
          <div className="section-heading"><h2>{copy.contributeTitle}</h2><p>{copy.contributeBody}</p></div>
          <div className="contribution-actions">
            <a className="button button--support" href={contributePath}><Heart size={18} aria-hidden="true" />{copy.contributeLink}</a>
            <a className="text-link" href={`${sourceUrl}/issues`} target="_blank" rel="noreferrer">{copy.issues}<ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
      </section>
    </main>
  );
}

function PrivacyPage({ language }: { language: SiteLanguage }) {
  const copy = text[language];
  const sections = privacySections[language];

  return (
    <main id="main-content" className="document-page content-width language-transition" tabIndex={-1}>
      <header className="document-heading">
        <a className="text-link back-link" href="/gpmatcher/"><ArrowLeft size={17} aria-hidden="true" />{copy.back}</a>
        <span className="eyebrow">Google Photos Matcher · v3.0</span>
        <h1>{copy.policyTitle}</h1>
        <p className="document-intro">{copy.policyIntro}</p>
        <p className="policy-updated"><time dateTime="2026-10-05">{copy.updated}</time></p>
      </header>
      <nav className="policy-index" aria-label={copy.contents}>
        {sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}
      </nav>
      <div className="document-body">
        {sections.map((section) => (
          <section id={section.id} key={section.id} aria-labelledby={`policy-${section.id}`}>
            <h2 id={`policy-${section.id}`}>{section.title}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.links && (
              <div className="policy-links">
                {section.links.map((link) => <a className="text-link" href={link.url} key={link.url} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={16} aria-hidden="true" /></a>)}
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}