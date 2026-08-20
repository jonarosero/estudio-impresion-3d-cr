"use client";

import { create } from "zustand";

export type QuoteStatus = "new" | "reviewing" | "quoted" | "converted" | "discarded" | "completed";

export type QuoteImage = {
  id: string;
  name: string;
  url: string;
  storagePath: string;
};

export type QuoteMessage = {
  id: string;
  sender: "customer" | "admin";
  text: string;
  createdAt: string;
};

export type Quote = {
  id: string;
  customer: string;
  phone: string;
  description: string;
  dimensions: string;
  quantity: number;
  color: string;
  status: QuoteStatus;
  images: QuoteImage[];
  messages: QuoteMessage[];
  createdAt: string;
  expiresAt: string;
};

type NewQuote = Omit<Quote, "id" | "status" | "messages" | "createdAt" | "expiresAt">;

const demoQuotes: Quote[] = [
  {
    id: "Q-1042",
    customer: "Johana V.",
    phone: "099 321 4567",
    description: "Organizador modular para maquillaje y brochas.",
    dimensions: "28 x 18 cm",
    quantity: 1,
    color: "Rosa pastel",
    status: "quoted",
    images: [],
    messages: [
      { id: "m1", sender: "customer", text: "Quisiera separar las brochas de los labiales.", createdAt: "Ayer, 10:15" },
      { id: "m2", sender: "admin", text: "Podemos hacerlo en tres modulos por $32. Te envio la propuesta.", createdAt: "Ayer, 11:02" },
    ],
    createdAt: "Ayer",
    expiresAt: "17 sep 2026",
  },
  {
    id: "Q-1041",
    customer: "Camila S.",
    phone: "098 111 2233",
    description: "Recuerdos personalizados para bautizo.",
    dimensions: "8 cm",
    quantity: 30,
    color: "Blanco",
    status: "reviewing",
    images: [],
    messages: [
      { id: "m3", sender: "customer", text: "Necesito incluir el nombre y la fecha en cada pieza.", createdAt: "18 ago, 16:40" },
    ],
    createdAt: "18 ago",
    expiresAt: "17 sep 2026",
  },
];

type QuoteState = {
  quotes: Quote[];
  addQuote: (quote: NewQuote) => string;
  addMessage: (quoteId: string, sender: QuoteMessage["sender"], text: string) => void;
  setStatus: (quoteId: string, status: QuoteStatus) => void;
};

export const useQuoteStore = create<QuoteState>((set) => ({
  quotes: demoQuotes,
  addQuote: (quote) => {
    const id = `Q-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const expires = new Date(now);
    expires.setDate(expires.getDate() + 30);
    set((state) => ({
      quotes: [
        {
          ...quote,
          id,
          status: "new",
          messages: [
            {
              id: crypto.randomUUID(),
              sender: "customer",
              text: quote.description,
              createdAt: "Ahora",
            },
          ],
          createdAt: "Ahora",
          expiresAt: expires.toLocaleDateString("es-EC"),
        },
        ...state.quotes,
      ],
    }));
    return id;
  },
  addMessage: (quoteId, sender, text) =>
    set((state) => ({
      quotes: state.quotes.map((quote) =>
        quote.id === quoteId
          ? {
              ...quote,
              messages: [
                ...quote.messages,
                { id: crypto.randomUUID(), sender, text, createdAt: "Ahora" },
              ],
            }
          : quote,
      ),
    })),
  setStatus: (quoteId, status) =>
    set((state) => ({
      quotes: state.quotes.map((quote) => {
        if (quote.id !== quoteId) return quote;
        const shouldDeleteImages = status === "discarded" || status === "completed";
        if (shouldDeleteImages) {
          quote.images.forEach((image) => URL.revokeObjectURL(image.url));
        }
        return { ...quote, status, images: shouldDeleteImages ? [] : quote.images };
      }),
    })),
}));
