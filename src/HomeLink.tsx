import { House } from "lucide-react";
import type { SiteLanguage } from "./sitePreferences";
import "./homeLink.css";

export default function HomeLink({ language }: { language: SiteLanguage }) {
  const label = language === "es" ? "Inicio" : "Home";
  const description = language === "es" ? "Volver al inicio" : "Back to home";

  return (
    <a className="home-link" href="/" aria-label={description} title={description}>
      <House size={18} aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}