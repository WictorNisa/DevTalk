import { create } from "zustand";
import { persist } from "zustand/middleware"

// Enkel auth store exempel
// TODO: Connecta med WebSocket när backend är redo.
type User = {
  id: string;
  externalId: string;
  displayName: string;
  avatarUrl: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/github"
      },
      logout: async () => {
        try {
          await fetch('http://localhost:8080/api/logout', {
            method: "POST",
            credentials: "include"
          })
          set({ user: null, isAuthenticated: false })
          window.location.href = "/"
        } catch (error) {
          console.error("Logout failed:", error)
          //This will force logout on the frontend even tho if the backend would fail
          set({ user: null, isAuthenticated: false })
        }
      },

      checkAuth: async () => {
        set({ isLoading: true })

        try {
          const response = await fetch("http://localhost:8080/api/me", {
            credentials: "include",
          })

          if (response.ok) {
            const userData = await response.json()
            set({
              user: {
                id: userData.id?.toString() || "",
                externalId: userData.externalId || "",
                displayName: userData.displayName || "",
                avatarUrl: userData.avatar_url || "",
              },
              isAuthenticated: true,
              isLoading: false
            })
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false })
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      }
    }), {
    name: 'auth-storage',
    partialize: (state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated
    })
  }
  )
)

