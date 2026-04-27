"use client";

import Link from "next/link";
import { useState } from "react";

type Produit = {
  id: number;
  nom: string;
  prix: number;
  stock: number;
};

type ProduitPanier = {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
  stock: number;
};

type Props = {
  produits: Produit[];
};

type Toast = {
  message: string;
  type: "success" | "error";
};

export default function ProduitsClient({ produits }: Props) {
  const [toast, setToast] = useState<Toast | null>(null);

  function afficherToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2200);
  }

  function ajouterAuPanier(id: number, nom: string, prix: number, stock: number) {
    if (stock === 0) {
      afficherToast("Rupture de stock", "error");
      return;
    }

    const panierActuel = localStorage.getItem("panier");
    const panier: ProduitPanier[] = panierActuel ? JSON.parse(panierActuel) : [];
    const indexProduit = panier.findIndex((item) => item.id === id);

    if (indexProduit >= 0) {
      if (panier[indexProduit].quantite >= stock) {
        afficherToast("Stock maximum atteint", "error");
        return;
      }

      panier[indexProduit].quantite += 1;
      panier[indexProduit].stock = stock;
    } else {
      panier.push({
        id,
        nom,
        prix,
        quantite: 1,
        stock,
      });
    }

    localStorage.setItem("panier", JSON.stringify(panier));
    afficherToast(`${nom} ajouté au panier`, "success");
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden px-3 py-2 md:px-6 lg:px-8">
      {/* TOAST GLOBAL */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "18px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 99999,
            width: "calc(100% - 32px)",
            maxWidth: "420px",
            backgroundColor: toast.type === "success" ? "#dcfce7" : "#fee2e2",
            color: toast.type === "success" ? "#166534" : "#991b1b",
            padding: "13px 16px",
            borderRadius: "14px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "14px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
          }}
        >
          {toast.type === "success" ? "✅ " : "⚠️ "}
          {toast.message}
        </div>
      )}

      {/* IMAGE DE FOND */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/fondEcran.jpg"
          alt=""
          className="h-full w-full object-cover scale-110 blur-[2px] opacity-30"
        />
      </div>

      {/* CONTENU */}
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* HEADER */}
        <section
          className="mt-3 rounded-[24px] px-4 py-5 shadow-[0_14px_35px_rgba(0,0,0,0.16)] md:px-3 md:py-3"
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
                Nos Samoussas
              </h1>

              <p className="mt-2 text-base italic text-[#92400e] md:text-lg">
                Croustillants, savoureux et faits maison
              </p>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#4b2e05] md:text-base">
                Idéal à l’apéro ou avec une salade.
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

        {/* INFO */}
        <div
          style={{
            maxWidth: "860px",
            margin: "10px auto 16px auto",
            backgroundColor: "#ffffff",
            padding: "12px 16px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            fontSize: "14px",
            color: "#374151",
          }}
        >
          👉 Cliquez sur <strong>"Sélectionner"</strong> pour sélectionner vos produits.
          Ensuite, cliquez sur <strong>"Voir panier"</strong>🧺 pour modifier les quantités. 
        </div>

        {/* PRODUITS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {produits.map((produit) => (
            <div
              key={produit.id}
              style={{
                borderRadius: "16px",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                overflow: "hidden",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow =
                  "0 12px 28px rgba(0,0,0,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0,0,0,0.08)";
              }}
            >
              <img
                src={`/images/${
                  produit.nom.toLowerCase().includes("boeuf")
                    ? "boeuf"
                    : produit.nom.toLowerCase().includes("fromage")
                    ? "fromage"
                    : "poulet"
                }.jpg`}
                alt={produit.nom}
                style={{
                  width: "100%",
                  height: "190px",
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "16px" }}>

               <h2
                style={{
                 margin: "0 0 8px 0",
                  fontSize: "20px",
                 color: "#111827",
                fontWeight: "bold",
                 }}
                >
              {produit.nom}
            </h2>

                <p
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "14px",
                    color: "#555",
                  }}
                >
                  {produit.nom.toLowerCase().includes("boeuf") &&
                    "Samoussas au bœuf croustillants."}
                  {produit.nom.toLowerCase().includes("fromage") &&
                    "Fromage fondant et croustillant."}
                  {produit.nom.toLowerCase().includes("poulet") &&
                    "Poulet tendre et épicé."}
                </p>

               <p style={{ margin: "0 0 8px 0", fontSize: "15px", color: "#111827" }}>
                   Prix : {produit.prix.toFixed(2)} €
                </p>

               <p style={{ margin: "0 0 14px 0", fontSize: "15px", color: "#111827" }}>
                 {produit.stock === 0 ? "Rupture de stock" : "En stock"}
                  </p>
                  
                <button
                  onClick={() =>
                    ajouterAuPanier(
                      produit.id,
                      produit.nom,
                      produit.prix,
                      produit.stock
                    )
                  }
                  disabled={produit.stock === 0}
                  style={{
                    padding: "12px",
                    width: "100%",
                    background:
                      produit.stock === 0
                        ? "#9ca3af"
                        : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: produit.stock === 0 ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    fontSize: "15px",
                    boxShadow:
                      produit.stock === 0
                        ? "none"
                        : "0 4px 10px rgba(37,99,235,0.4)",
                    transition: "all 0.2s",
                  }}
                >
                  🛒 Sélectionner
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* BOUTON PANIER */}
        <div style={{ marginTop: "18px", textAlign: "center" }}>
          <Link href="/panier">
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
              }}
            >
              Voir panier
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}