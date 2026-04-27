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
          <section className="rounded-[16px] bg-white p-4 shadow-md text-[#111827]">
            <h2 className="mb-3 text-xl font-bold text-[#111827]">Client</h2>

            {client ? (
              <div className="grid gap-2 text-[15px] text-[#111827]">
                <p><strong>Nom :</strong> {client.nom}</p>
                <p><strong>Email :</strong> {client.email}</p>
                <p><strong>Téléphone :</strong> {client.telephone}</p>
                <p><strong>Adresse :</strong> {client.adresse}</p>
              </div>
            ) : (
              <p>Aucune information client.</p>
            )}
          </section>

          <section className="rounded-[16px] bg-white p-4 shadow-md text-[#111827]">
            <h2 className="mb-3 text-xl font-bold text-[#111827]">Panier</h2>

            {panier.length === 0 ? (
              <p>Panier vide.</p>
            ) : (
              <div className="grid gap-3">
                {panier.map((produit, index) => {
                  const quantite = produit.quantite ?? 1;
                  const sousTotal = produit.prix * quantite;

                  return (
                    <div
                      key={`${produit.id}-${index}`}
                      className="rounded-[10px] border border-[#ead7a4] bg-[#fffdf8] p-3"
                    >
                      <p className="font-bold text-[#111827]">{produit.nom}</p>
                      <p className="mt-1 text-sm text-[#374151]">
                        Prix : {produit.prix.toFixed(2)} € — Quantité :{" "}
                        {quantite}
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#111827]">
                        Sous-total : {sousTotal.toFixed(2)} €
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <div className="mt-4 rounded-[16px] border border-[#fde68a] bg-white p-5 text-center shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-[#111827]">
            Total : {total.toFixed(2)} €
          </h2>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={allerVersStripe}
              disabled={chargement}
              className="cursor-pointer rounded-xl bg-green-600 px-6 py-3 font-bold text-white disabled:opacity-70 hover:bg-[#b8933f]"
            >
              {chargement ? "Redirection..." : "Payer avec Stripe"}
            </button>

            <button
              type="button"
              onClick={() => setShowWero(true)}
              disabled={panier.length === 0}
              className="cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-bold text-white disabled:opacity-60 hover:bg-[#b8933f]"
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
              borderRadius: "18px",
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
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

            <p style={{ color: "#111827", WebkitTextFillColor: "#111827" }}>
              Envoyez <strong>{total.toFixed(2)} €</strong> au numéro :
            </p>

            <p
              style={{
                color: "#111827",
                WebkitTextFillColor: "#111827",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              07 66 08 97 75
            </p>

            <p style={{ color: "#374151", WebkitTextFillColor: "#374151" }}>
              Merci d’indiquer votre nom lors du paiement.
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={onPaiementWeroEffectue}
                disabled={weroLoading}
                className="cursor-pointer rounded-lg bg-green-600 px-5 py-3 font-bold text-white disabled:opacity-70 hover:bg-[#b8933f]"
              >
                {weroLoading ? "Enregistrement..." : "Paiement effectué"}
              </button>

              <button
                onClick={() => setShowWero(false)}
                disabled={weroLoading}
                className="cursor-pointer rounded-lg bg-red-500 px-5 py-3 font-bold text-white disabled:opacity-70 hover:bg-[#b8933f]"
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
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "18px",
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
            }}
          >
            <p
              style={{
                color: "#111827",
                WebkitTextFillColor: "#111827",
                fontSize: "17px",
                fontWeight: "bold",
                lineHeight: 1.5,
                margin: "0 0 18px 0",
              }}
            >
              {confirmationMessage}
            </p>

            <button
              onClick={fermerConfirmation}
              className="cursor-pointer rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-[#b8933f]"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </main>
  );
}