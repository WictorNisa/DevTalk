import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import dummyUsers from "@/data/dummyUsers.json";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ProfileDialog = ({ open, onOpenChange }: Props) => {
  // TODO: Replace with authenticated user from auth context (useAuth hook)
  // For now, use first dummy user as fallback
  const fallbackUser = {
    username: "You",
    avatar: "/images/default-avatar.jpg",
  };

  const userFromJson =
    Array.isArray(dummyUsers) && dummyUsers.length > 0
      ? dummyUsers[0]
      : fallbackUser;

  const user = {
    username: userFromJson.username || fallbackUser.username,
    avatar:
      typeof userFromJson.avatar === "string"
        ? userFromJson.avatar.startsWith("/") ||
          userFromJson.avatar.startsWith("http")
          ? userFromJson.avatar
          : `/${userFromJson.avatar}`
        : fallbackUser.avatar,
  };

  // Local state for bio (will be synced with backend when auth is ready)
  const [bio, setBio] = useState("");

  const handleSave = () => {
    // TODO: POST bio to backend API
    // TODO: Show toast/notification on success/error
    console.log("Saving bio:", bio);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>
            Update your bio here. Avatar and username are managed by GitHub
            OAuth and will sync automatically.{" "}
            <span className="text-muted-foreground text-xs">
              (Please visit the GitHub settings to change your avatar or
              username.)
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Avatar and username from GitHub OAuth */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={user.avatar}
                alt={user.username}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/default-avatar.jpg";
                }}
              />
              <AvatarFallback>
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.username}</span>
              <span className="text-muted-foreground text-xs">
                Synced from GitHub
              </span>
            </div>
          </div>

          {/* Bio (can edit) */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us something about you..."
              rows={4}
              maxLength={200}
              className="max-w-svh"
            />
            <span className="text-muted-foreground text-xs">
              {bio.length}/200 characters
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
