"use client";

import Link from "next/link";
import { useState } from "react";
import type { CSSProperties } from "react";

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
  const [videoOuverte, setVideoOuverte] = useState<string | null>(null);

  function getImageProduit(nom: string) {
    const n = nom.toLowerCase();

    if (n.includes("boeuf")) return "boeuf";
    if (n.includes("fromage")) return "fromage";
    return "poulet";
  }

  function getVideoProduit(nom: string) {
    const n = nom.toLowerCase();

    if (n.includes("boeuf")) return "/videos/cuisson-boeuf.mp4";
    if (n.includes("fromage")) return "/videos/cuisson-fromage.mp4";
    return "/videos/cuisson-poulet.mp4";
  }

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
      {toast && (
        <div style={toastStyle(toast.type)}>
          {toast.type === "success" ? "✅ " : "⚠️ "}
          {toast.message}
        </div>
      )}

      <div className="absolute inset-0 z-0">
        <img
          src="/images/fondEcran.jpg"
          alt=""
          className="h-full w-full object-cover scale-110 blur-[2px] opacity-30"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <section
          className="mt-3 rounded-[24px] px-4 py-5 shadow-[0_14px_35px_rgba(0,0,0,0.16)] md:px-3 md:py-3"
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
                Nos Samoussas
              </h1>

              <p className="mt-2 text-base italic text-[#92400e] md:text-lg">
                Croustillants, savoureux et faits maison
              </p>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#4b2e05] md:text-base">
                Idéal à l’apéro ou avec une salade.
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

        <div style={infoStyle}>
          👉 Cliquez sur <strong>"Sélectionner"</strong> pour sélectionner un produit.
          Ensuite, cliquez sur <strong>"Voir panier"</strong> 🧺 pour modifier les quantités.
        </div>

        <div style={gridStyle}>
          {produits.map((produit) => (
            <div
              key={produit.id}
              style={cardStyle}
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
              <div style={imageWrapperStyle}>
                <img
                  src={`/images/${getImageProduit(produit.nom)}.jpg`}
                  alt={produit.nom}
                  style={imageStyle}
                />

                <button
                  type="button"
                  onClick={() => setVideoOuverte(getVideoProduit(produit.nom))}
                  style={playButtonStyle}
                  title="Voir la cuisson"
                >
                  ▶
                </button>
              </div>

              <div style={{ padding: "16px" }}>
                <h2 style={titleStyle}>{produit.nom}</h2>

                <p style={descriptionStyle}>
                  {produit.nom.toLowerCase().includes("boeuf") &&
                    "Samoussas au bœuf croustillants."}
                  {produit.nom.toLowerCase().includes("fromage") &&
                    "Fromage fondant et croustillant."}
                  {produit.nom.toLowerCase().includes("poulet") &&
                    "Poulet tendre et épicé."}
                </p>

                <p style={priceStyle}>Prix : {produit.prix.toFixed(2)} €</p>

                <p style={stockStyle}>
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
                    ...selectButtonStyle,
                    background:
                      produit.stock === 0
                        ? "#9ca3af"
                        : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    cursor: produit.stock === 0 ? "not-allowed" : "pointer",
                    boxShadow:
                      produit.stock === 0
                        ? "none"
                        : "0 4px 10px rgba(37,99,235,0.4)",
                  }}
                >
                  🛒 Sélectionner
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "18px", textAlign: "center" }}>
          <Link href="/panier">
            <button style={panierButtonStyle}>Voir panier</button>
          </Link>
        </div>
      </div>

      {videoOuverte && (
        <div onClick={() => setVideoOuverte(null)} style={overlayStyle}>
          <div onClick={(e) => e.stopPropagation()} style={popupStyle}>
            <button onClick={() => setVideoOuverte(null)} style={closeBtnStyle}>
              ✕
            </button>

            <video
              src={videoOuverte}
              controls
              autoPlay
              style={videoStyle}
            />
          </div>
        </div>
      )}
    </main>
  );
}

function toastStyle(type: "success" | "error"): CSSProperties {
  return {
    position: "fixed",
    top: "18px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 99999,
    width: "calc(100% - 32px)",
    maxWidth: "420px",
    backgroundColor: type === "success" ? "#dcfce7" : "#fee2e2",
    color: type === "success" ? "#166534" : "#991b1b",
    padding: "13px 16px",
    borderRadius: "14px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "14px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  };
}

const infoStyle: CSSProperties = {
  maxWidth: "860px",
  margin: "10px auto 16px auto",
  backgroundColor: "#ffffff",
  padding: "12px 16px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  fontSize: "14px",
  color: "#374151",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
};

const cardStyle: CSSProperties = {
  borderRadius: "16px",
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  overflow: "hidden",
  transition: "0.2s",
};

const imageWrapperStyle: CSSProperties = {
  position: "relative",
};

const imageStyle: CSSProperties = {
  width: "100%",
  height: "190px",
  objectFit: "cover",
  display: "block",
};

const playButtonStyle: CSSProperties = {
  position: "absolute",
  right: "14px",
  bottom: "14px",
  width: "46px",
  height: "46px",
  borderRadius: "999px",
  border: "2px solid rgba(255,255,255,0.85)",
  background: "linear-gradient(135deg, #7c2d12, #b45309)",
  color: "white",
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: "bold",
  boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
};

const titleStyle: CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: "20px",
  color: "#111827",
  fontWeight: "bold",
};

const descriptionStyle: CSSProperties = {
  margin: "0 0 12px 0",
  fontSize: "14px",
  color: "#555",
};

const priceStyle: CSSProperties = {
  margin: "0 0 8px 0",
  fontSize: "15px",
  color: "#111827",
};

const stockStyle: CSSProperties = {
  margin: "0 0 14px 0",
  fontSize: "15px",
  color: "#111827",
};

const selectButtonStyle: CSSProperties = {
  padding: "12px",
  width: "100%",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  fontSize: "15px",
  transition: "all 0.2s",
};

const panierButtonStyle: CSSProperties = {
  padding: "12px 24px",
  fontSize: "17px",
  background: "linear-gradient(135deg, #16a34a, #15803d)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
};

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.75)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  padding: "20px",
};

const popupStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: "720px",
  background: "linear-gradient(135deg, #fff7ed, #ffffff)",
  borderRadius: "22px",
  padding: "16px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
  border: "1px solid #facc15",
};

const closeBtnStyle: CSSProperties = {
  position: "absolute",
  top: "-14px",
  right: "-14px",
  width: "36px",
  height: "36px",
  borderRadius: "999px",
  border: "none",
  backgroundColor: "#7c2d12",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "18px",
  zIndex: 2,
};

const videoStyle: CSSProperties = {
  width: "100%",
  borderRadius: "16px",
  display: "block",
};