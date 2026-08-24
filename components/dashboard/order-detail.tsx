"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/data";
import { orderStatusLabels, type OrderStatus, useOrderStore } from "@/stores/order-store";
import { StatusBadge } from "@/components/dashboard/panel-heading";

const progress: OrderStatus[] = ["pending_payment", "paid", "production", "ready", "shipped", "delivered"];

export function OrderDetail({ id }: { id: string }) {
  const order = useOrderStore((state) => state.orders.find((item) => item.id === id));
  const updateStatus = useOrderStore((state) => state.updateStatus);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<OrderStatus | null>(null);

  if (!order) return <main className="grid min-h-dvh place-items-center bg-[#f7f3f3] text-sm text-[#786970]">Cargando pedido...</main>;

  async function changeStatus(status: OrderStatus) {
    setUpdating(status);
    setError("");
    try {
      await updateStatus(id, status);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo actualizar el pedido.");
    } finally {
      setUpdating(null);
    }
  }

  const origin = order.origin === "quote" ? `Cotización${order.quoteCode ? ` ${order.quoteCode}` : ""}` : "Pedido web";
  return <main className="min-h-dvh bg-[#f7f3f3] p-5 sm:p-10"><div className="mx-auto max-w-4xl"><Link href="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-bold text-[#9e5f72]"><ArrowLeft size={14} /> Volver a pedidos</Link><section className="mt-5 rounded-[28px] bg-[#fffdfb] p-6 sm:p-10"><div className="flex flex-wrap items-start justify-between gap-5 border-b border-[#e5d8dc] pb-6"><div><p className="eyebrow">Pedido</p><h1 className="mt-2 font-display text-5xl font-semibold">{order.code ?? order.id}</h1><p className="mt-3 text-xs text-[#786970]">Creado el {new Date(order.createdAt).toLocaleString("es-EC")}</p><p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[#9e5f72]">Origen: {origin}</p></div><StatusBadge value={orderStatusLabels[order.status]} /></div><div className="mt-7"><p className="text-[9px] font-bold uppercase tracking-wider text-[#9e5f72]">Estado del pedido</p><div className="mt-3 flex flex-wrap gap-2">{progress.map((status) => <button key={status} disabled={order.status === status || updating !== null} onClick={() => void changeStatus(status)} className={`rounded-full px-3 py-2 text-[9px] font-bold disabled:opacity-50 ${order.status === status ? "bg-[#35282d] text-white" : "border border-[#d8c9cd] text-[#786970]"}`}>{updating === status ? "Actualizando..." : orderStatusLabels[status]}</button>)}</div>{error && <p className="mt-2 text-[10px] font-bold text-[#a64655]">{error}</p>}</div><div className="mt-7 grid gap-8 border-t border-[#e5d8dc] pt-7 md:grid-cols-2"><div><p className="text-[9px] font-bold uppercase tracking-wider text-[#9e5f72]">Cliente</p><p className="mt-3 text-sm font-bold">{order.customer}</p><p className="mt-1 text-xs text-[#786970]">{order.email} · {order.phone}</p><p className="mt-7 text-[9px] font-bold uppercase tracking-wider text-[#9e5f72]">Entrega</p><p className="mt-3 text-xs leading-5 text-[#786970]">{order.shippingAddress}, {order.city}</p>{order.reference && <p className="mt-2 text-xs text-[#786970]">Referencia: {order.reference}</p>}</div><div><p className="text-[9px] font-bold uppercase tracking-wider text-[#9e5f72]">Productos</p><div className="mt-3 space-y-3">{order.lines.map((line) => <div key={`${line.productId}-${line.color}`} className="flex justify-between gap-4 border-b border-[#eee5e7] pb-3 text-xs"><div><p className="font-bold">{line.name}</p><p className="mt-1 text-[#786970]">{line.color} · {line.quantity} unidad(es)</p></div><span className="font-bold">{formatPrice(line.unitPrice * line.quantity)}</span></div>)}</div><div className="mt-5 space-y-2 border-t border-[#e5d8dc] pt-4 text-xs"><p className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></p><p className="flex justify-between text-base font-bold"><span>Total</span><span>{formatPrice(order.total)}</span></p></div></div></div></section></div></main>;
}
