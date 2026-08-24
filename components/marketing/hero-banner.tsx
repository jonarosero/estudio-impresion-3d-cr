"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, PackageCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { usePromotionStore } from "@/stores/promotion-store";
import { useSiteMediaStore } from "@/stores/site-media-store";

export function HeroBanner() {
  const promotions = usePromotionStore((state) => state.promotions);
  const messages = useSiteMediaStore((state) => state.bannerMessages);
  const [slideIndex, setSlideIndex] = useState(0);
  const slides = [
    ...promotions
      .filter((item) => item.active)
      .map((item) => ({
        href: `/producto/${item.productSlug}`,
        image: item.image,
        eyebrow: `Promoción activa · ${item.code}`,
        title: item.title,
        detail: item.message,
        value: item.value,
        cta: "Ver promoción",
        footer: "Una pieza especial, hecha para ti.",
      })),
    ...messages.map((item) => ({
      href: item.href,
      image: item.image,
      eyebrow: item.eyebrow ?? "Entregas J&J",
      title: item.title,
      detail:
        item.description ??
        (item.id === "local"
          ? "La Libertad, Salinas y cantón Santa Elena sin compra mínima."
          : "Calculamos la tarifa por destino y peso antes de finalizar tu pedido."),
      value: item.highlight ?? (item.id === "local" ? "Gratis" : "Ecuador"),
      cta: item.cta ?? "Conocer envío",
      footer: item.footer ?? "Una pieza especial, hecha para ti.",
    })),
  ];
  if (!slides.length)
    slides.push({
      href: "/catalogo",
      image: "",
      eyebrow: "J&J Estudio",
      title: "Objetos que cuentan algo",
      detail: "Conoce nuestra colección de piezas impresas en 3D.",
      value: "",
      cta: "Ver catálogo",
      footer: "",
    });
  const slide = slides[slideIndex % slides.length];

  useEffect(() => {
    const timer = window.setInterval(
      () => setSlideIndex((current) => (current + 1) % slides.length),
      5500,
    );
    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative isolate flex min-h-[540px] overflow-hidden bg-[#35282d] text-white lg:min-h-full">
      {slides.map(
        (item, index) =>
          item.image && (
            <Image
              key={item.image}
              src={item.image}
              alt=""
              fill
              priority={index === 0}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className={`-z-20 object-cover transition-opacity duration-1000 ease-in-out ${index === slideIndex ? "opacity-100" : "opacity-0"}`}
            />
          ),
      )}
      <div className="absolute inset-0 -z-10 bg-[#35282d]/88" />
      <div className="absolute -right-20 -top-20 size-72 rounded-full border-[52px] border-[#eccbd3]/15" />
      <div className="absolute -bottom-24 -left-24 size-72 rounded-full border-[44px] border-[#c98698]/15" />
      <div className="relative flex w-full flex-col justify-between p-7 pb-20 sm:p-10 sm:pb-20 lg:p-12 lg:pb-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#eccbd3]">
            <Truck size={13} /> {slide.eyebrow}
          </span>
          <p className="mt-10 max-w-md font-display text-5xl font-semibold leading-[0.9] sm:text-7xl">
            {slide.title}
          </p>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
            {slide.detail}
          </p>
        </div>
        <div className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <span className="font-display text-6xl font-semibold tracking-tight text-[#eccbd3] sm:text-8xl">
              {slide.value}
            </span>
            <span className="mb-2 max-w-32 text-xs font-bold leading-5">
              {slide.footer}
            </span>
          </div>
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#fffdfb] p-4 text-[#35282d]">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-[#f3e7e9] text-[#9e5f72]">
                <PackageCheck size={17} />
              </span>
              <div>
                <p className="text-[10px] font-bold">{slide.cta}</p>
                <p className="mt-0.5 text-[9px] text-[#786970]">
                  Actualizamos esta información desde el panel.
                </p>
              </div>
            </div>
            <Link
              href={slide.href}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-[#35282d] text-white"
              aria-label={slide.cta}
            >
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-[#35282d]/80 px-2 py-1.5">
          <button
            onClick={() =>
              setSlideIndex(
                (current) => (current - 1 + slides.length) % slides.length,
              )
            }
            className="p-1"
            aria-label="Diapositiva anterior"
          >
            <ArrowLeft size={12} />
          </button>
          {slides.map((item, index) => (
            <button
              key={`${item.eyebrow}-${index}`}
              onClick={() => setSlideIndex(index)}
              className={`size-1.5 rounded-full ${index === slideIndex ? "bg-[#eccbd3]" : "bg-white/40"}`}
              aria-label={`Ver ${item.title}`}
            />
          ))}
          <button
            onClick={() =>
              setSlideIndex((current) => (current + 1) % slides.length)
            }
            className="p-1"
            aria-label="Siguiente diapositiva"
          >
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
