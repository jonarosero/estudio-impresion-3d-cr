"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, Product } from "@/lib/types";

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  add: (product: Product, color?: string, quantity?: number) => void;
  remove: (productId: string, color: string) => void;
  setQuantity: (productId: string, color: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
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
          return { lines, isOpen: true };
        }),
      remove: (productId, color) =>
        set((state) => ({
          lines: state.lines.filter(
            (line) => !(line.product.id === productId && line.color === color),
          ),
        })),
      setQuantity: (productId, color, quantity) =>
        set((state) => ({
          lines: state.lines.map((line) =>
            line.product.id === productId && line.color === color
              ? { ...line, quantity: Math.max(1, quantity) }
              : line,
          ),
        })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "cr-cart",
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);
