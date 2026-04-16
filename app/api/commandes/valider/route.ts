import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const commandeId = Number(body.commandeId);

    // =====================
    // VÉRIFICATION ID
    // =====================
    if (!commandeId || Number.isNaN(commandeId)) {
      return NextResponse.json(
        { error: "commandeId invalide" },
        { status: 400 }
      );
    }

    // =====================
    // RÉCUPÉRATION COMMANDE
    // =====================
    const commande = await prisma.commande.findUnique({
      where: { id: commandeId },
    });

    if (!commande) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    if (commande.statut === "VALIDEE") {
      return NextResponse.json(
        { error: "Commande déjà validée" },
        { status: 400 }
      );
    }

    // =====================
    // LECTURE PANIER
    // =====================
    let panier: Array<{
      id: number;
      nom: string;
      quantite?: number;
    }> = [];

    try {
      panier = commande.produits ? JSON.parse(commande.produits) : [];
    } catch {
      return NextResponse.json(
        { error: "Produits de la commande invalides" },
        { status: 400 }
      );
    }

    if (!panier.length) {
      return NextResponse.json(
        { error: "Panier vide dans la commande" },
        { status: 400 }
      );
    }

    // =====================
    // VÉRIFICATION STOCK
    // =====================
    for (const item of panier) {
      const quantite = item.quantite ?? 1;

      const produit = await prisma.produit.findUnique({
        where: { id: item.id },
      });

      if (!produit) {
        return NextResponse.json(
          { error: `Produit introuvable : ${item.nom}` },
          { status: 404 }
        );
      }

      if (produit.stock < quantite) {
        return NextResponse.json(
          { error: `Stock insuffisant pour ${item.nom}` },
          { status: 400 }
        );
      }
    }

    // =====================
    // DÉCRÉMENT STOCK
    // =====================
    for (const item of panier) {
      const quantite = item.quantite ?? 1;

      await prisma.produit.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: quantite,
          },
        },
      });
    }

    // =====================
    // VALIDATION COMMANDE
    // =====================
    const commandeMiseAJour = await prisma.commande.update({
      where: { id: commandeId },
      data: {
        statut: "VALIDEE",
      },
    });

    // =====================
    // RAFRAÎCHISSEMENT PAGES
    // =====================
    revalidatePath("/produits");
    revalidatePath("/admin/commandes");

    return NextResponse.json({
      success: true,
      commande: commandeMiseAJour,
    });
  } catch (error: unknown) {
    console.error("Erreur API /api/commandes/valider :", error);

    const message =
      error instanceof Error ? error.message : "Erreur inconnue";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}