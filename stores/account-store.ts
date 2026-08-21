"use client";

import { create } from "zustand";
import type { Account, AccountRole } from "@/domain/users/account";
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

export type { AccountRole } from "@/domain/users/account";
type AccountState = {
  account: Account | null;
  isLoading: boolean;
  users: Account[];
  setLoading: (isLoading: boolean) => void;
  setAccount: (account: Account | null) => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  setRole: (userId: string, role: AccountRole) => void;
};

export const useAccountStore = create<AccountState>()((set) => ({
  account: null,
  isLoading: true,
  users: [],
  setLoading: (isLoading) => set({ isLoading }),
  setAccount: (account) => set({ account, users: account ? [account] : [] }),
  signIn: async () => {
    const credential = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
    const idToken = await credential.user.getIdToken();
    const response = await fetch("/api/auth/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idToken }) });
    if (!response.ok) throw new Error("No fue posible crear la sesión segura.");
  },
  signOut: async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    await firebaseSignOut(getFirebaseAuth());
  },
  setRole: () => {
    throw new Error("Los roles se administran con Firebase Admin.");
  },
}));
