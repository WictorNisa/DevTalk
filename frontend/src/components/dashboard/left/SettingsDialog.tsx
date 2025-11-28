import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ThemeSwitcher from "@/components/ui/custom/ThemeSwitcher";
import LanguageSelector from "@/components/ui/custom/LanguageSelector";
import { useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SettingsDialog = ({ open, onOpenChange }: Props) => {
  const { t } = useTranslation("common");

  const [notifications, setNotifications] = useState(true);

  const handleNotificationsChange = (checked: boolean) => {
    setNotifications(checked);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("profileSettings.settings")}</DialogTitle>
          <DialogDescription>
            {t("profileSettings.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div className="flex min-h-[35px] items-center justify-between">
            <Label htmlFor="language">{t("settings.language")}</Label>
            <span className="dark:bg-input/30 dark:text-primary border-input/20 bg-accent-foreground hover:bg-accent-foreground w-auto cursor-pointer rounded-lg text-white hover:text-white sm:w-auto">
              <LanguageSelector />
            </span>
          </div>

          <div className="flex min-h-[35px] items-center justify-between">
            <Label htmlFor="theme">{t("settings.theme")}</Label>
            <ThemeSwitcher />
          </div>

          <div className="flex min-h-[35px] items-center justify-between">
            <Label htmlFor="notifications">{t("settings.notifications")}</Label>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={handleNotificationsChange}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
