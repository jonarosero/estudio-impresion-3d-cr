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
  signIn: () => signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider()).then(() => undefined),
  signOut: () => firebaseSignOut(getFirebaseAuth()),
  setRole: () => {
    throw new Error("Los roles se administran con Firebase Admin.");
  },
}));
