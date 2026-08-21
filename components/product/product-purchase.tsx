"use client";

import Image from "next/image";
import { Minus, Paintbrush, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { AddToCart } from "@/components/cart/add-to-cart";
import { useProductVariant } from "@/components/product/product-variant-provider";
import { formatPrice } from "@/lib/data";
import type { Product, ProductColor, ProductFinish, ProductFinishOption } from "@/lib/types";
import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = { "Rosa nube": "#e6bdc8", Marfil: "#eee9dd", Salvia: "#aeb9a4", "Rosa arcilla": "#c98698", Arena: "#d7c4ac", Ciruela: "#6c4453", Lavanda: "#b9acd0", Blanco: "#f8f7f2", Caramelo: "#bc8a63", Terracota: "#b66c52", Negro: "#35282d", Miel: "#d6a568" };

function getVariants(product: Product): ProductColor[] {
  return product.colorVariants?.length ? product.colorVariants : product.colors.map((name) => ({ name, type: "matte", price: product.price, image: product.image }));
}

function getFinishOptions(product: Product): ProductFinishOption[] {
  if (product.finishOptions?.length) return product.finishOptions;
  const finishes: ProductFinish[] = product.availableFinishes?.length ? product.availableFinishes : ["standard"];
  const details: Record<ProductFinish, Omit<ProductFinishOption, "id" | "image">> = {
    standard: { title: "Impreso a colores", description: "Color aplicado durante la impresión.", priceAdjustment: 0 },
    "hand-painted": { title: "Pintado a mano", description: "Detalles terminados manualmente en el estudio.", priceAdjustment: 4.5 },
    "ready-to-paint": { title: "Diviértete pintando", description: "Base lista para personalizar en casa.", priceAdjustment: 0 },
  };
  return finishes.map((id) => ({ id, ...details[id], image: product.image }));
}

export function ProductPurchase({ product }: { product: Product }) {
  const productSelection = useProductVariant();
  const variants = productSelection?.variants ?? getVariants(product);
  const [localVariant, setLocalVariant] = useState(variants[0]);
  const variant = productSelection?.variant ?? localVariant;
  const setVariant = productSelection?.setVariant ?? setLocalVariant;
  const isMulticolor = product.colorPresentation === "multicolor";
  const finishOptions = !isMulticolor ? getFinishOptions(product) : [];
  const [finishId, setFinishId] = useState<ProductFinish>(finishOptions[0]?.id ?? "standard");
  const finish = finishOptions.find((option) => option.id === finishId) ?? finishOptions[0];
  const [quantity, setQuantity] = useState(1);
  const unitPrice = (isMulticolor ? variant.price : product.price) + (finish?.priceAdjustment ?? 0);
  const selectionLabel = `${isMulticolor ? `${variant.name} · Multicolor` : "Color único"}${finish ? ` · ${finish.title}` : ""}`;

  return <div className="mt-8 border-t border-[#e5d8dc] pt-7">
    {isMulticolor && <><div className="flex items-center justify-between"><span className="text-xs font-extrabold uppercase tracking-wider">Combinación multicolor</span><span className="text-xs font-bold text-[#786970]">{formatPrice(variant.price)}</span></div><div className="mt-3 grid gap-2 sm:grid-cols-3">{variants.map((item) => <button key={item.name} onClick={() => setVariant(item)} className={cn("relative min-h-24 overflow-hidden rounded-2xl border p-3 text-left", variant.name === item.name ? "border-[#35282d] bg-[#f3e7e9]" : "border-[#e5d8dc]")}><div className="absolute inset-0 opacity-25"><Image src={item.image} alt="" fill sizes="150px" className="object-cover" /></div><span className="relative flex size-7 rounded-full border-2 border-white shadow" style={{ background: colorMap[item.name] ?? "#e6bdc8" }} /><span className="relative mt-4 block text-xs font-bold">{item.name}</span><span className="relative mt-1 block text-[9px] text-[#786970]">{item.type === "marble" ? "Efecto mármol" : "Diseno multicolor"} · {formatPrice(item.price)}</span></button>)}</div></>}
    {isMulticolor && <p className="mt-3 text-[10px] leading-5 text-[#786970]">Elige la combinacion multicolor que prefieras. Esta pieza no admite acabados adicionales.</p>}
    {finishOptions.length > 0 && <div className={cn("mt-7 pt-6", isMulticolor && "border-t border-[#e5d8dc]")}><div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider"><Paintbrush size={14} className="text-[#9e5f72]" /> Acabado</div><div className="mt-3 grid gap-2">{finishOptions.map((option) => <button key={option.id} onClick={() => setFinishId(option.id)} className={cn("relative flex min-h-20 items-center justify-between overflow-hidden rounded-2xl border p-3 text-left", finish?.id === option.id ? "border-[#35282d] bg-[#f3e7e9]" : "border-[#e5d8dc]")}><div className="absolute inset-0 opacity-15"><Image src={option.image} alt="" fill sizes="500px" className="object-cover" /></div><span className="relative"><span className="block text-xs font-bold">{option.title}</span><span className="mt-1 block text-[10px] text-[#786970]">{option.description}</span></span><span className="relative text-[10px] font-bold">{option.priceAdjustment ? `+${formatPrice(option.priceAdjustment)}` : "Incluido"}</span></button>)}</div></div>}
    <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#f3e7e9] p-4"><span className="flex items-center gap-2 text-xs font-bold"><Sparkles size={14} className="text-[#9e5f72]" /> Precio de tu configuración</span><span className="font-display text-2xl font-semibold">{formatPrice(unitPrice)}</span></div>
    <div className="mt-7 flex flex-col gap-3 sm:flex-row"><div className="flex items-center justify-between rounded-full border border-[#d8c9cd] px-2 sm:w-32"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="p-3" aria-label="Reducir cantidad"><Minus size={14} /></button><span className="text-sm font-bold">{quantity}</span><button onClick={() => setQuantity((value) => value + 1)} className="p-3" aria-label="Aumentar cantidad"><Plus size={14} /></button></div><div className="flex-1"><AddToCart product={{ ...product, price: unitPrice }} color={selectionLabel} quantity={quantity} /></div></div>
  </div>;
}
