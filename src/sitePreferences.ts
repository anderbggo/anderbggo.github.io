export type SiteLanguage = "es" | "en";
export type SiteThemePreference = "system" | "light" | "dark";

const languageKey = "site-language";
const themeKey = "site-theme";
const legacyLanguageKeys = ["vestige-language", "contribute-language"];
const legacyThemeKeys = ["vestige-theme"];

export function getInitialLanguage(): SiteLanguage {
  const savedLanguage = [languageKey, ...legacyLanguageKeys]
    .map((key) => window.localStorage.getItem(key))
    .find((value) => value === "es" || value === "en");

  return savedLanguage ?? (window.navigator.language.toLowerCase().startsWith("es") ? "es" : "en");
}

export function saveLanguagePreference(language: SiteLanguage) {
  window.localStorage.setItem(languageKey, language);
  legacyLanguageKeys.forEach((key) => window.localStorage.removeItem(key));
}

export function getInitialThemePreference(): SiteThemePreference {
  const savedTheme = [themeKey, ...legacyThemeKeys]
    .map((key) => window.localStorage.getItem(key))
    .find((value) => value === "light" || value === "dark");

  return savedTheme ?? "system";
}

export function saveThemePreference(theme: SiteThemePreference) {
  if (theme === "system") {
    window.localStorage.removeItem(themeKey);
  } else {
    window.localStorage.setItem(themeKey, theme);
  }
  legacyThemeKeys.forEach((key) => window.localStorage.removeItem(key));
}