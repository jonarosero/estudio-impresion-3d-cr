import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Music2, Play, Sparkles } from "lucide-react";
import { HeroBanner } from "@/components/hero-banner";
import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/data";

export default function Home() {
  const tiktokUrl = process.env.NEXT_PUBLIC_TIKTOK_URL || "https://www.tiktok.com/@estudio3dcr";
  return (
    <main>
      <section className="page-shell pt-5 sm:pt-8">
        <div className="grid min-h-[610px] overflow-hidden rounded-[30px] bg-[#ead7dc] lg:grid-cols-[1.02fr_1.18fr]">
          <div className="relative z-10 flex flex-col justify-center px-7 py-12 sm:px-12 lg:px-16">
            <p className="eyebrow">Objetos que cuentan algo</p>
            <h1 className="mt-5 max-w-xl font-display text-[clamp(3.3rem,7vw,6.8rem)] font-semibold leading-[0.82] tracking-[-0.055em]">
              Ideas que toman <span className="italic text-[#9e5f72]">forma.</span>
            </h1>
            <p className="mt-8 max-w-md text-sm leading-7 text-[#66575d] sm:text-base">
              Disenamos objetos impresos en 3D para darle personalidad, orden y una pequena alegria a tus espacios.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/catalogo" className="focus-ring inline-flex items-center gap-3 rounded-full bg-[#35282d] px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5">
                Ver coleccion <ArrowRight size={16} />
              </Link>
              <Link href="/personalizados" className="focus-ring inline-flex items-center rounded-full border border-[#b9959f] px-7 py-4 text-sm font-bold hover:bg-[#fffdfb]/50">
                Crear algo unico
              </Link>
            </div>
            <div className="mt-12 flex items-center gap-4 text-[11px] font-semibold text-[#66575d]">
              <div className="flex -space-x-2">
                {["#c98698", "#aeb9a4", "#d9b89c"].map((color) => (
                  <span key={color} className="size-8 rounded-full border-2 border-[#ead7dc]" style={{ backgroundColor: color }} />
                ))}
              </div>
              <span>Hecho en pequenos lotes<br />con materiales responsables</span>
            </div>
          </div>
          <HeroBanner />
        </div>
      </section>

      <section className="page-shell py-20 sm:py-28">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Para cada rincon</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-6xl">Explora a tu manera</h2>
          </div>
          <Link href="/catalogo" className="focus-ring inline-flex items-center gap-2 self-start rounded text-xs font-extrabold uppercase tracking-wider text-[#9e5f72]">
            Todo el catalogo <ArrowRight size={14} />
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
      </section>

      <section className="bg-[#fffdfb] py-20 sm:py-28">
        <div className="page-shell">
          <div className="text-center">
            <p className="eyebrow">Los mas queridos</p>
            <h2 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">Piezas con personalidad</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#786970]">Formas amables, texturas sutiles y colores pensados para convivir contigo.</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-5">
            {products.filter((product) => product.featured).map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section id="proceso" className="page-shell py-20 sm:py-28">
        <div className="grid overflow-hidden rounded-[30px] bg-[#35282d] text-white lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative flex flex-col justify-center p-8 sm:p-14 lg:p-16">
            <Music2 className="absolute right-8 top-8 size-28 rotate-12 text-[#eccbd3]/10" strokeWidth={1} />
            <p className="eyebrow !text-[#eccbd3]">Detras de cada capa</p>
            <h2 className="mt-4 max-w-lg font-display text-5xl font-semibold leading-[0.92] sm:text-7xl">Mira como nacen nuestras piezas.</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/60">En TikTok compartimos el proceso de impresion, pruebas de color, acabados y modelos nuevos antes de que lleguen a la tienda.</p>
            <div className="mt-9 flex flex-wrap gap-3"><a href={tiktokUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#eccbd3] px-6 py-3.5 text-sm font-bold text-[#35282d]"><Music2 size={16} /> Siguenos en TikTok</a><Link href="/personalizados" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-bold">Proponer una idea <ArrowRight size={15} /></Link></div>
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
      </section>
    </main>
  );
}
