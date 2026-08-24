"use client";

import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/data";
import { orderStatusLabels, useOrderStore } from "@/stores/order-store";
import { PanelHeading, StatusBadge } from "@/components/dashboard/panel-heading";

export function OrdersPanel() {
  const orders = useOrderStore((state) => state.orders);
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const filteredOrders = orders.filter((order) =>
    [order.code ?? order.id, order.customer, order.status, order.createdAt].some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    ),
  );

  return <><PanelHeading title="Pedidos" subtitle="Gestiona producción, cobros y entregas" /><label className="relative mt-5 block max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e5f72]" size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por pedido, cliente o estado" className="w-full rounded-xl border border-[#e5d8dc] py-2.5 pl-9 pr-3 text-[10px] outline-none focus:border-[#9e5f72]" aria-label="Buscar pedidos" /></label><div className="mt-4 overflow-hidden rounded-2xl bg-[#fffdfb]">{filteredOrders.length > 0 ? filteredOrders.map((order) => <div key={order.id} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#eee5e7] p-5 last:border-0 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]"><div><p className="text-xs font-bold">{order.code ?? order.id}</p><p className="mt-1 text-[9px] text-[#786970]">{new Date(order.createdAt).toLocaleDateString("es-EC")}</p></div><span className="hidden text-[10px] sm:block">{order.customer}</span><span className="hidden text-[10px] font-bold sm:block">{formatPrice(order.total)}</span><span className="hidden sm:block"><StatusBadge value={orderStatusLabels[order.status]} /></span><Link href={`/dashboard/pedidos/${order.id}`} className="flex items-center gap-1 text-[9px] font-bold text-[#9e5f72]">Detalle <ChevronRight size={12} /></Link></div>) : <p className="p-5 text-center text-[10px] text-[#786970]">No se encontraron pedidos.</p>}</div></>;
}
