import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchCurrentUser } from "@/services/fetchCurrentUser";
import { normalizePresenceStatus } from "@/utils/normalizeStatus";
import type { PresenceStatus } from "@/utils/normalizeStatus";
import type { User } from "@/types/User";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setPresenceStatus: (status: PresenceStatus) => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: () => {
        window.location.href =
          "http://localhost:8080/oauth2/authorization/github";
      },
      logout: async () => {
        try {
          await fetch("http://localhost:8080/api/logout", {
            method: "POST",
            credentials: "include",
          });
        } finally {
          set({ user: null, isAuthenticated: false });
          localStorage.removeItem("auth-storage");
          window.location.href = "/";
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const me = await fetchCurrentUser();
          if (me) {
            const normalizedStatus = normalizePresenceStatus(me.presenceStatus);
            set({
              user: {
                id: me.id,
                externalId: me.externalId,
                displayName: me.displayName,
                avatarUrl: me.avatarUrl,
                presenceStatus: normalizedStatus || "Online",
              },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch (e) {
          console.error("Auth check failed:", e);
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      setPresenceStatus: async (status: PresenceStatus) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, presenceStatus: status }
            : state.user,
        }));

        try {
          const { updatePresenceStatus } = await import(
            "@/services/updatePresenceStatus"
          );
          await updatePresenceStatus(status);
        } catch (error) {
          console.error("Failed to update presence on backend:", error);
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
