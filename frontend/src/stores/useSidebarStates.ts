import { create } from "zustand";

type States = {
    isLeftCollapsed: boolean;
    isRightCollapsed: boolean;
};

type Actions = {
    toggleLeft: () => void;
    toggleRight: () => void;
};

export const useSidebarStates = create<States & Actions>((set) => ({
    isLeftCollapsed: false,
    isRightCollapsed: false,
    toggleLeft: () => set((state) => ({ isLeftCollapsed: !state.isLeftCollapsed })),
    toggleRight: () => set((state) => ({isRightCollapsed: !state.isRightCollapsed}))
}));