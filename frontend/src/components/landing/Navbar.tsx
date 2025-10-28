import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

import Logo from "@/assets/img/devtalk-logo.svg";
import { GitHubLogoIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import ThemeSwitcher from "../ui/custom/ThemeSwitcher";

const GITHUB_REPO = "https://github.com/WictorNisa/DevTalk";

const NAV_LINKS = [
  { key: "features", href: "#features" },
  { key: "howItWorks", href: "#how-it-works" },
  { key: "meetTheTeam", href: "#team" },
] as const;

const LANGUAGE_CODES = ["en", "sv"] as const;
type LanguageCode = (typeof LANGUAGE_CODES)[number];

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const navLinks = NAV_LINKS.map(({ key, href }) => ({
    href,
    label: t(`nav.${key}`),
  }));

  const normalizeLanguage = (code?: string | null): LanguageCode => {
    const base = code?.split("-")[0]?.toLowerCase() ?? "en";
    return LANGUAGE_CODES.includes(base as LanguageCode)
      ? (base as LanguageCode)
      : "en";
  };

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

  const LanguageDropdown = () => (
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
      <DropdownMenuContent align="end" className="w-48">
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

  return (
    <header className="dark:text-foreground bg-foreground/50 text-foreground sticky top-0 z-50 w-full border-b border-(--muted-foreground)/30 backdrop-blur-md dark:border-(--border)/70 dark:bg-(--background)/40">
      <nav className="max-w-8xl mx-auto flex items-center justify-between px-5 py-5">
        <a href="#home" className="flex">
          <span className="bg-foreground/15 flex h-12 w-12 items-center justify-center rounded-lg transition-colors dark:border-none dark:bg-transparent">
            <img src={Logo} className="h-8 w-8 invert" alt="DevTalk logo" />
          </span>
        </a>
        <div className="flex items-center gap-2">
          <LanguageDropdown />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-input/20 text-secondary hover:text-secondary hover:bg-secondary/10 dark:text-primary bg-accent/5 hidden cursor-pointer items-center gap-2 md:inline-flex"
              >
                {t("nav.menu")}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="hidden w-48 md:block">
              {navLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <a
                    href={link.href}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    {link.label}
                  </a>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href={GITHUB_REPO}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer"
                >
                  <GitHubLogoIcon /> {t("nav.githubLabel")}
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <ThemeSwitcher />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-input/20 text-secondary hover:text-secondary hover:bg-secondary/10 dark:text-primary bg-accent/5 md:hidden"
                aria-label="Open navigation menu"
              >
                <HamburgerMenuIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 md:hidden">
              {navLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-base"
                  >
                    {link.label}
                  </a>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href={GITHUB_REPO}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-base"
                >
                  <GitHubLogoIcon /> {t("nav.githubLabelMobile")}
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
