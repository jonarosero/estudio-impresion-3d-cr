"use client";

import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { useSiteMediaStore, type MediaItem } from "@/stores/site-media-store";

const inputClass = "mt-2 w-full rounded-xl border border-[#e5d8dc] bg-white px-3 py-2.5 text-xs";

export function MediaSettings() {
  const videos = useSiteMediaStore((state) => state.tiktokVideos);
  const messages = useSiteMediaStore((state) => state.bannerMessages);
  const updateVideo = useSiteMediaStore((state) => state.updateTiktokVideo);
  const updateMessage = useSiteMediaStore((state) => state.updateBannerMessage);
  const addMessage = useSiteMediaStore((state) => state.addBannerMessage);
  const removeMessage = useSiteMediaStore((state) => state.removeBannerMessage);

  function upload(file: File | undefined, update: (patch: Partial<MediaItem>) => void) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update({ image: String(reader.result) });
    reader.readAsDataURL(file);
  }

  function editor(item: MediaItem, update: (patch: Partial<MediaItem>) => void, label: string, onRemove?: () => void) {
    return <div key={item.id} className="rounded-2xl border border-[#e5d8dc] p-4"><div className="flex items-center justify-between gap-3"><p className="text-[10px] font-bold">{label}</p>{onRemove && <button onClick={onRemove} className="inline-flex items-center gap-1 text-[9px] font-bold text-[#9e5f72]"><Trash2 size={12} /> Eliminar</button>}</div><input value={item.title} onChange={(event) => update({ title: event.target.value })} placeholder="Título" className={inputClass} /><input value={item.href} onChange={(event) => update({ href: event.target.value })} placeholder="Enlace" className={inputClass} /><div className="mt-3 rounded-xl bg-[#faf6f6] p-3"><p className="text-[10px] font-bold">Imagen: elige una opción</p><label className="mt-2 block text-[9px] font-bold text-[#786970]">1. Pega la URL de la imagen<input value={item.image} onChange={(event) => update({ image: event.target.value })} placeholder="https://..." className={inputClass} /></label><label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#c9adb5] bg-white px-3 py-2.5 text-xs text-[#786970]"><ImagePlus size={14} /> 2. O sube un archivo<input type="file" accept="image/*" className="sr-only" onChange={(event) => upload(event.target.files?.[0], update)} /></label></div></div>;
  }

  return <div className="mt-8 grid gap-6 xl:grid-cols-2"><section><div className="flex items-end justify-between gap-3"><div><h3 className="font-display text-3xl font-semibold">Carrusel principal</h3><p className="mt-1 text-[10px] text-[#786970]">Agrega, edita o elimina mensajes del banner.</p></div><button onClick={addMessage} className="inline-flex items-center gap-1 rounded-full border border-[#d8c9cd] px-3 py-2 text-[9px] font-bold"><Plus size={12} /> Agregar</button></div><div className="mt-4 space-y-3">{messages.map((item) => editor(item, (patch) => updateMessage(item.id, patch), "Mensaje de banner", () => removeMessage(item.id)))}</div>{!messages.length && <p className="mt-4 rounded-xl bg-[#fffdfb] p-4 text-[10px] text-[#786970]">No hay mensajes personalizados. Agrega uno para mostrarlo en el banner.</p>}</section><section><h3 className="font-display text-3xl font-semibold">Videos de TikTok</h3><p className="mt-1 text-[10px] text-[#786970]">Edita título, enlace e imagen de cada video mostrado en la portada.</p><div className="mt-4 space-y-3">{videos.map((item) => editor(item, (patch) => updateVideo(item.id, patch), "Video"))}</div></section></div>;
}
