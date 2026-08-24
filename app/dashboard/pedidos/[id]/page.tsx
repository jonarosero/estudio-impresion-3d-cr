import { OrderDetail } from "@/components/dashboard/order-detail";

export const metadata = { title: "Detalle de pedido" };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetail id={id} />;
}
