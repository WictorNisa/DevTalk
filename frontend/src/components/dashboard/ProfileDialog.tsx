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

type User = {
  id: string;
  displayName?: string | null;
  externalId?: string | null;
  avatarUrl?: string | null;
  lastActivityAt?: string | null;
  customStatusMessage?: string | null;
  presenceStatus?: "Online" | "Offline" | "Away" | "Busy";
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
            {user?.displayName}'s {t("userInfo.profile")}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4">
            {!user ? (
              <div className="bg-muted h-[4.5rem] w-[4.5rem] animate-pulse rounded-full" />
            ) : (
              <Avatar className="h-[4.5rem] w-[4.5rem]">
                <AvatarImage
                  src={user?.avatarUrl || undefined}
                  alt={user?.displayName || "User avatar"}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/default-avatar.jpg";
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
                {user?.presenceStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
