"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

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

const initialPromotions: Promotion[] = [
  {
    id: "welcome",
    title: "Bienvenida C&R",
    message: "10% para descubrir tu primera pieza.",
    code: "HOLA10",
    value: "10%",
    productName: "Maceta Onda",
    productSlug: "maceta-onda",
    productPrice: 18.5,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1600&q=90",
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
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1600&q=90",
    active: true,
  },
  {
    id: "shipping",
    title: "Envio especial",
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
  toggle: (id: string) => void;
};

export const usePromotionStore = create<PromotionState>()(
  persist(
    (set) => ({
      promotions: initialPromotions,
      toggle: (id) =>
        set((state) => ({
          promotions: state.promotions.map((promotion) =>
            promotion.id === id ? { ...promotion, active: !promotion.active } : promotion,
          ),
        })),
    }),
    { name: "cr-promotions" },
  ),
);
