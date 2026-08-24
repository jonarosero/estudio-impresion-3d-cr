import { NextResponse } from "next/server";
import { getServerAuth, getServerDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";

async function assignMissingCodes(collectionName: "orders" | "quotes", counterName: "orders" | "quotes", prefix: "P" | "C", width: number) {
  const db = getServerDb();
  return db.runTransaction(async (transaction) => {
    const collectionRef = db.collection(collectionName);
    const counterRef = db.collection("counters").doc(counterName);
    const [documents, counter] = await Promise.all([transaction.get(collectionRef), transaction.get(counterRef)]);
    const highestExisting = documents.docs.reduce((highest, item) => {
      const code = String(item.data().code ?? "");
      const match = code.match(new RegExp(`^${prefix}-(\\d+)$`));
      return Math.max(highest, match ? Number(match[1]) : 0);
    }, 0);
    let sequence = Math.max(Number(counter.data()?.value ?? 0), highestExisting);
    const missing = documents.docs.filter((item) => !item.data().code).sort((left, right) => String(left.data().createdAt ?? "").localeCompare(String(right.data().createdAt ?? "")));
    missing.forEach((item) => {
      sequence += 1;
      transaction.update(item.ref, { code: `${prefix}-${String(sequence).padStart(width, "0")}` });
    });
    if (sequence !== Number(counter.data()?.value ?? 0)) transaction.set(counterRef, { value: sequence });
    return missing.length;
  });
}

export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Falta el token de acceso." }, { status: 401 });
  try {
    const user = await getServerAuth().verifyIdToken(token);
    if (user.admin !== true) return NextResponse.json({ error: "No tienes permisos administrativos." }, { status: 403 });
    const [orders, quotes] = await Promise.all([assignMissingCodes("orders", "orders", "P", 4), assignMissingCodes("quotes", "quotes", "C", 3)]);
    return NextResponse.json({ orders, quotes });
  } catch {
    return NextResponse.json({ error: "No se pudieron asignar los códigos pendientes." }, { status: 400 });
  }
}
