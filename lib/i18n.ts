import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager, Platform } from "react-native";

// Translation resources will be injected from JSON files in /locales
// We lazy-require to avoid bundler ordering issues on native/web
const resources = {
  en: { translation: require("../locales/en.json") },
  fr: { translation: require("../locales/fr.json") },
  es: { translation: require("../locales/es.json") },
  de: { translation: require("../locales/de.json") },
  zh: { translation: require("../locales/zh.json") },
  ja: { translation: require("../locales/ja.json") },
  ko: { translation: require("../locales/ko.json") },
  ru: { translation: require("../locales/ru.json") },
  it: { translation: require("../locales/it.json") },
  pt: { translation: require("../locales/pt.json") },
  ar: { translation: require("../locales/ar.json") },
} as const;

export const LANGUAGE_STORAGE_KEY = "app_language";

async function detectLanguage(): Promise<string> {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved) return saved;
  } catch {}
  const locales = Localization.getLocales?.();
  const best =
    locales && locales.length > 0 ? locales[0].languageCode ?? "en" : "en";
  // Normalize like en-US -> en, fr-FR -> fr, ar-SA -> ar
  const base = (best || "en").split("-")[0];
  return Object.keys(resources).includes(base) ? base : "en";
}

export async function ensureI18n(): Promise<typeof i18next> {
  if (!i18next.isInitialized) {
    const lng = await detectLanguage();
    await i18next.use(initReactI18next).init({
      resources,
      lng,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
    handleRTL(lng);
  }
  return i18next;
}

export function handleRTL(lang: string) {
  const isRTL = lang === "ar";
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    // On native, forcing RTL requires one reload to apply fully.
    if (Platform.OS !== "web") {
      // A soft hint; caller can trigger an app reload if desired.
      // You can integrate expo-updates reload if you use it.
    }
  }
}

export async function changeAppLanguage(lang: string) {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  await i18next.changeLanguage(lang);
  handleRTL(lang);
}

export default i18next;
