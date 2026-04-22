import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== "connected") {
    redirect("/admin/login");
  }

  // 👉 redirection directe vers commandes
  redirect("/admin/commandes");
}