"use client";

import Link from "next/link";
import { House, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { useAccountStore } from "@/stores/account-store";
import { useCartStore } from "@/stores/cart-store";

const links = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/catalogo?categoria=macetas", label: "Macetas" },
  { href: "/catalogo?categoria=hogar", label: "Hogar" },
  { href: "/catalogo?categoria=organizadores", label: "Organizadores" },
  { href: "/catalogo?categoria=figuritas", label: "Figuritas" },
  { href: "/personalizados", label: "Personalizados" },
  { href: "/#proceso", label: "Cómo lo hacemos" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const params = useSearchParams();
  const lines = useCartStore((state) => state.lines);
  const openCart = useCartStore((state) => state.open);
  const account = useAccountStore((state) => state.account);
  const signOut = useAccountStore((state) => state.signOut);
  const count = lines.reduce((total, line) => total + line.quantity, 0);
  const isActive = (href: string) => {
    const [path, query] = href.split("?");
    if (pathname !== path) return false;
    if (!query) return !params.get("categoria");
    return params.get("categoria") === new URLSearchParams(query).get("categoria");
  };

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!accountMenuRef.current?.contains(event.target as Node)) setAccountOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return <><header className="sticky top-0 z-40 border-b border-[#e5d8dc]/80 bg-[#fffdfb]/90 backdrop-blur-xl"><div className="page-shell grid h-[76px] grid-cols-[1fr_auto_1fr] items-center"><button className="focus-ring justify-self-start rounded-lg p-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu size={21} /></button><nav className="hidden items-center gap-2 justify-self-start lg:flex" aria-label="Categorias"><Link href="/" className={`focus-ring grid size-8 place-items-center rounded-full hover:bg-[#f3e7e9] ${pathname === "/" ? "bg-[#f3e7e9] text-[#9e5f72]" : "text-[#9e5f72]"}`} aria-label="Inicio"><House size={15} /></Link>{links.slice(0, 5).map((link) => <Link key={link.href} href={link.href} className={`focus-ring whitespace-nowrap rounded px-1.5 py-1 text-[11px] font-semibold hover:text-[#9e5f72] ${isActive(link.href) ? "bg-[#f3e7e9] text-[#9e5f72]" : ""}`}>{link.label}</Link>)}</nav><div className="justify-self-center px-3"><Logo /></div><div className="flex items-center justify-self-end gap-6"><nav className="hidden items-center gap-5 xl:flex" aria-label="Navegacion secundaria">{links.slice(5).map((link) => <Link key={link.href} href={link.href} className={`focus-ring whitespace-nowrap rounded px-1.5 py-1 text-[11px] font-semibold hover:text-[#9e5f72] ${isActive(link.href) ? "bg-[#f3e7e9] text-[#9e5f72]" : ""}`}>{link.label}</Link>)}</nav><div className="flex items-center gap-1"><Link href="/catalogo" className="focus-ring hidden rounded-full p-2.5 hover:bg-[#f3e7e9] sm:block" aria-label="Buscar"><Search size={19} /></Link>{account ? <div ref={accountMenuRef} className="relative hidden sm:block"><button onClick={() => setAccountOpen((open) => !open)} className="focus-ring inline-flex items-center gap-2 rounded-full px-2.5 py-2 hover:bg-[#f3e7e9]" aria-expanded={accountOpen}><UserRound size={19} /><span className="text-[10px] font-bold">{account.role === "admin" ? "Administración" : "Mi cuenta"}</span></button>{accountOpen && <AccountMenu isAdmin={account.role === "admin"} onClose={() => setAccountOpen(false)} onSignOut={() => { signOut(); setAccountOpen(false); }} />}</div> : <Link href="/login" className="focus-ring hidden items-center gap-2 rounded-full px-2.5 py-2 hover:bg-[#f3e7e9] sm:inline-flex"><UserRound size={19} /><span className="text-[10px] font-bold">Ingresa</span></Link>}<button onClick={openCart} className="focus-ring relative rounded-full p-2.5 hover:bg-[#f3e7e9]" aria-label={`Carrito con ${count} productos`}><ShoppingBag size={19} />{count > 0 && <span className="absolute right-0 top-0 grid size-[18px] place-items-center rounded-full bg-[#9e5f72] text-[9px] font-bold text-white">{count}</span>}</button></div></div></div></header>{mobileOpen && <div className="fixed inset-0 z-50 bg-[#35282d]/25 backdrop-blur-sm" onClick={() => setMobileOpen(false)}><div className="h-full w-[86%] max-w-sm bg-[#fffdfb] p-6" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><Logo /><button onClick={() => setMobileOpen(false)} className="rounded-full p-2" aria-label="Cerrar menu"><X size={20} /></button></div><nav className="mt-12 flex flex-col" aria-label="Menu movil">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`border-b border-[#e5d8dc] py-5 font-display text-2xl font-semibold ${isActive(link.href) ? "text-[#9e5f72]" : ""}`}>{link.label}</Link>)}<Link href={account ? "/cuenta" : "/login"} onClick={() => setMobileOpen(false)} className="mt-8 rounded-full bg-[#35282d] px-5 py-3 text-center text-sm font-bold text-white">{account ? "Mi cuenta" : "Ingresa"}</Link></nav></div></div>}</>;
}

function AccountMenu({ isAdmin, onClose, onSignOut }: { isAdmin: boolean; onClose: () => void; onSignOut: () => void }) {
  const customerLinks = [{ href: "/cuenta", label: "Perfil" }, { href: "/cuenta/pedidos", label: "Pedidos" }, { href: "/notificaciones", label: "Notificaciones" }, { href: "/cuenta/favoritos", label: "Favoritos" }, { href: "/cuenta/cotizaciones", label: "Chat de personalizados" }];
  return <div className="absolute right-0 top-12 w-56 rounded-2xl border border-[#e5d8dc] bg-[#fffdfb] p-2 shadow-xl">{customerLinks.map((item) => <Link key={item.href} href={item.href} onClick={onClose} className="block rounded-xl px-3 py-2.5 text-xs font-bold hover:bg-[#f3e7e9]">{item.label}</Link>)}{isAdmin && <Link href="/dashboard" onClick={onClose} className="mt-1 block rounded-xl bg-[#35282d] px-3 py-2.5 text-xs font-bold text-white">Administración</Link>}<button onClick={() => { onClose(); onSignOut(); }} className="mt-1 w-full rounded-xl border-t border-[#e5d8dc] px-3 py-2.5 text-left text-xs font-bold text-[#9e5f72]">Cerrar sesión</button></div>;
}
