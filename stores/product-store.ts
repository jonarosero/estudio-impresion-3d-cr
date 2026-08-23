"use client";

import { create } from "zustand";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { products as initialProducts } from "@/lib/data";
import { getFirebaseDb } from "@/lib/firebase/client";
import type { Product } from "@/lib/types";

type ProductState = {
  products: Product[];
  isLoaded: boolean;
  replace: (products: Product[]) => void;
  setLoaded: () => void;
  add: (product: Omit<Product, "id">) => Promise<void>;
  update: (id: string, product: Omit<Product, "id">) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export const useProductStore = create<ProductState>()((set) => ({
  products: initialProducts,
  isLoaded: false,
  replace: (products) => set({ products, isLoaded: true }),
  setLoaded: () => set({ isLoaded: true }),
  add: async (product) => {
    const id = crypto.randomUUID();
    await setDoc(doc(getFirebaseDb(), "products", id), { ...product, id, status: "active" });
  },
  update: async (id, product) => {
    await setDoc(doc(getFirebaseDb(), "products", id), { ...product, id, status: "active" });
  },
  remove: async (id) => {
    await deleteDoc(doc(getFirebaseDb(), "products", id));
  },
}));
