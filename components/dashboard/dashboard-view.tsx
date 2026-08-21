"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  Box,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  Menu,
  MessageCircleMore,
  Package,
  Percent,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, onSnapshot } from "firebase/firestore";
import { PromotionsPanel } from "@/components/dashboard/promotions-panel";
import { SettingsPanel } from "@/components/dashboard/settings-panel";
import { DashboardProducts } from "@/components/dashboard/products-panel";
import { formatPrice } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useQuoteStore, type QuoteStatus } from "@/stores/quote-store";
import { useAccountStore } from "@/stores/account-store";
import { useOrderStore } from "@/stores/order-store";
import { getFirebaseDb } from "@/lib/firebase/client";
import { getFirebaseAuth } from "@/lib/firebase/client";

type Tab =
  | "resumen"
  | "productos"
  | "promociones"
  | "pedidos"
  | "cotizaciones"
  | "clientes"
  | "configuración";

const nav: Array<{ id: Tab; label: string; icon: typeof Box }> = [
  { id: "resumen", label: "Resumen", icon: LayoutDashboard },
  { id: "productos", label: "Productos", icon: Box },
  { id: "promociones", label: "Promociones", icon: Percent },
  { id: "pedidos", label: "Pedidos", icon: ShoppingBag },
  { id: "cotizaciones", label: "Cotizaciones", icon: MessageCircleMore },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "configuración", label: "Configuración", icon: Settings },
];

