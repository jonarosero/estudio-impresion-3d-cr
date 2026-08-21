"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function CheckoutSuccess({ orderId }: { orderId?: string }) {
  return <main className="page-shell py-20"><div className="mx-auto max-w-xl rounded-[30px] bg-[#fffdfb] p-8 text-center sm:p-12"><CheckCircle2 className="mx-auto text-[#52704b]" size={46} /><p className="eyebrow mt-6">Pedido creado</p><h1 className="mt-3 font-display text-5xl font-semibold">Gracias por tu compra</h1><p className="mt-5 text-sm leading-6 text-[#786970]">Tu pedido {orderId ? <strong>{orderId}</strong> : ""} fue registrado. Recibirás confirmación por correo cuando el pago y la producción avancen.</p><div className="mt-8 flex justify-center gap-3"><Link href="/cuenta/pedidos" className="rounded-full bg-[#35282d] px-5 py-3 text-xs font-bold text-white">Ver mis pedidos</Link><Link href="/catalogo" className="rounded-full border border-[#d8c9cd] px-5 py-3 text-xs font-bold">Seguir comprando</Link></div></div></main>;
}
