"use client";

import Image from "next/image";
import { Percent, Plus, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePromotionStore } from "@/stores/promotion-store";

export function PromotionsPanel() {
  const promotions = usePromotionStore((state) => state.promotions);
  const toggle = usePromotionStore((state) => state.toggle);
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const filteredPromotions = promotions.filter((promo) =>
    [promo.title, promo.code, promo.value].some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    ),
  );

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl font-semibold">Promociones</h2>
          <p className="mt-1 text-[10px] text-[#786970]">
            Las promociones activas aparecen automáticamente en el banner
            principal
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-[#35282d] px-4 py-2.5 text-[10px] font-bold text-white">
          <Plus size={13} /> Nueva promocion
        </button>
      </div>
      <label className="relative mt-5 block max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e5f72]"
          size={14}
        />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por título o código"
          className="w-full rounded-xl border border-[#e5d8dc] py-2.5 pl-9 pr-3 text-[10px] outline-none focus:border-[#9e5f72]"
          aria-label="Buscar promociones"
        />
      </label>
      <div className="mt-4 rounded-2xl bg-[#ead7dc] p-4 text-[10px] leading-5 text-[#72505b]">
        El banner de inicio utiliza esta misma lista. Al activar o pausar una
        campana, la portada se actualiza sin editar su diseño.
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {filteredPromotions.length > 0 ? (
          filteredPromotions.map((promo) => (
            <div
              key={promo.id}
              className="overflow-hidden rounded-2xl bg-[#fffdfb]"
            >
              <div className="relative h-28">
                <Image
                  src={promo.image}
                  alt={promo.title}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
                <span
                  className={cn(
                    "absolute left-3 top-3 rounded-full px-3 py-1 text-[9px] font-bold",
                    promo.active
                      ? "bg-[#e7eee3] text-[#52704b]"
                      : "bg-[#eee6e8] text-[#786970]",
                  )}
                >
                  {promo.active ? "Visible en banner" : "Pausada"}
                </span>
              </div>
              <div className="p-5">
                <div className="flex justify-between">
                  <span className="font-display text-3xl font-bold">
                    {promo.value}
                  </span>
                  <Percent size={16} className="text-[#9e5f72]" />
                </div>
                <p className="mt-4 font-display text-2xl font-semibold">
                  {promo.title}
                </p>
                <p className="mt-1 text-[10px] text-[#786970]">
                  Código: {promo.code}
                </p>
                <button
                  onClick={() => toggle(promo.id)}
                  className="mt-5 w-full rounded-full border border-[#d8c9cd] px-4 py-2.5 text-[9px] font-bold"
                >
                  {promo.active ? "Pausar en banner" : "Activar en banner"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-2xl bg-[#fffdfb] p-5 text-center text-[10px] text-[#786970] md:col-span-3">
            No se encontraron promociones.
          </p>
        )}
      </div>
    </>
  );
}
