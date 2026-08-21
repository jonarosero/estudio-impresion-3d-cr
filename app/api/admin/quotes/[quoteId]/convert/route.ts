import { NextResponse } from "next/server";
import { getServerAuth, getServerDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ quoteId: string }> }) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Falta el token de acceso." }, { status: 401 });
  try {
    const decoded = await getServerAuth().verifyIdToken(token);
    if (decoded.admin !== true) return NextResponse.json({ error: "No tienes permisos administrativos." }, { status: 403 });
    const { quoteId } = await params;
    const { unitPrice, shippingCost } = await request.json();
    if (!Number.isFinite(unitPrice) || unitPrice <= 0 || !Number.isFinite(shippingCost) || shippingCost < 0) return NextResponse.json({ error: "Ingresa un precio unitario válido y un envío no negativo." }, { status: 400 });
    const db = getServerDb();
    const result = await db.runTransaction(async (transaction) => {
      const quoteRef = db.collection("quotes").doc(quoteId);
      const quoteSnapshot = await transaction.get(quoteRef);
      if (!quoteSnapshot.exists) throw new Error("NOT_FOUND");
      const quote = quoteSnapshot.data()!;
      if (quote.status === "converted" || quote.orderId) throw new Error("ALREADY_CONVERTED");
      if (["discarded", "completed"].includes(quote.status)) throw new Error("INVALID_STATUS");
      const quantity = Number(quote.quantity);
      if (!Number.isFinite(quantity) || quantity < 1) throw new Error("INVALID_QUANTITY");
      const subtotal = Math.round(unitPrice * quantity * 100) / 100;
      const total = Math.round((subtotal + shippingCost) * 100) / 100;
      const orderRef = db.collection("orders").doc();
      const now = new Date().toISOString();
      transaction.set(orderRef, { id: orderRef.id, quoteId, userId: quote.userId, customer: quote.customer ?? "Cliente J&J", email: quote.email ?? "", phone: quote.phone ?? "", shippingAddress: "", city: "", reference: `Cotización ${quoteId}: ${quote.description ?? ""}`, lines: [{ productId: quoteId, name: "Producto personalizado", color: quote.color ?? "", quantity, unitPrice, weightGrams: 0 }], unitPrice, shippingCost, subtotal, total, currency: "USD", status: "pending_payment", paymentStatus: "pending", createdAt: now });
      transaction.update(quoteRef, { status: "converted", orderId: orderRef.id, approvedUnitPrice: unitPrice, shippingCost, subtotal, total, currency: "USD", convertedAt: now });
      return { orderId: orderRef.id, subtotal, total };
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    const status = message === "NOT_FOUND" ? 404 : message === "ALREADY_CONVERTED" ? 409 : message === "INVALID_STATUS" || message === "INVALID_QUANTITY" ? 400 : 500;
    return NextResponse.json({ error: message === "ALREADY_CONVERTED" ? "Esta cotización ya fue convertida." : message === "NOT_FOUND" ? "No se encontró la cotización." : message === "INVALID_STATUS" ? "La cotización no puede convertirse." : "No fue posible convertir la cotización." }, { status });
  }
}
