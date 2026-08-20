import type { CategoryId, Product } from "@/lib/types";

function makeColorVariants(colors: string[], image: string, price: number) {
  return colors.map((name) => ({
    name,
    type: name === "Ciruela" || name === "Caramelo" || name === "Miel" ? "marble" as const : "matte" as const,
    price: price + (name === "Ciruela" || name === "Caramelo" || name === "Miel" ? 1.5 : 0),
    image,
  }));
}

export const categories: Array<{
  id: CategoryId;
  name: string;
  description: string;
}> = [
  { id: "macetas", name: "Macetas", description: "Formas suaves para rincones vivos." },
  { id: "hogar", name: "Hogar", description: "Detalles cotidianos con intención." },
  { id: "organizadores", name: "Organizadores", description: "Orden bonito y funcional." },
  { id: "figuritas", name: "Figuritas", description: "Pequeñas piezas con personalidad." },
  { id: "personalizadas", name: "Personalizadas", description: "Tu idea, impresa especialmente." },
];

export const products: Product[] = [
  {
    id: "p1",
    slug: "maceta-onda",
    name: "Maceta Onda",
    shortName: "Onda",
    description: "Maceta de líneas orgánicas impresa capa a capa. Ideal para suculentas y espacios serenos.",
    category: "macetas",
    price: 18.5,
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/hjjmt/gradio_api/file=/tmp/gradio/0a0e907b1cb885bba493013916685a8e6613c9a4ab1a494640cda8ca122b10c7/image.webp",
    colors: ["Rosa nube", "Marfil", "Salvia"],
    colorVariants: makeColorVariants(["Rosa nube", "Marfil", "Salvia"], "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=85", 18.5),
    colorPresentation: "single",
    availableFinishes: ["standard"],
    badge: "Favorita",
    featured: true,
    weightGrams: 280,
  },
  {
    id: "p2",
    slug: "florero-pliegue",
    name: "Florero Pliegue",
    shortName: "Pliegue",
    description: "Un florero escultórico de acabado mate que transforma una sola rama en una composición.",
    category: "hogar",
    price: 24,
    compareAtPrice: 29,
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/hjjmt/gradio_api/file=/tmp/gradio/bce07e7a93fc2be0e739f7df0c393bf1fe4b05a96069d1a29ec0158ec8b3c8a3/image.webp",
    colors: ["Rosa arcilla", "Arena", "Ciruela"],
    colorVariants: makeColorVariants(["Rosa arcilla", "Arena", "Ciruela"], "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85", 24),
    colorPresentation: "single",
    availableFinishes: ["standard", "hand-painted"],
    badge: "Nuevo",
    featured: true,
    weightGrams: 420,
  },
  {
    id: "p3",
    slug: "organizador-nube",
    name: "Organizador Nube",
    shortName: "Nube",
    description: "Bandeja modular para joyas, llaves o escritorio con curvas continuas y tacto sedoso.",
    category: "organizadores",
    price: 16.9,
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/hjjmt/gradio_api/file=/tmp/gradio/d2fc792f0248eb80e58fb0f2860e8c30a1ea744ec3325a2ace35be5d53030c70/image.webp",
    colors: ["Rosa nube", "Lavanda", "Marfil"],
    colorVariants: makeColorVariants(["Rosa nube", "Lavanda", "Marfil"], "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=85", 16.9),
    colorPresentation: "single",
    availableFinishes: ["standard"],
    featured: true,
    weightGrams: 190,
  },
  {
    id: "p4",
    slug: "conejita-lola",
    name: "Conejita Lola",
    shortName: "Lola",
    description: "Figurita decorativa de formas redondeadas, perfecta para repisas y habitaciones infantiles.",
    category: "figuritas",
    price: 12.5,
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/hjjmt/gradio_api/file=/tmp/gradio/0a0e907b1cb885bba493013916685a8e6613c9a4ab1a494640cda8ca122b10c7/image.webp",
    colors: ["Rosa nube", "Blanco", "Caramelo"],
    colorVariants: makeColorVariants(["Rosa nube", "Blanco", "Caramelo"], "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?auto=format&fit=crop&w=1200&q=85", 12.5).map((variant) => ({ ...variant, type: "multicolor" as const })),
    colorPresentation: "multicolor",
    availableFinishes: ["standard"],
    badge: "Edición corta",
    featured: true,
    weightGrams: 120,
  },
  {
    id: "p5",
    slug: "maceta-bucle",
    name: "Maceta Bucle",
    shortName: "Bucle",
    description: "Volumen geométrico y ligero para plantas pequeñas. Incluye plato interior removible.",
    category: "macetas",
    price: 21,
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/hjjmt/gradio_api/file=/tmp/gradio/0a0e907b1cb885bba493013916685a8e6613c9a4ab1a494640cda8ca122b10c7/image.webp",
    colors: ["Terracota", "Salvia", "Marfil"],
    colorVariants: makeColorVariants(["Terracota", "Salvia", "Marfil"], "https://images.unsplash.com/photo-1509423350716-97f2360af8e4?auto=format&fit=crop&w=1200&q=85", 21),
    colorPresentation: "single",
    availableFinishes: ["standard"],
    weightGrams: 340,
  },
  {
    id: "p6",
    slug: "porta-incienso-luna",
    name: "Porta incienso Luna",
    shortName: "Luna",
    description: "Una pieza minimalista que recoge la ceniza y acompaña tus pausas diarias.",
    category: "hogar",
    price: 14,
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/hjjmt/gradio_api/file=/tmp/gradio/bce07e7a93fc2be0e739f7df0c393bf1fe4b05a96069d1a29ec0158ec8b3c8a3/image.webp",
    colors: ["Rosa arcilla", "Negro", "Arena"],
    colorVariants: makeColorVariants(["Rosa arcilla", "Negro", "Arena"], "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85", 14),
    colorPresentation: "single",
    availableFinishes: ["standard", "ready-to-paint"],
    weightGrams: 110,
  },
  {
    id: "p7",
    slug: "organizador-giro",
    name: "Organizador Giro",
    shortName: "Giro",
    description: "Contenedor de escritorio para lápices, brochas o herramientas creativas.",
    category: "organizadores",
    price: 19.5,
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/hjjmt/gradio_api/file=/tmp/gradio/d2fc792f0248eb80e58fb0f2860e8c30a1ea744ec3325a2ace35be5d53030c70/image.webp",
    colors: ["Lavanda", "Rosa nube", "Salvia"],
    colorVariants: makeColorVariants(["Lavanda", "Rosa nube", "Salvia"], "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85", 19.5),
    colorPresentation: "single",
    availableFinishes: ["standard"],
    badge: "Más vendido",
    weightGrams: 230,
  },
  {
    id: "p8",
    slug: "osita-aurora",
    name: "Osita Aurora",
    shortName: "Aurora",
    description: "Figura coleccionable de acabado mate, producida en pequeños lotes y numerada a mano.",
    category: "figuritas",
    price: 15.75,
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/hjjmt/gradio_api/file=/tmp/gradio/0a0e907b1cb885bba493013916685a8e6613c9a4ab1a494640cda8ca122b10c7/image.webp",
    colors: ["Rosa nube", "Miel", "Lavanda"],
    colorVariants: makeColorVariants(["Rosa nube", "Miel", "Lavanda"], "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=1200&q=85", 15.75).map((variant) => ({ ...variant, type: "multicolor" as const })),
    colorPresentation: "multicolor",
    availableFinishes: ["standard"],
    weightGrams: 150,
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
