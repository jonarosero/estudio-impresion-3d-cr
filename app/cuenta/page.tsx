import Link from "next/link";
import { Heart, Package, Settings, ShoppingBag } from "lucide-react";

export const metadata = { title: "Mi cuenta" };

export default function AccountPage() {
  return (
    <main className="page-shell py-12 sm:py-16">
      <div className="rounded-[30px] bg-[#ead7dc] p-8 sm:p-12"><p className="eyebrow">Mi espacio</p><h1 className="mt-3 font-display text-5xl font-semibold">Hola, Carolina</h1><p className="mt-3 text-sm text-[#66575d]">Aqui encontraras tus pedidos y piezas guardadas.</p></div>
      <div className="mt-7 grid gap-4 md:grid-cols-4">{[{ icon: Package, title: "Pedidos", value: "2 activos" }, { icon: Heart, title: "Favoritos", value: "5 piezas" }, { icon: ShoppingBag, title: "Carrito", value: "Continuar" }, { icon: Settings, title: "Perfil", value: "Editar datos" }].map((item) => <div key={item.title} className="rounded-3xl bg-[#fffdfb] p-6"><item.icon size={20} className="text-[#9e5f72]" /><p className="mt-7 text-xs font-bold">{item.title}</p><p className="mt-1 font-display text-2xl font-semibold">{item.value}</p></div>)}</div>
      <section className="mt-8 rounded-[28px] bg-[#fffdfb] p-7 sm:p-10"><div className="flex items-center justify-between"><div><p className="eyebrow">Pedido reciente</p><h2 className="mt-2 font-display text-3xl font-semibold">CR-00241</h2></div><span className="rounded-full bg-[#e7eee3] px-4 py-2 text-[10px] font-bold text-[#52704b]">En produccion</span></div><div className="mt-7 grid gap-4 border-t border-[#e5d8dc] pt-6 text-sm sm:grid-cols-4"><div><span className="text-[10px] text-[#786970]">Fecha</span><p className="mt-1 font-bold">18 ago 2026</p></div><div><span className="text-[10px] text-[#786970]">Productos</span><p className="mt-1 font-bold">2 piezas</p></div><div><span className="text-[10px] text-[#786970]">Total</span><p className="mt-1 font-bold">$43,50</p></div><div className="sm:text-right"><Link href="#" className="text-xs font-bold text-[#9e5f72]">Ver detalle</Link></div></div></section>
    </main>
  );
}
