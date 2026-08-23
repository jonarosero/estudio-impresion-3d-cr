"use client";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";
import type { Product } from "@/lib/types";
import { type Promotion, usePromotionStore } from "@/stores/promotion-store";
import { useProductStore } from "@/stores/product-store";
import { useAccountStore } from "@/stores/account-store";

export function FirebaseCatalogProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const account = useAccountStore((state) => state.account);
  const replaceProducts = useProductStore((state) => state.replace);
  const replacePromotions = usePromotionStore((state) => state.replace);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const db = getFirebaseDb();
    const productsQuery = account?.role === "admin" ? collection(db, "products") : query(collection(db, "products"), where("status", "==", "active"));
    const promotionsQuery = account?.role === "admin" ? collection(db, "promotions") : query(collection(db, "promotions"), where("status", "==", "active"));
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      replaceProducts(snapshot.docs.map((item) => item.data() as Product));
    });
    const unsubscribePromotions = onSnapshot(promotionsQuery, (snapshot) => {
      replacePromotions(snapshot.docs.map((item) => item.data() as Promotion));
    });
    return () => { unsubscribeProducts(); unsubscribePromotions(); };
  }, [account, replaceProducts, replacePromotions]);

  return children;
}
