import { create } from "zustand";

// Enkel auth store exempel
// TODO: Connecta med WebSocket när backend är redo.
type User = {
  id: string;
  username: string;
  token: string;
};

type AuthState = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
