import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locale/en.json";
import sv from "./locale/swe.json";

const STORAGE_KEY = "devtalk-language";
const SUPPORTED_LANGUAGES = ["en", "sv"] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const isSupportedLanguage = (
  value: string | null | undefined,
): value is SupportedLanguage =>
  !!value && SUPPORTED_LANGUAGES.includes(value as SupportedLanguage);

const resolveInitialLanguage = (): SupportedLanguage => {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isSupportedLanguage(stored)) {
    return stored;
  }

  const browserLanguage = window.navigator.language
    ?.split("-")[0]
    ?.toLowerCase();
  if (isSupportedLanguage(browserLanguage)) {
    return browserLanguage;
  }

  return "en";
};

const initialLanguage = resolveInitialLanguage();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    sv: { translation: sv },
  },
  lng: initialLanguage,
  fallbackLng: "en",
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: { escapeValue: false },
});

if (typeof window !== "undefined") {
  i18n.on("languageChanged", (language) => {
    const normalized = language?.split("-")[0]?.toLowerCase();
    if (isSupportedLanguage(normalized)) {
      window.localStorage.setItem(STORAGE_KEY, normalized);
    }
  });
}

export default i18n;
