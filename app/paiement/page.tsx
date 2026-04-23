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

  const router = useRouter();

  useEffect(() => {
    const panierStocke = localStorage.getItem("panier");
    const clientStocke = localStorage.getItem("client");

    const panierParse = panierStocke ? JSON.parse(panierStocke) : [];
    const clientParse = clientStocke ? JSON.parse(clientStocke) : null;

    setPanier(panierParse);
    setClient(clientParse);
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ panier, client }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      alert(data.error || "Erreur Stripe");
      setChargement(false);
    } catch (error) {
      console.error(error);
      alert("Erreur Stripe");
      setChargement(false);
    }
  }

  async function onPaiementWeroEffectue() {
    try {
      const panier = JSON.parse(localStorage.getItem("panier") || "[]");
      const client = JSON.parse(localStorage.getItem("client") || "null");

      const total = panier.reduce(
        (sum: number, p: any) => sum + p.prix * (p.quantite || 1),
        0
      );

      const response = await fetch("/api/commandes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client,
          panier,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erreur enregistrement commande");
        return;
      }

      setShowWero(false);
      localStorage.removeItem("panier");

      alert(
        "Merci. Votre commande a bien été enregistrée. Elle sera validée après vérification de votre paiement."
      );

      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Erreur enregistrement commande");
    }
  }

  function onAnnulerWero() {
    setShowWero(false);
    router.push("/");
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden px-4 py-3 md:px-6 lg:px-8">
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
        {/* HEADER CORRIGÉ */}
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

            {/* TEXTE */}
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

        {/* 👉 TOUT LE RESTE DE TON CODE NE CHANGE PAS */}
      </div>

      {/* POPUP WERO (inchangée) */}
      {showWero && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "20px" }}>
          <div style={{ width: "100%", maxWidth: "460px", background: "white", borderRadius: "18px", padding: "24px", boxShadow: "0 20px 50px rgba(0,0,0,0.25)", textAlign: "center" }}>
            <h2 style={{ margin: "0 0 10px 0", color: "#1d4ed8", fontSize: "24px" }}>
              Paiement Wero
            </h2>

            <p style={{ margin: "0 0 8px 0", fontSize: "15px", color: "#374151" }}>
              Envoyez <strong>{total.toFixed(2)} €</strong> au numéro :
            </p>

            <p style={{ margin: "0 0 14px 0", fontSize: "22px", fontWeight: "bold", color: "#0f172a" }}>
              07 66 08 97 75
            </p>

            <p style={{ margin: "0 0 18px 0", fontSize: "14px", color: "#6b7280" }}>
              Merci d’indiquer votre nom lors du paiement.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={onPaiementWeroEffectue} style={{ padding: "11px 18px", background: "#16a34a", color: "white", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                Paiement effectué
              </button>

              <button onClick={onAnnulerWero} style={{ padding: "11px 18px", background: "#ef4444", color: "white", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}