"use client";

import Link from "next/link";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirebaseDb } from "@/lib/firebase/client";
import { useAccountStore } from "@/stores/account-store";

export function OnboardingGate({ children }: Readonly<{ children: React.ReactNode }>) {
  const account = useAccountStore((state) => state.account);
  const [required, setRequired] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [details, setDetails] = useState({ billingName: "", taxId: "", billingAddress: "", shippingAddress: "", city: "", phone: "" });

  useEffect(() => {
    if (!account) return;
    return onSnapshot(doc(getFirebaseDb(), "users", account.id), (snapshot) => {
      const profile = snapshot.data();
      setRequired(!profile?.policyAcceptedAt);
      setDetails((current) => ({ ...current, billingName: profile?.billingName ?? account.name, taxId: profile?.taxId ?? "", billingAddress: profile?.billingAddress ?? "", shippingAddress: profile?.shippingAddress ?? "", city: profile?.city ?? "", phone: profile?.phone ?? "" }));
    });
  }, [account]);

  async function finish() {
    if (!account || !accepted || !details.billingName || !details.shippingAddress || !details.city || !details.phone) return;
    setSaving(true);
    await setDoc(doc(getFirebaseDb(), "users", account.id), { ...details, policyAcceptedAt: new Date().toISOString(), policyVersion: "2026-08-21", updatedAt: new Date().toISOString() }, { merge: true });
    setSaving(false);
  }

  return <>{children}{account && required && <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#35282d]/55 p-4 backdrop-blur-sm"><div className="mx-auto my-8 max-w-2xl rounded-[28px] bg-[#fffdfb] p-6 shadow-2xl sm:p-10"><p className="eyebrow">Antes de continuar</p><h2 className="mt-3 font-display text-4xl font-semibold">Tus datos y tu privacidad</h2><p className="mt-4 text-sm leading-6 text-[#786970]">Usamos tus datos para facturación, entregas, pedidos y cotizaciones. Este portal no almacena datos de tarjetas ni cuentas bancarias; los pagos se procesarán mediante un proveedor autorizado.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><input value={details.billingName} onChange={(event) => setDetails({ ...details, billingName: event.target.value })} className="rounded-xl border border-[#ded0d4] px-4 py-3 text-sm sm:col-span-2" placeholder="Nombre o razón social" /><input value={details.taxId} onChange={(event) => setDetails({ ...details, taxId: event.target.value })} className="rounded-xl border border-[#ded0d4] px-4 py-3 text-sm" placeholder="Cédula o RUC" /><input value={details.phone} onChange={(event) => setDetails({ ...details, phone: event.target.value })} className="rounded-xl border border-[#ded0d4] px-4 py-3 text-sm" placeholder="Teléfono" /><input value={details.billingAddress} onChange={(event) => setDetails({ ...details, billingAddress: event.target.value })} className="rounded-xl border border-[#ded0d4] px-4 py-3 text-sm sm:col-span-2" placeholder="Dirección de facturación" /><input value={details.shippingAddress} onChange={(event) => setDetails({ ...details, shippingAddress: event.target.value })} className="rounded-xl border border-[#ded0d4] px-4 py-3 text-sm" placeholder="Dirección de envío" /><input value={details.city} onChange={(event) => setDetails({ ...details, city: event.target.value })} className="rounded-xl border border-[#ded0d4] px-4 py-3 text-sm" placeholder="Ciudad o cantón" /></div><label className="mt-6 flex items-start gap-3 text-xs leading-5 text-[#66575d]"><input checked={accepted} onChange={(event) => setAccepted(event.target.checked)} type="checkbox" className="mt-1 accent-[#9e5f72]" />Acepto la <Link href="/privacidad" target="_blank" className="font-bold text-[#9e5f72] underline">política de protección y tratamiento de datos</Link>.</label><button onClick={() => void finish()} disabled={saving || !accepted || !details.billingName || !details.shippingAddress || !details.city || !details.phone} className="mt-6 w-full rounded-full bg-[#35282d] px-6 py-4 text-sm font-bold text-white disabled:opacity-40">{saving ? "Guardando..." : "Acepto y continuar"}</button></div></div>}</>;
}
