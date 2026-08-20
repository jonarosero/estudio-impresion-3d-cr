"use client";

import { collection, onSnapshot, writeBatch, doc, query, where } from "firebase/firestore";
import { useEffect, useRef } from "react";
import { products as initialProducts } from "@/lib/data";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";
import type { Product } from "@/lib/types";
import { initialPromotions, type Promotion, usePromotionStore } from "@/stores/promotion-store";
import { useProductStore } from "@/stores/product-store";
import { useAccountStore } from "@/stores/account-store";

export function FirebaseCatalogProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const account = useAccountStore((state) => state.account);
  const replaceProducts = useProductStore((state) => state.replace);
  const replacePromotions = usePromotionStore((state) => state.replace);
  const seeded = useRef(false);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const db = getFirebaseDb();
    const productsQuery = account?.role === "admin" ? collection(db, "products") : query(collection(db, "products"), where("status", "==", "active"));
    const promotionsQuery = account?.role === "admin" ? collection(db, "promotions") : query(collection(db, "promotions"), where("status", "==", "active"));
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      if (snapshot.empty && account?.role === "admin" && !seeded.current) {
        seeded.current = true;
        const batch = writeBatch(db);
        initialProducts.forEach((product) => batch.set(doc(db, "products", product.id), { ...product, status: "active" }));
        initialPromotions.forEach((promotion) => batch.set(doc(db, "promotions", promotion.id), { ...promotion, status: promotion.active ? "active" : "inactive" }));
        void batch.commit();
        return;
      }
      if (!snapshot.empty) replaceProducts(snapshot.docs.map((item) => item.data() as Product));
    });
    const unsubscribePromotions = onSnapshot(promotionsQuery, (snapshot) => {
      if (!snapshot.empty) replacePromotions(snapshot.docs.map((item) => item.data() as Promotion));
    });
    return () => { unsubscribeProducts(); unsubscribePromotions(); };
  }, [account, replaceProducts, replacePromotions]);

  return children;
}
