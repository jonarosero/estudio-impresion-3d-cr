"use client";

import { Heart } from "lucide-react";
import { useAccountStore } from "@/stores/account-store";
import { useFavoriteStore } from "@/stores/favorite-store";

export function FavoriteButton({ productId, productName }: { productId: string; productName: string }) {
  const account = useAccountStore((state) => state.account);
  const productIds = useFavoriteStore((state) => state.productIds);
  const toggle = useFavoriteStore((state) => state.toggle);
  const active = productIds.includes(productId);
  return <button className="focus-ring absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full bg-[#fffdfb]/90 backdrop-blur" aria-label={active ? `Quitar ${productName} de favoritos` : `Guardar ${productName} en favoritos`} onClick={() => { if (account) toggle(productId); }} title={account ? undefined : "Inicia sesión para guardar favoritos"}><Heart size={15} fill={active ? "currentColor" : "none"} className={active ? "text-[#9e5f72]" : undefined} /></button>;
}
