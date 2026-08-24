"use client";

import { create } from "zustand";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import type { CustomPrint } from "@/lib/types";

type CustomPrintState = {
  prints: CustomPrint[];
  replace: (prints: CustomPrint[]) => void;
  add: (print: Omit<CustomPrint, "id" | "status" | "createdAt">) => Promise<void>;
  update: (id: string, print: Omit<CustomPrint, "id" | "status" | "createdAt">) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export const useCustomPrintStore = create<CustomPrintState>()((set) => ({
  prints: [],
  replace: (prints) => set({ prints }),
  add: async (print) => {
    const id = crypto.randomUUID();
    await setDoc(doc(getFirebaseDb(), "customPrints", id), {
      ...print,
      id,
      status: "active",
      createdAt: new Date().toISOString(),
    });
  },
  update: async (id, print) => {
    await setDoc(doc(getFirebaseDb(), "customPrints", id), {
      ...print,
      id,
      status: "active",
    }, { merge: true });
  },
  remove: async (id) => deleteDoc(doc(getFirebaseDb(), "customPrints", id)),
}));
