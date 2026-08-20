import Link from "next/link";
import { ArrowRight, MapPin, PackageCheck, Scale, Truck } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="relative flex min-h-[430px] flex-col justify-between overflow-hidden bg-[#35282d] p-7 text-white sm:p-10 lg:min-h-full lg:p-12">
      <div className="absolute -right-24 -top-24 size-80 rounded-full border-[56px] border-[#c98698]/15" />
      <div className="absolute bottom-[-90px] left-[-50px] size-64 rounded-full bg-[#c98698]/10" />

      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#eccbd3]">
          <Truck size={13} /> Entregas C&R
        </span>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-white/45">En compras desde</p>
        <div className="mt-1 flex items-end gap-3">
          <span className="font-display text-[clamp(6rem,12vw,10rem)] font-semibold leading-[0.75] tracking-[-0.08em] text-[#eccbd3]">$60</span>
          <span className="mb-1 max-w-28 text-sm font-bold leading-5">tu envio es gratis</span>
        </div>
      </div>

      <div className="relative mt-10 grid gap-2 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <MapPin size={17} className="text-[#eccbd3]" />
          <p className="mt-4 text-xs font-bold">Entrega local gratis</p>
          <p className="mt-1 text-[10px] leading-4 text-white/45">La Libertad, Salinas y cantón Santa Elena, sin compra minima.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <Scale size={17} className="text-[#eccbd3]" />
          <p className="mt-4 text-xs font-bold">Resto del Ecuador</p>
          <p className="mt-1 text-[10px] leading-4 text-white/45">Calculamos la tarifa de Servientrega según destino y peso.</p>
        </div>
      </div>

      <div className="relative mt-6 flex items-center justify-between gap-4 rounded-2xl bg-[#fffdfb] p-4 text-[#35282d]">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-[#f3e7e9] text-[#9e5f72]"><PackageCheck size={17} /></span>
          <div><p className="text-[10px] font-bold">Conoce el costo antes de pagar</p><p className="mt-0.5 text-[9px] text-[#786970]">Ingresa tu ciudad en el checkout.</p></div>
        </div>
        <Link href="/catalogo" className="grid size-10 shrink-0 place-items-center rounded-full bg-[#35282d] text-white" aria-label="Explorar catalogo">
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
