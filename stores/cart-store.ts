"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import type { CartLine, Product } from "@/lib/types";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/client";

function saveCart(lines: CartLine[]) {
  const userId = getFirebaseAuth().currentUser?.uid;
  if (userId) void setDoc(doc(getFirebaseDb(), "users", userId), { cart: lines }, { merge: true });
}

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  add: (product: Product, color?: string, quantity?: number) => void;
  remove: (productId: string, color: string) => void;
  setQuantity: (productId: string, color: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  startListening: (userId: string) => void;
  stopListening: () => void;
};

let unsubscribe: (() => void) | undefined;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      add: (product, color = product.colors[0], quantity = 1) =>
        set((state) => {
          const existing = state.lines.find(
            (line) => line.product.id === product.id && line.color === color,
          );
          const lines = existing
            ? state.lines.map((line) =>
                line === existing ? { ...line, quantity: line.quantity + quantity } : line,
              )
            : [...state.lines, { product, color, quantity }];
          saveCart(lines);
          return { lines, isOpen: true };
       }),
      remove: (productId, color) =>
        set((state) => {
          const lines = state.lines.filter(
            (line) => !(line.product.id === productId && line.color === color),
          );
          saveCart(lines);
          return { lines };
        }),
      setQuantity: (productId, color, quantity) =>
        set((state) => {
          const lines = state.lines.map((line) =>
            line.product.id === productId && line.color === color
              ? { ...line, quantity: Math.max(1, quantity) }
              : line,
          );
          saveCart(lines);
          return { lines };
        }),
      clear: () => { saveCart([]); set({ lines: [] }); },
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      startListening: (userId) => {
        unsubscribe?.();
        const userRef = doc(getFirebaseDb(), "users", userId);
        unsubscribe = onSnapshot(userRef, (snapshot) => {
          const remoteLines = snapshot.data()?.cart as CartLine[] | undefined;
          if (remoteLines) set({ lines: remoteLines });
          else void setDoc(userRef, { cart: get().lines }, { merge: true });
        });
      },
      stopListening: () => { unsubscribe?.(); unsubscribe = undefined; set({ lines: [] }); },
    }),
    {
      name: "cr-cart",
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);
