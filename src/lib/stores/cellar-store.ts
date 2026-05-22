import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WineType } from "@/types/wine";

type SortField = "name" | "vintage" | "createdAt" | "quantity";
type SortDirection = "asc" | "desc";

interface CellarStore {
  filterType: WineType | null;
  filterRegion: string | null;
  filterCountry: string | null;
  sortField: SortField;
  sortDirection: SortDirection;

  setFilterType: (type: WineType | null) => void;
  setFilterRegion: (region: string | null) => void;
  setFilterCountry: (country: string | null) => void;
  setSortField: (field: SortField) => void;
  setSortDirection: (direction: SortDirection) => void;
  clearFilters: () => void;
}

// Wine data is NEVER stored in Zustand — it lives in Dexie.
// Zustand holds ONLY UI state: filter/sort preferences.
// Per PITFALLS.md technical debt table.
export const useCellarStore = create<CellarStore>()(
  persist(
    (set) => ({
      filterType: null,
      filterRegion: null,
      filterCountry: null,
      sortField: "createdAt",
      sortDirection: "desc",

      setFilterType: (type) => set({ filterType: type }),
      setFilterRegion: (region) => set({ filterRegion: region }),
      setFilterCountry: (country) => set({ filterCountry: country }),
      setSortField: (field) => set({ sortField: field }),
      setSortDirection: (direction) => set({ sortDirection: direction }),
      clearFilters: () =>
        set({ filterType: null, filterRegion: null, filterCountry: null }),
    }),
    { name: "cellar-store" }
  )
);
