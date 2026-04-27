"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ProduitPanier = {
  id: number;
  nom: string;
  prix: number;
  quantite?: number;
};

type Client = {
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
};

export default function PaiementPage() {
  const [panier, setPanier] = useState<ProduitPanier[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [chargement, setChargement] = useState(false);
  const [showWero, setShowWero] = useState(false);
  const [weroLoading, setWeroLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const panierStocke = localStorage.getItem("panier");
    const clientStocke = localStorage.getItem("client");

    setPanier(panierStocke ? JSON.parse(panierStocke) : []);
    setClient(clientStocke ? JSON.parse(clientStocke) : null);
  }, []);

  const total = panier.reduce((sum, produit) => {
    const quantite = produit.quantite ?? 1;
    return sum + produit.prix * quantite;
  }, 0);

  async function allerVersStripe() {
    try {
      setChargement(true);

      const panier = JSON.parse(localStorage.getItem("panier") || "[]");
      const client = JSON.parse(localStorage.getItem("client") || "null");

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panier, client }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setConfirmationMessage(data.error || "Erreur Stripe");
      setChargement(false);
    } catch (error) {
      console.error(error);
      setConfirmationMessage("Erreur Stripe");
      setChargement(false);
    }
  }

  async function onPaiementWeroEffectue() {
    if (weroLoading) return;

    try {
      setWeroLoading(true);

      const panier = JSON.parse(localStorage.getItem("panier") || "[]");
      const client = JSON.parse(localStorage.getItem("client") || "null");

      const total = panier.reduce(
        (sum: number, p: any) => sum + p.prix * (p.quantite || 1),
        0
      );

      const response = await fetch("/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client, panier, total }),
      });

      const data = await response.json();

      if (!response.ok) {
        setConfirmationMessage(data.error || "Erreur enregistrement commande");
        return;
      }

      setShowWero(false);
      localStorage.removeItem("panier");
      setPanier([]);

      setConfirmationMessage(
        "Merci. Votre commande a bien été enregistrée. Elle sera validée après vérification de votre paiement."
      );
    } catch (error) {
      console.error(error);
      setConfirmationMessage("Erreur enregistrement commande");
    } finally {
      setWeroLoading(false);
    }
  }

  function fermerConfirmation() {
    setConfirmationMessage(null);
    router.push("/");
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden px-4 py-3 md:px-6 lg:px-8 text-[#111827]">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/fondEcran.jpg"
          alt=""
          className="h-full w-full object-cover scale-110 blur-[2px] opacity-30"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-[#7c2d12]">
          Paiement
        </h1>

        <h2 className="mb-2 text-xl font-bold text-[#111827]">
          Total : {total.toFixed(2)} €
        </h2>

        <div className="flex gap-3">
          <button
            onClick={allerVersStripe}
            disabled={chargement}
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            {chargement ? "Redirection..." : "Stripe"}
          </button>

          <button
            onClick={() => setShowWero(true)}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Wero
          </button>
        </div>
      </div>

      {showWero && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99998,
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              backgroundColor: "#ffffff",
              color: "#111827",
              WebkitTextFillColor: "#111827",
              padding: "24px",
              borderRadius: "16px",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#1d4ed8", WebkitTextFillColor: "#1d4ed8" }}>
              Paiement Wero
            </h2>

            <p style={{ color: "#111827", WebkitTextFillColor: "#111827" }}>
              Envoyez <strong>{total.toFixed(2)} €</strong>
            </p>

            <button
              onClick={onPaiementWeroEffectue}
              disabled={weroLoading}
              style={{
                backgroundColor: "#16a34a",
                color: "#ffffff",
                WebkitTextFillColor: "#ffffff",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "bold",
              }}
            >
              {weroLoading ? "Enregistrement..." : "Paiement effectué"}
            </button>

            <button
              onClick={() => setShowWero(false)}
              disabled={weroLoading}
              style={{
                marginLeft: "10px",
                backgroundColor: "#ef4444",
                color: "#ffffff",
                WebkitTextFillColor: "#ffffff",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "bold",
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {confirmationMessage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              opacity: 1,
              padding: "24px",
              borderRadius: "16px",
              textAlign: "center",
              maxWidth: "430px",
              width: "100%",
            }}
          >
            <p
              style={{
                color: "#111827",
                WebkitTextFillColor: "#111827",
                fontSize: "17px",
                fontWeight: "bold",
                lineHeight: "1.5",
                margin: "0 0 18px 0",
              }}
            >
              {confirmationMessage}
            </p>

            <button
              onClick={fermerConfirmation}
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                WebkitTextFillColor: "#ffffff",
                padding: "11px 22px",
                borderRadius: "10px",
                border: "none",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </main>
  );
}