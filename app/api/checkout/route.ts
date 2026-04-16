
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Paiement Stripe désactivé pour le moment" },
    { status: 503 }
  );
}



 {/*  import { NextResponse } from "next/server";
 import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { panier, client } = body;

    if (!panier || panier.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    if (!client) {
      return NextResponse.json({ error: "Client manquant" }, { status: 400 });
    }

    const total = panier.reduce((sum: number, item: any) => {
      const quantite = item.quantite ?? 1;
      return sum + item.prix * quantite;
    }, 0);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: panier.map((item: any) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.nom,
          },
          unit_amount: Math.round(item.prix * 100),
        },
        quantity: item.quantite ?? 1,
      })),
      success_url:
        "http://localhost:3000/confirmation?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/paiement",
      metadata: {
        client: JSON.stringify(client),
        panier: JSON.stringify(panier),
        total: String(total),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Erreur API /api/checkout :", error);

    const message =
      error instanceof Error ? error.message : "Erreur inconnue";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}   */}