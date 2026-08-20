"use client";

import Image from "next/image";
import { createContext, useContext, useState } from "react";
import type { Product, ProductColor } from "@/lib/types";

type VariantContextValue = {
  variant: ProductColor;
  variants: ProductColor[];
  setVariant: (variant: ProductColor) => void;
};

const ProductVariantContext = createContext<VariantContextValue | null>(null);

function getVariants(product: Product): ProductColor[] {
  return product.colorVariants?.length
    ? product.colorVariants
    : product.colors.map((name) => ({ name, type: "matte", price: product.price, image: product.image }));
}

export function ProductVariantProvider({ product, children }: { product: Product; children: React.ReactNode }) {
  const variants = getVariants(product);
  const [variant, setVariant] = useState(variants[0]);
  return <ProductVariantContext value={{ variant, variants, setVariant }}>{children}</ProductVariantContext>;
}

export function useProductVariant() {
  return useContext(ProductVariantContext);
}

export function ProductGallery({ product }: { product: Product }) {
  const selection = useProductVariant();
  const image = selection?.variant.image || product.image;
  return <div className="relative aspect-[5/5.4] overflow-hidden rounded-[30px] bg-[#eadfe1]"><Image src={image} alt={`${product.name} en ${selection?.variant.name ?? "su color"}`} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />{product.badge && <span className="absolute left-5 top-5 rounded-full bg-[#fffdfb]/90 px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur">{product.badge}</span>}</div>;
}
