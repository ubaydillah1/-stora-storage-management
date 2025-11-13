import { FileCategory, NodeSort } from "@/features/api/nodes/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface FilterState {
  search: string;
  category: FileCategory;
  sort: NodeSort;
}

export interface FilterActions {
  setSearch: (search: string) => void;
  setCategory: (category: FileCategory) => void;
  setSort: (sort: NodeSort) => void;

  clearSearch: () => void;
  clearCategory: () => void;
  clearAll: () => void;
}

export type FilterStore = FilterState & FilterActions;

export const useFilter = create<FilterStore>()(
  persist(
    (set) => ({
      search: "",
      category: "",
      sort: "newest",

      setSearch: (search) => set({ search }),
      setCategory: (category) => set({ category }),
      setSort: (sort) => set({ sort }),

      clearSearch: () => set({ search: "" }),
      clearCategory: () => set({ category: "" }),

      clearAll: () =>
        set({
          search: "",
          category: "",
          sort: "newest",
        }),
    }),
    {
      name: "stora-filter",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
