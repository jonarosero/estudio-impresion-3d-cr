import Image from "next/image";
import Link from "next/link";
import { AddToCart } from "@/components/cart/add-to-cart";
import { FavoriteButton } from "@/components/product/favorite-button";
import { categories, formatPrice } from "@/lib/data";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const category = categories.find((item) => item.id === product.category)?.name;

  return (
    <article className="group min-w-0">
      <div className="relative aspect-[4/4.6] overflow-hidden rounded-[24px] bg-[#eee8e7]">
        <Link href={`/producto/${product.slug}`} className="absolute inset-0 z-10" aria-label={`Ver ${product.name}`} />
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#35282d]/10 to-transparent" />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-[#fffdfb]/90 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider backdrop-blur">
            {product.badge}
          </span>
        )}
        <FavoriteButton productId={product.id} productName={product.name} />
        <div className="absolute bottom-3 right-3 z-20 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
          <AddToCart product={product} compact />
        </div>
      </div>
      <div className="px-1 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9e5f72]">{category}</p>
        <div className="mt-1 flex items-start justify-between gap-2">
          <Link href={`/producto/${product.slug}`} className="font-display text-xl font-semibold leading-tight hover:text-[#9e5f72]">
            {product.name}
          </Link>
          <div className="shrink-0 text-right text-sm font-bold">
            {formatPrice(product.price)}
            {product.compareAtPrice && (
              <span className="ml-1 text-[10px] font-normal text-[#9b8e93] line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
