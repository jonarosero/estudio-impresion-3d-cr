"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { useCartStore } from "@/stores/cart-store";

const links = [
  { href: "/catalogo?categoria=macetas", label: "Macetas" },
  { href: "/catalogo?categoria=hogar", label: "Hogar" },
  { href: "/catalogo?categoria=organizadores", label: "Organizadores" },
  { href: "/catalogo?categoria=figuritas", label: "Figuritas" },
  { href: "/personalizados", label: "Personalizados" },
  { href: "/#proceso", label: "Como lo hacemos" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const lines = useCartStore((state) => state.lines);
  const openCart = useCartStore((state) => state.open);
  const count = lines.reduce((total, line) => total + line.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#e5d8dc]/80 bg-[#fffdfb]/90 backdrop-blur-xl">
        <div className="page-shell grid h-[76px] grid-cols-[1fr_auto_1fr] items-center">
          <button
            className="focus-ring justify-self-start rounded-lg p-2 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={21} />
          </button>
          <nav className="hidden items-center gap-4 justify-self-start lg:flex" aria-label="Categorias">
            {links.slice(0, 4).map((link) => (
              <Link key={link.href} href={link.href} className="focus-ring whitespace-nowrap rounded text-[11px] font-semibold hover:text-[#9e5f72]">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="justify-self-center px-3">
            <Logo />
          </div>
          <div className="flex items-center justify-self-end gap-6">
            <nav className="hidden items-center gap-5 xl:flex" aria-label="Navegacion secundaria">
              {links.slice(4).map((link) => (
                <Link key={link.href} href={link.href} className="focus-ring whitespace-nowrap rounded text-[11px] font-semibold hover:text-[#9e5f72]">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-1">
              <Link href="/catalogo" className="focus-ring hidden rounded-full p-2.5 hover:bg-[#f3e7e9] sm:block" aria-label="Buscar">
                <Search size={19} />
              </Link>
              <Link href="/login" className="focus-ring hidden rounded-full p-2.5 hover:bg-[#f3e7e9] sm:block" aria-label="Mi cuenta">
                <UserRound size={19} />
              </Link>
              <button onClick={openCart} className="focus-ring relative rounded-full p-2.5 hover:bg-[#f3e7e9]" aria-label={`Carrito con ${count} productos`}>
                <ShoppingBag size={19} />
                {count > 0 && (
                  <span className="absolute right-0 top-0 grid size-[18px] place-items-center rounded-full bg-[#9e5f72] text-[9px] font-bold text-white">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#35282d]/25 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div className="h-full w-[86%] max-w-sm bg-[#fffdfb] p-6" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={() => setMobileOpen(false)} className="rounded-full p-2" aria-label="Cerrar menu">
                <X size={20} />
              </button>
            </div>
            <nav className="mt-12 flex flex-col" aria-label="Menu movil">
              {links.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="border-b border-[#e5d8dc] py-5 font-display text-2xl font-semibold">
                  {link.label}
                </Link>
              ))}
              <Link href="/login" onClick={() => setMobileOpen(false)} className="mt-8 rounded-full bg-[#35282d] px-5 py-3 text-center text-sm font-bold text-white">
                Mi cuenta
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
