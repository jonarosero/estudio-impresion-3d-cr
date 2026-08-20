import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Box, HeartHandshake, Layers3, MessageCircle } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/data";

export default function Home() {
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
          <div className="relative min-h-[390px] lg:min-h-full">
            <Image
              src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1600&q=90"
              alt="Objetos decorativos en un interior sereno"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#ead7dc]/25 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-[#fffdfb]/85 p-4 backdrop-blur-xl sm:bottom-8 sm:left-8 sm:right-auto sm:w-[310px]">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#9e5f72]">Pieza destacada</p>
                <p className="mt-1 font-display text-xl font-semibold">Florero Pliegue</p>
              </div>
              <Link href="/producto/florero-pliegue" className="grid size-11 place-items-center rounded-full bg-[#35282d] text-white" aria-label="Ver Florero Pliegue">
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
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
        <div className="grid overflow-hidden rounded-[30px] bg-[#35282d] text-white lg:grid-cols-[1fr_1.05fr]">
          <div className="p-8 sm:p-14 lg:p-16">
            <p className="eyebrow !text-[#eccbd3]">Nuestro proceso</p>
            <h2 className="mt-4 max-w-lg font-display text-5xl font-semibold leading-[0.95] sm:text-6xl">De una linea digital a un objeto real.</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/60">Cada pieza se prepara, imprime y termina en nuestro estudio. Sin produccion masiva, sin prisa innecesaria.</p>
            <Link href="/personalizados" className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#eccbd3] px-6 py-3.5 text-sm font-bold text-[#35282d]">
              Cuéntanos tu idea <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid divide-y divide-white/10 border-t border-white/10 lg:border-l lg:border-t-0">
            {[
              { icon: MessageCircle, number: "01", title: "Conversamos", text: "Entendemos la pieza, su uso, medidas y el color que imaginas." },
              { icon: Layers3, number: "02", title: "Creamos capa a capa", text: "Ajustamos el modelo y elegimos una impresion limpia y resistente." },
              { icon: HeartHandshake, number: "03", title: "Terminamos a mano", text: "Revisamos cada detalle antes de entregarlo listo para disfrutar." },
            ].map((step) => (
              <div key={step.number} className="grid grid-cols-[48px_1fr_auto] items-center gap-4 p-7 sm:p-9">
                <span className="grid size-12 place-items-center rounded-full bg-white/10 text-[#eccbd3]"><step.icon size={20} /></span>
                <div><h3 className="font-display text-2xl font-semibold">{step.title}</h3><p className="mt-1 max-w-md text-xs leading-5 text-white/55">{step.text}</p></div>
                <span className="font-display text-2xl text-white/20">{step.number}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell">
        <div className="relative overflow-hidden rounded-[30px] bg-[#d8b9c2] px-7 py-16 text-center sm:px-12 sm:py-20">
          <Box className="absolute -left-5 -top-8 size-36 rotate-12 text-white/15" strokeWidth={1} />
          <p className="eyebrow">Solo para ti</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-5xl font-semibold leading-[0.95] sm:text-7xl">¿Tienes una idea dando vueltas?</h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-[#5f4b53]">Envia tus imagenes de referencia por WhatsApp y conversemos sobre como hacerla realidad.</p>
          <Link href="/personalizados" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#35282d] px-7 py-4 text-sm font-bold text-white">Pedir una cotizacion <ArrowRight size={16} /></Link>
        </div>
      </section>
    </main>
  );
}
