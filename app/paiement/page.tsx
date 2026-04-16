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

  // =====================
// WERO → MESSAGE DE REMERCIEMENT
// =====================
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
        {/* HEADER PREMIUM */}
        <section
          className="mt-3 mb-6 rounded-[24px] px-4 py-5 shadow-[0_14px_35px_rgba(0,0,0,0.16)] md:px-6 md:py-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(248,238,214,0.96), rgba(238,220,150,0.92))",
          }}
        >
          <div className="grid items-center gap-4 md:grid-cols-[190px_1fr_190px]">
            <div className="flex justify-center md:justify-start">
              <img
                src="/images/Logosamoussas.png"
                alt="Logo gauche"
                className="w-[120px] md:w-[170px] lg:w-[100px] object-contain rounded-lg"
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

            <div className="flex justify-center md:justify-end">
              <img
                src="/images/Logosamoussas.png"
                alt="Logo droit"
                className="w-[120px] md:w-[170px] lg:w-[100px] object-contain rounded-lg"
              />
            </div>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.05fr]">
          {/* CLIENT */}
          <section
            style={{
              backgroundColor: "rgba(255,255,255,0.92)",
              borderRadius: "16px",
              padding: "14px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <h2
              style={{
                margin: "0 0 10px 0",
                fontSize: "21px",
                color: "#3a2a10",
              }}
            >
              Client
            </h2>

            {client ? (
              <div style={{ display: "grid", gap: "7px", fontSize: "15px" }}>
                <p style={{ margin: 0 }}>
                  <strong>Nom :</strong> {client.nom}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Email :</strong> {client.email}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Téléphone :</strong> {client.telephone}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Adresse :</strong> {client.adresse}
                </p>
              </div>
            ) : (
              <p style={{ margin: 0 }}>Aucune information client.</p>
            )}
          </section>

          {/* PANIER */}
          <section
            style={{
              backgroundColor: "rgba(255,255,255,0.92)",
              borderRadius: "16px",
              padding: "14px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <h2
              style={{
                margin: "0 0 10px 0",
                fontSize: "21px",
                color: "#3a2a10",
              }}
            >
              Panier
            </h2>

            {panier.length === 0 ? (
              <p style={{ margin: 0 }}>Panier vide.</p>
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
                      <p
                        style={{
                          margin: 0,
                          fontWeight: "bold",
                          fontSize: "16px",
                          color: "#4b2e05",
                        }}
                      >
                        {produit.nom}
                      </p>

                      <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>
                        Prix : {produit.prix.toFixed(2)} € — Quantité :{" "}
                        {quantite}
                      </p>

                      <p
                        style={{
                          margin: "5px 0 0 0",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
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
            background: "linear-gradient(135deg, #fff7ed, #ffffff)",
            borderRadius: "16px",
            padding: "18px 14px",
            textAlign: "center",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            border: "1px solid #fde68a",
          }}
        >
          <h2
            style={{
              margin: "0 0 14px 0",
              fontSize: "26px",
              color: "#3a2a10",
            }}
          >
            Total : {total.toFixed(2)} €
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >

       {/*   Stripe désactivé temporairement 
           <button disabled>
         Paiement Stripe (bientôt disponible)
          </button>    */}

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
                boxShadow: "0 6px 14px rgba(22,163,74,0.4)",
              }}
            >
     {chargement ? "Redirection..." : "Payer avec Stripe"}   
            </button>   

            <button
              type="button"
              onClick={() => setShowWero(true)}
              style={{
                padding: "11px 22px",
                fontSize: "16px",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 6px 14px rgba(37,99,235,0.35)",
              }}
            >
              Payer avec Wero
            </button>
          </div>
        </div>
      </div>

      {/* POPUP WERO CENTRÉE */}
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
            <h2
              style={{
                margin: "0 0 10px 0",
                color: "#1d4ed8",
                fontSize: "24px",
              }}
            >
              Paiement Wero
            </h2>

            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "15px",
                color: "#374151",
              }}
            >
              Envoyez <strong>{total.toFixed(2)} €</strong> au numéro :
            </p>

            <p
              style={{
                margin: "0 0 14px 0",
                fontSize: "22px",
                fontWeight: "bold",
                color: "#0f172a",
              }}
            >
              06 XX XX XX XX
            </p>

            <p
              style={{
                margin: "0 0 18px 0",
                fontSize: "14px",
                color: "#6b7280",
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
                style={{
                  padding: "11px 18px",
                  background: "#16a34a",
                  color: "white",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Paiement effectué
              </button>

              <button
                onClick={onAnnulerWero}
                style={{
                  padding: "11px 18px",
                  background: "#ef4444",
                  color: "white",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}