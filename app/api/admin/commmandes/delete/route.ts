import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID commande manquant" },
        { status: 400 }
      );
    }

    const commande = await prisma.commande.findUnique({
      where: { id: Number(id) },
    });

    if (!commande) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    if (commande.statut !== "VALIDEE") {
      return NextResponse.json(
        { error: "Seules les commandes validées peuvent être supprimées." },
        { status: 400 }
      );
    }

    await prisma.commande.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression commande :", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}