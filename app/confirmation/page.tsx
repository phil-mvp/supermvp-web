"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmationPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("panier");
    localStorage.removeItem("client");
  }, []);

  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial",
        maxWidth: "700px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "20px", color: "#16a34a" }}>
        Paiement confirmé
      </h1>

      <p style={{ fontSize: "20px", marginBottom: "20px" }}>
        Merci pour votre commande ✅
      </p>

      <p style={{ fontSize: "18px", marginBottom: "30px" }}>
        Votre paiement a bien été pris en compte.
      </p>

      <button
        onClick={() => router.push("/")}
        style={{
          padding: "12px 24px",
          fontSize: "18px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Retour à l'accueil
      </button>
    </main>
  );
}