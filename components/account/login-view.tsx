"use client";

import { Box, CircleUserRound, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { useAccountStore } from "@/stores/account-store";

export function LoginView() {
  const router = useRouter();
  const signIn = useAccountStore((state) => state.signIn);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSignIn() {
    setError("");
    setPending(true);
    try {
      await signIn();
      router.push("/cuenta");
    } catch {
      setError("No fue posible iniciar sesion con Google. Intentalo nuevamente.");
    } finally {
      setPending(false);
    }
  }

  return <main className="page-shell py-12 sm:py-20"><div className="mx-auto grid max-w-5xl overflow-hidden rounded-[30px] bg-[#fffdfb] soft-shadow md:grid-cols-2"><div className="relative hidden min-h-[580px] overflow-hidden bg-[#d8b9c2] p-12 md:block"><div className="absolute -bottom-24 -right-20 size-96 rounded-full bg-[#9e5f72]/20" /><div className="relative"><span className="grid size-14 place-items-center rounded-2xl bg-[#35282d] text-white"><Box size={24} /></span><p className="eyebrow mt-12">Tu espacio J&J</p><h1 className="mt-4 font-display text-6xl font-semibold leading-[0.9]">Tus piezas favoritas, siempre cerca.</h1><p className="mt-6 max-w-sm text-sm leading-7 text-[#5f4b53]">Guarda favoritos, revisa pedidos y continúa tus compras de forma sencilla.</p></div><div className="absolute bottom-10 left-12 right-12 flex items-center gap-3 rounded-2xl bg-white/35 p-4 text-xs text-[#5f4b53] backdrop-blur"><ShieldCheck size={18} /> Acceso protegido por Google y Firebase Authentication.</div></div><div className="flex min-h-[520px] flex-col justify-center p-7 sm:p-12"><p className="eyebrow">Bienvenida</p><h2 className="mt-3 font-display text-5xl font-semibold">Entra a tu cuenta</h2><p className="mt-4 text-sm leading-6 text-[#786970]">Usaremos Google para que no tengas que recordar otra contraseña.</p><button onClick={handleSignIn} disabled={!isFirebaseConfigured || pending} className="mt-9 flex w-full items-center justify-center gap-3 rounded-full border border-[#d8c9cd] bg-white px-6 py-4 text-sm font-bold transition hover:bg-[#f3e7e9] disabled:cursor-not-allowed disabled:opacity-50"><CircleUserRound size={18} />{pending ? "Abriendo Google..." : "Continuar con Google"}</button>{!isFirebaseConfigured && <p className="mt-3 text-xs text-red-700">Firebase aun no esta configurado en este entorno.</p>}{error && <p className="mt-3 text-xs text-red-700">{error}</p>}<p className="mt-8 text-xs leading-5 text-[#786970]">Los accesos administrativos se asignan de forma segura desde Firebase Admin.</p></div></div></main>;
}
