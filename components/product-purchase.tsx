"use client";

import { Minus, Paintbrush, Palette, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { AddToCart } from "@/components/add-to-cart";
import { formatPrice } from "@/lib/data";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductPurchase({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]);
  const [colorMode, setColorMode] = useState<"single" | "multicolor">("single");
  const [finish, setFinish] = useState<"standard" | "hand-painted" | "ready-to-paint">("standard");
  const [quantity, setQuantity] = useState(1);
  const colorMap: Record<string, string> = {
    "Rosa nube": "#e6bdc8", Marfil: "#eee9dd", Salvia: "#aeb9a4", "Rosa arcilla": "#c98698", Arena: "#d7c4ac", Ciruela: "#6c4453", Lavanda: "#b9acd0", Blanco: "#f8f7f2", Caramelo: "#bc8a63", Terracota: "#b66c52", Negro: "#35282d", Miel: "#d6a568",
  };
  const colorSurcharge = ["Ciruela", "Negro", "Caramelo", "Miel"].includes(color) ? 0.75 : 0;
  const multicolorSurcharge = colorMode === "multicolor" ? 3 : 0;
  const finishAdjustment = finish === "hand-painted" ? 4.5 : finish === "ready-to-paint" ? -2 : 0;
  const unitPrice = product.price + colorSurcharge + multicolorSurcharge + finishAdjustment;
  const selectionLabel = [colorMode === "multicolor" ? `Multicolor con base ${color}` : color, finish === "hand-painted" ? "Pintado a mano" : finish === "ready-to-paint" ? "Listo para pintar" : "Acabado estandar"].join(" · ");
  const cartProduct = { ...product, price: unitPrice };

  return (
    <div className="mt-8 border-t border-[#e5d8dc] pt-7">
      <div className="flex items-center justify-between"><span className="text-xs font-extrabold uppercase tracking-wider">Color base</span><span className="text-xs text-[#786970]">{color}{colorSurcharge > 0 && ` · +${formatPrice(colorSurcharge)}`}</span></div>
      <div className="mt-3 flex flex-wrap gap-3">
        {product.colors.map((item) => (
          <button key={item} onClick={() => setColor(item)} className={cn("size-9 rounded-full border-4 border-[#fffdfb] shadow-[0_0_0_1px_#d8c9cd] transition", color === item && "shadow-[0_0_0_2px_#35282d]")} style={{ background: colorMap[item] ?? "#e6bdc8" }} aria-label={`Elegir color ${item}`} />
        ))}
      </div>
      <div className="mt-7 border-t border-[#e5d8dc] pt-6"><div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider"><Palette size={14} className="text-[#9e5f72]" /> Composicion de color</div><div className="mt-3 grid gap-2 sm:grid-cols-2"><button onClick={() => setColorMode("single")} className={cn("rounded-2xl border p-4 text-left", colorMode === "single" ? "border-[#35282d] bg-[#f3e7e9]" : "border-[#e5d8dc]")}><span className="text-xs font-bold">Un solo color</span><span className="mt-1 block text-[10px] text-[#786970]">Acabado uniforme, sin costo extra.</span></button><button onClick={() => setColorMode("multicolor")} className={cn("rounded-2xl border p-4 text-left", colorMode === "multicolor" ? "border-[#35282d] bg-[#f3e7e9]" : "border-[#e5d8dc]")}><span className="text-xs font-bold">Multicolor</span><span className="mt-1 block text-[10px] text-[#786970]">Varias tonalidades en la misma pieza · +{formatPrice(3)}</span></button></div></div>
      <div className="mt-7 border-t border-[#e5d8dc] pt-6"><div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider"><Paintbrush size={14} className="text-[#9e5f72]" /> Acabado</div><div className="mt-3 grid gap-2"><button onClick={() => setFinish("standard")} className={cn("flex items-center justify-between rounded-2xl border px-4 py-3 text-left", finish === "standard" ? "border-[#35282d] bg-[#f3e7e9]" : "border-[#e5d8dc]")}><span><span className="block text-xs font-bold">Impresion estandar</span><span className="mt-1 block text-[10px] text-[#786970]">Color aplicado directamente durante la impresion.</span></span><span className="text-[10px] font-bold">Incluido</span></button><button onClick={() => setFinish("hand-painted")} className={cn("flex items-center justify-between rounded-2xl border px-4 py-3 text-left", finish === "hand-painted" ? "border-[#35282d] bg-[#f3e7e9]" : "border-[#e5d8dc]")}><span><span className="block text-xs font-bold">Pintado a mano</span><span className="mt-1 block text-[10px] text-[#786970]">Terminamos detalles a mano en el estudio.</span></span><span className="text-[10px] font-bold">+{formatPrice(4.5)}</span></button><button onClick={() => setFinish("ready-to-paint")} className={cn("flex items-center justify-between rounded-2xl border px-4 py-3 text-left", finish === "ready-to-paint" ? "border-[#35282d] bg-[#f3e7e9]" : "border-[#e5d8dc]")}><span><span className="block text-xs font-bold">Listo para pintar</span><span className="mt-1 block text-[10px] text-[#786970]">Base sin acabado para que la personalices en casa.</span></span><span className="text-[10px] font-bold text-[#52704b]">-{formatPrice(2)}</span></button></div></div>
      <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#f3e7e9] p-4"><span className="flex items-center gap-2 text-xs font-bold"><Sparkles size={14} className="text-[#9e5f72]" /> Tu configuracion</span><span className="font-display text-2xl font-semibold">{formatPrice(unitPrice)}</span></div>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <div className="flex items-center justify-between rounded-full border border-[#d8c9cd] px-2 sm:w-32">
          <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="p-3" aria-label="Reducir cantidad"><Minus size={14} /></button>
          <span className="text-sm font-bold">{quantity}</span>
          <button onClick={() => setQuantity((value) => value + 1)} className="p-3" aria-label="Aumentar cantidad"><Plus size={14} /></button>
        </div>
        <div className="flex-1"><AddToCart product={cartProduct} color={selectionLabel} quantity={quantity} /></div>
      </div>
    </div>
  );
}
