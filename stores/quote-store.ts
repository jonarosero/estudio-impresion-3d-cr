"use client";

import { create } from "zustand";
import { collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc, where, writeBatch } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseAuth, getFirebaseDb, getFirebaseStorage, isFirebaseConfigured } from "@/lib/firebase/client";

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
  images?: QuoteImage[];
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
  userId: string;
};

export type NewQuote = Omit<Quote, "id" | "userId" | "status" | "images" | "messages" | "createdAt" | "expiresAt">;

type QuoteState = {
  quotes: Quote[];
  startListening: (userId: string, isAdmin: boolean) => void;
  stopListening: () => void;
  addQuote: (quote: NewQuote, files: File[]) => Promise<string>;
  addMessage: (quoteId: string, sender: QuoteMessage["sender"], text: string, files?: File[]) => Promise<void>;
  setStatus: (quoteId: string, status: QuoteStatus) => Promise<void>;
};

const messageUnsubscribers = new Map<string, () => void>();
let quotesUnsubscribe: (() => void) | undefined;

function clearListeners() {
  quotesUnsubscribe?.();
  quotesUnsubscribe = undefined;
  messageUnsubscribers.forEach((unsubscribe) => unsubscribe());
  messageUnsubscribers.clear();
}

function formattedDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("es-EC", { day: "numeric", month: "short" });
}

function toQuote(id: string, data: Record<string, unknown>, messages: QuoteMessage[] = []): Quote {
  return {
    id,
    customer: String(data.customer ?? ""),
    phone: String(data.phone ?? ""),
    description: String(data.description ?? ""),
    dimensions: String(data.dimensions ?? ""),
    quantity: Number(data.quantity ?? 0),
    color: String(data.color ?? ""),
    status: data.status as QuoteStatus,
    images: (data.images as QuoteImage[] | undefined) ?? [],
    messages,
    createdAt: formattedDate(String(data.createdAt ?? "")),
    expiresAt: formattedDate(String(data.expiresAt ?? "")),
    userId: String(data.userId ?? ""),
  };
}

function requireUser() {
  if (!isFirebaseConfigured) throw new Error("Firebase no esta configurado.");
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error("Debes iniciar sesion para enviar una cotizacion.");
  return user;
}

export const useQuoteStore = create<QuoteState>((set, get) => ({
  quotes: [],
  startListening: (userId, isAdmin) => {
    clearListeners();
    if (!isFirebaseConfigured) return;

    const quotesRef = collection(getFirebaseDb(), "quotes");
    const quotesQuery = isAdmin ? quotesRef : query(quotesRef, where("userId", "==", userId));

    quotesUnsubscribe = onSnapshot(quotesQuery, (snapshot) => {
      const current = get().quotes;
      const quotes = [...snapshot.docs].sort((left, right) => String(right.data().createdAt ?? "").localeCompare(String(left.data().createdAt ?? ""))).map((quoteDoc) => {
        const existing = current.find((quote) => quote.id === quoteDoc.id);
        return toQuote(quoteDoc.id, quoteDoc.data(), existing?.messages);
      });
      const activeIds = new Set(quotes.map((quote) => quote.id));

      messageUnsubscribers.forEach((unsubscribe, quoteId) => {
        if (!activeIds.has(quoteId)) {
          unsubscribe();
          messageUnsubscribers.delete(quoteId);
        }
      });
      set({ quotes });

      snapshot.docs.forEach((quoteDoc) => {
        if (messageUnsubscribers.has(quoteDoc.id)) return;
        const messagesQuery = query(collection(quoteDoc.ref, "messages"), orderBy("createdAt", "asc"));
        messageUnsubscribers.set(quoteDoc.id, onSnapshot(messagesQuery, (messagesSnapshot) => {
          const messages = messagesSnapshot.docs.map((messageDoc) => ({
            id: messageDoc.id,
            sender: messageDoc.data().sender as QuoteMessage["sender"],
            text: String(messageDoc.data().text ?? ""),
            createdAt: formattedDate(String(messageDoc.data().createdAt ?? "")),
            images: (messageDoc.data().images as QuoteImage[] | undefined) ?? [],
          }));
          set((state) => ({
            quotes: state.quotes.map((quote) => quote.id === quoteDoc.id ? { ...quote, messages } : quote),
          }));
        }));
      });
    });
  },
  stopListening: () => {
    clearListeners();
    set({ quotes: [] });
  },
  addQuote: async (quote, files) => {
    const user = requireUser();
    const quoteRef = doc(collection(getFirebaseDb(), "quotes"));
    const uploadedImages: QuoteImage[] = [];

    try {
      for (const file of files) {
        const imageRef = ref(getFirebaseStorage(), `quotes/${user.uid}/${quoteRef.id}/${crypto.randomUUID()}-${file.name}`);
        await uploadBytes(imageRef, file, { contentType: file.type });
        uploadedImages.push({ id: crypto.randomUUID(), name: file.name, url: await getDownloadURL(imageRef), storagePath: imageRef.fullPath });
      }

      const now = new Date();
      const expires = new Date(now);
      expires.setDate(expires.getDate() + 30);
      const batch = writeBatch(getFirebaseDb());
      batch.set(quoteRef, { ...quote, userId: user.uid, status: "new", images: uploadedImages, createdAt: now.toISOString(), expiresAt: expires.toISOString() });
      batch.set(doc(collection(quoteRef, "messages")), { sender: "customer", text: quote.description, createdAt: now.toISOString() });
      await batch.commit();
      return quoteRef.id;
    } catch (error) {
      await Promise.all(uploadedImages.map((image) => deleteObject(ref(getFirebaseStorage(), image.storagePath)).catch(() => undefined)));
      throw error;
    }
  },
  addMessage: async (quoteId, sender, text, files = []) => {
    requireUser();
    const quote = get().quotes.find((item) => item.id === quoteId);
    if (!quote) throw new Error("No se encontró la cotización.");
    const messageRef = doc(collection(getFirebaseDb(), "quotes", quoteId, "messages"));
    const images: QuoteImage[] = [];
    for (const file of files) {
      const imageRef = ref(getFirebaseStorage(), `quotes/${quote.userId}/${quoteId}/messages/${messageRef.id}-${crypto.randomUUID()}-${file.name}`);
      await uploadBytes(imageRef, file, { contentType: file.type });
      images.push({ id: crypto.randomUUID(), name: file.name, url: await getDownloadURL(imageRef), storagePath: imageRef.fullPath });
    }
    await setDoc(messageRef, { sender, text, images, createdAt: new Date().toISOString() });
  },
  setStatus: async (quoteId, status) => {
    requireUser();
    const quote = get().quotes.find((item) => item.id === quoteId);
    const shouldDeleteImages = status === "discarded" || status === "completed";
    if (shouldDeleteImages && quote) {
      await Promise.all(quote.images.map((image) => deleteObject(ref(getFirebaseStorage(), image.storagePath))));
    }
    await updateDoc(doc(getFirebaseDb(), "quotes", quoteId), { status, ...(shouldDeleteImages ? { images: [] } : {}) });
  },
}));
