"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

export function AddToCart({
  product,
  color,
  quantity = 1,
  compact = false,
}: {
  product: Product;
  color?: string;
  quantity?: number;
  compact?: boolean;
}) {
  const [added, setAdded] = useState(false);
  const add = useCartStore((state) => state.add);

  function handleAdd() {
    add(product, color, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      onClick={handleAdd}
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-[#35282d] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#9e5f72]",
        compact ? "size-11" : "px-6 py-3.5 text-sm",
      )}
      aria-label={compact ? `Agregar ${product.name} al carrito` : undefined}
    >
      {added ? <Check size={17} /> : <ShoppingBag size={17} />}
      {!compact && (added ? "Agregado" : "Agregar al carrito")}
    </button>
  );
}
