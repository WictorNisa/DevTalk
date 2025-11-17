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
  const { t } = useTranslation();
  // TODO: Fetch settings from backend when dialog opens
  // useEffect(() => {
  //   if (open) {
  //     fetch('/api/users/me/settings')
  //       .then(res => res.json())
  //       .then(data => {
  //         setNotifications(data.notifications ?? true);
  //         setOtherSettings(data);
  //       });
  //   }
  // }, [open]);

  // TODO: Add loading state
  // const [isLoading, setIsLoading] = useState(false);
  // const [isSaving, setIsSaving] = useState(false);

  // TODO: Wire to backend - save to: PUT /api/users/me/settings
  const [notifications, setNotifications] = useState(true);

  // TODO: Implement auto-save or manual save button
  // const handleSaveSettings = async () => {
  //   setIsSaving(true);
  //   try {
  //     const response = await fetch('/api/users/me/settings', {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         notifications,
  //         otherSettings,
  //       }),
  //     });
  //
  //     if (!response.ok) throw new Error('Failed to save settings');
  //
  //     toast.success('Settings saved successfully');
  //   } catch (error) {
  //     toast.error('Failed to save settings');
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

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

        <div className="flex flex-col gap-4 py-4">
          {/* Theme - already persisted via ThemeSwitcher component */}
          {/* TODO: Also save theme preference to backend for cross-device sync */}
          {/* PUT /api/users/me/settings with { theme: 'light' | 'dark' | 'system' } */}
          <div className="flex items-center justify-between">
            <Label htmlFor="theme">{t("settings.theme")}</Label>
            <ThemeSwitcher />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="language">{t("settings.language")}</Label>
            <LanguageSelector />
          </div>

          {/* TODO: Wire to backend - GET/PUT /api/users/me/settings */}
          {/* Backend should provide notification settings:
              - email_notifications: boolean
              - push_notifications: boolean
              - sound_enabled: boolean
              - message_preview: boolean
          */}
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">{t("settings.notifications")}</Label>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={handleNotificationsChange}
              // disabled={isSaving}
            />
          </div>

          {/* TODO: Add more settings */}
          {/* <div className="flex items-center justify-between">
            <Label htmlFor="sounds">Sound Effects</Label>
            <Switch id="sounds" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="message-preview">Message Preview</Label>
            <Switch id="message-preview" />
          </div> */}
        </div>

        {/* TODO: Add Save/Cancel buttons if not using auto-save */}
        {/* <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div> */}
      </DialogContent>
    </Dialog>
  );
};