export function DashboardView() {
  const router = useRouter();
  const account = useAccountStore((state) => state.account);
  const isAccountLoading = useAccountStore((state) => state.isLoading);
  const [tab, setTab] = useState<Tab>("resumen");
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const orders = useOrderStore((state) => state.orders);
  const quotes = useQuoteStore((state) => state.quotes);
  const currentLabel = nav.find((item) => item.id === tab)?.label;

  function changeTab(next: Tab) {
    setTab(next);
    setMobileNav(false);
  }

  useEffect(() => {
    if (isAccountLoading) return;
    if (!account) router.replace("/login?redirect=/dashboard");
    else if (account.role !== "admin") router.replace("/");
  }, [account, isAccountLoading, router]);

  if (isAccountLoading) return <main className="grid min-h-dvh place-items-center bg-[#f7f3f3] text-sm text-[#786970]">Verificando acceso...</main>;
  if (!account || account.role !== "admin") return null;

  return (
    <main className="min-h-dvh w-full bg-[#f7f3f3]">
      <div className="min-h-dvh lg:pl-[250px]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-[280px] bg-[#35282d] p-5 text-white transition lg:w-[250px] lg:translate-x-0",
            mobileNav ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div>
              <p className="font-display text-xl font-bold">J&J Estudio</p>
              <p className="mt-1 text-[9px] uppercase tracking-widest text-white/45">
                Panel de tienda
              </p>
            </div>
            <button
              onClick={() => setMobileNav(false)}
              className="p-2 lg:hidden"
              aria-label="Cerrar navegacion"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="mt-7 space-y-1">
            {nav.map((item) => (
              <button
                key={item.id}
                onClick={() => changeTab(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-semibold transition",
                  tab === item.id
                    ? "bg-[#c98698] text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon size={16} />
                {item.label}
                {item.id === "pedidos" && (
                  <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[9px]">
                    {orders.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <Link
            href="/"
            className="absolute bottom-6 left-5 right-5 flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-[10px] font-bold text-white/70"
          >
            Ver tienda <ExternalLink size={13} />
          </Link>
        </aside>
        <section className="min-w-0">
          <header className="flex h-[72px] items-center justify-between border-b border-[#e5d8dc] bg-[#fffdfb] px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileNav(true)}
                className="rounded-lg p-2 lg:hidden"
                aria-label="Abrir navegacion"
              >
                <Menu size={19} />
              </button>
              <div>
                <p className="text-[9px] text-[#786970]">Administración</p>
                <h1 className="text-sm font-extrabold">{currentLabel}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="relative hidden sm:block">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e5f72]"
                  size={14}
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar seccion"
                  className="w-44 rounded-full border border-[#e5d8dc] py-2 pl-9 pr-3 text-[11px]"
                />
                {search && (
                  <div className="absolute right-0 top-10 z-20 w-56 rounded-xl border border-[#e5d8dc] bg-white p-2 shadow-lg">
                    {nav
                      .filter((item) =>
                        item.label.toLowerCase().includes(search.toLowerCase()),
                      )
                      .map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            changeTab(item.id);
                            setSearch("");
                          }}
                          className="w-full rounded-lg px-3 py-2 text-left text-[10px] font-bold hover:bg-[#f3e7e9]"
                        >
                          Ir a {item.label}
                        </button>
                      ))}
                  </div>
                )}
              </label>
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen((open) => !open)}
                  className="relative grid size-9 place-items-center rounded-full border border-[#e5d8dc]"
                  aria-label="Notificaciones"
                >
                  <Bell size={15} />
                  <span className="absolute right-1 top-1 size-1.5 rounded-full bg-[#c98698]" />
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-11 z-20 w-64 rounded-2xl border border-[#e5d8dc] bg-white p-3 shadow-lg">
                    <p className="text-xs font-bold">Notificaciones</p>
                    <p className="mt-3 rounded-xl bg-[#f3e7e9] p-3 text-[10px]">
                       Tienes {orders.filter((order) => order.status === "pending_payment").length} pedidos pendientes por revisar.
                    </p>
                    <p className="mt-2 rounded-xl bg-[#faf6f6] p-3 text-[10px]">
                       Hay {quotes.filter((quote) => quote.status === "new").length} cotizaciones esperando respuesta.
                    </p>
                  </div>
                )}
              </div>
              <span className="grid size-9 place-items-center rounded-full bg-[#ead7dc] text-[10px] font-bold text-[#9e5f72]">
                JJ
              </span>
            </div>
          </header>
          <div className="p-5 sm:p-8">
            {tab === "resumen" && (
              <Overview onOpenProducts={() => changeTab("productos")} orders={orders} />
            )}
            {tab === "productos" && <DashboardProducts />}
            {tab === "promociones" && <PromotionsPanel />}
            {tab === "pedidos" && <OrdersPanel />}
            {tab === "cotizaciones" && <QuotesPanel />}
            {tab === "clientes" && <CustomersPanel />}
            {tab === "configuración" && <SettingsPanel />}
          </div>
        </section>
      </div>
    </main>
  );
}

function Overview({ onOpenProducts, orders }: { onOpenProducts: () => void; orders: ReturnType<typeof useOrderStore.getState>["orders"] }) {
  const account = useAccountStore((state) => state.account);
  const quotes = useQuoteStore((state) => state.quotes);
  const sales = orders.filter((order) => order.paymentStatus === "paid").reduce((total, order) => total + order.total, 0);
  const activeOrders = orders.filter((order) => !["delivered", "cancelled"].includes(order.status));
  const stats = [
    {
      label: "Ventas del mes",
       value: formatPrice(sales),
       note: "Cobros confirmados",
      icon: CircleDollarSign,
      color: "bg-[#ead7dc] text-[#9e5f72]",
    },
    {
      label: "Pedidos activos",
       value: String(activeOrders.length),
       note: `${orders.filter((order) => order.status === "pending_payment").length} pendientes`,
      icon: Package,
      color: "bg-[#e4ebe0] text-[#567050]",
    },
    {
      label: "Cotizaciones",
       value: String(quotes.length),
       note: `${quotes.filter((quote) => quote.status === "new").length} por revisar`,
      icon: ClipboardList,
      color: "bg-[#eee6d8] text-[#886e42]",
    },
    {
      label: "Conversion",
       value: orders.length ? `${Math.round((orders.filter((order) => order.paymentStatus === "paid").length / orders.length) * 100)}%` : "0%",
       note: "Pedidos pagados",
      icon: TrendingUp,
      color: "bg-[#e6e1ee] text-[#665687]",
    },
  ];
  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-[#786970]">Jueves, 20 de agosto</p>
          <h2 className="mt-1 font-display text-4xl font-semibold">
             Buenos días, {account?.name.split(" ")[0] ?? "administración"}
          </h2>
        </div>
        <button
          onClick={onOpenProducts}
          className="hidden items-center gap-2 rounded-full bg-[#35282d] px-5 py-3 text-xs font-bold text-white sm:flex"
        >
          <Plus size={14} /> Nuevo producto
        </button>
      </div>
      <div className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-[#fffdfb] p-4 sm:p-5">
            <span
              className={cn(
                "grid size-9 place-items-center rounded-xl",
                stat.color,
              )}
            >
              <stat.icon size={16} />
            </span>
            <p className="mt-5 text-[10px] text-[#786970]">{stat.label}</p>
            <div className="mt-1 flex items-end justify-between">
              <span className="font-display text-3xl font-semibold">
                {stat.value}
              </span>
              <span className="text-[9px] font-bold text-[#6a865f]">
                {stat.note}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <div className="rounded-2xl bg-[#fffdfb] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold">Ventas</p>
              <p className="mt-1 text-[9px] text-[#786970]">Ultimos 7 días</p>
            </div>
            <BarChart3 size={17} className="text-[#9e5f72]" />
          </div>
          <div className="mt-8 flex h-44 items-end gap-3">
            {[42, 68, 48, 82, 63, 92, 74].map((height, index) => (
              <div
                key={index}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="w-full rounded-t-lg bg-[#d9abb7] transition hover:bg-[#9e5f72]"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[8px] text-[#91848a]">
                  {["L", "M", "M", "J", "V", "S", "D"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-[#fffdfb] p-5">
          <p className="text-xs font-bold">Actividad reciente</p>
          <div className="mt-5 space-y-5">
             {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-[#f3e7e9] text-[#9e5f72]">
                  <ShoppingBag size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-bold">
                    Pedido {order.id}
                  </p>
                  <p className="mt-1 text-[9px] text-[#786970]">
                     {order.customer} · {new Date(order.createdAt).toLocaleDateString("es-EC")}
                  </p>
                </div>
                <span className="text-[10px] font-bold">
                  {formatPrice(order.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function OrdersPanel() {
  const orders = useOrderStore((state) => state.orders);
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const filteredOrders = orders.filter((order) =>
     [order.id, order.customer, order.status, order.createdAt].some((value) =>
       value.toLowerCase().includes(normalizedSearch),
    ),
  );

  return (
    <>
      <PanelHeading
        title="Pedidos"
        subtitle="Gestiona producción, cobros y entregas"
      />
      <label className="relative mt-5 block max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e5f72]"
          size={14}
        />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por pedido, cliente o estado"
          className="w-full rounded-xl border border-[#e5d8dc] py-2.5 pl-9 pr-3 text-[10px] outline-none focus:border-[#9e5f72]"
          aria-label="Buscar pedidos"
        />
      </label>
      <div className="mt-4 overflow-hidden rounded-2xl bg-[#fffdfb]">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#eee5e7] p-5 last:border-0 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]"
            >
              <div>
                <p className="text-xs font-bold">{order.id}</p>
                 <p className="mt-1 text-[9px] text-[#786970]">{new Date(order.createdAt).toLocaleDateString("es-EC")}</p>
              </div>
              <span className="hidden text-[10px] sm:block">
                {order.customer}
              </span>
              <span className="hidden text-[10px] font-bold sm:block">
                {formatPrice(order.total)}
              </span>
              <span className="hidden sm:block">
                 <Status value={order.status} />
              </span>
              <button className="flex items-center gap-1 text-[9px] font-bold text-[#9e5f72]">
                Detalle <ChevronRight size={12} />
              </button>
            </div>
          ))
        ) : (
          <p className="p-5 text-center text-[10px] text-[#786970]">
            No se encontraron pedidos.
          </p>
        )}
      </div>
    </>
  );
}

function QuotesPanel() {
  const quotes = useQuoteStore((state) => state.quotes);
  const addMessage = useQuoteStore((state) => state.addMessage);
  const setStatus = useQuoteStore((state) => state.setStatus);
  const [selectedId, setSelectedId] = useState(quotes[0]?.id ?? "");
  const [reply, setReply] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [search, setSearch] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [shippingCost, setShippingCost] = useState("0");
  const [converting, setConverting] = useState(false);
  const [conversionMessage, setConversionMessage] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const filteredQuotes = quotes.filter((quote) =>
    [
      quote.id,
      quote.customer,
      quote.description,
      quote.dimensions,
      quote.color,
    ].some((value) => value.toLowerCase().includes(normalizedSearch)),
  );
  const selected =
    filteredQuotes.find((quote) => quote.id === selectedId) ??
    filteredQuotes[0];
  const statusLabels: Record<QuoteStatus, string> = {
    new: "Nueva",
    reviewing: "En revisión",
    quoted: "Cotizada",
    converted: "Convertida en pedido",
    discarded: "Descartada",
    completed: "Venta terminada",
  };

  async function sendReply() {
    if (!selected || (!reply.trim() && !attachments.length)) return;
    await addMessage(selected.id, "admin", reply.trim(), attachments);
    setReply("");
    setAttachments([]);
  }
  const subtotal = (Number(unitPrice) || 0) * (selected?.quantity ?? 0);
  const total = subtotal + (Number(shippingCost) || 0);
  async function convertQuote() {
    if (!selected) return;
    setConverting(true); setConversionMessage("");
    try {
      const token = await getFirebaseAuth().currentUser?.getIdToken();
      const response = await fetch(`/api/admin/quotes/${selected.id}/convert`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token ?? ""}` }, body: JSON.stringify({ unitPrice: Number(unitPrice), shippingCost: Number(shippingCost) }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "No fue posible convertir la cotización.");
      setConversionMessage(`Pedido ${result.orderId} creado correctamente.`);
    } catch (error) { setConversionMessage(error instanceof Error ? error.message : "No fue posible convertir la cotización."); }
    finally { setConverting(false); }
  }

  return (
    <>
      <PanelHeading
        title="Cotizaciones"
        subtitle="Mensajes privados, referencias y conversion a pedidos"
      />
      <label className="relative mt-5 block max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e5f72]"
          size={14}
        />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por cliente, solicitud o referencia"
          className="w-full rounded-xl border border-[#e5d8dc] py-2.5 pl-9 pr-3 text-[10px] outline-none focus:border-[#9e5f72]"
          aria-label="Buscar cotizaciones"
        />
      </label>
      <div className="mt-4 rounded-2xl bg-[#eee6d8] p-4 text-[10px] leading-5 text-[#725f42]">
        Las imágenes son temporales. Se eliminan al descartar una solicitud o al
        marcar cómo terminada una venta convertida; los archivos vencidos se
        limpian automáticamente.
      </div>
      <div className="mt-4 grid min-h-[520px] overflow-hidden rounded-2xl bg-[#fffdfb] xl:grid-cols-[330px_1fr]">
        <div className="border-b border-[#eee5e7] xl:border-b-0 xl:border-r">
          <div className="p-4 text-[9px] font-bold uppercase tracking-wider text-[#91848a]">
            Conversaciones
          </div>
          {filteredQuotes.length > 0 ? (
            filteredQuotes.map((quote) => (
              <button
                key={quote.id}
                onClick={() => setSelectedId(quote.id)}
                className={cn(
                  "flex w-full items-center gap-3 border-t border-[#eee5e7] p-4 text-left",
                  selected?.id === quote.id && "bg-[#faf1f3]",
                )}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f3e7e9] text-[#9e5f72]">
                  <MessageCircleMore size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold">
                    {quote.customer}
                  </span>
                  <span className="mt-1 block truncate text-[9px] text-[#786970]">
                    {quote.description}
                  </span>
                </span>
                <span className="text-[8px] text-[#91848a]">
                  {quote.createdAt}
                </span>
              </button>
            ))
          ) : (
            <p className="p-5 text-center text-[10px] text-[#786970]">
              No se encontraron cotizaciones.
            </p>
          )}
        </div>
        {selected && (
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee5e7] p-5">
              <div>
                <p className="text-sm font-bold">
                  {selected.customer} · {selected.id}
                </p>
                <p className="mt-1 text-[9px] text-[#786970]">
                  {selected.dimensions} · {selected.quantity} unidad(es) ·{" "}
                  {selected.color}
                </p>
              </div>
              <Status value={statusLabels[selected.status]} />
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto bg-[#faf8f8] p-5">
              {selected.images.length > 0 && (
                <div className="mb-5 grid max-w-md grid-cols-4 gap-2">
                  {selected.images.map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square overflow-hidden rounded-xl"
                    >
                      <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              {selected.images.length === 0 &&
                (selected.status === "discarded" ||
                  selected.status === "completed") && (
                  <p className="rounded-xl bg-[#eee6d8] p-3 text-[9px] text-[#725f42]">
                    Las imágenes temporales de esta conversación ya fueron
                    eliminadas.
                  </p>
                )}
              {selected.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-[10px] leading-5",
                    message.sender === "admin"
                      ? "ml-auto bg-[#35282d] text-white"
                      : "bg-white",
                  )}
                >
                  <p>{message.text}</p>
                  {message.images?.length ? <div className="mt-2 grid grid-cols-3 gap-2">{message.images.map((image) => <a key={image.id} href={image.url} target="_blank" rel="noreferrer" className="relative aspect-square overflow-hidden rounded-lg"><Image src={image.url} alt={image.name} fill unoptimized className="object-cover" /></a>)}</div> : null}
                  <span
                    className={cn(
                      "mt-1 block text-[8px]",
                      message.sender === "admin"
                        ? "text-white/45"
                        : "text-[#91848a]",
                    )}
                  >
                    {message.createdAt}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#eee5e7] p-4">
              <div className="flex gap-2">
                <input
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && sendReply()}
                  placeholder="Responder al cliente"
                  className="min-w-0 flex-1 rounded-full border border-[#ded0d4] px-4 py-2.5 text-xs"
                />
                <button
                  onClick={sendReply}
                  className="rounded-full bg-[#35282d] px-5 text-[9px] font-bold text-white"
                >
                  Enviar
                </button>
              </div>
              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#d8c9cd] px-3 py-2 text-[9px] font-bold text-[#9e5f72]">Adjuntar imágenes<input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => setAttachments(Array.from(event.target.files ?? []).filter((file) => file.size <= 8 * 1024 * 1024).slice(0, 4))} /></label>{attachments.length > 0 && <span className="ml-2 text-[9px] text-[#786970]">{attachments.length} imagen(es) listas para enviar</span>}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setStatus(selected.id, "quoted")}
                  className="rounded-full border border-[#d8c9cd] px-3 py-2 text-[8px] font-bold"
                >
                  Marcar cotizada
                </button>
                {selected.status !== "converted" && <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#e7eee3] p-2 text-[9px]"><input value={unitPrice} onChange={(event) => setUnitPrice(event.target.value)} type="number" min="0" step="0.01" placeholder="Precio/u." className="w-20 rounded-lg border border-[#c8d5c1] bg-white px-2 py-1.5" /><input value={shippingCost} onChange={(event) => setShippingCost(event.target.value)} type="number" min="0" step="0.01" placeholder="Envío" className="w-16 rounded-lg border border-[#c8d5c1] bg-white px-2 py-1.5" /><span>Subt. {formatPrice(subtotal)} · Total {formatPrice(total)}</span><button disabled={converting || !unitPrice || Number(unitPrice) <= 0} onClick={() => void convertQuote()} className="rounded-full bg-[#52704b] px-3 py-2 font-bold text-white disabled:opacity-50">{converting ? "Convirtiendo..." : "Convertir"}</button></div>}
                <button
                  onClick={() => setStatus(selected.id, "discarded")}
                  className="rounded-full bg-[#f4e5e7] px-3 py-2 text-[8px] font-bold text-[#9e5f72]"
                >
                  Descartar y borrar imágenes
                </button>
                {selected.status === "converted" && (
                  <button
                    onClick={() => setStatus(selected.id, "completed")}
                    className="rounded-full bg-[#35282d] px-3 py-2 text-[8px] font-bold text-white"
                  >
                    Terminar venta y borrar imágenes
                  </button>
                )}
              </div>
              {conversionMessage && <p className="mt-2 text-[9px] font-bold text-[#52704b]">{conversionMessage}</p>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function CustomersPanel() {
  const orders = useOrderStore((state) => state.orders);
  const [customers, setCustomers] = useState<Array<{ id: string; name: string; email: string; phone: string; billingName: string; taxId: string; billingAddress: string; shippingAddress: string; createdAt: string }>>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  useEffect(() => onSnapshot(collection(getFirebaseDb(), "users"), (snapshot) => setCustomers(snapshot.docs.map((item) => ({ id: item.id, name: String(item.data().name ?? "Cliente J&J"), email: String(item.data().email ?? ""), phone: String(item.data().phone ?? ""), billingName: String(item.data().billingName ?? ""), taxId: String(item.data().taxId ?? ""), billingAddress: String(item.data().billingAddress ?? ""), shippingAddress: String(item.data().shippingAddress ?? ""), createdAt: String(item.data().createdAt ?? "") })))), []);
  const filtered = customers.filter((customer) => `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(search.toLowerCase()));
  const selected = filtered.find((customer) => customer.id === selectedId) ?? filtered[0];
  const customerOrders = selected ? orders.filter((order) => order.userId === selected.id) : [];
  return <><PanelHeading title="Clientes" subtitle="Datos reales de cuentas, pedidos y facturación" /><div className="mt-6 grid gap-5 xl:grid-cols-[1fr_360px]"><div className="overflow-hidden rounded-2xl bg-[#fffdfb]"><label className="relative m-4 block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e5f72]" size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, correo o teléfono" className="w-full rounded-xl border border-[#e5d8dc] py-2.5 pl-9 pr-3 text-[10px]" /></label>{filtered.map((customer) => { const customerOrders = orders.filter((order) => order.userId === customer.id); const total = customerOrders.reduce((sum, order) => sum + order.total, 0); return <button key={customer.id} onClick={() => setSelectedId(customer.id)} className={cn("grid w-full grid-cols-[1fr_auto] items-center gap-4 border-t border-[#eee5e7] p-5 text-left md:grid-cols-[1.5fr_1.5fr_.6fr_.7fr_auto]", selected?.id === customer.id && "bg-[#faf1f3]")}><div><p className="text-xs font-bold">{customer.name}</p><p className="mt-1 text-[9px] text-[#91848a]">desde {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString("es-EC") : "sin fecha"}</p></div><span className="hidden text-[10px] md:block">{customer.email}<br />{customer.phone}</span><span className="hidden text-[10px] md:block">{customerOrders.length}</span><span className="hidden text-[10px] font-bold md:block">{formatPrice(total)}</span><ChevronRight size={13} className="text-[#9e5f72]" /></button>; })}{!filtered.length && <p className="p-5 text-center text-[10px] text-[#786970]">No se encontraron clientes.</p>}</div>{selected && <aside className="h-fit rounded-2xl bg-[#fffdfb] p-6"><h3 className="font-display text-2xl font-semibold">{selected.name}</h3><p className="mt-1 text-[10px] text-[#786970]">{selected.email} · {selected.phone || "Sin teléfono"}</p><div className="mt-5 border-t border-[#eee5e7] pt-4 text-[10px]"><p className="font-bold">Facturación</p><p className="mt-2">{selected.billingName || "Sin datos"}</p><p className="text-[#786970]">{selected.taxId} {selected.billingAddress}</p></div><div className="mt-5 border-t border-[#eee5e7] pt-4 text-[10px]"><p className="font-bold">Entrega</p><p className="mt-2 text-[#786970]">{selected.shippingAddress || "Sin dirección"}</p></div><p className="mt-5 border-t border-[#eee5e7] pt-4 text-[10px]">{customerOrders.length} pedido(s) · <strong>{formatPrice(customerOrders.reduce((sum, order) => sum + order.total, 0))}</strong></p></aside>}</div></>;
}

// Kept temporarily as a visual reference while the real Firestore panel rolls out.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LegacyCustomersPanel() {
  const customers = [
    {
      id: "CL-0184",
      accountId: "maria-jimenez",
      name: "Maria Jimenez",
      email: "maria.j@example.com",
      phone: "099 452 1180",
      joined: "12 ago 2026",
      orders: 4,
      total: 148.5,
      taxId: "0912345678",
      billingName: "Maria Jimenez",
      billingAddress: "Barrio General Enriquez Gallo, Salinas",
      shippingAddress: "Av. Carlos Espinoza, Salinas, Santa Elena",
    },
    {
      id: "CL-0183",
      accountId: "andrea-ponce",
      name: "Andrea Ponce",
      email: "andrea.p@example.com",
      phone: "098 771 2034",
      joined: "08 ago 2026",
      orders: 2,
      total: 85,
      taxId: "0923456789",
      billingName: "Andrea Ponce",
      billingAddress: "La Libertad, Santa Elena",
      shippingAddress: "Cdla. Las Acacias, La Libertad",
    },
    {
      id: "CL-0182",
      accountId: null,
      name: "Sofia Rosales",
      email: "sofia.r@example.com",
      phone: "096 221 9041",
      joined: "02 ago 2026",
      orders: 1,
      total: 24,
      taxId: "0956781234",
      billingName: "Sofia Rosales",
      billingAddress: "Guayaquil, Guayas",
      shippingAddress: "Urdesa Central, Guayaquil",
    },
    {
      id: "CL-0181",
      accountId: null,
      name: "Daniela Cedeño",
      email: "daniela.c@example.com",
      phone: "097 310 8872",
      joined: "28 jul 2026",
      orders: 6,
      total: 267.9,
      taxId: "0909876543",
      billingName: "Daniela Cedeño",
      billingAddress: "Santa Elena, Santa Elena",
      shippingAddress: "Calle Guayaquil y 9 de Octubre, Santa Elena",
    },
  ];
  const [selectedId, setSelectedId] = useState(customers[0].id);
  const [search, setSearch] = useState("");
  const users = useAccountStore((state) => state.users);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredCustomers = customers.filter((customer) =>
    [customer.name, customer.email, customer.phone].some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    ),
  );
  const selected =
    filteredCustomers.find((customer) => customer.id === selectedId) ??
    filteredCustomers[0];
  const selectedAccount = selected?.accountId
    ? users.find(
        (user) =>
          user.id === selected.accountId && user.email === selected.email,
      )
    : undefined;
  return (
    <>
      <PanelHeading
        title="Clientes"
        subtitle="Datos de contacto, facturación, entregas e historial"
      />
      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-2xl bg-[#fffdfb]">
          <div className="border-b border-[#e5d8dc] p-4">
            <label className="relative block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e5f72]"
                size={14}
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre, correo o teléfono"
                className="w-full rounded-xl border border-[#e5d8dc] py-2.5 pl-9 pr-3 text-[10px] outline-none focus:border-[#9e5f72]"
                aria-label="Buscar clientes"
              />
            </label>
          </div>
          <div className="hidden grid-cols-[1.5fr_1.5fr_.6fr_.7fr_auto] gap-4 border-b border-[#e5d8dc] px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-[#91848a] md:grid">
            <span>Cliente</span>
            <span>Contacto</span>
            <span>Pedidos</span>
            <span>Total</span>
            <span></span>
          </div>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <button
                key={customer.id}
                onClick={() => setSelectedId(customer.id)}
                className={cn(
                  "grid w-full grid-cols-[1fr_auto] items-center gap-4 border-b border-[#eee5e7] p-5 text-left last:border-0 md:grid-cols-[1.5fr_1.5fr_.6fr_.7fr_auto]",
                  selected?.id === customer.id && "bg-[#faf1f3]",
                )}
              >
                <div>
                  <p className="text-xs font-bold">{customer.name}</p>
                  <p className="mt-1 text-[9px] text-[#91848a]">
                    {customer.id} · desde {customer.joined}
                  </p>
                </div>
                <div className="hidden md:block">
                  <p className="text-[10px]">{customer.email}</p>
                  <p className="mt-1 text-[9px] text-[#786970]">
                    {customer.phone}
                  </p>
                </div>
                <span className="hidden text-[10px] md:block">
                  {customer.orders}
                </span>
                <span className="hidden text-[10px] font-bold md:block">
                  {formatPrice(customer.total)}
                </span>
                <ChevronRight size={13} className="text-[#9e5f72]" />
              </button>
            ))
          ) : (
            <p className="p-5 text-center text-[10px] text-[#786970]">
              No se encontraron clientes.
            </p>
          )}
        </div>
        {selected && (
          <aside className="h-fit rounded-2xl bg-[#fffdfb] p-6">
            <span className="grid size-12 place-items-center rounded-full bg-[#ead7dc] font-display text-lg font-bold text-[#9e5f72]">
              {selected.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </span>
            <h3 className="mt-4 font-display text-2xl font-semibold">
              {selected.name}
            </h3>
            <p className="mt-1 text-[10px] text-[#786970]">
              {selected.email} · {selected.phone}
            </p>
            {selectedAccount && <p className="mt-4 text-[10px] text-[#786970]">El rol se administra desde Firebase Admin.</p>}
            <div className="mt-6 border-t border-[#eee5e7] pt-5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#9e5f72]">
                Facturación
              </p>
              <p className="mt-3 text-[10px] font-bold">
                {selected.billingName}
              </p>
              <p className="mt-1 text-[9px] text-[#786970]">
                RUC/CI: {selected.taxId}
              </p>
              <p className="mt-1 text-[9px] leading-4 text-[#786970]">
                {selected.billingAddress}
              </p>
            </div>
            <div className="mt-5 border-t border-[#eee5e7] pt-5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#9e5f72]">
                Entrega
              </p>
              <p className="mt-3 text-[9px] leading-4 text-[#786970]">
                {selected.shippingAddress}
              </p>
            </div>
            <div className="mt-5 flex justify-between border-t border-[#eee5e7] pt-5 text-[10px]">
              <span>{selected.orders} pedido(s)</span>
              <span className="font-bold">{formatPrice(selected.total)}</span>
            </div>
          </aside>
        )}
      </div>
    </>
  );
  /*
  return <><PanelHeading title="Clientes" subtitle="Datos de contacto, facturación, entregas e historial" /><div className="mt-6 grid gap-5 xl:grid-cols-[1fr_360px]"><div className="overflow-hidden rounded-2xl bg-[#fffdfb]"><div className="hidden grid-cols-[1.5fr_1.5fr_.6fr_.7fr_auto] gap-4 border-b border-[#e5d8dc] px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-[#91848a] md:grid"><span>Cliente</span><span>Contacto</span><span>Pedidos</span><span>Total</span><span></span></div>{customers.map((customer) => <button key={customer.id} onClick={() => setSelectedId(customer.id)} className={cn("grid w-full grid-cols-[1fr_auto] items-center gap-4 border-b border-[#eee5e7] p-5 text-left last:border-0 md:grid-cols-[1.5fr_1.5fr_.6fr_.7fr_auto]", selected.id === customer.id && "bg-[#faf1f3]")}><div><p className="text-xs font-bold">{customer.name}</p><p className="mt-1 text-[9px] text-[#91848a]">{customer.id} · desde {customer.joined}</p></div><div className="hidden md:block"><p className="text-[10px]">{customer.email}</p><p className="mt-1 text-[9px] text-[#786970]">{customer.phone}</p></div><span className="hidden text-[10px] md:block">{customer.orders}</span><span className="hidden text-[10px] font-bold md:block">{formatPrice(customer.total)}</span><ChevronRight size={13} className="text-[#9e5f72]" /></button>)}</div><aside className="h-fit rounded-2xl bg-[#fffdfb] p-6"><span className="grid size-12 place-items-center rounded-full bg-[#ead7dc] font-display text-lg font-bold text-[#9e5f72]">{selected.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><h3 className="mt-4 font-display text-2xl font-semibold">{selected.name}</h3><p className="mt-1 text-[10px] text-[#786970]">{selected.email} · {selected.phone}</p><div className="mt-6 border-t border-[#eee5e7] pt-5"><p className="text-[9px] font-bold uppercase tracking-wider text-[#9e5f72]">Facturación</p><p className="mt-3 text-[10px] font-bold">{selected.billingName}</p><p className="mt-1 text-[9px] leading-4 text-[#786970]">CI/RUC: {selected.taxId}<br />{selected.billingAddress}</p></div><div className="mt-5 border-t border-[#eee5e7] pt-5"><p className="text-[9px] font-bold uppercase tracking-wider text-[#9e5f72]">Dirección de envío</p><p className="mt-3 text-[9px] leading-4 text-[#786970]">{selected.shippingAddress}</p></div><Link href="mailto:{selected.email}" className="mt-6 block rounded-full bg-[#35282d] px-5 py-3 text-center text-[9px] font-bold text-white">Contactar cliente</Link></aside></div></>;
  */
}

function PanelHeading({
  title,
  subtitle,
  action,
  onAction,
}: {
  title: string;
  subtitle: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="font-display text-4xl font-semibold">{title}</h2>
        <p className="mt-1 text-[10px] text-[#786970]">{subtitle}</p>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 rounded-full bg-[#35282d] px-4 py-2.5 text-[10px] font-bold text-white"
        >
          <Plus size={13} /> {action}
        </button>
      )}
    </div>
  );
}
function Status({ value }: { value: string }) {
  return (
    <span className="shrink-0 rounded-full bg-[#f3e7e9] px-3 py-1.5 text-[9px] font-bold text-[#9e5f72]">
      {value}
    </span>
  );
}
