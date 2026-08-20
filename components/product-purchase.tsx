"use client";

import { Minus, Paintbrush, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { AddToCart } from "@/components/add-to-cart";
import { formatPrice } from "@/lib/data";
import type { Product, ProductFinish } from "@/lib/types";
import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  "Rosa nube": "#e6bdc8", Marfil: "#eee9dd", Salvia: "#aeb9a4", "Rosa arcilla": "#c98698", Arena: "#d7c4ac", Ciruela: "#6c4453", Lavanda: "#b9acd0", Blanco: "#f8f7f2", Caramelo: "#bc8a63", Terracota: "#b66c52", Negro: "#35282d", Miel: "#d6a568",
};

const finishDetails: Record<ProductFinish, { title: string; description: string; adjustment: number }> = {
  standard: { title: "Impresion estandar", description: "Color aplicado directamente durante la impresion.", adjustment: 0 },
  "hand-painted": { title: "Pintado a mano", description: "Terminamos los detalles a mano en el estudio.", adjustment: 4.5 },
  "ready-to-paint": { title: "Diviertete pintandolo", description: "Base sin acabado para que la personalices en casa.", adjustment: -2 },
};

export function ProductPurchase({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]);
  const finishes: ProductFinish[] = product.availableFinishes?.length ? product.availableFinishes : ["standard"];
  const [finish, setFinish] = useState<ProductFinish>(finishes[0]);
  const [quantity, setQuantity] = useState(1);
  const hasFinishChoice = finishes.some((item) => item !== "standard");
  const finishInfo = finishDetails[finish];
  const unitPrice = product.price + finishInfo.adjustment;
  const selectionLabel = `${color} · ${finishInfo.title}`;
  const cartProduct = { ...product, price: unitPrice };

  return (
    <div className="mt-8 border-t border-[#e5d8dc] pt-7">
      <div className="flex items-center justify-between"><span className="text-xs font-extrabold uppercase tracking-wider">Color{product.colorPresentation === "multicolor" ? " de la pieza" : " base"}</span><span className="text-xs text-[#786970]">{color}</span></div>
      <div className="mt-3 flex flex-wrap gap-3">
        {product.colors.map((item) => (
          <button key={item} onClick={() => setColor(item)} className={cn("size-9 rounded-full border-4 border-[#fffdfb] shadow-[0_0_0_1px_#d8c9cd] transition", color === item && "shadow-[0_0_0_2px_#35282d]")} style={{ background: colorMap[item] ?? "#e6bdc8" }} aria-label={`Elegir color ${item}`} />
        ))}
      </div>
      {product.colorPresentation === "multicolor" && <p className="mt-3 text-[10px] leading-5 text-[#786970]">Esta pieza fue diseñada por el estudio con varias tonalidades. Elige el color predominante disponible.</p>}
      {hasFinishChoice && <div className="mt-7 border-t border-[#e5d8dc] pt-6"><div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider"><Paintbrush size={14} className="text-[#9e5f72]" /> Acabado disponible</div><div className="mt-3 grid gap-2">{finishes.map((item) => { const option = finishDetails[item]; return <button key={item} onClick={() => setFinish(item)} className={cn("flex items-center justify-between rounded-2xl border px-4 py-3 text-left", finish === item ? "border-[#35282d] bg-[#f3e7e9]" : "border-[#e5d8dc]")}><span><span className="block text-xs font-bold">{option.title}</span><span className="mt-1 block text-[10px] text-[#786970]">{option.description}</span></span><span className={cn("text-[10px] font-bold", option.adjustment < 0 && "text-[#52704b]")}>{option.adjustment === 0 ? "Incluido" : `${option.adjustment > 0 ? "+" : "-"}${formatPrice(Math.abs(option.adjustment))}`}</span></button>; })}</div></div>}
      <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#f3e7e9] p-4"><span className="flex items-center gap-2 text-xs font-bold"><Sparkles size={14} className="text-[#9e5f72]" /> {hasFinishChoice ? "Tu configuracion" : "Precio de la pieza"}</span><span className="font-display text-2xl font-semibold">{formatPrice(unitPrice)}</span></div>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row"><div className="flex items-center justify-between rounded-full border border-[#d8c9cd] px-2 sm:w-32"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="p-3" aria-label="Reducir cantidad"><Minus size={14} /></button><span className="text-sm font-bold">{quantity}</span><button onClick={() => setQuantity((value) => value + 1)} className="p-3" aria-label="Aumentar cantidad"><Plus size={14} /></button></div><div className="flex-1"><AddToCart product={cartProduct} color={selectionLabel} quantity={quantity} /></div></div>
    </div>
  );
}
