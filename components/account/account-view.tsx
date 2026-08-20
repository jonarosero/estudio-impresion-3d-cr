"use client";

import Link from "next/link";
import { Heart, Package, Settings, ShoppingBag } from "lucide-react";
import { collection, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirebaseDb } from "@/lib/firebase/client";
import { useAccountStore } from "@/stores/account-store";

type Profile = {
  billingName: string; taxId: string; billingEmail: string; billingAddress: string;
  shippingAddress: string; province: string; city: string; phone: string; postalCode: string; reference: string;
};

const emptyProfile: Profile = { billingName: "", taxId: "", billingEmail: "", billingAddress: "", shippingAddress: "", province: "", city: "", phone: "", postalCode: "", reference: "" };
const fieldClass = "rounded-xl border border-[#ded0d4] bg-white px-4 py-3 text-xs";

export function AccountView() {
  const account = useAccountStore((state) => state.account);
  const isLoading = useAccountStore((state) => state.isLoading);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [orders, setOrders] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!account) return;
    const db = getFirebaseDb();
    const unsubscribeProfile = onSnapshot(doc(db, "users", account.id), (snapshot) => setProfile({ ...emptyProfile, ...(snapshot.data() ?? {}) }));
    const unsubscribeOrders = onSnapshot(query(collection(db, "orders"), where("userId", "==", account.id)), (snapshot) => setOrders(snapshot.size));
    return () => { unsubscribeProfile(); unsubscribeOrders(); };
  }, [account]);

  if (isLoading) return <main className="page-shell py-20 text-center text-sm text-[#786970]">Cargando tu cuenta...</main>;
  if (!account) return <main className="page-shell py-20 text-center"><h1 className="font-display text-4xl font-semibold">Inicia sesión para ver tu cuenta</h1><Link href="/login" className="mt-6 inline-block rounded-full bg-[#35282d] px-6 py-3 text-xs font-bold text-white">Continuar con Google</Link></main>;

  const currentAccount = account;
  const firstName = account.name.split(" ")[0] || "cliente";
  const updateProfile = (key: keyof Profile, value: string) => setProfile((current) => ({ ...current, [key]: value }));
  async function saveProfile() {
    await setDoc(doc(getFirebaseDb(), "users", currentAccount.id), { ...profile, name: currentAccount.name, email: currentAccount.email, updatedAt: new Date().toISOString() }, { merge: true });
    setSaved(true);
  }

  return <main className="page-shell py-12 sm:py-16"><div className="rounded-[30px] bg-[#ead7dc] p-8 sm:p-12"><p className="eyebrow">Mi espacio</p><h1 className="mt-3 font-display text-5xl font-semibold">Hola, {firstName}</h1><p className="mt-3 text-sm text-[#66575d]">{account.email}</p></div><div className="mt-7 grid gap-4 md:grid-cols-4">{[{ icon: Package, title: "Pedidos", value: orders ? `${orders} ${orders === 1 ? "pedido" : "pedidos"}` : "Sin pedidos" }, { icon: Heart, title: "Favoritos", value: "Sin favoritos" }, { icon: ShoppingBag, title: "Carrito", value: "Continuar" }, { icon: Settings, title: "Perfil", value: "Editar datos" }].map((item) => <div key={item.title} className="rounded-3xl bg-[#fffdfb] p-6"><item.icon size={20} className="text-[#9e5f72]" /><p className="mt-7 text-xs font-bold">{item.title}</p><p className="mt-1 font-display text-2xl font-semibold">{item.value}</p></div>)}</div><section className="mt-8 rounded-[28px] bg-[#fffdfb] p-7 sm:p-10"><p className="eyebrow">Pedidos</p><h2 className="mt-2 font-display text-3xl font-semibold">{orders ? "Tus pedidos" : "Aún no tienes pedidos"}</h2><p className="mt-3 text-sm text-[#786970]">{orders ? "Tus pedidos se actualizan automáticamente desde Firebase." : "Cuando completes una compra, aparecerá aquí."}</p></section><section className="mt-8 rounded-[28px] bg-[#fffdfb] p-7 sm:p-10"><p className="eyebrow">Datos de compra</p><h2 className="mt-2 font-display text-4xl font-semibold">Facturación y envío</h2><form onSubmit={(event) => { event.preventDefault(); void saveProfile(); }} className="mt-8 grid gap-7 lg:grid-cols-2"><fieldset className="rounded-2xl bg-[#faf6f6] p-5"><legend className="px-2 text-xs font-bold">Información de facturación</legend><div className="mt-3 grid gap-3"><input value={profile.billingName} onChange={(event) => updateProfile("billingName", event.target.value)} className={fieldClass} placeholder="Nombre o razón social" /><input value={profile.taxId} onChange={(event) => updateProfile("taxId", event.target.value)} className={fieldClass} placeholder="Cédula o RUC" /><input value={profile.billingEmail} onChange={(event) => updateProfile("billingEmail", event.target.value)} className={fieldClass} placeholder="Correo para factura" /><textarea value={profile.billingAddress} onChange={(event) => updateProfile("billingAddress", event.target.value)} className={`${fieldClass} resize-none`} rows={3} placeholder="Dirección de facturación" /></div></fieldset><fieldset className="rounded-2xl bg-[#faf6f6] p-5"><legend className="px-2 text-xs font-bold">Dirección de envío</legend><div className="mt-3 grid gap-3 sm:grid-cols-2"><input value={profile.shippingAddress} onChange={(event) => updateProfile("shippingAddress", event.target.value)} className={`${fieldClass} sm:col-span-2`} placeholder="Dirección y número de casa" /><input value={profile.province} onChange={(event) => updateProfile("province", event.target.value)} className={fieldClass} placeholder="Provincia" /><input value={profile.city} onChange={(event) => updateProfile("city", event.target.value)} className={fieldClass} placeholder="Ciudad o cantón" /><input value={profile.phone} onChange={(event) => updateProfile("phone", event.target.value)} className={fieldClass} placeholder="Teléfono" /><input value={profile.postalCode} onChange={(event) => updateProfile("postalCode", event.target.value)} className={fieldClass} placeholder="Código postal opcional" /><textarea value={profile.reference} onChange={(event) => updateProfile("reference", event.target.value)} className={`${fieldClass} resize-none sm:col-span-2`} rows={2} placeholder="Referencia para la entrega" /></div></fieldset><div className="lg:col-span-2"><button className="rounded-full bg-[#35282d] px-7 py-3.5 text-xs font-bold text-white">Guardar información</button>{saved && <span className="ml-3 text-xs text-[#52704b]">Guardado en Firebase.</span>}</div></form></section></main>;
}
