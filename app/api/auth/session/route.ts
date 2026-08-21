import { NextResponse } from "next/server";
import { getServerAuth } from "@/lib/firebase/admin";

export const runtime = "nodejs";

const cookieName = "jj-session";
const maxAge = 60 * 60 * 24 * 5;

export async function POST(request: Request) {
  const { idToken } = await request.json();
  if (!idToken) return NextResponse.json({ error: "Falta el token." }, { status: 400 });
  const sessionCookie = await getServerAuth().createSessionCookie(idToken, { expiresIn: maxAge * 1000 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, sessionCookie, { httpOnly: true, secure: true, sameSite: "lax", maxAge, path: "/" });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, "", { httpOnly: true, secure: true, sameSite: "lax", maxAge: 0, path: "/" });
  return response;
}
