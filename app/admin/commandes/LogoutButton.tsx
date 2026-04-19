"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (!res.ok) {
        alert("Erreur logout");
        setLoading(false);
        return;
      }

      router.push("/admin/login");
      router.refresh();
    } catch {
      alert("Erreur serveur");
      setLoading(false);
    }
  }

  return (
  <button
  onClick={handleLogout}
  disabled={loading}
  style={{
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#e53935",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.2s",
  }}
>
  {loading ? "Déconnexion..." : "Se déconnecter"}
</button>
  );
}