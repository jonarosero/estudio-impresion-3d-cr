"use client";

import { collection, doc, onSnapshot, query, setDoc, where, writeBatch } from "firebase/firestore";
import type { Quote } from "@/stores/quote-store";
import { create } from "zustand";
import type { CartLine } from "@/lib/types";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/client";

export type Order = {
  id: string;
  userId: string;
  customer: string;
  email: string;
  phone: string;
  shippingAddress: string;
  city: string;
  reference: string;
  lines: Array<{ productId: string; name: string; color: string; quantity: number; unitPrice: number; weightGrams: number }>;
  subtotal: number;
  total: number;
  status: "pending_payment" | "paid" | "production" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid";
  createdAt: string;
};

type OrderState = {
  orders: Order[];
  startListening: (userId: string, isAdmin: boolean) => void;
  stopListening: () => void;
  createOrder: (details: Pick<Order, "customer" | "email" | "phone" | "shippingAddress" | "city" | "reference">, lines: CartLine[]) => Promise<string>;
  createOrderFromQuote: (quote: Quote) => Promise<string>;
};

let unsubscribe: (() => void) | undefined;

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  startListening: (userId, isAdmin) => {
    unsubscribe?.();
    const ordersRef = collection(getFirebaseDb(), "orders");
    const ordersQuery = isAdmin ? ordersRef : query(ordersRef, where("userId", "==", userId));
    unsubscribe = onSnapshot(ordersQuery, (snapshot) => set({ orders: snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Order).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) }));
  },
  stopListening: () => {
    unsubscribe?.();
    unsubscribe = undefined;
    set({ orders: [] });
  },
  createOrder: async (details, cartLines) => {
    const user = getFirebaseAuth().currentUser;
    if (!user) throw new Error("Inicia sesión para crear el pedido.");
    if (!cartLines.length) throw new Error("Tu carrito está vacío.");
    const lines = cartLines.map((line) => ({ productId: line.product.id, name: line.product.name, color: line.color, quantity: line.quantity, unitPrice: line.product.price, weightGrams: line.product.weightGrams }));
    const subtotal = lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0);
    const orderRef = doc(collection(getFirebaseDb(), "orders"));
    await setDoc(orderRef, { id: orderRef.id, userId: user.uid, ...details, lines, subtotal, total: subtotal, status: "pending_payment", paymentStatus: "pending", createdAt: new Date().toISOString() });
    return orderRef.id;
  },
  createOrderFromQuote: async (quote) => {
    const orderRef = doc(collection(getFirebaseDb(), "orders"));
    const now = new Date().toISOString();
    const batch = writeBatch(getFirebaseDb());
    batch.set(orderRef, { id: orderRef.id, userId: quote.userId, customer: quote.customer, email: "", phone: quote.phone, shippingAddress: "", city: "", reference: `Cotización ${quote.id}: ${quote.description}`, lines: [{ productId: quote.id, name: "Producto personalizado", color: quote.color, quantity: quote.quantity, unitPrice: 0, weightGrams: 0 }], subtotal: 0, total: 0, status: "pending_payment", paymentStatus: "pending", createdAt: now, quoteId: quote.id });
    batch.update(doc(getFirebaseDb(), "quotes", quote.id), { status: "converted", orderId: orderRef.id, convertedAt: now });
    await batch.commit();
    return orderRef.id;
  },
}));
