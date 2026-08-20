"use client";

import { ShieldCheck } from "lucide-react";
import { useAccountStore } from "@/stores/account-store";

export function AdminUsersPanel() {
  const account = useAccountStore((state) => state.account);
  return <section className="mt-8"><div><h3 className="font-display text-3xl font-semibold">Administradores</h3><p className="mt-1 text-[10px] text-[#786970]">Los permisos se asignan como custom claims mediante Firebase Admin.</p></div><div className="mt-4 rounded-2xl bg-[#fffdfb] p-5"><p className="flex items-center gap-2 text-xs font-bold"><ShieldCheck size={15} className="text-[#9e5f72]" /> Acceso actual</p>{account?.role === "admin" ? <div className="mt-4 rounded-xl bg-[#f3e7e9] p-3"><span className="block text-xs font-bold">{account.name}</span><span className="text-[9px] text-[#786970]">{account.email}</span></div> : <p className="mt-4 text-[10px] text-[#786970]">No hay un administrador autenticado en esta sesión.</p>}</div></section>;
}
