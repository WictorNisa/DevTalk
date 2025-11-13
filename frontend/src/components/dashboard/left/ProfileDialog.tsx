import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ProfileDialog = ({ open, onOpenChange }: Props) => {
  const { user, isLoading } = useAuthStore();
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch bio (when backend adds it) when dialog opens
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const res = await fetch("http://localhost:8080/api/me", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        // If backend later provides bio, use data.bio || ""
        if (data.bio) setBio(data.bio);
      } catch {
        // Silent fail for simplicity
      }
    })();
  }, [open]);

  const initials = (
    user?.displayName?.slice(0, 2) ||
    user?.externalId?.slice(0, 2) ||
    "?"
  ).toUpperCase();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Placeholder until backend provides /api/me/profile
      // await fetch("http://localhost:8080/api/me/profile", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ bio }),
      //   credentials: "include",
      // });
      console.log("Bio to save:", bio);
      onOpenChange(false);
    } catch {
      // Minimal error handling
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="pb-1.5 font-semibold">
            Profile Settings
          </DialogTitle>
          <DialogDescription>
            Avatar & name sync from GitHub. Bio is local until backend adds
            profile endpoint.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4">
            {isLoading ? (
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
                Synced from GitHub
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={200}
              disabled={isSaving}
            />
            <span className="text-muted-foreground text-xs">
              {bio.length}/200
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isSaving}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
