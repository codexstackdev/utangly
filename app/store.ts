import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ItemProps = {
  itemName: string;
  quantity: number;
  price: number;
  _id: string;
  createdAt: string;
};
type HistoryProps = {
  payBy: string;
  amountPaid: number;
  createdAt: string;
  _id?: string;
};

type DebtorsProps = {
  fullName: string;
  totalDebt: number;
  items: ItemProps[];
  history: HistoryProps[];
  _id: string;
  status: "paid" | "not paid";
  createdAt: string;
};

type User = {
  fullName: string;
  items: ItemProps[];
  debtors: DebtorsProps[];
};

type ItemDataProps = {
  price: number;
  quantity: number;
  _id: string;
};

type SetStore = {
  user: User | null;
  setUser: (user: User) => void;
  addItem: (newItem: ItemProps) => void;
  editItem: (editItem: ItemDataProps) => void;
  removeItem: (removeItem: string) => void;
  updateTotalDebt: (updateDebtor: DebtorsProps) => void;
  updateItemQuantity: (updateItem: ItemProps[]) => void;
  addDebtor: (newDebtor: DebtorsProps) => void;
  addHistory: (newHistory: HistoryProps, debtorId: string) => void;
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
      editItem: (editItem) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                items: state.user.items.map((item) =>
                  item._id === editItem._id
                    ? {
                        ...item,
                        price: editItem.price,
                        quantity: editItem.quantity,
                      }
                    : item,
                ),
              }
            : null,
        })),

      updateItemQuantity: (updateItem) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                items: state.user.items.map((item) => {
                  const match = updateItem.find((existing) => existing._id === item._id);
                  return match ? {...item, quantity: item.quantity - match.quantity} : item
                }),
              } : null
        })),

      addDebtor: (newDebtor) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, debtors: [...state.user.debtors, newDebtor] }
            : null,
        })),

      addHistory: (newHistory, debtorId) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                debtors: state.user.debtors.map((debt) =>
                  debt._id === debtorId
                    ? { ...debt, history: [...debt.history, newHistory] }
                    : debt,
                ),
              }
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

      updateTotalDebt: (updateDebtor) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                debtors: state.user.debtors.map((debt) =>
                  debt._id === updateDebtor._id
                    ? {
                        ...debt,
                        totalDebt: debt.totalDebt - updateDebtor.totalDebt,
                        status: updateDebtor.status
                      }
                    : debt,
                ),
              }
            : null,
        }));
      },

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
