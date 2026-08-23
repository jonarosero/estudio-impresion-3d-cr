"use client";

import { ChevronRight, Search, X } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/data";
import { useOrderStore } from "@/stores/order-store";
import { PanelHeading, StatusBadge } from "@/components/dashboard/panel-heading";

export function OrdersPanel() {
  const orders = useOrderStore((state) => state.orders);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredOrders = orders.filter((order) =>
    [order.id, order.customer, order.status, order.createdAt].some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    ),
  );
  const selected = orders.find((order) => order.id === selectedId);

  return (
    <>
      <PanelHeading title="Pedidos" subtitle="Gestiona producción, cobros y entregas" />
      <label className="relative mt-5 block max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e5f72]" size={14} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por pedido, cliente o estado"
          className="w-full rounded-xl border border-[#e5d8dc] py-2.5 pl-9 pr-3 text-[10px] outline-none focus:border-[#9e5f72]"
          aria-label="Buscar pedidos"
        />
      </label>
      <div className="mt-4 overflow-hidden rounded-2xl bg-[#fffdfb]">
        {filteredOrders.length > 0 ? filteredOrders.map((order) => (
          <div key={order.id} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#eee5e7] p-5 last:border-0 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            <div><p className="text-xs font-bold">{order.id}</p><p className="mt-1 text-[9px] text-[#786970]">{new Date(order.createdAt).toLocaleDateString("es-EC")}</p></div>
            <span className="hidden text-[10px] sm:block">{order.customer}</span>
            <span className="hidden text-[10px] font-bold sm:block">{formatPrice(order.total)}</span>
            <span className="hidden sm:block"><StatusBadge value={order.status} /></span>
            <button onClick={() => setSelectedId(order.id)} className="flex items-center gap-1 text-[9px] font-bold text-[#9e5f72]">Detalle <ChevronRight size={12} /></button>
          </div>
        )) : <p className="p-5 text-center text-[10px] text-[#786970]">No se encontraron pedidos.</p>}
      </div>
      {selected && <section className="mt-5 rounded-2xl bg-[#fffdfb] p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e5d8dc] pb-5"><div><p className="eyebrow">Pedido</p><h3 className="mt-1 font-display text-3xl font-semibold">{selected.id}</h3><p className="mt-2 text-[10px] text-[#786970]">{new Date(selected.createdAt).toLocaleString("es-EC")}</p></div><div className="flex items-center gap-3"><StatusBadge value={selected.status} /><button onClick={() => setSelectedId(null)} className="rounded-full border border-[#e5d8dc] p-2" aria-label="Cerrar detalle"><X size={14} /></button></div></div><div className="mt-5 grid gap-5 lg:grid-cols-[.9fr_1.1fr]"><div className="space-y-5 text-[11px]"><div><p className="text-[9px] font-bold uppercase tracking-wider text-[#9e5f72]">Cliente</p><p className="mt-2 font-bold">{selected.customer}</p><p className="mt-1 text-[#786970]">{selected.email} · {selected.phone}</p></div><div><p className="text-[9px] font-bold uppercase tracking-wider text-[#9e5f72]">Entrega</p><p className="mt-2 leading-5 text-[#786970]">{selected.shippingAddress}, {selected.city}</p>{selected.reference && <p className="mt-1 text-[#786970]">Referencia: {selected.reference}</p>}</div></div><div><p className="text-[9px] font-bold uppercase tracking-wider text-[#9e5f72]">Productos</p><div className="mt-3 space-y-3">{selected.lines.map((line) => <div key={`${line.productId}-${line.color}`} className="flex justify-between gap-4 border-b border-[#eee5e7] pb-3 text-[11px]"><div><p className="font-bold">{line.name}</p><p className="mt-1 text-[#786970]">{line.color} · {line.quantity} unidad(es)</p></div><span className="font-bold">{formatPrice(line.unitPrice * line.quantity)}</span></div>)}</div><div className="mt-4 space-y-2 border-t border-[#e5d8dc] pt-4 text-[11px]"><p className="flex justify-between"><span>Subtotal</span><span>{formatPrice(selected.subtotal)}</span></p><p className="flex justify-between text-sm font-bold"><span>Total</span><span>{formatPrice(selected.total)}</span></p></div></div></div></section>}
    </>
  );
}
