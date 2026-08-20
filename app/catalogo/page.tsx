import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/catalog-view";

export const metadata = { title: "Catálogo" };

export default function CatalogPage() {
  return (
    <main className="page-shell py-12 sm:py-16">
      <Suspense fallback={<div className="min-h-[600px] animate-pulse rounded-[30px] bg-[#eadfe1]" />}>
        <CatalogView />
      </Suspense>
    </main>
  );
}
