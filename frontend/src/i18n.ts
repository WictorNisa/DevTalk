import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locale/en/common.json";
import enLanding from "./locale/en/landing.json";
import enDashboard from "./locale/en/dashboard.json";

import svCommon from "./locale/sv/common.json";
import svLanding from "./locale/sv/landing.json";
import svDashboard from "./locale/sv/dashboard.json";

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
    en: {
      common: enCommon,
      landing: enLanding,
      dashboard: enDashboard,
    },
    sv: {
      common: svCommon,
      landing: svLanding,
      dashboard: svDashboard,
    },
  },
  lng: initialLanguage,
  fallbackLng: "en",
  supportedLngs: SUPPORTED_LANGUAGES,
  defaultNS: "common",
  ns: ["common", "landing", "dashboard"],
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
