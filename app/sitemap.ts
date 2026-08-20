import type { MetadataRoute } from "next";
import { products } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://estudio-impresion-3d-cr.vercel.app";
  const pages = ["", "/catalogo", "/personalizados", "/login"];
  return [
    ...pages.map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() })),
    ...products.map((product) => ({
      url: `${baseUrl}/producto/${product.slug}`,
      lastModified: new Date(),
    })),
  ];
}
