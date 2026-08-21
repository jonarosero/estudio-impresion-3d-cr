import { CheckoutSuccess } from "@/components/checkout/checkout-success";
export const metadata = { title: "Pedido creado" };
export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) { const { orderId } = await searchParams; return <CheckoutSuccess orderId={orderId} />; }
