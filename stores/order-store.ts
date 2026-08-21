"use client";

import { collection, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
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
}));
