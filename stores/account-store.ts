"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { assignRole } from "@/application/users/manage-roles";
import type { Account, AccountRole } from "@/domain/users/account";

export type { AccountRole } from "@/domain/users/account";
type AccountState = { account: Account | null; users: Account[]; signIn: (role: AccountRole) => void; signOut: () => void; setRole: (userId: string, role: AccountRole) => void };

const users: Account[] = [
  { id: "admin-jj", name: "Administración J&J", email: "admin@jj.ec", role: "admin" },
  { id: "customer-demo", name: "Cliente J&J", email: "cliente@jj.ec", role: "customer" },
  { id: "maria-jimenez", name: "Maria Jimenez", email: "maria.j@example.com", role: "customer" },
  { id: "andrea-ponce", name: "Andrea Ponce", email: "andrea.p@example.com", role: "customer" },
];

export const useAccountStore = create<AccountState>()(persist((set) => ({
  account: null,
  users,
  signIn: (role) => set((state) => ({ account: state.users.find((user) => user.role === role && (role === "admin" || user.id === "customer-demo")) ?? null })),
  signOut: () => set({ account: null }),
  setRole: (userId, role) => set((state) => ({ users: assignRole(state.users, userId, role), account: state.account?.id === userId ? { ...state.account, role } : state.account })),
}), { name: "jj-account" }));
