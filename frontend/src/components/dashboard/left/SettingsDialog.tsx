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

/*
 TODO (SettingsDialog)
 - Fetch user settings from backend: GET /api/users/me/settings
 - Save settings to backend: PUT /api/users/me/settings
 - Add loading state while fetching settings
 - Add loading/disabled state while saving settings
 - Show toast/notification on save success/error
 - Add more settings when backend supports:
   * Email notifications
   * Push notifications
   * Sound effects
   * Message preview in notifications
   * Privacy settings (who can message you, etc.)
   * Language preference
 - Debounce settings changes before saving to backend
 - Add settings validation
*/

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SettingsDialog = ({ open, onOpenChange }: Props) => {
  const { t } = useTranslation("common");

  // TODO: Wire to backend - save to: PUT /api/users/me/settings
  const [notifications, setNotifications] = useState(true);

  const handleNotificationsChange = (checked: boolean) => {
    setNotifications(checked);
    // TODO: Debounce and auto-save to backend
    // OR show a "Save" button to manually trigger save
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
            <LanguageSelector />
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
