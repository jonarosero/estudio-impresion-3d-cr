"use client";

import { ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseStorage } from "@/lib/firebase/client";
import { useSiteMediaStore, type MediaItem } from "@/stores/site-media-store";

const inputClass = "mt-2 w-full rounded-xl border border-[#e5d8dc] bg-white px-3 py-2.5 text-xs";

export function MediaSettings() {
  const videos = useSiteMediaStore((state) => state.tiktokVideos);
  const messages = useSiteMediaStore((state) => state.bannerMessages);
  const updateVideo = useSiteMediaStore((state) => state.updateTiktokVideo);
  const updateMessage = useSiteMediaStore((state) => state.updateBannerMessage);
  const addMessage = useSiteMediaStore((state) => state.addBannerMessage);
  const removeMessage = useSiteMediaStore((state) => state.removeBannerMessage);
  const save = useSiteMediaStore((state) => state.save);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function upload(file: File | undefined, update: (patch: Partial<MediaItem>) => void) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setMessage("La imagen no puede superar 10 MB."); return; }
    setSaving(true); setMessage("");
    try {
      const imageRef = ref(getFirebaseStorage(), `site-media/${crypto.randomUUID()}-${file.name}`);
      await uploadBytes(imageRef, file, { contentType: file.type });
      update({ image: await getDownloadURL(imageRef) });
      setMessage("Imagen cargada. Guarda los cambios para publicarla.");
    } catch (error) {
      setMessage(`No se pudo subir la imagen.${error instanceof Error ? ` ${error.message}` : ""}`);
    } finally { setSaving(false); }
  }

  async function publish() {
    setSaving(true); setMessage("");
    try { await save(); setMessage("Cambios guardados y publicados."); } catch (error) { setMessage(`No se pudieron guardar los cambios.${error instanceof Error ? ` ${error.message}` : ""}`); } finally { setSaving(false); }
  }

  function editor(item: MediaItem, update: (patch: Partial<MediaItem>) => void, label: string, onRemove?: () => void) {
    return <div key={item.id} className="rounded-2xl border border-[#e5d8dc] p-4"><div className="flex items-center justify-between gap-3"><p className="text-[10px] font-bold">{label}</p>{onRemove && <button onClick={onRemove} className="inline-flex items-center gap-1 text-[9px] font-bold text-[#9e5f72]"><Trash2 size={12} /> Eliminar</button>}</div><input value={item.title} onChange={(event) => update({ title: event.target.value })} placeholder="Título" className={inputClass} /><input value={item.href} onChange={(event) => update({ href: event.target.value })} placeholder="Enlace" className={inputClass} /><div className="mt-3 rounded-xl bg-[#faf6f6] p-3"><p className="text-[10px] font-bold">Imagen</p><label className="mt-2 block text-[9px] font-bold text-[#786970]">Pega una URL<input value={item.image} onChange={(event) => update({ image: event.target.value })} placeholder="https://..." className={inputClass} /></label><label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#c9adb5] bg-white px-3 py-2.5 text-xs text-[#786970]"><ImagePlus size={14} /> Subir archivo<input type="file" accept="image/*" className="sr-only" onChange={(event) => void upload(event.target.files?.[0], update)} /></label></div></div>;
  }

  return <div className="mt-8"><div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#fffdfb] p-4"><p className="text-[10px] text-[#786970]">Edita el contenido y publícalo cuando esté listo.</p><button onClick={() => void publish()} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#35282d] px-4 py-2.5 text-[10px] font-bold text-white disabled:opacity-50"><Save size={13} /> {saving ? "Guardando..." : "Guardar cambios"}</button>{message && <p className="w-full text-[10px] font-bold text-[#52704b]">{message}</p>}</div><div className="grid gap-6 xl:grid-cols-2"><section><div className="flex items-end justify-between gap-3"><div><h3 className="font-display text-3xl font-semibold">Carrusel principal</h3><p className="mt-1 text-[10px] text-[#786970]">Agrega, edita o elimina mensajes del banner.</p></div><button onClick={addMessage} className="inline-flex items-center gap-1 rounded-full border border-[#d8c9cd] px-3 py-2 text-[9px] font-bold"><Plus size={12} /> Agregar</button></div><div className="mt-4 space-y-3">{messages.map((item) => editor(item, (patch) => updateMessage(item.id, patch), "Mensaje de banner", () => removeMessage(item.id)))}</div>{!messages.length && <p className="mt-4 rounded-xl bg-[#fffdfb] p-4 text-[10px] text-[#786970]">No hay mensajes personalizados. Agrega uno para mostrarlo en el banner.</p>}</section><section><h3 className="font-display text-3xl font-semibold">Videos de TikTok</h3><p className="mt-1 text-[10px] text-[#786970]">Edita título, enlace e imagen de cada video mostrado en la portada.</p><div className="mt-4 space-y-3">{videos.map((item) => editor(item, (patch) => updateVideo(item.id, patch), "Video"))}</div></section></div></div>;
}
