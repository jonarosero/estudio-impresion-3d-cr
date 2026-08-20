"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { useCartStore } from "@/stores/cart-store";

export function CartDrawer() {
  const { lines, isOpen, close, remove, setQuantity } = useCartStore();
  const subtotal = lines.reduce((total, line) => total + line.product.price * line.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#35282d]/35 backdrop-blur-sm" onClick={close}>
      <aside className="ml-auto flex h-full w-full max-w-md flex-col bg-[#fffdfb] p-5 sm:p-7" onClick={(event) => event.stopPropagation()} aria-label="Carrito de compras">
        <div className="flex items-center justify-between border-b border-[#e5d8dc] pb-5">
          <div>
            <p className="eyebrow">Tu selección</p>
            <h2 className="mt-1 font-display text-3xl font-semibold">Carrito</h2>
          </div>
          <button onClick={close} className="focus-ring rounded-full border border-[#e5d8dc] p-2.5" aria-label="Cerrar carrito">
            <X size={18} />
          </button>
        </div>
        {lines.length === 0 ? (
          <div className="grid flex-1 place-items-center text-center">
            <div>
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#f3e7e9] text-[#9e5f72]">
                <ShoppingBag size={24} />
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold">Tu carrito está esperando</h3>
              <p className="mt-2 text-sm text-[#786970]">Encuentra una pieza que se sienta hecha para ti.</p>
              <Link href="/catalogo" onClick={close} className="mt-6 inline-block rounded-full bg-[#35282d] px-6 py-3 text-sm font-bold text-white">
                Explorar colección
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto py-6">
              {lines.map((line) => (
                <div key={`${line.product.id}-${line.color}`} className="grid grid-cols-[82px_1fr_auto] gap-4">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f3e7e9]">
                    <Image src={line.product.image} alt={line.product.name} fill sizes="82px" className="object-cover" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold leading-tight">{line.product.name}</p>
                    <p className="mt-1 text-[11px] text-[#786970]">{line.color}</p>
                    <div className="mt-3 inline-flex items-center rounded-full border border-[#e5d8dc]">
                      <button onClick={() => setQuantity(line.product.id, line.color, line.quantity - 1)} className="p-2" aria-label="Reducir cantidad"><Minus size={12} /></button>
                      <span className="w-7 text-center text-xs font-bold">{line.quantity}</span>
                      <button onClick={() => setQuantity(line.product.id, line.color, line.quantity + 1)} className="p-2" aria-label="Aumentar cantidad"><Plus size={12} /></button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <span className="text-sm font-bold">{formatPrice(line.product.price * line.quantity)}</span>
                    <button onClick={() => remove(line.product.id, line.color)} className="p-2 text-[#9e5f72]" aria-label={`Quitar ${line.product.name}`}><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#e5d8dc] pt-5">
              <div className="flex justify-between font-bold"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <p className="mt-2 text-[11px] text-[#786970]">El costo de entrega se calcula al finalizar.</p>
              <Link href="/checkout" onClick={close} className="mt-5 block rounded-full bg-[#35282d] px-6 py-4 text-center text-sm font-bold text-white hover:bg-[#9e5f72]">
                Continuar al pago
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
