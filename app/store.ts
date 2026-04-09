import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ItemProps = {
  itemName: string;
  quantity: number;
  price: number;
  _id: string;
};

type User = {
  fullName: string;
  items: ItemProps[];
};

type SetStore = {
  user: User | null;
  setUser: (user: User) => void;
  addItem: (newItem: ItemProps) => void;
  removeItem: (removeItem: string) => void;
  clearUser: () => void;
};

export const setUserStore = create<SetStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      addItem: (addItem) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, items: [...state.user.items, addItem] }
            : null,
        })),
      removeItem: (removeItem) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                items: state.user.items.filter(
                  (item) => item._id !== removeItem,
                ),
              }
            : null,
        })),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-session",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);
