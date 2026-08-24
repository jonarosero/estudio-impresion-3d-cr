"use client";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { create } from "zustand";
import type { CartLine } from "@/lib/types";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/client";

export type Order = {
  id: string;
  code?: string;
  origin?: "web" | "quote";
  quoteCode?: string;
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
  status: OrderStatus;
  paymentStatus: "pending" | "paid";
  createdAt: string;
};

export type OrderStatus = "pending_payment" | "paid" | "production" | "ready" | "shipped" | "delivered" | "cancelled";

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending_payment: "Pendiente de pago",
  paid: "Pagado",
  production: "En fabricación",
  ready: "Fabricado",
  shipped: "Enviado",
  delivered: "Recibido",
  cancelled: "Cancelado",
};

type OrderState = {
  orders: Order[];
  startListening: (userId: string, isAdmin: boolean) => void;
  stopListening: () => void;
  createOrder: (details: Pick<Order, "customer" | "email" | "phone" | "shippingAddress" | "city" | "reference">, lines: CartLine[]) => Promise<string>;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
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
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${await user.getIdToken()}` },
      body: JSON.stringify({ details, lines: cartLines.map((line) => ({ productId: line.product.id, color: line.color, quantity: line.quantity })) }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "No se pudo crear el pedido.");
    return result.code ?? result.orderId;
  },
  updateStatus: async (orderId, status) => {
    const user = getFirebaseAuth().currentUser;
    if (!user) throw new Error("Inicia sesión para actualizar el pedido.");
    const response = await fetch(`/api/admin/orders/${orderId}/status`, { method: "PATCH", headers: { "content-type": "application/json", authorization: `Bearer ${await user.getIdToken()}` }, body: JSON.stringify({ status }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "No se pudo actualizar el pedido.");
  },
}));
