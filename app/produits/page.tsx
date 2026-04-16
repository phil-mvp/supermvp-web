import { prisma } from "@/lib/prisma";
import ProduitsClient from "./ProduitsClient";
export const dynamic = "force-dynamic";

export default async function ProduitsPage() {
  const produits = await prisma.produit.findMany({
    orderBy: { id: "asc" },
  });

  return <ProduitsClient produits={produits} />;
}