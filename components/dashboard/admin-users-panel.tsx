"use client";

import { ShieldCheck } from "lucide-react";
import { adminUsers } from "@/application/users/manage-roles";
import { useAccountStore } from "@/stores/account-store";

export function AdminUsersPanel() {
  const setRole = useAccountStore((state) => state.setRole);
  const admins = adminUsers(useAccountStore((state) => state.users));
  return <section className="mt-8"><div><h3 className="font-display text-3xl font-semibold">Administradores</h3><p className="mt-1 text-[10px] text-[#786970]">Usuarios con acceso al panel. Puedes retirar su acceso cuando sea necesario.</p></div><div className="mt-4 rounded-2xl bg-[#fffdfb] p-5"><p className="flex items-center gap-2 text-xs font-bold"><ShieldCheck size={15} className="text-[#9e5f72]" /> Administradores ({admins.length})</p><div className="mt-4 space-y-2">{admins.map((user) => <div key={user.id} className="flex items-center justify-between rounded-xl bg-[#f3e7e9] p-3"><span><span className="block text-xs font-bold">{user.name}</span><span className="text-[9px] text-[#786970]">{user.email}</span></span><button onClick={() => setRole(user.id, "customer")} className="text-[9px] font-bold text-[#9e5f72]">Quitar acceso</button></div>)}</div></div></section>;
}
