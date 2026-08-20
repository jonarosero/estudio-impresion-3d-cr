"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { AddToCart } from "@/components/add-to-cart";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductPurchase({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const colorMap: Record<string, string> = {
    "Rosa nube": "#e6bdc8", Marfil: "#eee9dd", Salvia: "#aeb9a4", "Rosa arcilla": "#c98698", Arena: "#d7c4ac", Ciruela: "#6c4453", Lavanda: "#b9acd0", Blanco: "#f8f7f2", Caramelo: "#bc8a63", Terracota: "#b66c52", Negro: "#35282d", Miel: "#d6a568",
  };

  return (
    <div className="mt-8 border-t border-[#e5d8dc] pt-7">
      <div className="flex items-center justify-between"><span className="text-xs font-extrabold uppercase tracking-wider">Color</span><span className="text-xs text-[#786970]">{color}</span></div>
      <div className="mt-3 flex flex-wrap gap-3">
        {product.colors.map((item) => (
          <button key={item} onClick={() => setColor(item)} className={cn("size-9 rounded-full border-4 border-[#fffdfb] shadow-[0_0_0_1px_#d8c9cd] transition", color === item && "shadow-[0_0_0_2px_#35282d]")} style={{ background: colorMap[item] ?? "#e6bdc8" }} aria-label={`Elegir color ${item}`} />
        ))}
      </div>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <div className="flex items-center justify-between rounded-full border border-[#d8c9cd] px-2 sm:w-32">
          <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="p-3" aria-label="Reducir cantidad"><Minus size={14} /></button>
          <span className="text-sm font-bold">{quantity}</span>
          <button onClick={() => setQuantity((value) => value + 1)} className="p-3" aria-label="Aumentar cantidad"><Plus size={14} /></button>
        </div>
        <div className="flex-1"><AddToCart product={product} color={color} quantity={quantity} /></div>
      </div>
    </div>
  );
}
