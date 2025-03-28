import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Dashboard from "@/app/components/dashboard"

export default async function Home() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  // Si no hay sesión, redirigir a login (esto es una verificación adicional)
  if (!session) {
    redirect("/login");
  }

  // Si hay sesión, mostrar el dashboard
  return <Dashboard />;
}