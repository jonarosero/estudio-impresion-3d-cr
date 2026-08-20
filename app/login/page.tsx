import Link from "next/link";
import { ArrowRight, Box, CircleUserRound, ShieldCheck } from "lucide-react";

export const metadata = { title: "Iniciar sesion" };

export default function LoginPage() {
  return (
    <main className="page-shell py-12 sm:py-20">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[30px] bg-[#fffdfb] soft-shadow md:grid-cols-2">
        <div className="relative hidden min-h-[580px] overflow-hidden bg-[#d8b9c2] p-12 md:block"><div className="absolute -bottom-24 -right-20 size-96 rounded-full bg-[#9e5f72]/20" /><div className="relative"><span className="grid size-14 place-items-center rounded-2xl bg-[#35282d] text-white"><Box size={24} /></span><p className="eyebrow mt-12">Tu espacio C&R</p><h1 className="mt-4 font-display text-6xl font-semibold leading-[0.9]">Tus piezas favoritas, siempre cerca.</h1><p className="mt-6 max-w-sm text-sm leading-7 text-[#5f4b53]">Guarda favoritos, revisa pedidos y continua tus compras de forma sencilla.</p></div><div className="absolute bottom-10 left-12 right-12 flex items-center gap-3 rounded-2xl bg-white/35 p-4 text-xs text-[#5f4b53] backdrop-blur"><ShieldCheck size={18} /> Acceso protegido por Google y Firebase Authentication.</div></div>
        <div className="flex min-h-[520px] flex-col justify-center p-7 sm:p-12">
          <p className="eyebrow">Bienvenida</p><h2 className="mt-3 font-display text-5xl font-semibold">Entra a tu cuenta</h2><p className="mt-4 text-sm leading-6 text-[#786970]">Usaremos Google para que no tengas que recordar otra contrasena.</p>
          <Link href="/cuenta" className="mt-9 flex w-full items-center justify-center gap-3 rounded-full border border-[#d8c9cd] bg-white px-6 py-4 text-sm font-bold transition hover:bg-[#f3e7e9]"><CircleUserRound size={18} /> Continuar con Google</Link>
          <div className="my-7 flex items-center gap-3 text-[10px] text-[#a09398]"><span className="h-px flex-1 bg-[#e5d8dc]" />PROTOTIPO VISUAL<span className="h-px flex-1 bg-[#e5d8dc]" /></div>
          <Link href="/dashboard" className="group flex items-center justify-between rounded-2xl bg-[#35282d] p-5 text-white"><div><span className="text-xs font-bold">Vista administrativa</span><p className="mt-1 text-[10px] text-white/50">Acceso de demostracion</p></div><ArrowRight className="transition group-hover:translate-x-1" size={17} /></Link>
          <p className="mt-7 text-center text-[10px] leading-5 text-[#91848a]">Al continuar aceptas nuestros terminos y politica de privacidad. Firebase se conectara en la fase funcional.</p>
        </div>
      </div>
    </main>
  );
}
