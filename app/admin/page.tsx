import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== "connected") {
    redirect("/admin/login");
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Admin</h1>
      <p>Connexion réussie.</p>

      <form action="/api/admin/logout" method="POST">
        <button type="submit">Se déconnecter</button>
      </form>
    </div>
  );
}