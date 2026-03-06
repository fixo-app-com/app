import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import en from "./locales/en";
import type { SupportedLanguage } from "../types/firestore";
import "./types";

const LANGUAGE_STORAGE_KEY = "fixo_language";

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  "en",
  "it",
  "fr",
  "de",
  "es",
];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: "English",
  it: "Italiano",
  fr: "Fran\u00E7ais",
  de: "Deutsch",
  es: "Espa\u00F1ol",
};

i18n.use(initReactI18next).init({
  resources: { en: { translation: en } },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  compatibilityJSON: "v4",
});

/** Lazy-load a non-English translation bundle. */
async function loadLanguageBundle(lang: SupportedLanguage): Promise<void> {
  if (lang === "en" || i18n.hasResourceBundle(lang, "translation")) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bundles: Record<string, () => Promise<{ default: any }>> = {
    it: () => import("./locales/it"),
    fr: () => import("./locales/fr"),
    de: () => import("./locales/de"),
    es: () => import("./locales/es"),
  };

  const loader = bundles[lang];
  if (loader) {
    const mod = await loader();
    i18n.addResourceBundle(lang, "translation", mod.default);
  }
}

/** Resolve initial language from AsyncStorage → device locale → "en". */
export async function initLanguage(): Promise<void> {
  try {
    const cached = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (cached && SUPPORTED_LANGUAGES.includes(cached as SupportedLanguage)) {
      await loadLanguageBundle(cached as SupportedLanguage);
      await i18n.changeLanguage(cached);
      return;
    }

    const deviceLang = getLocales()[0]?.languageCode ?? "en";
    const lang = SUPPORTED_LANGUAGES.includes(deviceLang as SupportedLanguage)
      ? (deviceLang as SupportedLanguage)
      : "en";

    await loadLanguageBundle(lang);
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // Fallback already set to "en"
  }
}

/** Change language: update i18next + persist to AsyncStorage. */
export async function setLanguage(lang: SupportedLanguage): Promise<void> {
  await loadLanguageBundle(lang);
  await i18n.changeLanguage(lang);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
}

export default i18n;
