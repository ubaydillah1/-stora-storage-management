import { create } from "zustand";

export type UploadItem = {
  id: string;
  name: string;
  isUploading: boolean;
};

type UploadQueueState = {
  items: UploadItem[];
  add: (fileName: string) => string;
  finish: (id: string) => void;
};

export const useUploadQueue = create<UploadQueueState>((set) => ({
  items: [],

  add: (fileName) => {
    const id = crypto.randomUUID();
    set((state) => ({
      items: [...state.items, { id, name: fileName, isUploading: true }],
    }));
    return id;
  },

  finish: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
}));
