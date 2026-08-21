import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/firebase/admin";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = (await cookies()).get("jj-session")?.value;
  if (!session) redirect("/login?redirect=/dashboard");
  try {
    const token = await getServerAuth().verifySessionCookie(session, true);
    if (token.admin !== true) redirect("/");
  } catch {
    redirect("/login?redirect=/dashboard");
  }
  return children;
}
