"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MediaItem = { id: string; title: string; image: string; href: string };

type SiteMediaState = {
  tiktokVideos: MediaItem[];
  bannerMessages: MediaItem[];
  updateTiktokVideo: (id: string, patch: Partial<MediaItem>) => void;
  updateBannerMessage: (id: string, patch: Partial<MediaItem>) => void;
};

const tiktokVideos: MediaItem[] = [
  { id: "filamento", title: "De filamento a florero", image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/hjjmt/gradio_api/file=/tmp/gradio/a37134125379cc2806527617cf2d12cee3cefb23b8f9f4bfcbb7ffc098debca2/image.webp", href: "https://www.tiktok.com/@estudio3dcr" },
  { id: "colores", title: "Probando nuevos colores", image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/hjjmt/gradio_api/file=/tmp/gradio/a37134125379cc2806527617cf2d12cee3cefb23b8f9f4bfcbb7ffc098debca2/image.webp", href: "https://www.tiktok.com/@estudio3dcr" },
  { id: "modelo", title: "Modelo nuevo en camino", image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/hjjmt/gradio_api/file=/tmp/gradio/a37134125379cc2806527617cf2d12cee3cefb23b8f9f4bfcbb7ffc098debca2/image.webp", href: "https://www.tiktok.com/@estudio3dcr" },
];

const bannerMessages: MediaItem[] = [
  { id: "local", title: "Santa Elena sin mínimo", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85", href: "/catalogo" },
  { id: "nacional", title: "Cotiza antes de pagar", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85", href: "/checkout" },
];

function update(items: MediaItem[], id: string, patch: Partial<MediaItem>) {
  return items.map((item) => item.id === id ? { ...item, ...patch } : item);
}

export const useSiteMediaStore = create<SiteMediaState>()(persist((set) => ({
  tiktokVideos,
  bannerMessages,
  updateTiktokVideo: (id, patch) => set((state) => ({ tiktokVideos: update(state.tiktokVideos, id, patch) })),
  updateBannerMessage: (id, patch) => set((state) => ({ bannerMessages: update(state.bannerMessages, id, patch) })),
}), { name: "jj-site-media" }));
