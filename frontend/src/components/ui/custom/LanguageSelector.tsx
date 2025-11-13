import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

const LANGUAGE_CODES = ["en", "sv"] as const;
type LanguageCode = (typeof LANGUAGE_CODES)[number];

const normalizeLanguage = (code?: string | null): LanguageCode => {
  const base = code?.split("-")[0]?.toLowerCase() ?? "en";
  return LANGUAGE_CODES.includes(base as LanguageCode)
    ? (base as LanguageCode)
    : "en";
};

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();

  const currentLanguageCode = normalizeLanguage(
    i18n.resolvedLanguage ?? i18n.language,
  );

  const languageNames: Record<"en" | "sv", string> = {
    en: t("language.names.en"),
    sv: t("language.names.sv"),
  };

  const handleLanguageChange = (value: LanguageCode) => {
    if (value !== currentLanguageCode) {
      void i18n.changeLanguage(value);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-input/20 text-secondary hover:text-secondary hover:bg-secondary/10 dark:text-primary bg-accent/5 inline-flex cursor-pointer items-center gap-2"
          aria-label={t("language.label")}
        >
          <Languages className="h-4 w-4" aria-hidden="true" />
          <span className="text-xs font-medium md:text-sm">
            {languageNames[currentLanguageCode]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto">
        <DropdownMenuLabel>{t("language.label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={currentLanguageCode}
          onValueChange={(value) => handleLanguageChange(value as LanguageCode)}
        >
          {LANGUAGE_CODES.map((code) => (
            <DropdownMenuRadioItem key={code} value={code}>
              {languageNames[code]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
