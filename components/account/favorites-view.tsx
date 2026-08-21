"use client";

import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { useAccountStore } from "@/stores/account-store";
import { useFavoriteStore } from "@/stores/favorite-store";
import { useProductStore } from "@/stores/product-store";

export function FavoritesView() {
  const account = useAccountStore((state) => state.account);
  const productIds = useFavoriteStore((state) => state.productIds);
  const products = useProductStore((state) => state.products).filter((product) => productIds.includes(product.id));
  if (!account) return <main className="page-shell py-20 text-center"><h1 className="font-display text-4xl font-semibold">Inicia sesión para ver tus favoritos</h1><Link href="/login?redirect=/cuenta/favoritos" className="mt-6 inline-block rounded-full bg-[#35282d] px-6 py-3 text-xs font-bold text-white">Continuar con Google</Link></main>;
  return <main className="page-shell py-12 sm:py-16"><p className="eyebrow">Tu selección</p><h1 className="mt-3 font-display text-5xl font-semibold">Favoritos</h1>{products.length ? <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:grid-cols-4"><>{products.map((product) => <ProductCard key={product.id} product={product} />)}</></div> : <div className="mt-8 rounded-3xl bg-[#fffdfb] p-8"><p className="text-sm text-[#786970]">Aún no guardaste productos.</p><Link href="/catalogo" className="mt-4 inline-block text-sm font-bold text-[#9e5f72]">Explorar catálogo</Link></div>}</main>;
}
