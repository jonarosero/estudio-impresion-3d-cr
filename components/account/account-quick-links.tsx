"use client";

import Link from "next/link";
import { Heart, Package, Settings, ShoppingBag } from "lucide-react";
import { useAccountStore } from "@/stores/account-store";
import { useCartStore } from "@/stores/cart-store";
import { useFavoriteStore } from "@/stores/favorite-store";

export function AccountQuickLinks() {
  const account = useAccountStore((state) => state.account);
  const lines = useCartStore((state) => state.lines);
  const favorites = useFavoriteStore((state) => state.productIds);
  if (!account) return null;
  const items = lines.reduce((total, line) => total + line.quantity, 0);
  const links = [
    { href: "/cuenta/pedidos", icon: Package, title: "Pedidos", value: "Ver historial" },
    { href: "/cuenta/favoritos", icon: Heart, title: "Favoritos", value: favorites.length ? `${favorites.length} guardados` : "Sin favoritos" },
    { href: "/carrito", icon: ShoppingBag, title: "Carrito", value: items ? `${items} producto${items === 1 ? "" : "s"}` : "Vacío" },
    { href: "/cuenta", icon: Settings, title: "Perfil", value: "Editar datos" },
  ];
  return <nav aria-label="Accesos de cuenta" className="page-shell mt-7 grid gap-4 md:grid-cols-4">{links.map((item) => <Link key={item.title} href={item.href} className="rounded-3xl bg-[#fffdfb] p-6 transition hover:bg-[#f3e7e9]"><item.icon size={20} className="text-[#9e5f72]" /><p className="mt-7 text-xs font-bold">{item.title}</p><p className="mt-1 font-display text-2xl font-semibold">{item.value}</p></Link>)}</nav>;
}
