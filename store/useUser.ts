import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UseUser = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  setUser: (user: UseUser["user"]) => void;
  clearUser: () => void;
};

export const useUser = create<UseUser>()(
  persist(
    (set) => ({
      user: { id: "", name: "", email: "" },
      setUser: (user: UseUser["user"]) => set({ user }),
      clearUser: () => set({ user: { id: "", name: "", email: "" } }),
    }),
    { name: "user" }
  )
);
