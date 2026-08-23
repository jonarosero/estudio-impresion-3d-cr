"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Box, RefreshCw, ShieldCheck } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { ProductPurchase } from "@/components/product/product-purchase";
import { ProductGallery, ProductVariantProvider } from "@/components/product/product-variant-provider";
import { categories, formatPrice } from "@/lib/data";
import { useProductStore } from "@/stores/product-store";

export function ProductDetailView({ slug }: { slug: string }) {
  const products = useProductStore((state) => state.products);
  const isCatalogLoaded = useProductStore((state) => state.isLoaded);
  const product = products.find((item) => item.slug === slug);
  if (!product && !isCatalogLoaded) {
    return <main className="grid min-h-[60vh] place-items-center text-sm text-[#786970]">Cargando producto...</main>;
  }
  if (!product) notFound();
  const category = categories.find((item) => item.id === product.category)?.name;
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);

  return <main className="page-shell py-8 sm:py-12"><Link href="/catalogo" className="inline-flex items-center gap-2 text-xs font-bold text-[#786970]"><ArrowLeft size={14} /> Volver al catálogo</Link><ProductVariantProvider key={`${product.id}-${product.image}`} product={product}><div className="mt-7 grid gap-10 lg:grid-cols-[1.12fr_.88fr] lg:gap-16"><ProductGallery product={product} /><div className="flex flex-col justify-center lg:pr-8"><p className="eyebrow">{category}</p><h1 className="mt-3 font-display text-6xl font-semibold leading-[0.9] tracking-tight sm:text-7xl">{product.name}</h1><div className="mt-5 flex items-center gap-3"><span className="text-xl font-bold">{formatPrice(product.price)}</span>{product.compareAtPrice && <span className="text-sm text-[#9b8e93] line-through">{formatPrice(product.compareAtPrice)}</span>}</div><p className="mt-7 text-sm leading-7 text-[#66575d]">{product.description}</p><ProductPurchase product={product} /><div className="mt-8 grid gap-3 text-xs text-[#66575d] sm:grid-cols-3">{[{ icon: Box, text: "Hecho en Ecuador" }, { icon: ShieldCheck, text: "Calidad revisada" }, { icon: RefreshCw, text: "Producción consciente" }].map((item) => <div key={item.text} className="flex items-center gap-2"><item.icon size={15} className="text-[#9e5f72]" />{item.text}</div>)}</div><div className="mt-8 rounded-2xl bg-[#f3e7e9] p-5 text-xs leading-5 text-[#66575d]"><strong className="text-[#35282d]">Sobre los tiempos:</strong> algunas piezas se producen al confirmar tu pedido. El tiempo habitual es de 3 a 5 días laborables.</div></div></div></ProductVariantProvider>{related.length > 0 && <section className="py-20"><p className="eyebrow">También te puede gustar</p><h2 className="mt-2 font-display text-4xl font-semibold">De la misma familia</h2><div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}</main>;
}
