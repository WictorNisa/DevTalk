import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchCurrentUser } from "@/services/fetchCurrentUser";
import { normalizePresenceStatus } from "@/utils/normalizeStatus";
import type { User } from "@/types/User";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
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
          window.location.href = "/";
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const me = await fetchCurrentUser();
          if (me) {
            set({
              user: {
                id: me.id,
                externalId: me.externalId,
                displayName: me.displayName,
                avatarUrl: me.avatarUrl,
                // Force online status on successful auth check
                presenceStatus: "Online",
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
