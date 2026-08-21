"use client";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";
import { useAccountStore } from "@/stores/account-store";
import { useQuoteStore } from "@/stores/quote-store";
import { useOrderStore } from "@/stores/order-store";
import { useCartStore } from "@/stores/cart-store";
import { useFavoriteStore } from "@/stores/favorite-store";

export function FirebaseAuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const setAccount = useAccountStore((state) => state.setAccount);
  const setLoading = useAccountStore((state) => state.setLoading);
  const startQuoteListening = useQuoteStore((state) => state.startListening);
  const stopQuoteListening = useQuoteStore((state) => state.stopListening);
  const startOrderListening = useOrderStore((state) => state.startListening);
  const stopOrderListening = useOrderStore((state) => state.stopListening);
  const startCartListening = useCartStore((state) => state.startListening);
  const stopCartListening = useCartStore((state) => state.stopListening);
  const startFavoriteListening = useFavoriteStore((state) => state.startListening);
  const stopFavoriteListening = useFavoriteStore((state) => state.stopListening);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (user) => {
      if (!user) {
        stopQuoteListening();
        stopOrderListening();
        stopCartListening();
        stopFavoriteListening();
        setAccount(null);
        setLoading(false);
        return;
      }

      const userRef = doc(getFirebaseDb(), "users", user.uid);
      const profile = await getDoc(userRef);
      if (!profile.exists()) {
        await setDoc(userRef, {
          name: user.displayName ?? "Cliente J&J",
          email: user.email ?? "",
          role: "customer",
          createdAt: new Date().toISOString(),
        });
      }

      const token = await user.getIdTokenResult();
      const isAdmin = token.claims.admin === true;
      startQuoteListening(user.uid, isAdmin);
      startOrderListening(user.uid, isAdmin);
      startCartListening(user.uid);
      startFavoriteListening(user.uid);
      setAccount({
        id: user.uid,
        name: user.displayName ?? "Cliente J&J",
        email: user.email ?? "",
        role: isAdmin ? "admin" : "customer",
      });
      setLoading(false);
    });
    return () => {
      unsubscribe();
      stopQuoteListening();
      stopOrderListening();
      stopCartListening();
      stopFavoriteListening();
    };
  }, [setAccount, setLoading, startCartListening, startFavoriteListening, startOrderListening, startQuoteListening, stopCartListening, stopFavoriteListening, stopOrderListening, stopQuoteListening]);

  return children;
}
