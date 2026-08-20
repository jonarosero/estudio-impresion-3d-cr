"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { categories } from "@/lib/data";
import type { CategoryId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SelectMenu } from "@/components/ui/select-menu";
import { useProductStore } from "@/stores/product-store";

export function CatalogView() {
  const params = useSearchParams();
  const router = useRouter();
  const paramCategory = params.get("categoria") as CategoryId | null;
  const category = categories.some((item) => item.id === paramCategory) && paramCategory !== "personalizadas"
    ? paramCategory
    : "todos";
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("destacados");
  const products = useProductStore((state) => state.products);

  function selectCategory(nextCategory: CategoryId | "todos") {
    router.push(nextCategory === "todos" ? "/catalogo" : `/catalogo?categoria=${nextCategory}`);
  }

  const visible = products
    .filter((product) => category === "todos" || product.category === category)
    .filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sort === "menor") return a.price - b.price;
      if (sort === "mayor") return b.price - a.price;
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });

  return (
    <>
      <div className="rounded-[30px] bg-[#ead7dc] px-7 py-12 sm:px-12 sm:py-16">
        <p className="eyebrow">Colección J&J</p>
        <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h1 className="max-w-2xl font-display text-5xl font-semibold leading-[0.9] sm:text-7xl">Objetos para vivir bonito.</h1>
          <p className="max-w-sm text-sm leading-6 text-[#66575d]">Piezas ligeras, útiles y producidas en pequeños lotes. Elige la forma; nosotras cuidamos cada capa.</p>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-5 border-b border-[#e5d8dc] pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => selectCategory("todos")} className={cn("shrink-0 rounded-full border px-4 py-2.5 text-xs font-bold", category === "todos" ? "border-[#35282d] bg-[#35282d] text-white" : "border-[#d8c9cd] bg-[#fffdfb]")}>Todos</button>
          {categories.filter((item) => item.id !== "personalizadas").map((item) => (
            <button key={item.id} onClick={() => selectCategory(item.id)} className={cn("shrink-0 rounded-full border px-4 py-2.5 text-xs font-bold", category === item.id ? "border-[#35282d] bg-[#35282d] text-white" : "border-[#d8c9cd] bg-[#fffdfb]")}>{item.name}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <label className="relative min-w-0 flex-1 lg:w-56 lg:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9e5f72]" size={15} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar una pieza" className="w-full rounded-full border border-[#d8c9cd] bg-[#fffdfb] py-2.5 pl-10 pr-9 text-xs" />
            {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={14} /></button>}
          </label>
          <div className="relative min-w-36"><SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2" size={14} /><SelectMenu value={sort} onChange={setSort} options={[{ value: "destacados", label: "Destacados" }, { value: "menor", label: "Menor precio" }, { value: "mayor", label: "Mayor precio" }]} className="[&>button]:rounded-full [&>button]:py-2.5 [&>button]:pl-10 [&>button]:text-xs" /></div>
        </div>
      </div>
      <div className="mt-7 flex items-center justify-between text-xs text-[#786970]"><span>{visible.length} piezas</span><span>Impresas a pedido o en pequeños lotes</span></div>
      {visible.length > 0 ? (
        <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">{visible.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      ) : (
        <div className="mt-10 rounded-[28px] bg-[#fffdfb] py-24 text-center"><h2 className="font-display text-3xl font-semibold">No encontramos esa pieza</h2><p className="mt-2 text-sm text-[#786970]">Prueba otra palabra o explora todas las categorías.</p></div>
      )}
    </>
  );
}
