"use client";

import Image from "next/image";
import Link from "next/link";
import { BarChart3, Bell, Box, ChevronRight, CircleDollarSign, ClipboardList, ExternalLink, LayoutDashboard, Menu, MessageCircleMore, Package, Percent, Plus, Search, Settings, ShoppingBag, TrendingUp, Users, X } from "lucide-react";
import { useState } from "react";
import { formatPrice, products } from "@/lib/data";
import { cn } from "@/lib/utils";

type Tab = "resumen" | "productos" | "promociones" | "pedidos" | "cotizaciones" | "clientes" | "configuracion";

const nav: Array<{ id: Tab; label: string; icon: typeof Box }> = [
  { id: "resumen", label: "Resumen", icon: LayoutDashboard },
  { id: "productos", label: "Productos", icon: Box },
  { id: "promociones", label: "Promociones", icon: Percent },
  { id: "pedidos", label: "Pedidos", icon: ShoppingBag },
  { id: "cotizaciones", label: "Cotizaciones", icon: MessageCircleMore },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "configuracion", label: "Configuracion", icon: Settings },
];

const orders = [
  { id: "CR-00245", customer: "Maria J.", total: 38.5, status: "Nuevo", date: "Hoy, 10:24" },
  { id: "CR-00244", customer: "Andrea P.", total: 61, status: "Produccion", date: "Hoy, 08:12" },
  { id: "CR-00243", customer: "Sofia R.", total: 24, status: "Enviado", date: "Ayer, 16:40" },
  { id: "CR-00242", customer: "Daniela C.", total: 47.9, status: "Entregado", date: "18 ago" },
];

