"use client";

import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/data";
import { orderStatusLabels, type OrderStatus, useOrderStore } from "@/stores/order-store";
import { PanelHeading, StatusBadge } from "@/components/dashboard/panel-heading";

const statuses: OrderStatus[] = ["pending_payment", "paid", "production", "ready", "shipped", "delivered", "cancelled"];

export function OrdersPanel() {
  const orders = useOrderStore((state) => state.orders);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const normalizedSearch = search.trim().toLowerCase();
  const filteredOrders = orders.filter((order) => status === "all" || order.status === status).filter((order) => [order.code ?? "", order.customer, orderStatusLabels[order.status], order.createdAt].some((value) => value.toLowerCase().includes(normalizedSearch)));

  return <><PanelHeading title="Pedidos" subtitle="Gestiona producción, cobros y entregas" /><div className="mt-5 flex flex-wrap gap-3"><label className="relative block max-w-sm flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e5f72]" size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por código, cliente o estado" className="w-full rounded-xl border border-[#e5d8dc] py-2.5 pl-9 pr-3 text-[10px] outline-none focus:border-[#9e5f72]" aria-label="Buscar pedidos" /></label><select value={status} onChange={(event) => setStatus(event.target.value as OrderStatus | "all")} className="rounded-xl border border-[#e5d8dc] bg-white px-3 py-2.5 text-[10px] font-bold text-[#786970]" aria-label="Filtrar por estado"><option value="all">Todos los estados</option>{statuses.map((item) => <option key={item} value={item}>{orderStatusLabels[item]}</option>)}</select></div><div className="mt-4 overflow-hidden rounded-2xl bg-[#fffdfb]">{filteredOrders.length > 0 ? filteredOrders.map((order) => <div key={order.id} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#eee5e7] p-5 last:border-0 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]"><div><p className="text-xs font-bold">{order.code ?? "Sin código"}</p><p className="mt-1 text-[9px] text-[#786970]">{new Date(order.createdAt).toLocaleDateString("es-EC")}</p></div><span className="hidden text-[10px] sm:block">{order.customer}</span><span className="hidden text-[10px] font-bold sm:block">{formatPrice(order.total)}</span><span className="hidden sm:block"><StatusBadge value={orderStatusLabels[order.status]} /></span><Link href={`/dashboard?tab=pedidos&pedido=${encodeURIComponent(order.id)}`} className="flex items-center gap-1 text-[9px] font-bold text-[#9e5f72]">Detalle <ChevronRight size={12} /></Link></div>) : <p className="p-5 text-center text-[10px] text-[#786970]">No se encontraron pedidos.</p>}</div></>;
}
