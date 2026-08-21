"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { useCartStore } from "@/stores/cart-store";

export function CartPage() {
  const { lines, remove, setQuantity } = useCartStore();
  const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  if (!lines.length) return <main className="page-shell py-16"><h1 className="font-display text-5xl font-semibold">Tu carrito está vacío</h1><Link className="mt-6 inline-block text-sm font-bold text-[#9e5f72]" href="/catalogo">Ver catálogo</Link></main>;
  return <main className="page-shell py-12 sm:py-16"><p className="eyebrow">Tu selección</p><h1 className="mt-3 font-display text-5xl font-semibold">Carrito</h1><div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]"> <section className="space-y-4">{lines.map((line) => <article key={`${line.product.id}-${line.color}`} className="flex gap-4 rounded-3xl bg-[#fffdfb] p-4"><div className="relative size-24 shrink-0 overflow-hidden rounded-2xl"><Image src={line.product.image} alt={line.product.name} fill className="object-cover" /></div><div className="min-w-0 flex-1"><h2 className="font-display text-xl font-semibold">{line.product.name}</h2><p className="text-xs text-[#786970]">{line.color}</p><p className="mt-2 font-bold">{formatPrice(line.product.price)}</p><div className="mt-3 flex items-center gap-3"><button aria-label="Reducir cantidad" onClick={() => setQuantity(line.product.id, line.color, line.quantity - 1)}><Minus size={16} /></button><span className="text-sm font-bold">{line.quantity}</span><button aria-label="Aumentar cantidad" onClick={() => setQuantity(line.product.id, line.color, line.quantity + 1)}><Plus size={16} /></button><button className="ml-auto text-[#9e5f72]" aria-label="Eliminar producto" onClick={() => remove(line.product.id, line.color)}><Trash2 size={17} /></button></div></div></article>)}</section><aside className="h-fit rounded-3xl bg-[#35282d] p-6 text-white"><p className="text-sm text-white/65">Subtotal</p><p className="mt-2 font-display text-3xl font-semibold">{formatPrice(total)}</p><Link href="/checkout" className="mt-6 block rounded-full bg-[#d8b9c2] px-5 py-3 text-center text-sm font-bold text-[#35282d]">Continuar al pago</Link></aside></div></main>;
}
