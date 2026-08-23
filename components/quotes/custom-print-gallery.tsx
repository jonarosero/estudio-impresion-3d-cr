import Image from "next/image";
import Link from "next/link";

const customPrints = [
  {
    title: "Impresión personalizada",
    description: "Pieza creada a partir de la idea y referencias de nuestro cliente.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/estudio-jj-3d.firebasestorage.app/o/products%2F42317676-e637-4c70-bf25-84c973202562%2Fed3294ba-32f9-4b0c-b88e-b064febe9ed5?alt=media&token=f427ff05-6144-4311-8bf2-d5da847fdba4",
  },
];

export function CustomPrintGallery() {
  return (
    <section id="trabajos" className="mt-20 border-t border-[#e5d8dc] pt-16 sm:mt-28 sm:pt-20">
      <p className="eyebrow">Hecho para ideas reales</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-5xl font-semibold sm:text-6xl">
            Pedidos de nuestros clientes
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#786970]">
            Una selección de impresiones personalizadas que hemos llevado de
            idea a pieza.
          </p>
        </div>
        <span className="rounded-full bg-[#f3e7e9] px-4 py-2 text-[10px] font-bold text-[#9e5f72]">
          Galería en crecimiento
        </span>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {customPrints.map((print) => (
          <article key={print.image} className="overflow-hidden rounded-[26px] bg-[#fffdfb] soft-shadow">
            <div className="relative aspect-[4/5] bg-[#eadfe1]">
              <Image
                src={print.image}
                alt={print.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="font-display text-2xl font-semibold">{print.title}</h3>
              <p className="mt-2 text-xs leading-5 text-[#786970]">
                {print.description}
              </p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-10 grid gap-6 rounded-[28px] bg-[#35282d] p-7 text-white sm:mt-14 sm:grid-cols-[1fr_auto] sm:items-center sm:p-10">
        <div>
          <p className="eyebrow !text-[#eccbd3]">Hecho a tu medida</p>
          <h3 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Pide tú también
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
            Tu idea también puede tomar forma. Cuéntanos qué necesitas y
            preparemos una pieza única para ti.
          </p>
        </div>
        <Link
          href="#solicitud"
          className="inline-flex justify-center rounded-full bg-[#eccbd3] px-6 py-3.5 text-sm font-bold text-[#35282d]"
        >
          Crear mi pedido
        </Link>
      </div>
    </section>
  );
}
