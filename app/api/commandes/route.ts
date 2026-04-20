import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { envoyerEmailCommande } from "@/lib/email";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client, panier, total } = body;

    // =====================
    // VÉRIFICATIONS
    // =====================
    if (!client) {
      return NextResponse.json(
        { error: "Client manquant" },
        { status: 400 }
      );
    }

    if (!panier || panier.length === 0) {
      return NextResponse.json(
        { error: "Panier vide" },
        { status: 400 }
      );
    }

    if (
      !client.nom ||
      !client.email ||
      !client.telephone ||
      !client.adresse
    ) {
      return NextResponse.json(
        { error: "Informations client incomplètes" },
        { status: 400 }
      );
    }

    // =====================
    // ENREGISTREMENT COMMANDE WERO
    // =====================
    const commande = await prisma.commande.create({
      data: {
        nom: client.nom,
        email: client.email,
        telephone: client.telephone,
        adresse: client.adresse,
        total,
        produits: JSON.stringify(panier),

        // IMPORTANT
        statut: "EN_ATTENTE",
        paiement: "WERO",
      },
    });

    try {
    await envoyerEmailCommande(commande);
    } catch (error) {
     console.error("Erreur email :", error);
    }

    // =====================
    // RETOUR OK
    // =====================
    return NextResponse.json({
      success: true,
      commande,
    });
  } catch (error: unknown) {
    console.error("Erreur API /api/commandes :", error);

    const message =
      error instanceof Error ? error.message : "Erreur inconnue";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}