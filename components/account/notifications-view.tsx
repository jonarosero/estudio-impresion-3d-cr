"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useOrderStore } from "@/stores/order-store";
import { useQuoteStore } from "@/stores/quote-store";

export function NotificationsView() {
  const orders = useOrderStore((state) => state.orders);
  const quotes = useQuoteStore((state) => state.quotes);
  const items = [...orders.filter((order) => order.status === "pending_payment").map((order) => ({ id: order.id, title: "Pedido creado", text: `Tu pedido ${order.id} espera confirmación de pago.`, href: "/cuenta" })), ...quotes.filter((quote) => quote.status !== "new").map((quote) => ({ id: quote.id, title: "Actualización de cotización", text: `Tu solicitud está ${quote.status}.`, href: "/personalizados?vista=conversaciones" }))];
  return <main className="page-shell py-12 sm:py-16"><p className="eyebrow">Mi cuenta</p><h1 className="mt-3 font-display text-5xl font-semibold">Notificaciones</h1><div className="mt-8 rounded-[28px] bg-[#fffdfb]">{items.length ? items.map((item) => <Link key={item.id} href={item.href} className="flex gap-4 border-b border-[#eee5e7] p-5 last:border-0 hover:bg-[#faf6f6]"><Bell className="mt-1 text-[#9e5f72]" size={17} /><span><strong className="block text-xs">{item.title}</strong><span className="mt-1 block text-xs text-[#786970]">{item.text}</span></span></Link>) : <p className="p-10 text-center text-sm text-[#786970]">No tienes notificaciones nuevas.</p>}</div></main>;
}
