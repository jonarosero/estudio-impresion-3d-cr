"use client";

import { ProductCard } from "@/components/product/product-card";
import { useProductStore } from "@/stores/product-store";

export function FeaturedProducts() {
  const products = useProductStore((state) => state.products);
  const featured = products.filter((product) => product.featured);
  const visibleProducts = (featured.length ? featured : products).slice(0, 4);

  return (
    <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-5">
      {visibleProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
