import { NextResponse } from "next/server";
import { getServerAuth, getServerDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";

const statuses = ["pending_payment", "paid", "production", "ready", "shipped", "delivered", "cancelled"] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Falta el token de acceso." }, { status: 401 });
  try {
    const user = await getServerAuth().verifyIdToken(token);
    if (user.admin !== true) return NextResponse.json({ error: "No tienes permisos administrativos." }, { status: 403 });
    const { status } = await request.json();
    if (!statuses.includes(status)) return NextResponse.json({ error: "Estado de pedido inválido." }, { status: 400 });
    const { orderId } = await params;
    const orderRef = getServerDb().collection("orders").doc(orderId);
    if (!(await orderRef.get()).exists) return NextResponse.json({ error: "No se encontró el pedido." }, { status: 404 });
    await orderRef.update({ status, ...(status === "paid" ? { paymentStatus: "paid", paidAt: new Date().toISOString() } : {}) });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code.startsWith("auth/")) return NextResponse.json({ error: "Token de acceso inválido o vencido." }, { status: 401 });
    return NextResponse.json({ error: "No se pudo actualizar el pedido." }, { status: 400 });
  }
}
