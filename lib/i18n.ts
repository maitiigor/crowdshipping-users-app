import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager, Platform } from "react-native";

// Translation resources will be injected from JSON files in /locales
// We lazy-require to avoid bundler ordering issues on native/web
const resources = {
  en: {
    translation: require("../locales/en.json"),
    welcome: require("../locales/en/welcome.json"),
    login: require("../locales/en/login.json"),
    signup: require("../locales/en/signup.json"),
    forgetPassword: require("../locales/en/forget-password.json"),
    confirmationCode: require("../locales/en/confirmation-code.json"),
    signupConfirmCode: require("../locales/en/signup-confirm-code.json"),
    resetPassword: require("../locales/en/reset-password.json"),
    userProfileSetup: require("../locales/en/user-profile-setup.json"),
    termsOfService: require("../locales/en/terms-of-service.json"),
    privacyPolicy: require("../locales/en/privacy-policy.json"),
    addPackage: require("../locales/en/add-package.json"),
  },
  fr: {
    translation: require("../locales/fr.json"),
    welcome: require("../locales/fr/welcome.json"),
    login: require("../locales/fr/login.json"),
    signup: require("../locales/fr/signup.json"),
    forgetPassword: require("../locales/fr/forget-password.json"),
    confirmationCode: require("../locales/fr/confirmation-code.json"),
    signupConfirmCode: require("../locales/fr/signup-confirm-code.json"),
    resetPassword: require("../locales/fr/reset-password.json"),
    userProfileSetup: require("../locales/fr/user-profile-setup.json"),
    termsOfService: require("../locales/fr/terms-of-service.json"),
    privacyPolicy: require("../locales/fr/privacy-policy.json"),
    addPackage: require("../locales/fr/add-package.json"),
  },
  es: {
    translation: require("../locales/es.json"),
    welcome: require("../locales/es/welcome.json"),
    login: require("../locales/es/login.json"),
    signup: require("../locales/es/signup.json"),
    forgetPassword: require("../locales/es/forget-password.json"),
    confirmationCode: require("../locales/es/confirmation-code.json"),
    signupConfirmCode: require("../locales/es/signup-confirm-code.json"),
    resetPassword: require("../locales/es/reset-password.json"),
    userProfileSetup: require("../locales/es/user-profile-setup.json"),
    termsOfService: require("../locales/es/terms-of-service.json"),
    privacyPolicy: require("../locales/es/privacy-policy.json"),
    addPackage: require("../locales/es/add-package.json"),
  },
  de: {
    translation: require("../locales/de.json"),
    welcome: require("../locales/de/welcome.json"),
    login: require("../locales/de/login.json"),
    signup: require("../locales/de/signup.json"),
    forgetPassword: require("../locales/de/forget-password.json"),
    confirmationCode: require("../locales/de/confirmation-code.json"),
    signupConfirmCode: require("../locales/de/signup-confirm-code.json"),
    resetPassword: require("../locales/de/reset-password.json"),
    userProfileSetup: require("../locales/de/user-profile-setup.json"),
    termsOfService: require("../locales/de/terms-of-service.json"),
    privacyPolicy: require("../locales/de/privacy-policy.json"),
    addPackage: require("../locales/de/add-package.json"),
  },
  zh: {
    translation: require("../locales/zh.json"),
    welcome: require("../locales/zh/welcome.json"),
    login: require("../locales/zh/login.json"),
    signup: require("../locales/zh/signup.json"),
    forgetPassword: require("../locales/zh/forget-password.json"),
    confirmationCode: require("../locales/zh/confirmation-code.json"),
    signupConfirmCode: require("../locales/zh/signup-confirm-code.json"),
    resetPassword: require("../locales/zh/reset-password.json"),
    userProfileSetup: require("../locales/zh/user-profile-setup.json"),
    termsOfService: require("../locales/zh/terms-of-service.json"),
    privacyPolicy: require("../locales/zh/privacy-policy.json"),
    addPackage: require("../locales/zh/add-package.json"),
  },
  ja: {
    translation: require("../locales/ja.json"),
    welcome: require("../locales/ja/welcome.json"),
    login: require("../locales/ja/login.json"),
    signup: require("../locales/ja/signup.json"),
    forgetPassword: require("../locales/ja/forget-password.json"),
    confirmationCode: require("../locales/ja/confirmation-code.json"),
    signupConfirmCode: require("../locales/ja/signup-confirm-code.json"),
    resetPassword: require("../locales/ja/reset-password.json"),
    userProfileSetup: require("../locales/ja/user-profile-setup.json"),
    termsOfService: require("../locales/ja/terms-of-service.json"),
    privacyPolicy: require("../locales/ja/privacy-policy.json"),
    addPackage: require("../locales/ja/add-package.json"),
  },
  ko: {
    translation: require("../locales/ko.json"),
    welcome: require("../locales/ko/welcome.json"),
    login: require("../locales/ko/login.json"),
    signup: require("../locales/ko/signup.json"),
    forgetPassword: require("../locales/ko/forget-password.json"),
    confirmationCode: require("../locales/ko/confirmation-code.json"),
    signupConfirmCode: require("../locales/ko/signup-confirm-code.json"),
    resetPassword: require("../locales/ko/reset-password.json"),
    userProfileSetup: require("../locales/ko/user-profile-setup.json"),
    termsOfService: require("../locales/ko/terms-of-service.json"),
    privacyPolicy: require("../locales/ko/privacy-policy.json"),
    addPackage: require("../locales/ko/add-package.json"),
  },
  ru: {
    translation: require("../locales/ru.json"),
    welcome: require("../locales/ru/welcome.json"),
    login: require("../locales/ru/login.json"),
    signup: require("../locales/ru/signup.json"),
    forgetPassword: require("../locales/ru/forget-password.json"),
    confirmationCode: require("../locales/ru/confirmation-code.json"),
    signupConfirmCode: require("../locales/ru/signup-confirm-code.json"),
    resetPassword: require("../locales/ru/reset-password.json"),
    userProfileSetup: require("../locales/ru/user-profile-setup.json"),
    termsOfService: require("../locales/ru/terms-of-service.json"),
    privacyPolicy: require("../locales/ru/privacy-policy.json"),
    addPackage: require("../locales/ru/add-package.json"),
  },
  it: {
    translation: require("../locales/it.json"),
    welcome: require("../locales/it/welcome.json"),
    login: require("../locales/it/login.json"),
    signup: require("../locales/it/signup.json"),
    forgetPassword: require("../locales/it/forget-password.json"),
    confirmationCode: require("../locales/it/confirmation-code.json"),
    signupConfirmCode: require("../locales/it/signup-confirm-code.json"),
    resetPassword: require("../locales/it/reset-password.json"),
    userProfileSetup: require("../locales/it/user-profile-setup.json"),
    termsOfService: require("../locales/it/terms-of-service.json"),
    privacyPolicy: require("../locales/it/privacy-policy.json"),
    addPackage: require("../locales/it/add-package.json"),
  },
  pt: {
    translation: require("../locales/pt.json"),
    welcome: require("../locales/pt/welcome.json"),
    login: require("../locales/pt/login.json"),
    signup: require("../locales/pt/signup.json"),
    forgetPassword: require("../locales/pt/forget-password.json"),
    confirmationCode: require("../locales/pt/confirmation-code.json"),
    signupConfirmCode: require("../locales/pt/signup-confirm-code.json"),
    resetPassword: require("../locales/pt/reset-password.json"),
    userProfileSetup: require("../locales/pt/user-profile-setup.json"),
    termsOfService: require("../locales/pt/terms-of-service.json"),
    privacyPolicy: require("../locales/pt/privacy-policy.json"),
    addPackage: require("../locales/pt/add-package.json"),
  },
  ar: {
    translation: require("../locales/ar.json"),
    welcome: require("../locales/ar/welcome.json"),
    login: require("../locales/ar/login.json"),
    signup: require("../locales/ar/signup.json"),
    forgetPassword: require("../locales/ar/forget-password.json"),
    confirmationCode: require("../locales/ar/confirmation-code.json"),
    signupConfirmCode: require("../locales/ar/signup-confirm-code.json"),
    resetPassword: require("../locales/ar/reset-password.json"),
    userProfileSetup: require("../locales/ar/user-profile-setup.json"),
    termsOfService: require("../locales/ar/terms-of-service.json"),
    privacyPolicy: require("../locales/ar/privacy-policy.json"),
    addPackage: require("../locales/ar/add-package.json"),
  },
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
