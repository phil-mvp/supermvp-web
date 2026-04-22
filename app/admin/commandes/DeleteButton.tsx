"use client";

import { useState } from "react";

type Props = {
  id: number;
};

export default function DeleteButton({ id }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const ok = window.confirm(
      "Voulez-vous vraiment supprimer cette commande du site ?"
    );

    if (!ok) return;

    setLoading(true);

    try {
      const response = await fetch("/api/admin/commandes/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const contentType = response.headers.get("content-type") || "";
      const rawText = await response.text();

      console.log("STATUS =", response.status);
      console.log("CONTENT-TYPE =", contentType);
      console.log("RAW RESPONSE =", rawText);

      if (!contentType.includes("application/json")) {
        throw new Error(
          `Réponse non JSON reçue. Status ${response.status}.`
        );
      }

      const data = JSON.parse(rawText);

      if (!response.ok) {
        throw new Error(data.error || "Erreur suppression");
      }

      window.location.reload();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Impossible de supprimer la commande.";
      alert(message);
      console.error("Erreur suppression :", error);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      style={{
        marginTop: "12px",
        padding: "10px 16px",
        borderRadius: "10px",
        border: "none",
        backgroundColor: "#c62828",
        color: "white",
        fontWeight: "bold",
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Suppression..." : "Supprimer"}
    </button>
  );
}