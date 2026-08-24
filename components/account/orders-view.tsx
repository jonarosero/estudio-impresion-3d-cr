"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { useOrderStore } from "@/stores/order-store";

const statusLabel: Record<string, string> = { pending_payment: "Pendiente de pago", paid: "Pagado", production: "En producción", ready: "Fabricado", shipped: "Enviado", delivered: "Recibido", cancelled: "Cancelado" };

export function OrdersView() {
  const orders = useOrderStore((state) => state.orders);
  return <main className="page-shell py-12 sm:py-16"><p className="eyebrow">Mi cuenta</p><h1 className="mt-3 font-display text-5xl font-semibold">Mis pedidos</h1>{orders.length ? <div className="mt-8 space-y-3">{orders.map((order) => <article key={order.id} className="rounded-2xl bg-[#fffdfb] p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold">Pedido {order.id}</p><p className="mt-1 text-[10px] text-[#786970]">{new Date(order.createdAt).toLocaleDateString("es-EC")} · {order.lines.length} producto(s)</p></div><span className="rounded-full bg-[#f3e7e9] px-3 py-1.5 text-[9px] font-bold text-[#9e5f72]">{statusLabel[order.status] ?? order.status}</span></div><div className="mt-4 flex justify-between border-t border-[#eee5e7] pt-4 text-xs"><span>{order.lines.map((line) => line.name).join(", ")}</span><strong>{formatPrice(order.total)}</strong></div></article>)}</div> : <div className="mt-8 rounded-[28px] bg-[#fffdfb] p-12 text-center"><Package className="mx-auto text-[#9e5f72]" /><h2 className="mt-4 font-display text-3xl font-semibold">Aún no tienes pedidos</h2><Link href="/catalogo" className="mt-5 inline-block text-xs font-bold text-[#9e5f72]">Explorar catálogo</Link></div>}</main>;
}
