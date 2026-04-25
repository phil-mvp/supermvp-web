POur correction . Avec le fichier complet stp //
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
        setWeroLoading(false);
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
    <main className="relative min-h-screen w-full overflow-hidden px-4 py-3 md:px-6 lg:px-8">
      {/* IMAGE FOND */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/fondEcran.jpg"
          alt=""
          className="h-full w-full object-cover scale-110 blur-[2px] opacity-30"
        />
      </div>

      {/* CONTENU */}
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <h1 className="text-center text-3xl font-bold text-[#7c2d12] mb-6">
          Paiement
        </h1>

        <h2 className="text-xl font-bold text-[#111827] mb-2">
          Total : {total.toFixed(2)} €
        </h2>

        <div className="flex gap-3">
          <button
            onClick={allerVersStripe}
            disabled={chargement}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {chargement ? "Redirection..." : "Stripe"}
          </button>

          <button
            onClick={() => setShowWero(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Wero
          </button>
        </div>
      </div>

      {/* POPUP WERO */}
      {showWero && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              opacity: 1,
              color: "#111827",
              padding: "24px",
              borderRadius: "16px",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#1d4ed8" }}>Paiement Wero</h2>

            <p style={{ color: "#111827" }}>
              Envoyez <strong>{total.toFixed(2)} €</strong>
            </p>

            <button
              onClick={onPaiementWeroEffectue}
              disabled={weroLoading}
              style={{
                background: "#16a34a",
                color: "white",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              {weroLoading ? "Enregistrement..." : "Paiement effectué"}
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION */}
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
          }}
        >
          <div
            style={{
              background: "#ffffff",
              opacity: 1,
              color: "#111827",
              padding: "24px",
              borderRadius: "16px",
              textAlign: "center",
            }}
          >
            <p>{confirmationMessage}</p>

            <button
              onClick={fermerConfirmation}
              style={{
                marginTop: "10px",
                background: "#2563eb",
                color: "white",
                padding: "10px",
                borderRadius: "8px",
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