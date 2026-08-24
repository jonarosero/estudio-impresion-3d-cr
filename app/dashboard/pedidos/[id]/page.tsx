import { redirect } from "next/navigation";

export const metadata = { title: "Detalle de pedido" };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/dashboard?tab=pedidos&pedido=${encodeURIComponent(id)}`);
}
