"use client";

import Image from "next/image";
import { useCustomPrintStore } from "@/stores/custom-print-store";

const fallbackPrints = [
  {
    title: "Impresión personalizada",
    description: "Pieza creada a partir de la idea y referencias de nuestro cliente.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/estudio-jj-3d.firebasestorage.app/o/products%2F42317676-e637-4c70-bf25-84c973202562%2Fed3294ba-32f9-4b0c-b88e-b064febe9ed5?alt=media&token=f427ff05-6144-4311-8bf2-d5da847fdba4",
  },
];

export function HomeCustomPrints() {
  const prints = useCustomPrintStore((state) => state.prints);
  const visiblePrints = (prints.length ? prints : fallbackPrints).slice(0, 3);

  return (
    <div className="grid grid-cols-2 gap-3 p-4 sm:gap-5 sm:p-7">
      {visiblePrints.map((print, index) => (
        <div key={print.image} className={`group relative min-h-44 overflow-hidden rounded-2xl ${index === 0 ? "row-span-2" : ""}`}>
          <Image src={print.image} alt={print.title} fill sizes="(max-width: 1024px) 45vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#35282d]/75 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4"><p className="font-display text-xl font-semibold text-white">{print.title}</p><p className="mt-1 text-[9px] text-white/70">{print.description}</p></div>
        </div>
      ))}
    </div>
  );
}
