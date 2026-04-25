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
        setWeroLoading(false);
        return;
      }

      if (!client) {
        setConfirmationMessage("Informations client manquantes.");
        setWeroLoading(false);
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

  function onAnnulerWero() {
    setShowWero(false);
  }

  function fermerConfirmation() {
    setConfirmationMessage(null);
    router.push("/");
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden px-4 py-3 md:px-6 lg:px-8">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/fondEcran.jpg"
          alt=""
          className="h-full w-full object-cover scale-110 blur-[2px] opacity-30"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <section
          className="mt-3 mb-6 rounded-[24px] px-4 py-5 shadow-[0_14px_35px_rgba(0,0,0,0.16)] md:px-6 md:py-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(248,238,214,0.96), rgba(238,220,150,0.92))",
          }}
        >
          <div className="grid items-center gap-4 md:grid-cols-[190px_1fr_190px]">
            <div className="flex justify-center md:hidden">
              <img
                src="/images/Logosamoussas.png"
                alt="Logo"
                className="w-[110px] object-contain rounded-lg"
              />
            </div>

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

            <div className="hidden md:flex justify-center md:justify-end">
              <img
                src="/images/Logosamoussas.png"
                alt="Logo droit"
                className="w-[110px] lg:w-[120px] object-contain rounded-lg"
              />
            </div>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.05fr]">
          <section
            style={{
              backgroundColor: "rgba(255,255,255,0.92)",
              borderRadius: "16px",
              padding: "14px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ margin: "0 0 10px 0", fontSize: "21px" }}>
              Client
            </h2>

            {client ? (
              <div style={{ display: "grid", gap: "7px", fontSize: "15px" }}>
                <p><strong>Nom :</strong> {client.nom}</p>
                <p><strong>Email :</strong> {client.email}</p>
                <p><strong>Téléphone :</strong> {client.telephone}</p>
                <p><strong>Adresse :</strong> {client.adresse}</p>
              </div>
            ) : (
              <p>Aucune information client.</p>
            )}
          </section>

          <section
            style={{
              backgroundColor: "rgba(255,255,255,0.92)",
              borderRadius: "16px",
              padding: "14px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ margin: "0 0 10px 0", fontSize: "21px" }}>
              Panier
            </h2>

            {panier.length === 0 ? (
              <p>Panier vide.</p>
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
                        background: "linear-gradient(135deg, #fffdf8, #fff7ed)",
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: "bold" }}>
                        {produit.nom}
                      </p>
                      <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>
                        Prix : {produit.prix.toFixed(2)} € — Quantité : {quantite}
                      </p>
                      <p style={{ margin: "5px 0 0 0", fontWeight: "bold" }}>
                        Sous-total : {sousTotal.toFixed(2)} €
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <div
          style={{
            marginTop: "14px",
            background: "linear-gradient(135deg, #fff7ed, #ffffff)",
            borderRadius: "16px",
            padding: "18px 14px",
            textAlign: "center",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            border: "1px solid #fde68a",
          }}
        >
          <h2 style={{ margin: "0 0 14px 0", fontSize: "26px" }}>
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
                color: "white",
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
                color: "white",
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
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              background: "white",
              borderRadius: "18px",
              padding: "24px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#1d4ed8", fontSize: "24px" }}>
              Paiement Wero
            </h2>

            <p>
              Envoyez <strong>{total.toFixed(2)} €</strong> au numéro :
            </p>

            <p style={{ fontSize: "22px", fontWeight: "bold" }}>
              07 66 08 97 75
            </p>

            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              Merci d’indiquer votre nom lors du paiement.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={onPaiementWeroEffectue}
                disabled={weroLoading}
                style={{
                  padding: "11px 18px",
                  background: "#16a34a",
                  color: "white",
                  borderRadius: "10px",
                  border: "none",
                  cursor: weroLoading ? "not-allowed" : "pointer",
                  opacity: weroLoading ? 0.7 : 1,
                  fontWeight: "bold",
                }}
              >
                {weroLoading ? "Enregistrement..." : "Paiement effectué"}
              </button>

              <button
                onClick={onAnnulerWero}
                disabled={weroLoading}
                style={{
                  padding: "11px 18px",
                  background: "#ef4444",
                  color: "white",
                  borderRadius: "10px",
                  border: "none",
                  cursor: weroLoading ? "not-allowed" : "pointer",
                  opacity: weroLoading ? 0.7 : 1,
                  fontWeight: "bold",
                }}
              >
                Annuler
              </button>
            </div>
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
              width: "100%",
              maxWidth: "430px",
              background: "white",
              borderRadius: "18px",
              padding: "24px",
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
            }}
          >
            <p style={{ fontSize: "17px", fontWeight: "bold", marginBottom: "18px" }}>
              {confirmationMessage}
            </p>

            <button
              onClick={fermerConfirmation}
              style={{
                padding: "11px 22px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "10px",
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