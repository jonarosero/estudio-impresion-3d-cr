import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroBanner } from "@/components/marketing/hero-banner";
import { ProductCard } from "@/components/product/product-card";
import { TiktokShowcase } from "@/components/marketing/tiktok-showcase";
import { categories, products } from "@/lib/data";

export default function Home() {
  return (
    <main>
      <section className="bg-[#f8f0f2]"><div className="page-shell pb-10 pt-5 sm:pb-14 sm:pt-8">
        <div className="grid min-h-[610px] overflow-hidden rounded-[30px] bg-[#ead7dc] lg:grid-cols-[1.02fr_1.18fr]">
          <div className="relative z-10 flex flex-col justify-center px-7 py-12 sm:px-12 lg:px-16">
            <p className="eyebrow">Objetos que cuentan algo</p>
            <h1 className="mt-5 max-w-xl font-display text-[clamp(3.3rem,7vw,6.8rem)] font-semibold leading-[0.82] tracking-[-0.055em]">
              Ideas que toman <span className="italic text-[#9e5f72]">forma.</span>
            </h1>
            <p className="mt-8 max-w-md text-sm leading-7 text-[#66575d] sm:text-base">
              Diseñamos objetos impresos en 3D para darle personalidad, orden y una pequeña alegría a tus espacios.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/catalogo" className="focus-ring inline-flex items-center gap-3 rounded-full bg-[#35282d] px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5">
                Ver colección <ArrowRight size={16} />
              </Link>
              <Link href="/personalizados" className="focus-ring inline-flex items-center rounded-full border border-[#b9959f] px-7 py-4 text-sm font-bold hover:bg-[#fffdfb]/50">
                Crear algo único
              </Link>
            </div>
            <div className="mt-12 flex items-center gap-4 text-[11px] font-semibold text-[#66575d]">
              <div className="flex -space-x-2">
                {["#c98698", "#aeb9a4", "#d9b89c"].map((color) => (
                  <span key={color} className="size-8 rounded-full border-2 border-[#ead7dc]" style={{ backgroundColor: color }} />
                ))}
              </div>
              <span>Hecho en pequeños lotes<br />con materiales responsables</span>
            </div>
          </div>
          <HeroBanner />
        </div>
      </div></section>

      <section className="bg-[#f4e9ec]"><div className="page-shell py-14 sm:py-20">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Para cada rincón</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-6xl">Explora a tu manera</h2>
          </div>
          <Link href="/catalogo" className="focus-ring inline-flex items-center gap-2 self-start rounded text-xs font-extrabold uppercase tracking-wider text-[#9e5f72]">
            Todo el catálogo <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-5">
          {categories.map((category, index) => (
            <Link
              key={category.id}
                href={category.id === "personalizadas" ? "/personalizados" : `/catalogo?categoria=${category.id}`}
              className={`group relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-[24px] border border-[#e5d8dc] p-5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#9e5f72]/10 ${index === 4 ? "col-span-2 bg-[#35282d] text-white md:col-span-1" : "bg-[#fffdfb]"}`}
            >
              <span className={`font-display text-5xl font-semibold ${index === 4 ? "text-white/15" : "text-[#ead7dc]"}`}>0{index + 1}</span>
              <div>
                <h3 className="font-display text-2xl font-semibold">{category.name}</h3>
                <p className={`mt-2 text-[11px] leading-5 ${index === 4 ? "text-white/60" : "text-[#786970]"}`}>{category.description}</p>
              </div>
              <ArrowRight className="absolute right-5 top-5 opacity-0 transition group-hover:opacity-100" size={17} />
            </Link>
          ))}
        </div>
      </div></section>

      <section className="bg-[#fffdfb] py-20 sm:py-28">
        <div className="page-shell">
          <div className="text-center">
            <p className="eyebrow">Los más queridos</p>
            <h2 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">Piezas con personalidad</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#786970]">Formas amables, texturas sutiles y colores pensados para convivir contigo.</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-5">
            {products.filter((product) => product.featured).map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <TiktokShowcase />
      {/* <section id="proceso" className="page-shell py-20 sm:py-28">
        <div className="grid overflow-hidden rounded-[30px] bg-[#35282d] text-white lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative flex flex-col justify-center p-8 sm:p-14 lg:p-16">
            <Music2 className="absolute right-8 top-8 size-28 rotate-12 text-[#eccbd3]/10" strokeWidth={1} />
            <p className="eyebrow !text-[#eccbd3]">Detrás de cada capa</p>
            <h2 className="mt-4 max-w-lg font-display text-5xl font-semibold leading-[0.92] sm:text-7xl">Mira cómo nacen nuestras piezas.</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/60">En TikTok compartimos el proceso de impresión, pruebas de color, acabados y modelos nuevos antes de que lleguen a la tienda.</p>
            <div className="mt-9 flex flex-wrap gap-3"><a href={tiktokUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#eccbd3] px-6 py-3.5 text-sm font-bold text-[#35282d]"><Music2 size={16} /> Síguenos en TikTok</a><Link href="/personalizados" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-bold">Proponer una idea <ArrowRight size={15} /></Link></div>
            <div className="mt-10 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-white/35"><Sparkles size={14} className="text-[#eccbd3]" /> Nuevos videos cada semana</div>
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-white/10 bg-white/5 p-4 sm:gap-4 sm:p-7 lg:border-l lg:border-t-0">
            {[
              { title: "De filamento a florero", image: products[1].image },
              { title: "Probando nuevos colores", image: products[0].image },
              { title: "Modelo nuevo en camino", image: products[2].image },
            ].map((video, index) => (
              <a key={video.title} href={tiktokUrl} target="_blank" rel="noreferrer" className={`group relative min-h-[330px] overflow-hidden rounded-[22px] sm:min-h-[450px] ${index === 1 ? "translate-y-5" : ""}`}>
                <Image src={video.image} alt={video.title} fill sizes="(max-width: 1024px) 30vw, 18vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
                <span className="absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-white/85 text-[#35282d]"><Play size={13} fill="currentColor" /></span>
                <div className="absolute bottom-4 left-4 right-4"><p className="text-[9px] font-bold uppercase tracking-wider text-[#eccbd3]">Video 0{index + 1}</p><p className="mt-1 font-display text-base font-semibold leading-tight sm:text-xl">{video.title}</p></div>
              </a>
            ))}
          </div>
        </div>
      </section> */}

      <section className="bg-[#fffdfb]"><div className="page-shell py-12 sm:py-16">
        <div className="grid overflow-hidden rounded-[30px] border border-[#e5d8dc] bg-white lg:grid-cols-[.85fr_1.15fr]">
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <p className="eyebrow">Hecho a tu medida</p>
            <h2 className="mt-4 font-display text-5xl font-semibold leading-[0.92] sm:text-6xl">Tu idea también puede tomar forma.</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#66575d]">Desde letreros y recuerdos hasta organizadores hechos para un espacio exacto. Estas son algunas de las piezas personalizadas que hemos creado.</p>
            <Link href="/personalizados" className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#35282d] px-6 py-3.5 text-sm font-bold text-white">Crear una pieza personalizada <ArrowRight size={15} /></Link>
            <p className="mt-5 text-[10px] leading-5 text-[#786970]">Envía referencias, medidas y color. Te responderemos dentro de una conversación privada.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 sm:gap-5 sm:p-7">
            {[
              { name: "Letrero para emprendimiento", detail: "Nombre y logotipo", image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=900&q=85", span: "row-span-2" },
              { name: "Recuerdos de bautizo", detail: "Serie x30", image: "https://images.unsplash.com/photo-1549989476-69a92fa57c36?auto=format&fit=crop&w=900&q=85", span: "" },
              { name: "Organizador a medida", detail: "Para maquillaje", image: "https://images.unsplash.com/photo-1583947582886-f40ec95dd752?auto=format&fit=crop&w=900&q=85", span: "" },
            ].map((piece) => (
              <div key={piece.name} className={`group relative min-h-44 overflow-hidden rounded-2xl ${piece.span}`}>
                <Image src={piece.image} alt={piece.name} fill sizes="(max-width: 1024px) 45vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#35282d]/75 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4"><p className="text-[9px] font-bold uppercase tracking-wider text-[#eccbd3]">{piece.detail}</p><p className="mt-1 font-display text-xl font-semibold text-white">{piece.name}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div></section>
    </main>
  );
}
