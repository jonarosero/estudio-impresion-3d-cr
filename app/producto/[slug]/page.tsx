import { ProductDetailView } from "@/components/product/product-detail-view";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetailView slug={slug} />;
}
