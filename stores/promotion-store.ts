"use client";

import { create } from "zustand";
import { doc, updateDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

export type Promotion = {
  id: string;
  title: string;
  message: string;
  code: string;
  value: string;
  productName: string;
  productSlug: string;
  productPrice: number;
  image: string;
  active: boolean;
};

export const initialPromotions: Promotion[] = [
  {
    id: "welcome",
    title: "Bienvenida J&J",
    message: "10% para descubrir tu primera pieza.",
    code: "HOLA10",
    value: "10%",
    productName: "Maceta Onda",
    productSlug: "maceta-onda",
    productPrice: 18.5,
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/hjjmt/gradio_api/file=/tmp/gradio/a37134125379cc2806527617cf2d12cee3cefb23b8f9f4bfcbb7ffc098debca2/image.webp",
    active: true,
  },
  {
    id: "weekly-vase",
    title: "Florero de la semana",
    message: "Una forma especial con 15% de descuento.",
    code: "PLIEGUE15",
    value: "15%",
    productName: "Florero Pliegue",
    productSlug: "florero-pliegue",
    productPrice: 24,
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/hjjmt/gradio_api/file=/tmp/gradio/a37134125379cc2806527617cf2d12cee3cefb23b8f9f4bfcbb7ffc098debca2/image.webp",
    active: true,
  },
  {
    id: "shipping",
    title: "Envío especial",
    message: "Entrega nacional a precio reducido.",
    code: "ENVIOCR",
    value: "$3,50",
    productName: "Organizador Nube",
    productSlug: "organizador-nube",
    productPrice: 16.9,
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1600&q=90",
    active: false,
  },
];

type PromotionState = {
  promotions: Promotion[];
  replace: (promotions: Promotion[]) => void;
  toggle: (id: string) => Promise<void>;
};

export const usePromotionStore = create<PromotionState>()((set) => ({
  promotions: initialPromotions,
  replace: (promotions) => set({ promotions }),
  toggle: async (id) => {
    const promotion = usePromotionStore.getState().promotions.find((item) => item.id === id);
    if (!promotion) return;
    await updateDoc(doc(getFirebaseDb(), "promotions", id), { active: !promotion.active, status: promotion.active ? "inactive" : "active" });
  },
}));
