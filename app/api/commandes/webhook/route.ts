import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Signature invalide";

    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const clientRaw = session.metadata?.client;
      const panierRaw = session.metadata?.panier;
      const totalRaw = session.metadata?.total;

      if (!clientRaw || !panierRaw || !totalRaw) {
        return NextResponse.json(
          { error: "Metadata incomplète" },
          { status: 400 }
        );
      }

      const client = JSON.parse(clientRaw);
      const panier = JSON.parse(panierRaw);
      const total = Number(totalRaw);

      const dejaExiste = await prisma.commande.findFirst({
        where: {
          email: client.email,
          total,
          produits: JSON.stringify(panier),
        },
      });

      if (!dejaExiste) {
        await prisma.commande.create({
          data: {
            nom: client.nom,
            email: client.email,
            telephone: client.telephone,
            adresse: client.adresse,
            total,
            produits: JSON.stringify(panier),
            statut: "VALIDEE",
            paiement: "STRIPE",
          },
        });

        for (const item of panier) {
          const produit = await prisma.produit.findUnique({
            where: { id: item.id },
          });

          if (!produit || produit.stock < (item.quantite ?? 1)) {
            throw new Error(`Stock insuffisant pour le produit ${item.id}`);
          }

          await prisma.produit.update({
            where: { id: item.id },
            data: {
              stock: {
                decrement: item.quantite ?? 1,
              },
            },
          });
        }

        revalidatePath("/produits");
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erreur webhook";

    console.error("Erreur webhook Stripe :", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}