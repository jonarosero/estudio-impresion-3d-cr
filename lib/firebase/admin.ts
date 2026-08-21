import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function adminApp() {
  const value = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!value) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON no está configurada.");
  const serviceAccount = JSON.parse(value);
  return getApps().length ? getApps()[0] : initializeApp({ credential: cert(serviceAccount) });
}

export function getServerAuth() {
  return getAuth(adminApp());
}
