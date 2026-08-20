"use client";

import { MediaSettings } from "@/components/dashboard/media-settings";
import { AdminUsersPanel } from "@/components/dashboard/admin-users-panel";
import { cn } from "@/lib/utils";

export function SettingsPanel() {
  return <><div className="flex items-center justify-between gap-4"><div><h2 className="font-display text-4xl font-semibold">Configuración</h2><p className="mt-1 text-[10px] text-[#786970]">Conexiones, medios y datos de la tienda</p></div></div><div className="mt-6 grid gap-4 md:grid-cols-2">{[{ title: "Mensajeria interna", text: "Cotizaciones privadas con archivos temporales y seguimiento dentro de la tienda.", active: true }, { title: "Firebase", text: "Google Auth, Firestore y Storage temporal pendientes de credenciales.", active: false }, { title: "DEUNA", text: "Payment Link preparado para la futura cuenta comercial.", active: false }, { title: "Vercel", text: "Listo para desplegar desde el repositorio de GitHub.", active: true }].map((item) => <div key={item.title} className="rounded-2xl bg-[#fffdfb] p-6"><div className="flex items-center justify-between"><h3 className="font-display text-2xl font-semibold">{item.title}</h3><span className={cn("size-2.5 rounded-full", item.active ? "bg-[#6f9265]" : "bg-[#c5b8bc]")} /></div><p className="mt-3 text-[10px] leading-5 text-[#786970]">{item.text}</p><button className="mt-5 text-[9px] font-bold text-[#9e5f72]">Configurar</button></div>)}</div><MediaSettings /><AdminUsersPanel /></>;
}
