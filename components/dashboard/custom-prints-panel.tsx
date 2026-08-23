"use client";

import Image from "next/image";
import { ImagePlus, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { getFirebaseStorage, isFirebaseConfigured } from "@/lib/firebase/client";
import type { CustomPrint } from "@/lib/types";
import { useCustomPrintStore } from "@/stores/custom-print-store";

const emptyPrint = { title: "", description: "", image: "" };
const inputClass = "mt-2 w-full rounded-xl border border-[#e5d8dc] bg-white px-4 py-3 text-xs";

export function CustomPrintsPanel() {
  const prints = useCustomPrintStore((state) => state.prints);
  const add = useCustomPrintStore((state) => state.add);
  const update = useCustomPrintStore((state) => state.update);
  const remove = useCustomPrintStore((state) => state.remove);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyPrint);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function edit(print: CustomPrint) {
    setEditingId(print.id);
    setDraft({ title: print.title, description: print.description, image: print.image });
    setMessage("");
  }

  async function uploadImage(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      setMessage("Selecciona una imagen de hasta 10 MB.");
      return;
    }
    if (!isFirebaseConfigured) {
      setMessage("Firebase Storage no está configurado.");
      return;
    }
    try {
      setSaving(true);
      const imageRef = ref(getFirebaseStorage(), `custom-prints/${crypto.randomUUID()}/${crypto.randomUUID()}`);
      await uploadBytes(imageRef, file, { contentType: file.type });
      setDraft((current) => ({ ...current, image: await getDownloadURL(imageRef) }));
      setMessage("");
    } catch {
      setMessage("No se pudo subir la imagen. Confirma tus permisos de administrador.");
    } finally {
      setSaving(false);
    }
  }

  async function save() {
    if (!draft.title.trim() || !draft.description.trim() || !draft.image) {
      setMessage("Completa título, descripción e imagen.");
      return;
    }
    try {
      setSaving(true);
      setMessage("");
      if (editingId) await update(editingId, draft);
      else await add(draft);
      setEditingId(null);
      setDraft(emptyPrint);
    } catch {
      setMessage("No se pudo guardar en Firebase.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-10 border-t border-[#e5d8dc] pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h3 className="font-display text-3xl font-semibold">Galería de personalizados</h3><p className="mt-1 text-[10px] text-[#786970]">Estas piezas se muestran en “Piezas creadas” para los clientes.</p></div>
        <button onClick={() => { setEditingId(null); setDraft(emptyPrint); setMessage(""); }} className="inline-flex items-center gap-2 rounded-full border border-[#d8c9cd] px-4 py-2 text-[10px] font-bold"><Plus size={13} /> Nueva pieza</button>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="grid gap-3 sm:grid-cols-2">
          {prints.map((print) => <article key={print.id} className="overflow-hidden rounded-2xl bg-[#fffdfb]"><div className="relative aspect-[4/3]"><Image src={print.image} alt={print.title} fill sizes="300px" className="object-cover" /></div><div className="flex items-start justify-between gap-3 p-4"><div><p className="text-xs font-bold">{print.title}</p><p className="mt-1 text-[9px] text-[#786970]">{print.description}</p></div><div className="flex gap-1"><button onClick={() => edit(print)} className="p-1.5" aria-label={`Editar ${print.title}`}><Pencil size={13} /></button><button onClick={() => void remove(print.id)} className="p-1.5 text-[#9e5f72]" aria-label={`Eliminar ${print.title}`}><Trash2 size={13} /></button></div></div></article>)}
          {!prints.length && <p className="rounded-2xl bg-[#fffdfb] p-5 text-[10px] text-[#786970]">Aún no hay piezas publicadas. Agrega la primera desde este panel.</p>}
        </div>
        <div className="rounded-2xl bg-[#fffdfb] p-5"><p className="text-xs font-bold">{editingId ? "Editar pieza" : "Nueva pieza"}</p><label className="mt-4 block text-[10px] font-bold">Título<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className={inputClass} /></label><label className="mt-4 block text-[10px] font-bold">Descripción<textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} rows={3} className={inputClass} /></label><label className="mt-4 block text-[10px] font-bold">URL de imagen<input value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} className={inputClass} /></label><label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#c9adb5] bg-[#faf6f6] px-3 py-3 text-xs text-[#786970]"><ImagePlus size={14} /> Subir imagen (máx. 10 MB)<input type="file" accept="image/*" disabled={saving} className="sr-only" onChange={(event) => void uploadImage(event.target.files?.[0])} /></label><button disabled={saving} onClick={() => void save()} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#35282d] px-4 py-3 text-[10px] font-bold text-white disabled:opacity-60"><Save size={13} />{saving ? "Guardando..." : "Guardar pieza"}</button>{message && <p className="mt-3 text-[10px] text-red-700">{message}</p>}</div>
      </div>
    </section>
  );
}
