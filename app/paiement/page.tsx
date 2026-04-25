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
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );

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

      if (!panier || panier.length === 0) {
        setConfirmationMessage("Votre panier est vide.");
        return;
      }

      if (!client) {
        setConfirmationMessage("Informations client manquantes.");
        return;
      }

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
            disabled={panier.length === 0}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
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
            zIndex: 99998,
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              backgroundColor: "#ffffff",
              opacity: 1,
              color: "#111827",
              WebkitTextFillColor: "#111827",
              padding: "24px",
              borderRadius: "18px",
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
              isolation: "isolate",
            }}
          >
            <h2
              style={{
                margin: "0 0 12px 0",
                color: "#1d4ed8",
                WebkitTextFillColor: "#1d4ed8",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              Paiement Wero
            </h2>

            <p
              style={{
                margin: "0 0 8px 0",
                color: "#111827",
                WebkitTextFillColor: "#111827",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              Envoyez <strong>{total.toFixed(2)} €</strong> au numéro :
            </p>

            <p
              style={{
                margin: "0 0 14px 0",
                color: "#111827",
                WebkitTextFillColor: "#111827",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              07 66 08 97 75
            </p>

            <p
              style={{
                margin: "0 0 18px 0",
                color: "#374151",
                WebkitTextFillColor: "#374151",
                fontSize: "14px",
              }}
            >
              Merci d’indiquer votre nom lors du paiement.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={onPaiementWeroEffectue}
                disabled={weroLoading}
                style={{
                  backgroundColor: "#16a34a",
                  color: "#ffffff",
                  WebkitTextFillColor: "#ffffff",
                  padding: "11px 18px",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: "bold",
                  cursor: weroLoading ? "not-allowed" : "pointer",
                  opacity: weroLoading ? 0.7 : 1,
                }}
              >
                {weroLoading ? "Enregistrement..." : "Paiement effectué"}
              </button>

              <button
                onClick={() => setShowWero(false)}
                disabled={weroLoading}
                style={{
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  WebkitTextFillColor: "#ffffff",
                  padding: "11px 18px",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: "bold",
                  cursor: weroLoading ? "not-allowed" : "pointer",
                  opacity: weroLoading ? 0.7 : 1,
                }}
              >
                Annuler
              </button>
            </div>
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
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "430px",
              backgroundColor: "#ffffff",
              opacity: 1,
              color: "#111827",
              WebkitTextFillColor: "#111827",
              padding: "24px",
              borderRadius: "18px",
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
              isolation: "isolate",
            }}
          >
            <p
              style={{
                margin: "0 0 18px 0",
                color: "#111827",
                WebkitTextFillColor: "#111827",
                fontSize: "17px",
                fontWeight: "bold",
                lineHeight: 1.5,
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
                cursor: "pointer",
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