"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/data";
import { usePromotionStore } from "@/stores/promotion-store";

export function HeroBanner() {
  const [active, setActive] = useState(0);
  const promotions = usePromotionStore((state) => state.promotions);
  const activePromotions = promotions.filter((promotion) => promotion.active);
  const slides = activePromotions.length > 0 ? activePromotions : promotions.slice(0, 1);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const safeActive = active % slides.length;
  const slide = slides[safeActive];
  const changeSlide = (direction: number) => {
    setActive((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <div className="relative min-h-[430px] overflow-hidden lg:min-h-full" aria-roledescription="carousel" aria-label="Productos destacados">
      {slides.map((item, index) => (
        <Image
          key={item.id}
          src={item.image}
          alt={item.productName}
          fill
          priority={index === 0}
          sizes="(max-width: 1024px) 100vw, 55vw"
          className={`object-cover transition duration-700 ${index === safeActive ? "scale-100 opacity-100" : "pointer-events-none scale-[1.03] opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#35282d]/55 via-transparent to-[#35282d]/10" />

      <div className="absolute left-5 top-5 max-w-[250px] rounded-2xl bg-[#fffdfb]/88 p-4 backdrop-blur-xl sm:left-8 sm:top-8">
        <p className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#9e5f72]">Promocion · {slide.code}</p>
        <p className="mt-2 font-display text-2xl font-semibold leading-none">{slide.message}</p>
      </div>

      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4 rounded-2xl bg-[#fffdfb]/90 p-4 backdrop-blur-xl sm:bottom-8 sm:left-8 sm:right-8">
        <div className="min-w-0">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#9e5f72]">{slide.value} · {formatPrice(slide.productPrice)}</p>
          <p className="mt-1 truncate font-display text-xl font-semibold">{slide.productName}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={() => changeSlide(-1)} className="grid size-9 place-items-center rounded-full border border-[#d8c9cd]" aria-label="Producto anterior">
            <ChevronLeft size={15} />
          </button>
          <button onClick={() => changeSlide(1)} className="grid size-9 place-items-center rounded-full border border-[#d8c9cd]" aria-label="Producto siguiente">
            <ChevronRight size={15} />
          </button>
          <Link href={`/producto/${slide.productSlug}`} className="grid size-11 place-items-center rounded-full bg-[#35282d] text-white" aria-label={`Ver ${slide.productName}`}>
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>

      <div className="absolute right-6 top-6 flex gap-1.5 sm:right-8 sm:top-8">
        {slides.map((item, index) => (
          <button key={item.id} onClick={() => setActive(index)} className={`h-1.5 rounded-full transition-all ${index === safeActive ? "w-7 bg-[#35282d]" : "w-1.5 bg-[#35282d]/30"}`} aria-label={`Mostrar ${item.title}`} />
        ))}
      </div>
    </div>
  );
}
