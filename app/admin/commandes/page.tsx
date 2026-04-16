import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ValiderButton from "./ValiderButton";

export const dynamic = "force-dynamic";

type ProduitCommande = {
  id: number;
  nom: string;
  prix: number;
  quantite?: number;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

// =====================
// PAGE ADMIN COMMANDES
// =====================
export default async function AdminCommandesPage({
  searchParams,
}: {
  searchParams: Promise<{ password?: string }>;
}) {
  const { password } = await searchParams;

  if (password !== process.env.ADMIN_PASSWORD) {
    redirect("/");
  }

  const commandes = await prisma.commande.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "30px" }}>
        Historique des commandes
      </h1>

      {commandes.length === 0 ? (
        <p>Aucune commande pour le moment.</p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {commandes.map((commande: any) => {
            let produits: ProduitCommande[] = [];

            try {
              produits = commande.produits
                ? JSON.parse(commande.produits)
                : [];
            } catch {
              produits = [];
            }

            return (
              <div
                key={commande.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "20px",
                  backgroundColor: "#fff",
                }}
              >
                <h2 style={{ marginTop: 0, marginBottom: "15px" }}>
                  Commande #{commande.id}
                </h2>

                <p><strong>Nom :</strong> {commande.nom}</p>
                <p><strong>Email :</strong> {commande.email}</p>
                <p><strong>Téléphone :</strong> {commande.telephone}</p>
                <p><strong>Adresse :</strong> {commande.adresse}</p>
                <p><strong>Date :</strong> {formatDate(commande.createdAt)}</p>
                <p><strong>Total :</strong> {commande.total.toFixed(2)} €</p>

                {/* ===================== */}
                {/* STATUT */}
                {/* ===================== */}
                <p>
                  <strong>Statut :</strong>{" "}
                  {commande.statut === "EN_ATTENTE"
                    ? "⏳ En attente"
                    : "✅ Validée"}
                </p>

                {/* ===================== */}
                {/* PRODUITS */}
                {/* ===================== */}
                <div style={{ marginTop: "15px" }}>
                  <strong>Produits :</strong>
                  {produits.length === 0 ? (
                    <p style={{ marginTop: "8px" }}>Aucun détail produit.</p>
                  ) : (
                    <ul style={{ marginTop: "8px" }}>
                      {produits.map((produit, index) => (
                        <li key={`${produit.id}-${index}`}>
                          {produit.nom} — Quantité : {produit.quantite ?? 1} — Prix :{" "}
                          {produit.prix.toFixed(2)} €
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* ===================== */}
                {/* BOUTON VALIDER */}
                {/* ===================== */}
                {commande.statut === "EN_ATTENTE" && (
                  <ValiderButton id={commande.id} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}