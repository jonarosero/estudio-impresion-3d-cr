"use client";

import Image from "next/image";
import Link from "next/link";
import { BarChart3, Bell, Box, ChevronRight, CircleDollarSign, ClipboardList, ExternalLink, LayoutDashboard, Menu, MessageCircleMore, Package, Percent, Plus, Search, Settings, ShoppingBag, TrendingUp, Users, X } from "lucide-react";
import { useState } from "react";
import { DashboardProducts } from "@/components/dashboard-products";
import { formatPrice } from "@/lib/data";
import { cn } from "@/lib/utils";
import { usePromotionStore } from "@/stores/promotion-store";
import { useQuoteStore, type QuoteStatus } from "@/stores/quote-store";

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
  const currentLabel = nav.find((item) => item.id === tab)?.label;

  function changeTab(next: Tab) { setTab(next); setMobileNav(false); }

  return (
    <main className="h-dvh w-full overflow-hidden bg-[#f7f3f3]">
      <div className="grid h-full lg:grid-cols-[250px_1fr]">
        <aside className={cn("fixed inset-y-0 left-0 z-50 w-[280px] bg-[#35282d] p-5 text-white transition lg:static lg:w-auto lg:translate-x-0", mobileNav ? "translate-x-0" : "-translate-x-full")}>
          <div className="flex items-center justify-between border-b border-white/10 pb-5"><div><p className="font-display text-xl font-bold">C&R Estudio</p><p className="mt-1 text-[9px] uppercase tracking-widest text-white/45">Panel de tienda</p></div><button onClick={() => setMobileNav(false)} className="p-2 lg:hidden" aria-label="Cerrar navegacion"><X size={18} /></button></div>
          <nav className="mt-7 space-y-1">{nav.map((item) => <button key={item.id} onClick={() => changeTab(item.id)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-semibold transition", tab === item.id ? "bg-[#c98698] text-white" : "text-white/60 hover:bg-white/5 hover:text-white")}><item.icon size={16} />{item.label}{item.id === "pedidos" && <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[9px]">4</span>}</button>)}</nav>
          <div className="mt-8 rounded-2xl bg-white/5 p-4"><p className="text-[10px] font-bold">Modo demostracion</p><p className="mt-2 text-[9px] leading-4 text-white/40">Los cambios son visuales. Firebase se conectara al pasar a produccion.</p></div>
          <Link href="/" className="absolute bottom-6 left-5 right-5 flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-[10px] font-bold text-white/70">Ver tienda <ExternalLink size={13} /></Link>
        </aside>
        <section className="min-w-0 overflow-y-auto">
          <header className="flex h-[72px] items-center justify-between border-b border-[#e5d8dc] bg-[#fffdfb] px-5 sm:px-8"><div className="flex items-center gap-3"><button onClick={() => setMobileNav(true)} className="rounded-lg p-2 lg:hidden" aria-label="Abrir navegacion"><Menu size={19} /></button><div><p className="text-[9px] text-[#786970]">Administracion</p><h1 className="text-sm font-extrabold">{currentLabel}</h1></div></div><div className="flex items-center gap-2"><label className="relative hidden sm:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e5f72]" size={14} /><input placeholder="Buscar" className="w-44 rounded-full border border-[#e5d8dc] py-2 pl-9 pr-3 text-[11px]" /></label><button className="relative grid size-9 place-items-center rounded-full border border-[#e5d8dc]" aria-label="Notificaciones"><Bell size={15} /><span className="absolute right-1 top-1 size-1.5 rounded-full bg-[#c98698]" /></button><span className="grid size-9 place-items-center rounded-full bg-[#ead7dc] text-[10px] font-bold text-[#9e5f72]">CR</span></div></header>
          <div className="p-5 sm:p-8">
            {tab === "resumen" && <Overview onOpenProducts={() => changeTab("productos")} />}
            {tab === "productos" && <DashboardProducts />}
            {tab === "promociones" && <PromotionsPanel />}
            {tab === "pedidos" && <OrdersPanel />}
            {tab === "cotizaciones" && <QuotesPanel />}
            {tab === "clientes" && <CustomersPanel />}
            {tab === "configuracion" && <SettingsPanel />}
          </div>
        </section>
      </div>
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

function PromotionsPanel() {
  const promotions = usePromotionStore((state) => state.promotions);
  const toggle = usePromotionStore((state) => state.toggle);
  return <><PanelHeading title="Promociones" subtitle="Las promociones activas aparecen automaticamente en el banner principal" action="Nueva promocion" /><div className="mt-5 rounded-2xl bg-[#ead7dc] p-4 text-[10px] leading-5 text-[#72505b]">El banner de inicio utiliza esta misma lista. Al activar o pausar una campana, la portada se actualiza sin editar su diseño.</div><div className="mt-4 grid gap-4 md:grid-cols-3">{promotions.map((promo) => <div key={promo.id} className="overflow-hidden rounded-2xl bg-[#fffdfb]"><div className="relative h-28"><Image src={promo.image} alt={promo.title} fill sizes="320px" className="object-cover" /><span className={cn("absolute left-3 top-3 rounded-full px-3 py-1 text-[9px] font-bold", promo.active ? "bg-[#e7eee3] text-[#52704b]" : "bg-[#eee6e8] text-[#786970]")}>{promo.active ? "Visible en banner" : "Pausada"}</span></div><div className="p-5"><div className="flex justify-between"><span className="font-display text-3xl font-bold">{promo.value}</span><Percent size={16} className="text-[#9e5f72]" /></div><p className="mt-4 font-display text-2xl font-semibold">{promo.title}</p><p className="mt-1 text-[10px] text-[#786970]">Codigo: {promo.code}</p><button onClick={() => toggle(promo.id)} className="mt-5 w-full rounded-full border border-[#d8c9cd] px-4 py-2.5 text-[9px] font-bold">{promo.active ? "Pausar en banner" : "Activar en banner"}</button></div></div>)}</div></>;
}

function OrdersPanel() { return <><PanelHeading title="Pedidos" subtitle="Gestiona produccion, cobros y entregas" /><div className="mt-6 overflow-hidden rounded-2xl bg-[#fffdfb]">{orders.map((order) => <div key={order.id} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#eee5e7] p-5 last:border-0 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]"><div><p className="text-xs font-bold">{order.id}</p><p className="mt-1 text-[9px] text-[#786970]">{order.date}</p></div><span className="hidden text-[10px] sm:block">{order.customer}</span><span className="hidden text-[10px] font-bold sm:block">{formatPrice(order.total)}</span><span className="hidden sm:block"><Status value={order.status} /></span><button className="flex items-center gap-1 text-[9px] font-bold text-[#9e5f72]">Detalle <ChevronRight size={12} /></button></div>)}</div></>; }

function QuotesPanel() {
  const quotes = useQuoteStore((state) => state.quotes);
  const addMessage = useQuoteStore((state) => state.addMessage);
  const setStatus = useQuoteStore((state) => state.setStatus);
  const [selectedId, setSelectedId] = useState(quotes[0]?.id ?? "");
  const [reply, setReply] = useState("");
  const selected = quotes.find((quote) => quote.id === selectedId) ?? quotes[0];
  const statusLabels: Record<QuoteStatus, string> = { new: "Nueva", reviewing: "En revision", quoted: "Cotizada", converted: "Convertida en pedido", discarded: "Descartada", completed: "Venta terminada" };

  function sendReply() {
    if (!selected || !reply.trim()) return;
    addMessage(selected.id, "admin", reply.trim());
    setReply("");
  }

  return <><PanelHeading title="Cotizaciones" subtitle="Mensajes privados, referencias y conversion a pedidos" /><div className="mt-5 rounded-2xl bg-[#eee6d8] p-4 text-[10px] leading-5 text-[#725f42]">Las imagenes son temporales. Se eliminan al descartar una solicitud o al marcar como terminada una venta convertida; los archivos vencidos se limpian automaticamente.</div><div className="mt-4 grid min-h-[520px] overflow-hidden rounded-2xl bg-[#fffdfb] xl:grid-cols-[330px_1fr]"><div className="border-b border-[#eee5e7] xl:border-b-0 xl:border-r"><div className="p-4 text-[9px] font-bold uppercase tracking-wider text-[#91848a]">Conversaciones</div>{quotes.map((quote) => <button key={quote.id} onClick={() => setSelectedId(quote.id)} className={cn("flex w-full items-center gap-3 border-t border-[#eee5e7] p-4 text-left", selected?.id === quote.id && "bg-[#faf1f3]")}><span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f3e7e9] text-[#9e5f72]"><MessageCircleMore size={15} /></span><span className="min-w-0 flex-1"><span className="block text-xs font-bold">{quote.customer}</span><span className="mt-1 block truncate text-[9px] text-[#786970]">{quote.description}</span></span><span className="text-[8px] text-[#91848a]">{quote.createdAt}</span></button>)}</div>{selected && <div className="flex min-w-0 flex-col"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee5e7] p-5"><div><p className="text-sm font-bold">{selected.customer} · {selected.id}</p><p className="mt-1 text-[9px] text-[#786970]">{selected.dimensions} · {selected.quantity} unidad(es) · {selected.color}</p></div><Status value={statusLabels[selected.status]} /></div><div className="flex-1 space-y-3 overflow-y-auto bg-[#faf8f8] p-5">{selected.images.length > 0 && <div className="mb-5 grid max-w-md grid-cols-4 gap-2">{selected.images.map((image) => <div key={image.id} className="relative aspect-square overflow-hidden rounded-xl"><Image src={image.url} alt={image.name} fill unoptimized className="object-cover" /></div>)}</div>}{selected.images.length === 0 && (selected.status === "discarded" || selected.status === "completed") && <p className="rounded-xl bg-[#eee6d8] p-3 text-[9px] text-[#725f42]">Las imagenes temporales de esta conversacion ya fueron eliminadas.</p>}{selected.messages.map((message) => <div key={message.id} className={cn("max-w-[80%] rounded-2xl px-4 py-3 text-[10px] leading-5", message.sender === "admin" ? "ml-auto bg-[#35282d] text-white" : "bg-white")}><p>{message.text}</p><span className={cn("mt-1 block text-[8px]", message.sender === "admin" ? "text-white/45" : "text-[#91848a]")}>{message.createdAt}</span></div>)}</div><div className="border-t border-[#eee5e7] p-4"><div className="flex gap-2"><input value={reply} onChange={(event) => setReply(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendReply()} placeholder="Responder al cliente" className="min-w-0 flex-1 rounded-full border border-[#ded0d4] px-4 py-2.5 text-xs" /><button onClick={sendReply} className="rounded-full bg-[#35282d] px-5 text-[9px] font-bold text-white">Enviar</button></div><div className="mt-3 flex flex-wrap gap-2"><button onClick={() => setStatus(selected.id, "quoted")} className="rounded-full border border-[#d8c9cd] px-3 py-2 text-[8px] font-bold">Marcar cotizada</button><button onClick={() => setStatus(selected.id, "converted")} className="rounded-full bg-[#e7eee3] px-3 py-2 text-[8px] font-bold text-[#52704b]">Convertir en pedido</button><button onClick={() => setStatus(selected.id, "discarded")} className="rounded-full bg-[#f4e5e7] px-3 py-2 text-[8px] font-bold text-[#9e5f72]">Descartar y borrar imagenes</button>{selected.status === "converted" && <button onClick={() => setStatus(selected.id, "completed")} className="rounded-full bg-[#35282d] px-3 py-2 text-[8px] font-bold text-white">Terminar venta y borrar imagenes</button>}</div></div></div>}</div></>;
}

function CustomersPanel() {
  const customers = [
    { id: "CL-0184", name: "Maria Jimenez", email: "maria.j@example.com", phone: "099 452 1180", joined: "12 ago 2026", orders: 4, total: 148.5, taxId: "0912345678", billingName: "Maria Jimenez", billingAddress: "Barrio General Enriquez Gallo, Salinas", shippingAddress: "Av. Carlos Espinoza, Salinas, Santa Elena" },
    { id: "CL-0183", name: "Andrea Ponce", email: "andrea.p@example.com", phone: "098 771 2034", joined: "08 ago 2026", orders: 2, total: 85, taxId: "0923456789", billingName: "Andrea Ponce", billingAddress: "La Libertad, Santa Elena", shippingAddress: "Cdla. Las Acacias, La Libertad" },
    { id: "CL-0182", name: "Sofia Rosales", email: "sofia.r@example.com", phone: "096 221 9041", joined: "02 ago 2026", orders: 1, total: 24, taxId: "0956781234", billingName: "Sofia Rosales", billingAddress: "Guayaquil, Guayas", shippingAddress: "Urdesa Central, Guayaquil" },
    { id: "CL-0181", name: "Daniela Cedeño", email: "daniela.c@example.com", phone: "097 310 8872", joined: "28 jul 2026", orders: 6, total: 267.9, taxId: "0909876543", billingName: "Daniela Cedeño", billingAddress: "Santa Elena, Santa Elena", shippingAddress: "Calle Guayaquil y 9 de Octubre, Santa Elena" },
  ];
  const [selectedId, setSelectedId] = useState(customers[0].id);
  const selected = customers.find((customer) => customer.id === selectedId) ?? customers[0];
  return <><PanelHeading title="Clientes" subtitle="Datos de contacto, facturacion, entregas e historial" /><div className="mt-6 grid gap-5 xl:grid-cols-[1fr_360px]"><div className="overflow-hidden rounded-2xl bg-[#fffdfb]"><div className="hidden grid-cols-[1.5fr_1.5fr_.6fr_.7fr_auto] gap-4 border-b border-[#e5d8dc] px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-[#91848a] md:grid"><span>Cliente</span><span>Contacto</span><span>Pedidos</span><span>Total</span><span></span></div>{customers.map((customer) => <button key={customer.id} onClick={() => setSelectedId(customer.id)} className={cn("grid w-full grid-cols-[1fr_auto] items-center gap-4 border-b border-[#eee5e7] p-5 text-left last:border-0 md:grid-cols-[1.5fr_1.5fr_.6fr_.7fr_auto]", selected.id === customer.id && "bg-[#faf1f3]")}><div><p className="text-xs font-bold">{customer.name}</p><p className="mt-1 text-[9px] text-[#91848a]">{customer.id} · desde {customer.joined}</p></div><div className="hidden md:block"><p className="text-[10px]">{customer.email}</p><p className="mt-1 text-[9px] text-[#786970]">{customer.phone}</p></div><span className="hidden text-[10px] md:block">{customer.orders}</span><span className="hidden text-[10px] font-bold md:block">{formatPrice(customer.total)}</span><ChevronRight size={13} className="text-[#9e5f72]" /></button>)}</div><aside className="h-fit rounded-2xl bg-[#fffdfb] p-6"><span className="grid size-12 place-items-center rounded-full bg-[#ead7dc] font-display text-lg font-bold text-[#9e5f72]">{selected.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><h3 className="mt-4 font-display text-2xl font-semibold">{selected.name}</h3><p className="mt-1 text-[10px] text-[#786970]">{selected.email} · {selected.phone}</p><div className="mt-6 border-t border-[#eee5e7] pt-5"><p className="text-[9px] font-bold uppercase tracking-wider text-[#9e5f72]">Facturacion</p><p className="mt-3 text-[10px] font-bold">{selected.billingName}</p><p className="mt-1 text-[9px] leading-4 text-[#786970]">CI/RUC: {selected.taxId}<br />{selected.billingAddress}</p></div><div className="mt-5 border-t border-[#eee5e7] pt-5"><p className="text-[9px] font-bold uppercase tracking-wider text-[#9e5f72]">Direccion de envio</p><p className="mt-3 text-[9px] leading-4 text-[#786970]">{selected.shippingAddress}</p></div><Link href="mailto:{selected.email}" className="mt-6 block rounded-full bg-[#35282d] px-5 py-3 text-center text-[9px] font-bold text-white">Contactar cliente</Link></aside></div></>;
}

function SettingsPanel() { return <><PanelHeading title="Configuracion" subtitle="Conexiones y datos de la tienda" /><div className="mt-6 grid gap-4 md:grid-cols-2">{[{ title: "Mensajeria interna", text: "Cotizaciones privadas con archivos temporales y seguimiento dentro de la tienda.", active: true }, { title: "Firebase", text: "Google Auth, Firestore y Storage temporal pendientes de credenciales.", active: false }, { title: "DEUNA", text: "Payment Link preparado para la futura cuenta comercial.", active: false }, { title: "Vercel", text: "Listo para desplegar desde el repositorio de GitHub.", active: true }].map((item) => <div key={item.title} className="rounded-2xl bg-[#fffdfb] p-6"><div className="flex items-center justify-between"><h3 className="font-display text-2xl font-semibold">{item.title}</h3><span className={cn("size-2.5 rounded-full", item.active ? "bg-[#6f9265]" : "bg-[#c5b8bc]")} /></div><p className="mt-3 text-[10px] leading-5 text-[#786970]">{item.text}</p><button className="mt-5 text-[9px] font-bold text-[#9e5f72]">Configurar</button></div>)}</div></>; }

function PanelHeading({ title, subtitle, action, onAction }: { title: string; subtitle: string; action?: string; onAction?: () => void }) { return <div className="flex items-center justify-between gap-4"><div><h2 className="font-display text-4xl font-semibold">{title}</h2><p className="mt-1 text-[10px] text-[#786970]">{subtitle}</p></div>{action && <button onClick={onAction} className="flex items-center gap-2 rounded-full bg-[#35282d] px-4 py-2.5 text-[10px] font-bold text-white"><Plus size={13} /> {action}</button>}</div>; }
function Status({ value }: { value: string }) { return <span className="shrink-0 rounded-full bg-[#f3e7e9] px-3 py-1.5 text-[9px] font-bold text-[#9e5f72]">{value}</span>; }
