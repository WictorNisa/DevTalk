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
import { useState } from "react";
import dummyUsers from "@/data/dummyUsers.json";

/*
 TODO (ProfileDialog)
 - Replace dummyUsers with authenticated user from auth context (useAuth hook)
 - Fetch user profile data from backend: GET /api/users/me/profile
 - Implement bio save functionality: PUT /api/users/me/profile with { bio }
 - Add loading state while fetching profile data
 - Add loading/disabled state on save button while submitting
 - Show toast/notification on save success/error
 - Add form validation for bio (min/max length, no special characters if needed)
 - Handle avatar upload: POST /api/users/me/avatar with FormData
 - Add error handling for failed avatar loads
 - Sync GitHub OAuth data: username and avatar auto-update from backend
 - Add ability to refresh GitHub data manually
*/

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ProfileDialog = ({ open, onOpenChange }: Props) => {
  // TODO: Replace with authenticated user from auth context
  // const { user, isLoading } = useAuth();
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

  // TODO: Fetch bio from backend when dialog opens
  // useEffect(() => {
  //   if (open) {
  //     fetch('/api/users/me/profile')
  //       .then(res => res.json())
  //       .then(data => setBio(data.bio || ''));
  //   }
  // }, [open]);
  const [bio, setBio] = useState("");

  // TODO: Add loading state for save action
  // const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    // TODO: Implement backend save logic
    // setIsSaving(true);
    // try {
    //   const response = await fetch('/api/users/me/profile', {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ bio }),
    //   });
    //
    //   if (!response.ok) throw new Error('Failed to save profile');
    //
    //   Show success toast
    //   toast.success('Profile updated successfully');
    //   onOpenChange(false);
    // } catch (error) {
    //   Show error toast
    //   toast.error('Failed to save profile');
    // } finally {
    //   setIsSaving(false);
    // }
    console.log("Saving bio:", bio);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="pb-1.5 font-semibold">
            Profile Settings
          </DialogTitle>
          <DialogDescription>
            Update your bio here. Avatar and username are managed by GitHub
            OAuth and will sync automatically.
            <br />
            <span className="text-muted-foreground text-xs">
              (Please visit the GitHub settings to change your avatar or
              username.)
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* TODO: Avatar and username synced from GitHub OAuth via backend */}
          {/* Backend should provide: GET /api/users/me with { username, avatar, githubId } */}
          <div className="flex items-center gap-4">
            <Avatar className="h-[4.5rem] w-[4.5rem]">
              <AvatarImage
                src={user.avatar}
                alt={user.username}
                onError={(e) => {
                  // TODO: Track failed avatar loads and report to backend
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

          {/* TODO: Bio field - save to backend PUT /api/users/me/profile */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={200}
              className="max-w-full"
              // disabled={isSaving}
            />
            <span className="text-muted-foreground text-xs">
              {bio.length}/200 characters
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button
              className="cursor-pointer"
              variant="outline"
              // disabled={isSaving}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="cursor-pointer"
            variant={"default"}
            onClick={handleSave}
            // disabled={isSaving}
          >
            {/* {isSaving ? 'Saving...' : 'Save'} */}
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
