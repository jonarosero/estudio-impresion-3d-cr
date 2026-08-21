"use client";

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { create } from "zustand";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/client";

type FavoriteState = {
  productIds: string[];
  toggle: (productId: string) => void;
  startListening: (userId: string) => void;
  stopListening: () => void;
};

let unsubscribe: (() => void) | undefined;

export const useFavoriteStore = create<FavoriteState>()((set, get) => ({
  productIds: [],
  toggle: (productId) => {
    const user = getFirebaseAuth().currentUser;
    if (!user) return;
    const productIds = get().productIds.includes(productId)
      ? get().productIds.filter((id) => id !== productId)
      : [...get().productIds, productId];
    set({ productIds });
    void setDoc(doc(getFirebaseDb(), "users", user.uid), { favorites: productIds }, { merge: true });
  },
  startListening: (userId) => {
    unsubscribe?.();
    unsubscribe = onSnapshot(doc(getFirebaseDb(), "users", userId), (snapshot) => {
    set({ productIds: snapshot.data()?.favorites ?? [] });
    });
  },
  stopListening: () => { unsubscribe?.(); unsubscribe = undefined; set({ productIds: [] }); },
}));