export function DashboardView() {
  const [tab, setTab] = useState<Tab>("resumen");
  const [mobileNav, setMobileNav] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const currentLabel = nav.find((item) => item.id === tab)?.label;

  function changeTab(next: Tab) { setTab(next); setMobileNav(false); }

  return (
    <main className="page-shell my-6 overflow-hidden rounded-[28px] border border-[#e5d8dc] bg-[#f7f3f3] soft-shadow">
      <div className="grid min-h-[820px] lg:grid-cols-[235px_1fr]">
        <aside className={cn("fixed inset-y-0 left-0 z-50 w-[280px] bg-[#35282d] p-5 text-white transition lg:static lg:w-auto lg:translate-x-0", mobileNav ? "translate-x-0" : "-translate-x-full")}>
          <div className="flex items-center justify-between border-b border-white/10 pb-5"><div><p className="font-display text-xl font-bold">C&R Estudio</p><p className="mt-1 text-[9px] uppercase tracking-widest text-white/45">Panel de tienda</p></div><button onClick={() => setMobileNav(false)} className="p-2 lg:hidden" aria-label="Cerrar navegacion"><X size={18} /></button></div>
          <nav className="mt-7 space-y-1">{nav.map((item) => <button key={item.id} onClick={() => changeTab(item.id)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-semibold transition", tab === item.id ? "bg-[#c98698] text-white" : "text-white/60 hover:bg-white/5 hover:text-white")}><item.icon size={16} />{item.label}{item.id === "pedidos" && <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[9px]">4</span>}</button>)}</nav>
          <div className="mt-8 rounded-2xl bg-white/5 p-4"><p className="text-[10px] font-bold">Modo demostracion</p><p className="mt-2 text-[9px] leading-4 text-white/40">Los cambios son visuales. Firebase se conectara al pasar a produccion.</p></div>
          <Link href="/" className="absolute bottom-6 left-5 right-5 flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-[10px] font-bold text-white/70">Ver tienda <ExternalLink size={13} /></Link>
        </aside>
        <section className="min-w-0">
          <header className="flex h-[72px] items-center justify-between border-b border-[#e5d8dc] bg-[#fffdfb] px-5 sm:px-8"><div className="flex items-center gap-3"><button onClick={() => setMobileNav(true)} className="rounded-lg p-2 lg:hidden" aria-label="Abrir navegacion"><Menu size={19} /></button><div><p className="text-[9px] text-[#786970]">Administracion</p><h1 className="text-sm font-extrabold">{currentLabel}</h1></div></div><div className="flex items-center gap-2"><label className="relative hidden sm:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e5f72]" size={14} /><input placeholder="Buscar" className="w-44 rounded-full border border-[#e5d8dc] py-2 pl-9 pr-3 text-[11px]" /></label><button className="relative grid size-9 place-items-center rounded-full border border-[#e5d8dc]" aria-label="Notificaciones"><Bell size={15} /><span className="absolute right-1 top-1 size-1.5 rounded-full bg-[#c98698]" /></button><span className="grid size-9 place-items-center rounded-full bg-[#ead7dc] text-[10px] font-bold text-[#9e5f72]">CR</span></div></header>
          <div className="p-5 sm:p-8">
            {tab === "resumen" && <Overview onOpenProducts={() => changeTab("productos")} />}
            {tab === "productos" && <ProductsPanel onCreate={() => setShowProductForm(true)} />}
            {tab === "promociones" && <PromotionsPanel />}
            {tab === "pedidos" && <OrdersPanel />}
            {tab === "cotizaciones" && <QuotesPanel />}
            {tab === "clientes" && <CustomersPanel />}
            {tab === "configuracion" && <SettingsPanel />}
          </div>
        </section>
      </div>
      {showProductForm && <ProductModal onClose={() => setShowProductForm(false)} />}
    </main>
  );
}

function Overview({ onOpenProducts }: { onOpenProducts: () => void }) {
  const stats = [
    { label: "Ventas del mes", value: "$1.248", note: "+12,4%", icon: CircleDollarSign, color: "bg-[#ead7dc] text-[#9e5f72]" },
    { label: "Pedidos activos", value: "18", note: "4 nuevos", icon: Package, color: "bg-[#e4ebe0] text-[#567050]" },
    { label: "Cotizaciones", value: "7", note: "3 por revisar", icon: ClipboardList, color: "bg-[#eee6d8] text-[#886e42]" },
    { label: "Conversion", value: "3,8%", note: "+0,6%", icon: TrendingUp, color: "bg-[#e6e1ee] text-[#665687]" },
  ];
  return <><div className="flex items-end justify-between"><div><p className="text-xs text-[#786970]">Jueves, 20 de agosto</p><h2 className="mt-1 font-display text-4xl font-semibold">Buenos dias, Carolina</h2></div><button onClick={onOpenProducts} className="hidden items-center gap-2 rounded-full bg-[#35282d] px-5 py-3 text-xs font-bold text-white sm:flex"><Plus size={14} /> Nuevo producto</button></div><div className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">{stats.map((stat) => <div key={stat.label} className="rounded-2xl bg-[#fffdfb] p-4 sm:p-5"><span className={cn("grid size-9 place-items-center rounded-xl", stat.color)}><stat.icon size={16} /></span><p className="mt-5 text-[10px] text-[#786970]">{stat.label}</p><div className="mt-1 flex items-end justify-between"><span className="font-display text-3xl font-semibold">{stat.value}</span><span className="text-[9px] font-bold text-[#6a865f]">{stat.note}</span></div></div>)}</div><div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]"><div className="rounded-2xl bg-[#fffdfb] p-5"><div className="flex items-center justify-between"><div><p className="text-xs font-bold">Ventas</p><p className="mt-1 text-[9px] text-[#786970]">Ultimos 7 dias</p></div><BarChart3 size={17} className="text-[#9e5f72]" /></div><div className="mt-8 flex h-44 items-end gap-3">{[42, 68, 48, 82, 63, 92, 74].map((height, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-lg bg-[#d9abb7] transition hover:bg-[#9e5f72]" style={{ height: `${height}%` }} /><span className="text-[8px] text-[#91848a]">{["L", "M", "M", "J", "V", "S", "D"][index]}</span></div>)}</div></div><div className="rounded-2xl bg-[#fffdfb] p-5"><p className="text-xs font-bold">Actividad reciente</p><div className="mt-5 space-y-5">{orders.slice(0, 3).map((order) => <div key={order.id} className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[#f3e7e9] text-[#9e5f72]"><ShoppingBag size={14} /></span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-bold">Pedido {order.id}</p><p className="mt-1 text-[9px] text-[#786970]">{order.customer} · {order.date}</p></div><span className="text-[10px] font-bold">{formatPrice(order.total)}</span></div>)}</div></div></div></>;
}

function ProductsPanel({ onCreate }: { onCreate: () => void }) { return <><PanelHeading title="Productos" subtitle={`${products.length} productos en el catalogo`} action="Nuevo producto" onAction={onCreate} /><div className="mt-6 overflow-hidden rounded-2xl bg-[#fffdfb]"><div className="hidden grid-cols-[2fr_1fr_.8fr_.8fr_auto] gap-4 border-b border-[#e5d8dc] px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-[#91848a] md:grid"><span>Producto</span><span>Categoria</span><span>Precio</span><span>Stock</span><span>Estado</span></div>{products.map((product) => <div key={product.id} className="grid grid-cols-[48px_1fr_auto] items-center gap-3 border-b border-[#eee5e7] px-4 py-4 last:border-0 md:grid-cols-[52px_2fr_1fr_.8fr_.8fr_auto]"><div className="relative aspect-square overflow-hidden rounded-xl"><Image src={product.image} alt={product.name} fill sizes="52px" className="object-cover" /></div><div><p className="text-xs font-bold">{product.name}</p><p className="mt-1 text-[9px] text-[#91848a]">{product.slug}</p></div><span className="hidden text-[10px] capitalize text-[#786970] md:block">{product.category}</span><span className="hidden text-[11px] font-bold md:block">{formatPrice(product.price)}</span><span className="hidden text-[10px] md:block">{product.stock} uds.</span><span className="rounded-full bg-[#e7eee3] px-3 py-1.5 text-[9px] font-bold text-[#52704b]">Activo</span></div>)}</div></>; }

function PromotionsPanel() { const promos = [{ title: "Bienvenida C&R", code: "HOLA10", value: "10%", status: "Activa", use: "24 usos" }, { title: "Florero de la semana", code: "PLIEGUE15", value: "15%", status: "Activa", use: "8 usos" }, { title: "Envio septiembre", code: "ENVIOCR", value: "$3,50", status: "Programada", use: "Inicia 01 sep" }]; return <><PanelHeading title="Promociones" subtitle="Crea incentivos sin perder el control" action="Nueva promocion" /><div className="mt-6 grid gap-4 md:grid-cols-3">{promos.map((promo, index) => <div key={promo.code} className="rounded-2xl bg-[#fffdfb] p-5"><div className="flex justify-between"><span className={cn("rounded-full px-3 py-1 text-[9px] font-bold", index === 2 ? "bg-[#eee6d8] text-[#886e42]" : "bg-[#e7eee3] text-[#52704b]")}>{promo.status}</span><Percent size={16} className="text-[#9e5f72]" /></div><p className="mt-8 font-display text-2xl font-semibold">{promo.title}</p><p className="mt-1 text-[10px] text-[#786970]">Codigo: {promo.code}</p><div className="mt-6 flex items-end justify-between border-t border-[#eee5e7] pt-4"><span className="font-display text-3xl font-bold">{promo.value}</span><span className="text-[9px] text-[#786970]">{promo.use}</span></div></div>)}</div></>; }

function OrdersPanel() { return <><PanelHeading title="Pedidos" subtitle="Gestiona produccion, cobros y entregas" /><div className="mt-6 overflow-hidden rounded-2xl bg-[#fffdfb]">{orders.map((order) => <div key={order.id} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#eee5e7] p-5 last:border-0 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]"><div><p className="text-xs font-bold">{order.id}</p><p className="mt-1 text-[9px] text-[#786970]">{order.date}</p></div><span className="hidden text-[10px] sm:block">{order.customer}</span><span className="hidden text-[10px] font-bold sm:block">{formatPrice(order.total)}</span><span className="hidden sm:block"><Status value={order.status} /></span><button className="flex items-center gap-1 text-[9px] font-bold text-[#9e5f72]">Detalle <ChevronRight size={12} /></button></div>)}</div></>; }

function QuotesPanel() { const quotes = [{ name: "Paula M.", idea: "Letrero para cafeteria", time: "Hace 12 min", status: "Nueva" }, { name: "Johana V.", idea: "Organizador para maquillaje", time: "Ayer", status: "Cotizada" }, { name: "Camila S.", idea: "Recuerdo para bautizo x30", time: "18 ago", status: "En revision" }]; return <><PanelHeading title="Cotizaciones" subtitle="Seguimiento de conversaciones por WhatsApp" /><div className="mt-5 rounded-2xl bg-[#eee6d8] p-4 text-[10px] leading-5 text-[#725f42]">Las imagenes se reciben directamente en WhatsApp y no se almacenan en Firebase. Este listado guardara solo datos de seguimiento cuando se conecte la base.</div><div className="mt-4 grid gap-3">{quotes.map((quote) => <div key={quote.name} className="flex items-center gap-4 rounded-2xl bg-[#fffdfb] p-5"><span className="grid size-11 place-items-center rounded-full bg-[#f3e7e9] text-[#9e5f72]"><MessageCircleMore size={17} /></span><div className="min-w-0 flex-1"><p className="text-xs font-bold">{quote.name}</p><p className="mt-1 truncate text-[10px] text-[#786970]">{quote.idea} · {quote.time}</p></div><Status value={quote.status} /><button className="hidden rounded-full border border-[#d8c9cd] px-4 py-2 text-[9px] font-bold sm:block">Abrir WhatsApp</button></div>)}</div></>; }

function CustomersPanel() { return <><PanelHeading title="Clientes" subtitle="Historial basico de compradores" /><div className="mt-6 rounded-2xl bg-[#fffdfb] p-5"><div className="grid gap-3 sm:grid-cols-3">{[{ label: "Clientes totales", value: "184" }, { label: "Nuevos este mes", value: "23" }, { label: "Clientes recurrentes", value: "31%" }].map((item) => <div key={item.label} className="rounded-xl bg-[#faf6f6] p-5"><p className="text-[9px] text-[#786970]">{item.label}</p><p className="mt-2 font-display text-3xl font-semibold">{item.value}</p></div>)}</div></div></>; }

function SettingsPanel() { return <><PanelHeading title="Configuracion" subtitle="Conexiones y datos de la tienda" /><div className="mt-6 grid gap-4 md:grid-cols-2">{[{ title: "WhatsApp", text: "Click to Chat activo. Cambia el numero en NEXT_PUBLIC_WHATSAPP_NUMBER.", active: true }, { title: "Firebase", text: "Google Auth, Firestore y Storage pendientes de credenciales.", active: false }, { title: "DEUNA", text: "Payment Link preparado para la futura cuenta comercial.", active: false }, { title: "Vercel", text: "Listo para desplegar desde el repositorio de GitHub.", active: true }].map((item) => <div key={item.title} className="rounded-2xl bg-[#fffdfb] p-6"><div className="flex items-center justify-between"><h3 className="font-display text-2xl font-semibold">{item.title}</h3><span className={cn("size-2.5 rounded-full", item.active ? "bg-[#6f9265]" : "bg-[#c5b8bc]")} /></div><p className="mt-3 text-[10px] leading-5 text-[#786970]">{item.text}</p><button className="mt-5 text-[9px] font-bold text-[#9e5f72]">Configurar</button></div>)}</div></>; }

function PanelHeading({ title, subtitle, action, onAction }: { title: string; subtitle: string; action?: string; onAction?: () => void }) { return <div className="flex items-center justify-between gap-4"><div><h2 className="font-display text-4xl font-semibold">{title}</h2><p className="mt-1 text-[10px] text-[#786970]">{subtitle}</p></div>{action && <button onClick={onAction} className="flex items-center gap-2 rounded-full bg-[#35282d] px-4 py-2.5 text-[10px] font-bold text-white"><Plus size={13} /> {action}</button>}</div>; }
function Status({ value }: { value: string }) { return <span className="shrink-0 rounded-full bg-[#f3e7e9] px-3 py-1.5 text-[9px] font-bold text-[#9e5f72]">{value}</span>; }

function ProductModal({ onClose }: { onClose: () => void }) { return <div className="fixed inset-0 z-[60] grid place-items-center bg-[#35282d]/35 p-4 backdrop-blur-sm" onClick={onClose}><div className="w-full max-w-lg rounded-[26px] bg-[#fffdfb] p-6 sm:p-8" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><div><p className="eyebrow">Catalogo</p><h2 className="mt-1 font-display text-3xl font-semibold">Nuevo producto</h2></div><button onClick={onClose} className="rounded-full border border-[#e5d8dc] p-2" aria-label="Cerrar"><X size={16} /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><input className="rounded-xl border border-[#e5d8dc] px-4 py-3 text-xs sm:col-span-2" placeholder="Nombre del producto" /><select className="rounded-xl border border-[#e5d8dc] px-4 py-3 text-xs"><option>Macetas</option><option>Hogar</option><option>Organizadores</option><option>Figuritas</option></select><input className="rounded-xl border border-[#e5d8dc] px-4 py-3 text-xs" placeholder="Precio" type="number" /><textarea className="rounded-xl border border-[#e5d8dc] px-4 py-3 text-xs sm:col-span-2" rows={4} placeholder="Descripcion" /><label className="rounded-xl border border-dashed border-[#c9adb5] bg-[#faf6f6] px-4 py-7 text-center text-[10px] font-bold text-[#9e5f72] sm:col-span-2">Seleccionar fotografias<input type="file" accept="image/*" multiple className="sr-only" /></label></div><div className="mt-6 flex justify-end gap-2"><button onClick={onClose} className="rounded-full border border-[#d8c9cd] px-5 py-2.5 text-[10px] font-bold">Cancelar</button><button onClick={() => { window.alert("Producto guardado en modo demostracion"); onClose(); }} className="rounded-full bg-[#35282d] px-5 py-2.5 text-[10px] font-bold text-white">Guardar producto</button></div></div></div>; }
