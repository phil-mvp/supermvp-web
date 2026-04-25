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
      {/* IMAGE DE FOND */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/fondEcran.jpg"
          alt=""
          className="h-full w-full object-cover scale-110 blur-[2px] opacity-30"
        />
      </div>

      {/* CONTENU */}
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        {/* HEADER */}
        <section
          className="mt-3 mb-6 rounded-[24px] px-4 py-5 shadow-[0_14px_35px_rgba(0,0,0,0.16)] md:px-6 md:py-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(248,238,214,0.96), rgba(238,220,150,0.92))",
          }}
        >
          <div className="grid items-center gap-4 md:grid-cols-[190px_1fr_190px]">
            {/* LOGO MOBILE */}
            <div className="flex justify-center md:hidden">
              <img
                src="/images/Logosamoussas.png"
                alt="Logo"
                className="w-[110px] object-contain rounded-lg"
              />
            </div>

            {/* LOGO GAUCHE DESKTOP */}
            <div className="hidden md:flex justify-center md:justify-start">
              <img
                src="/images/Logosamoussas.png"
                alt="Logo gauche"
                className="w-[110px] lg:w-[120px] object-contain rounded-lg"
              />
            </div>

            <div className="text-center">
              <h1
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-3xl font-bold text-[#7c2d12] md:text-4xl"
              >
                Paiement
              </h1>

              <p className="mt-2 text-base italic text-[#92400e] md:text-lg">
                Vérifiez vos informations avant de finaliser la commande
              </p>
            </div>

            {/* LOGO DROIT DESKTOP */}
            <div className="hidden md:flex justify-center md:justify-end">
              <img
                src="/images/Logosamoussas.png"
                alt="Logo droit"
                className="w-[110px] lg:w-[120px] object-contain rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* CLIENT + PANIER */}
        <div className="grid gap-4 lg:grid-cols-[1fr_1.05fr]">
          {/* CLIENT */}
          <section
            style={{
              backgroundColor: "#ffffff",
              color: "#111827",
              borderRadius: "16px",
              padding: "14px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ margin: "0 0 10px 0", fontSize: "21px", color: "#111827" }}>
              Client
            </h2>

            {client ? (
              <div style={{ display: "grid", gap: "7px", fontSize: "15px", color: "#111827" }}>
                <p style={{ margin: 0 }}><strong>Nom :</strong> {client.nom}</p>
                <p style={{ margin: 0 }}><strong>Email :</strong> {client.email}</p>
                <p style={{ margin: 0 }}><strong>Téléphone :</strong> {client.telephone}</p>
                <p style={{ margin: 0 }}><strong>Adresse :</strong> {client.adresse}</p>
              </div>
            ) : (
              <p style={{ margin: 0, color: "#111827" }}>Aucune information client.</p>
            )}
          </section>

          {/* PANIER */}
          <section
            style={{
              backgroundColor: "#ffffff",
              color: "#111827",
              borderRadius: "16px",
              padding: "14px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ margin: "0 0 10px 0", fontSize: "21px", color: "#111827" }}>
              Panier
            </h2>

            {panier.length === 0 ? (
              <p style={{ margin: 0, color: "#111827" }}>Panier vide.</p>
            ) : (
              <div style={{ display: "grid", gap: "10px" }}>
                {panier.map((produit, index) => {
                  const quantite = produit.quantite ?? 1;
                  const sousTotal = produit.prix * quantite;

                  return (
                    <div
                      key={`${produit.id}-${index}`}
                      style={{
                        border: "1px solid #ead7a4",
                        borderRadius: "10px",
                        padding: "10px 12px",
                        background: "#fffdf8",
                        color: "#111827",
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: "bold", fontSize: "16px", color: "#111827" }}>
                        {produit.nom}
                      </p>

                      <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#374151" }}>
                        Prix : {produit.prix.toFixed(2)} € — Quantité : {quantite}
                      </p>

                      <p style={{ margin: "5px 0 0 0", fontSize: "14px", fontWeight: "bold", color: "#111827" }}>
                        Sous-total : {sousTotal.toFixed(2)} €
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* TOTAL + BOUTONS */}
        <div
          style={{
            marginTop: "14px",
            background: "#ffffff",
            borderRadius: "16px",
            padding: "18px 14px",
            textAlign: "center",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            border: "1px solid #fde68a",
            color: "#111827",
          }}
        >
          <h2 style={{ margin: "0 0 14px 0", fontSize: "26px", color: "#111827" }}>
            Total : {total.toFixed(2)} €
          </h2>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={allerVersStripe}
              disabled={chargement}
              style={{
                padding: "11px 22px",
                fontSize: "16px",
                background: "linear-gradient(135deg, #16a34a, #15803d)",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                cursor: chargement ? "not-allowed" : "pointer",
                opacity: chargement ? 0.7 : 1,
                fontWeight: "bold",
              }}
            >
              {chargement ? "Redirection..." : "Payer avec Stripe"}
            </button>

            <button
              type="button"
              onClick={() => setShowWero(true)}
              disabled={panier.length === 0}
              style={{
                padding: "11px 22px",
                fontSize: "16px",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                cursor: panier.length === 0 ? "not-allowed" : "pointer",
                opacity: panier.length === 0 ? 0.6 : 1,
                fontWeight: "bold",
              }}
            >
              Payer avec Wero
            </button>
          </div>
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
            <h2 style={{ margin: "0 0 12px 0", color: "#1d4ed8", WebkitTextFillColor: "#1d4ed8", fontSize: "24px", fontWeight: "bold" }}>
              Paiement Wero
            </h2>

            <p style={{ margin: "0 0 8px 0", color: "#111827", WebkitTextFillColor: "#111827", fontSize: "16px", fontWeight: 500 }}>
              Envoyez <strong>{total.toFixed(2)} €</strong> au numéro :
            </p>

            <p style={{ margin: "0 0 14px 0", color: "#111827", WebkitTextFillColor: "#111827", fontSize: "22px", fontWeight: "bold" }}>
              07 66 08 97 75
            </p>

            <p style={{ margin: "0 0 18px 0", color: "#374151", WebkitTextFillColor: "#374151", fontSize: "14px" }}>
              Merci d’indiquer votre nom lors du paiement.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
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
            <p style={{ margin: "0 0 18px 0", color: "#111827", WebkitTextFillColor: "#111827", fontSize: "17px", fontWeight: "bold", lineHeight: 1.5 }}>
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