"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, LockKeyhole, Scale, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/data";
import { getShippingRule, SERVIENTREGA_QUOTE_URL } from "@/lib/shipping";
import { useCartStore } from "@/stores/cart-store";

const inputClass = "w-full rounded-2xl border border-[#ded0d4] bg-[#fffdfb] px-4 py-3.5 text-sm";

export function CheckoutView() {
  const [city, setCity] = useState("");
  const lines = useCartStore((state) => state.lines);
  const subtotal = lines.reduce((total, line) => total + line.product.price * line.quantity, 0);
  const totalWeightGrams = lines.reduce((total, line) => total + (line.product.weightGrams ?? 250) * line.quantity, 0);
  const shippingRule = getShippingRule(subtotal, city);
  const shippingResolved = shippingRule.free || subtotal === 0;

  return (
    <main className="page-shell py-10 sm:py-16">
      <Link href="/catalogo" className="inline-flex items-center gap-2 text-xs font-bold text-[#786970]"><ArrowLeft size={14} /> Seguir comprando</Link>
      <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_.72fr]">
        <section className="rounded-[28px] bg-[#fffdfb] p-6 sm:p-10"><p className="eyebrow">Finalizar compra</p><h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Datos de entrega</h1>
          <div className="mt-8 grid gap-4 sm:grid-cols-2"><input className={inputClass} placeholder="Nombre" /><input className={inputClass} placeholder="Apellido" /><input className={inputClass} type="email" placeholder="Correo electronico" /><input className={inputClass} type="tel" placeholder="Telefono" /><input className={`${inputClass} sm:col-span-2`} placeholder="Direccion" /><input value={city} onChange={(event) => setCity(event.target.value)} className={inputClass} placeholder="Ciudad o canton" /><input className={inputClass} placeholder="Referencia de entrega" /></div>
          <div className="mt-5 rounded-2xl border border-[#ded0d4] bg-[#faf6f6] p-5">
            <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f3e7e9] text-[#9e5f72]"><Truck size={17} /></span><div className="flex-1"><h2 className="text-sm font-bold">{shippingRule.free ? "Envio gratis" : "Cotizacion de entrega"}</h2><p className="mt-1 text-[11px] leading-5 text-[#786970]">{shippingRule.reason}. Peso estimado del pedido: {(totalWeightGrams / 1000).toFixed(2)} kg.</p>{!shippingRule.free && subtotal > 0 && <a href={SERVIENTREGA_QUOTE_URL} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-[10px] font-bold text-[#9e5f72]">Abrir cotizador oficial de Servientrega <ExternalLink size={12} /></a>}</div></div>
          </div>
          <div className="mt-8 rounded-2xl border border-[#c9adb5] bg-[#f3e7e9] p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-[#35282d] text-white"><LockKeyhole size={17} /></span><div><h2 className="text-sm font-bold">Pago seguro con DEUNA</h2><p className="mt-1 text-[11px] text-[#786970]">Integracion preparada para activarse al recibir credenciales comerciales.</p></div></div></div>
          <button onClick={() => window.alert("Este es un prototipo visual. El pago con DEUNA y la tarifa empresarial de Servientrega se activaran al configurar credenciales.")} disabled={lines.length === 0 || !city || !shippingResolved} className="mt-5 w-full rounded-full bg-[#35282d] px-6 py-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{!city ? "Ingresa la ciudad de entrega" : !shippingResolved ? "Cotiza el envio para continuar" : "Continuar a DEUNA"}</button>
        </section>
        <aside className="h-fit rounded-[28px] bg-[#ead7dc] p-6 sm:p-8"><h2 className="font-display text-3xl font-semibold">Tu pedido</h2>{lines.length === 0 ? <div className="py-16 text-center"><p className="text-sm text-[#786970]">El carrito esta vacio.</p><Link href="/catalogo" className="mt-4 inline-block text-xs font-bold underline">Explorar productos</Link></div> : <div className="mt-6 space-y-4">{lines.map((line) => <div key={`${line.product.id}-${line.color}`} className="grid grid-cols-[64px_1fr_auto] items-center gap-3"><div className="relative aspect-square overflow-hidden rounded-xl"><Image src={line.product.image} alt={line.product.name} fill sizes="64px" className="object-cover" /></div><div><p className="text-xs font-bold">{line.product.name}</p><p className="mt-1 text-[10px] text-[#786970]">{line.color} · Cant. {line.quantity}</p></div><span className="text-xs font-bold">{formatPrice(line.product.price * line.quantity)}</span></div>)}</div>}
          <div className="mt-7 space-y-3 border-t border-[#cdbbc0] pt-5 text-xs"><div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between"><span>Entrega</span><span>{shippingRule.free ? "$0,00" : "Por cotizar"}</span></div><div className="flex items-center justify-between text-[10px] text-[#786970]"><span className="flex items-center gap-1"><Scale size={12} /> Peso del pedido</span><span>{(totalWeightGrams / 1000).toFixed(2)} kg</span></div><div className="flex justify-between border-t border-[#cdbbc0] pt-4 text-base font-bold"><span>Total productos</span><span>{formatPrice(subtotal)}</span></div></div>
          <div className="mt-5 flex items-center gap-2 text-[10px] text-[#786970]"><ShieldCheck size={14} /> No almacenamos datos de tarjeta.</div>
        </aside>
      </div>
    </main>
  );
}
