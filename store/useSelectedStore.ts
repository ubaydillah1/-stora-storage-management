import { create } from "zustand";

interface SelectedStore {
  selectedBox: string[];
  lastSelectedId: string | null;
  setSelectedBox: (ids: string[]) => void;
  addToSelectedBox: (id: string) => void;
  removeFromSelectedBox: (id: string) => void;
  clearSelectedBox: () => void;
  setLastSelectedId: (id: string | null) => void;
  getTotalSelected: () => number;
}

export const useSelected = create<SelectedStore>((set, get) => ({
  selectedBox: [],
  lastSelectedId: null,
  setSelectedBox: (ids) => set({ selectedBox: ids }),
  addToSelectedBox: (id) => {
    const { selectedBox } = get();
    if (!selectedBox.includes(id)) {
      set({ selectedBox: [...selectedBox, id] });
    }
  },
  removeFromSelectedBox: (id) => {
    const { selectedBox } = get();
    set({ selectedBox: selectedBox.filter((x) => x !== id) });
  },
  clearSelectedBox: () => set({ selectedBox: [] }),
  setLastSelectedId: (id) => set({ lastSelectedId: id }),
  getTotalSelected: () => get().selectedBox.length,
}));

export const useTotalSelected = () =>
  useSelected((state) => state.getTotalSelected());
