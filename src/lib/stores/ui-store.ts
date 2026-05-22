import { create } from "zustand";

interface UIStore {
  isDrawerOpen: boolean;
  editingWineId: string | null;

  openDrawer: (wineId?: string) => void;
  closeDrawer: () => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  isDrawerOpen: false,
  editingWineId: null,

  openDrawer: (wineId?: string) =>
    set({ isDrawerOpen: true, editingWineId: wineId ?? null }),
  closeDrawer: () => set({ isDrawerOpen: false, editingWineId: null }),
}));
