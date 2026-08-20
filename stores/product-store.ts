"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as initialProducts } from "@/lib/data";
import type { Product } from "@/lib/types";

type ProductState = {
  products: Product[];
  add: (product: Omit<Product, "id">) => void;
  update: (id: string, product: Omit<Product, "id">) => void;
  remove: (id: string) => void;
};

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: initialProducts,
      add: (product) =>
        set((state) => ({
          products: [{ ...product, id: crypto.randomUUID() }, ...state.products],
        })),
      update: (id, product) =>
        set((state) => ({
          products: state.products.map((item) => item.id === id ? { ...product, id } : item),
        })),
      remove: (id) => set((state) => ({ products: state.products.filter((item) => item.id !== id) })),
    }),
    { name: "cr-admin-products" },
  ),
);
