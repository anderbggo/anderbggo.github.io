export type SiteLanguage = "es" | "en";
export type SiteThemePreference = "system" | "light" | "dark";

const languageKey = "site-language";
const themeKey = "site-theme";
const legacyLanguageKeys = ["vestige-language", "contribute-language"];
const legacyThemeKeys = ["vestige-theme"];

function getSavedLanguage(): SiteLanguage | undefined {
  return [languageKey, ...legacyLanguageKeys]
    .map((key) => window.localStorage.getItem(key))
    .find((value): value is SiteLanguage => value === "es" || value === "en");
}

export function getInitialLanguage(): SiteLanguage {
  return getSavedLanguage() ?? (window.navigator.language.toLowerCase().startsWith("es") ? "es" : "en");
}

/** Spanish unless the saved preference or the browser language is English. */
export function getInitialLanguageSpanishFirst(): SiteLanguage {
  return getSavedLanguage() ?? (window.navigator.language.toLowerCase().startsWith("en") ? "en" : "es");
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