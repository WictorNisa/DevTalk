import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { type PresenceStatus } from "@/utils/normalizeStatus";

type User = {
  id: string;
  displayName?: string | null;
  externalId?: string | null;
  avatarUrl?: string | null;
  presenceStatus?: PresenceStatus | undefined;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
};

export const ProfileDialog = ({ open, onOpenChange, user }: Props) => {
  const initials = (
    user?.displayName?.slice(0, 2) ||
    user?.externalId?.slice(0, 2) ||
    "?"
  ).toUpperCase();
  const { t } = useTranslation("common");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="pb-1.5 font-semibold">
            {t("userInfo.profileOf", {
              name: user?.displayName || user?.externalId || "User",
            })}
          </DialogTitle>
          <DialogDescription>
            {t("userInfo.profileDialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4">
            {!user ? (
              <div className="bg-muted h-18 w-18 animate-pulse rounded-full" />
            ) : (
              <Avatar className="h-18 w-18">
                <AvatarImage
                  src={user?.avatarUrl || undefined}
                  alt={user?.displayName || "User avatar"}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/img/default-avatar.svg";
                  }}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {user?.displayName || user?.externalId || "User"}
              </span>
              <span className="text-muted-foreground text-xs">
                {user?.presenceStatus
                  ? user.presenceStatus.charAt(0).toUpperCase() +
                    user.presenceStatus.slice(1).toLowerCase()
                  : "Unknown Status"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <DialogClose asChild>
            <Button className="cursor-pointer" variant="outline">
              {t("common.close")}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
