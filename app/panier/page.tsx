"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type ProduitPanier = {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
  stock: number;
};

export default function PanierPage() {
  const [panier, setPanier] = useState<ProduitPanier[]>([]);
  const [carteOuverte, setCarteOuverte] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const panierStocke = localStorage.getItem("panier");
    const panierParse = panierStocke ? JSON.parse(panierStocke) : [];
    setPanier(panierParse);
  }, []);

  const total = panier.reduce(
    (sum, produit) => sum + produit.prix * produit.quantite,
    0
  );

  function sauvegarderPanier(nouveauPanier: ProduitPanier[]) {
    setPanier(nouveauPanier);
    localStorage.setItem("panier", JSON.stringify(nouveauPanier));
  }

  function stopAutoQuantite() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function augmenterQuantite(id: number) {
    setPanier((ancienPanier) => {
      const nouveauPanier = ancienPanier.map((p) => {
        if (p.id === id) {
          if (p.quantite >= p.stock) {
            stopAutoQuantite();
            alert("Stock maximum atteint");
            return p;
          }
          return { ...p, quantite: p.quantite + 1 };
        }
        return p;
      });

      localStorage.setItem("panier", JSON.stringify(nouveauPanier));
      return nouveauPanier;
    });
  }

  function diminuerQuantite(id: number) {
    setPanier((ancienPanier) => {
      const nouveauPanier = ancienPanier
        .map((p) => (p.id === id ? { ...p, quantite: p.quantite - 1 } : p))
        .filter((p) => p.quantite > 0);

      localStorage.setItem("panier", JSON.stringify(nouveauPanier));
      return nouveauPanier;
    });
  }

  function startAutoQuantite(id: number, action: "plus" | "moins") {
    stopAutoQuantite();

    action === "plus"
      ? augmenterQuantite(id)
      : diminuerQuantite(id);

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        action === "plus"
          ? augmenterQuantite(id)
          : diminuerQuantite(id);
      }, 120);
    }, 350);
  }

  function supprimerProduit(id: number) {
    sauvegarderPanier(panier.filter((p) => p.id !== id));
  }

  function viderPanier() {
    if (!window.confirm("Voulez-vous vraiment vider le panier ?")) return;
    localStorage.removeItem("panier");
    setPanier([]);
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden px-3 py-4 md:px-6 lg:px-8">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/fondEcran.jpg"
          alt=""
          className="h-full w-full object-cover scale-110 blur-[2px] opacity-40"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">

        {/* LISTE PRODUITS */}
        {panier.length > 0 && (
          <div style={{ display: "grid", gap: "14px", marginBottom: "18px" }}>
            {panier.map((produit) => (
              <div key={produit.id} style={cardStyle}>
                <img
                  src={`/images/${
                    produit.nom.toLowerCase().includes("boeuf")
                      ? "boeuf22"
                      : produit.nom.toLowerCase().includes("fromage")
                      ? "fromage22"
                      : "poulet22"
                  }.jpg`}
                  alt={produit.nom}
                  style={imgStyle}
                />

                <div style={{ flex: 1 }}>
                  <h2 style={titleStyle}>{produit.nom}</h2>
                  <p style={textStyle}>
                    {produit.prix.toFixed(2)} € x {produit.quantite}
                  </p>
                  <p style={totalStyle}>
                    {(produit.prix * produit.quantite).toFixed(2)} €
                  </p>
                </div>

                <div style={actionsStyle}>
                  <button
                    title="Maintenir pour accélérer"
                    onMouseDown={() => startAutoQuantite(produit.id, "moins")}
                    onMouseUp={stopAutoQuantite}
                    onMouseLeave={stopAutoQuantite}
                    style={btnQty}
                  >
                    −
                  </button>

                  <span>{produit.quantite}</span>

                  <button
                    title="Maintenir pour accélérer"
                    onMouseDown={() => startAutoQuantite(produit.id, "plus")}
                    onMouseUp={stopAutoQuantite}
                    onMouseLeave={stopAutoQuantite}
                    style={btnQtyBlue}
                  >
                    +
                  </button>

                  <button onClick={() => supprimerProduit(produit.id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INFOS + LIEN */}
        <div style={infoBlock}>
          <p>
            📩 Une demande ?{" "}
            <button onClick={() => setCarteOuverte(true)} style={linkStyle}>
              Consultez notre carte de visite
            </button>
          </p>
        </div>

        {/* TOTAL */}
        <div style={totalBlock}>
          <h2>Total : {total.toFixed(2)} €</h2>
        </div>
      </div>

      {/* POPUP PREMIUM */}
      {carteOuverte && (
        <div
          onClick={() => setCarteOuverte(false)}
          style={overlayStyle}
        >
          <div onClick={(e) => e.stopPropagation()} style={popupStyle}>
            <button
              onClick={() => setCarteOuverte(false)}
              style={closeBtn}
            >
              ✕
            </button>

            <img
              src="/images/carte-visite.jpg"
              alt="Carte de visite"
              style={{ width: "100%", borderRadius: "12px" }}
            />
          </div>
        </div>
      )}
    </main>
  );
}

/* STYLES */
const cardStyle = {
  display: "flex",
  gap: "16px",
  padding: "16px",
  background: "#fff",
  borderRadius: "16px",
};

const imgStyle = {
  width: "100px",
  borderRadius: "12px",
};

const titleStyle = { fontWeight: "bold" };
const textStyle = {};
const totalStyle = { fontWeight: "bold" };

const actionsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const btnQty = {
  width: "34px",
  height: "34px",
  borderRadius: "8px",
};

const btnQtyBlue = {
  ...btnQty,
  backgroundColor: "#dbeafe",
};

const infoBlock = {
  background: "#fff7ed",
  padding: "16px",
  borderRadius: "12px",
  marginBottom: "12px",
};

const linkStyle = {
  color: "#b45309",
  fontWeight: "bold",
  textDecoration: "underline",
  background: "none",
  border: "none",
  cursor: "pointer",
};

const totalBlock = {
  textAlign: "center",
  fontSize: "22px",
  fontWeight: "bold",
};

const overlayStyle = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const popupStyle = {
  background: "white",
  padding: "16px",
  borderRadius: "16px",
  maxWidth: "500px",
  width: "90%",
  position: "relative" as const,
};

const closeBtn = {
  position: "absolute" as const,
  top: "10px",
  right: "10px",
  border: "none",
  background: "#ef4444",
  color: "white",
  borderRadius: "50%",
  width: "30px",
  height: "30px",
  cursor: "pointer",
};