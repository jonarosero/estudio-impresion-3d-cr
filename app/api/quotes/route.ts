import { NextResponse } from "next/server";
import { getServerAuth, getServerDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Falta el token de acceso." }, { status: 401 });
  try {
    const user = await getServerAuth().verifyIdToken(token);
    const { quoteId, quote, images } = await request.json();
    if (!quoteId || !quote?.description || !Array.isArray(images)) return NextResponse.json({ error: "Datos de cotización inválidos." }, { status: 400 });
    const db = getServerDb();
    const result = await db.runTransaction(async (transaction) => {
      const counterRef = db.collection("counters").doc("quotes");
      const counter = await transaction.get(counterRef);
      const sequence = Number(counter.data()?.value ?? 0) + 1;
      const code = `C-${String(sequence).padStart(3, "0")}`;
      const now = new Date();
      const expires = new Date(now);
      expires.setDate(expires.getDate() + 30);
      const quoteRef = db.collection("quotes").doc(String(quoteId));
      transaction.set(counterRef, { value: sequence });
      transaction.set(quoteRef, { ...quote, id: quoteRef.id, code, userId: user.uid, status: "new", images, createdAt: now.toISOString(), expiresAt: expires.toISOString() });
      transaction.set(quoteRef.collection("messages").doc(), { sender: "customer", text: String(quote.description), createdAt: now.toISOString() });
      return { code };
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code.startsWith("auth/")) return NextResponse.json({ error: "Token de acceso inválido o vencido." }, { status: 401 });
    return NextResponse.json({ error: "No se pudo crear la cotización." }, { status: 400 });
  }
}
