"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) {
    return children;
  }

  return (
    <>
      <Suspense fallback={<div className="h-[77px] border-b border-[#e5d8dc]/80" />}><Header /></Suspense>
      <CartDrawer />
      {children}
      <Footer />
    </>
  );
}
