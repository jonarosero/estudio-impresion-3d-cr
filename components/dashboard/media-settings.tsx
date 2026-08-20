"use client";

import { ImagePlus } from "lucide-react";
import { useSiteMediaStore, type MediaItem } from "@/stores/site-media-store";

const inputClass = "mt-2 w-full rounded-xl border border-[#e5d8dc] bg-white px-3 py-2.5 text-xs";

export function MediaSettings() {
  const videos = useSiteMediaStore((state) => state.tiktokVideos);
  const messages = useSiteMediaStore((state) => state.bannerMessages);
  const updateVideo = useSiteMediaStore((state) => state.updateTiktokVideo);
  const updateMessage = useSiteMediaStore((state) => state.updateBannerMessage);

  function upload(file: File | undefined, update: (patch: Partial<MediaItem>) => void) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update({ image: String(reader.result) });
    reader.readAsDataURL(file);
  }

  function editor(item: MediaItem, update: (patch: Partial<MediaItem>) => void, label: string) {
    return <div key={item.id} className="rounded-2xl border border-[#e5d8dc] p-4"><p className="text-[10px] font-bold">{label}</p><input value={item.title} onChange={(event) => update({ title: event.target.value })} placeholder="Título" className={inputClass} /><input value={item.href} onChange={(event) => update({ href: event.target.value })} placeholder="Enlace" className={inputClass} /><div className="mt-3 rounded-xl bg-[#faf6f6] p-3"><p className="text-[10px] font-bold">Imagen: elige una opción</p><label className="mt-2 block text-[9px] font-bold text-[#786970]">1. Pega la URL de la imagen<input value={item.image} onChange={(event) => update({ image: event.target.value })} placeholder="https://..." className={inputClass} /></label><label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#c9adb5] bg-white px-3 py-2.5 text-xs text-[#786970]"><ImagePlus size={14} /> 2. O sube un archivo<input type="file" accept="image/*" className="sr-only" onChange={(event) => upload(event.target.files?.[0], update)} /></label></div></div>;
  }

  return <div className="mt-8 grid gap-6 xl:grid-cols-2"><section><h3 className="font-display text-3xl font-semibold">Carrusel principal</h3><p className="mt-1 text-[10px] text-[#786970]">Edita las imágenes y enlaces de los mensajes de entrega. Las promociones se gestionan en su panel.</p><div className="mt-4 space-y-3">{messages.map((item) => editor(item, (patch) => updateMessage(item.id, patch), "Mensaje de banner"))}</div></section><section><h3 className="font-display text-3xl font-semibold">Videos de TikTok</h3><p className="mt-1 text-[10px] text-[#786970]">Edita título, enlace e imagen de cada video mostrado en la portada.</p><div className="mt-4 space-y-3">{videos.map((item) => editor(item, (patch) => updateVideo(item.id, patch), "Video"))}</div></section></div>;
}
