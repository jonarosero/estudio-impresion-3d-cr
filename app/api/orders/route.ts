import { NextResponse } from "next/server";
import { getServerAuth, getServerDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";

function orderCode(sequence: number) {
  return `P-${String(sequence).padStart(4, "0")}`;
}

export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Falta el token de acceso." }, { status: 401 });
  try {
    const user = await getServerAuth().verifyIdToken(token);
    const { details, lines: requestedLines } = await request.json();
    if (!Array.isArray(requestedLines) || !requestedLines.length) return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
    const db = getServerDb();
    const result = await db.runTransaction(async (transaction) => {
      const products = await Promise.all(requestedLines.map((line) => transaction.get(db.collection("products").doc(String(line.productId)))));
      const lines = products.map((product, index) => {
        const requested = requestedLines[index];
        const data = product.data();
        const quantity = Number(requested.quantity);
        if (!product.exists || data?.status !== "active" || !Number.isInteger(quantity) || quantity < 1) throw new Error("INVALID_LINE");
        return { productId: product.id, name: String(data.name), color: String(requested.color ?? ""), quantity, unitPrice: Number(data.price), weightGrams: Number(data.weightGrams ?? 0) };
      });
      const subtotal = lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0);
      const counterRef = db.collection("counters").doc("orders");
      const counter = await transaction.get(counterRef);
      const sequence = Number(counter.data()?.value ?? 0) + 1;
      const orderRef = db.collection("orders").doc();
      const now = new Date().toISOString();
      transaction.set(counterRef, { value: sequence });
      transaction.set(orderRef, { id: orderRef.id, code: orderCode(sequence), origin: "web", userId: user.uid, customer: String(details?.customer ?? ""), email: String(details?.email ?? user.email ?? ""), phone: String(details?.phone ?? ""), shippingAddress: String(details?.shippingAddress ?? ""), city: String(details?.city ?? ""), reference: String(details?.reference ?? ""), lines, subtotal, total: subtotal, status: "pending_payment", paymentStatus: "pending", createdAt: now });
      return { orderId: orderRef.id, code: orderCode(sequence) };
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code.startsWith("auth/")) return NextResponse.json({ error: "Token de acceso inválido o vencido." }, { status: 401 });
    return NextResponse.json({ error: "No se pudo crear el pedido." }, { status: 400 });
  }
}
