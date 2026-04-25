"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ProduitPanier = {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
  stock: number;
};

export default function PanierPage() {
  const [panier, setPanier] = useState<ProduitPanier[]>([]);

  useEffect(() => {
    const panierStocke = localStorage.getItem("panier");
    const panierParse = panierStocke ? JSON.parse(panierStocke) : [];
    setPanier(panierParse);
  }, []);

  const total = panier.reduce(
    (sum, produit) => sum + produit.prix * produit.quantite,
    0
  );

  function augmenterQuantite(id: number) {
    const nouveauPanier = panier.map((p) => {
      if (p.id === id) {
        if (p.quantite >= p.stock) {
          alert("Stock maximum atteint");
          return p;
        }
        return { ...p, quantite: p.quantite + 1 };
      }
      return p;
    });

    setPanier(nouveauPanier);
    localStorage.setItem("panier", JSON.stringify(nouveauPanier));
  }

  function diminuerQuantite(id: number) {
    const nouveauPanier = panier
      .map((p) => (p.id === id ? { ...p, quantite: p.quantite - 1 } : p))
      .filter((p) => p.quantite > 0);

    setPanier(nouveauPanier);
    localStorage.setItem("panier", JSON.stringify(nouveauPanier));
  }

  function supprimerProduit(id: number) {
    const nouveauPanier = panier.filter((p) => p.id !== id);

    setPanier(nouveauPanier);
    localStorage.setItem("panier", JSON.stringify(nouveauPanier));
  }

  function viderPanier() {
    const ok = window.confirm("Voulez-vous vraiment vider le panier ?");
    if (!ok) return;

    localStorage.removeItem("panier");
    setPanier([]);
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden px-3 py-4 md:px-6 lg:px-8">
      {/* IMAGE DE FOND */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/fondEcran.jpg"
          alt=""
          className="h-full w-full object-cover scale-110 blur-[2px] opacity-40"
        />
      </div>

      {/* CONTENU */}
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <section
          className="mt-3 mb-6 rounded-[24px] px-5 py-6 shadow-[0_14px_35px_rgba(0,0,0,0.16)] md:px-4 md:py-4"
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

            {/* CONTENU CENTRE */}
            <div className="text-center">
              <h1
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-3xl font-bold text-[#7c2d12] md:text-4xl"
              >
                Mon Panier
              </h1>

              <p className="mt-2 text-base italic text-[#92400e] md:text-lg">
                Vérifiez vos produits avant de passer commande
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

        {panier.length === 0 ? (
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "18px",
              textAlign: "center",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <p style={{ fontSize: "20px", marginBottom: "20px" }}>
              Votre panier est vide.
            </p>

            <Link href="/produits">
              <button
                style={{
                  padding: "12px 24px",
                  fontSize: "18px",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Retour aux produits
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gap: "14px", marginBottom: "18px" }}>
              {panier.map((produit) => (
                <div
                  key={produit.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    borderRadius: "16px",
                    padding: "16px 18px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  }}
                >
                  <img
                    src={`/images/${
                      produit.nom.toLowerCase().includes("boeuf")
                        ? "boeuf22"
                        : produit.nom.toLowerCase().includes("fromage")
                        ? "fromage22"
                        : "poulet22"
                    }.jpg`}
                    alt={produit.nom}
                    style={{
                      width: "98px",
                      height: "78px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1 }}>

                    <h2
                     style={{
                      margin: "0 0 6px 0",
                       fontSize: "17px",
                       color: "#111827",
                      fontWeight: "bold",
                     }}
                      >
                       {produit.nom}
                    </h2>

                    <p style={{ margin: "0 0 4px 0", color: "#374151", fontSize: "15px" }}>
                      {produit.prix.toFixed(2)} € x {produit.quantite}
                    </p>

                    <p
                     style={{
                      margin: 0,
                      fontWeight: "bold",
                      fontSize: "15px",
                       color: "#111827",
                        }}
                        >
                      {(produit.prix * produit.quantite).toFixed(2)} €
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexShrink: 0,
                    }}
                  >
                    <button onClick={() => diminuerQuantite(produit.id)} style={btnQty}>
                      −
                    </button>

                    <span style={{ fontWeight: "bold", fontSize: "16px", minWidth: "16px", textAlign: "center" }}>
                      {produit.quantite}
                    </span>

                    <button onClick={() => augmenterQuantite(produit.id)} style={btnQtyBlue}>
                      +
                    </button>

                    <button
                      onClick={() => supprimerProduit(produit.id)}
                      style={{
                        backgroundColor: "#fee2e2",
                        color: "#b91c1c",
                        border: "none",
                        padding: "8px 11px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #fff7ed, #ffffff)",
                borderRadius: "20px",
                padding: "22px",
                boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
                textAlign: "center",
                border: "1px solid #fde68a",
              }}
            >
              <h2 style={{ marginBottom: "18px", color: "#111827", fontSize: "26px" }}>
                Total : {total.toFixed(2)} €
              </h2>

              <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/commande">
                  <button
                    style={{
                      padding: "12px 24px",
                      fontSize: "17px",
                      background: "linear-gradient(135deg, #16a34a, #15803d)",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      boxShadow: "0 6px 14px rgba(22,163,74,0.4)",
                    }}
                  >
                    Commander
                  </button>
                </Link>

                <button
                  onClick={viderPanier}
                  style={{
                    padding: "12px 24px",
                    fontSize: "17px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Vider le panier
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

const btnQty = {
  width: "34px",
  height: "34px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#e5e7eb",
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: "bold",
};

const btnQtyBlue = {
  ...btnQty,
  backgroundColor: "#dbeafe",
};