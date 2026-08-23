"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Music2, Play, Sparkles } from "lucide-react";
import { useState } from "react";
import { useSiteMediaStore } from "@/stores/site-media-store";

const fallbackImages = [
  "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85",
];

export function TiktokShowcase() {
  const videos = useSiteMediaStore((state) => state.tiktokVideos);
  const [failedImages, setFailedImages] = useState<string[]>([]);

  return (
    <section id="proceso" className="bg-[#f7f3f3]">
      <div className="page-shell py-20 sm:py-28">
        <div className="grid overflow-hidden rounded-[30px] bg-[#35282d] text-white lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative flex flex-col justify-center p-8 sm:p-14 lg:p-16">
            <Music2 className="absolute right-8 top-8 size-28 rotate-12 text-[#eccbd3]/10" strokeWidth={1} />
            <p className="eyebrow !text-[#eccbd3]">Detrás de cada capa</p>
            <h2 className="mt-4 max-w-lg font-display text-5xl font-semibold leading-[0.92] sm:text-7xl">Mira cómo nacen nuestras piezas.</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/60">En TikTok compartimos el proceso de impresión, pruebas de color, acabados y modelos nuevos antes de que lleguen a la tienda.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={videos[0]?.href ?? "https://www.tiktok.com"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#eccbd3] px-6 py-3.5 text-sm font-bold text-[#35282d]"><Music2 size={16} /> Síguenos en TikTok</a>
              <Link href="/personalizados" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-bold">Proponer una idea <ArrowRight size={15} /></Link>
            </div>
            <div className="mt-10 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-white/35"><Sparkles size={14} className="text-[#eccbd3]" /> Nuevos videos cada semana</div>
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-white/10 bg-white/5 p-4 sm:gap-4 sm:p-7 lg:border-l lg:border-t-0">
            {videos.map((video, index) => {
              const image = failedImages.includes(video.id) ? fallbackImages[index % fallbackImages.length] : video.image;
              return <a key={video.id} href={video.href} target="_blank" rel="noreferrer" className={`group relative min-h-[330px] overflow-hidden rounded-[22px] sm:min-h-[450px] ${index === 1 ? "translate-y-5" : ""}`}>
                <Image src={image} alt={video.title} fill sizes="(max-width: 1024px) 33vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" onError={() => setFailedImages((current) => current.includes(video.id) ? current : [...current, video.id])} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
                <span className="absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-white/85 text-[#35282d]"><Play size={13} fill="currentColor" /></span>
                <div className="absolute bottom-4 left-4 right-4"><p className="text-[9px] font-bold uppercase tracking-wider text-[#eccbd3]">Video 0{index + 1}</p><p className="mt-1 font-display text-base font-semibold leading-tight sm:text-xl">{video.title}</p></div>
              </a>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
