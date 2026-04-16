"use client";

// =====================
// BOUTON VALIDER COMMANDE
// =====================
export default function ValiderButton({ id }: { id: number }) {
  async function validerCommande() {
    try {
      const response = await fetch("/api/commandes/valider", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commandeId: id }),
      });

      const text = await response.text();

      try {
        const data = JSON.parse(text);

        if (!response.ok) {
          alert(data.error || "Erreur validation");
          return;
        }

        alert("Commande validée ✅");
        window.location.reload();
      } catch {
        alert("Réponse serveur non JSON :\n\n" + text);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur serveur");
    }
  }

  return (
    <button
      onClick={validerCommande}
      style={{
        marginTop: "15px",
        padding: "10px 16px",
        background: "#16a34a",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Valider commande
    </button>
  );
}