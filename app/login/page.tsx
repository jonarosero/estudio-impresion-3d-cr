import { LoginView } from "@/components/account/login-view";

export const metadata = { title: "Iniciar sesión" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const { redirect } = await searchParams;
  return <LoginView redirect={redirect} />;
}
