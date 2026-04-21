import nodemailer from "nodemailer";

export async function envoyerEmailCommande(commande: any) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let produits = [];

  try {
    produits = commande.produits ? JSON.parse(commande.produits) : [];
  } catch {
    produits = [];
  }

  const lignesProduits = produits
    .map(
      (p: any) => `
        <tr>
          <td style="padding:8px 0;">${p.nom}</td>
          <td style="padding:8px 0; text-align:center;">${p.quantite ?? 1}</td>
          <td style="padding:8px 0; text-align:right;">${p.prix.toFixed(2)} €</td>
        </tr>
      `
    )
    .join("");

  const html = `
    <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; color:#222;">

      <div style="text-align:center; margin-bottom:20px;">
        <img
          src="https://supermvp-web.vercel.app/images/carte.png"
          alt="Samoussas Phils"
          style="width:220px; max-width:100%; border-radius:12px; display:block; margin:0 auto;"
        />
      </div>

      <h2 style="color:#d32f2f; margin-bottom:20px;">🧾 Confirmation de commande</h2>

      <p>Bonjour <strong>${commande.nom}</strong>,</p>

      <p>Merci pour votre commande 🙏</p>

      <h3 style="margin-top:25px;">Détails de la commande :</h3>

      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr>
            <th align="left" style="padding-bottom:10px; border-bottom:1px solid #ddd;">Produit</th>
            <th align="center" style="padding-bottom:10px; border-bottom:1px solid #ddd;">Quantité</th>
            <th align="right" style="padding-bottom:10px; border-bottom:1px solid #ddd;">Prix</th>
          </tr>
        </thead>
        <tbody>
          ${lignesProduits}
        </tbody>
      </table>

      <hr style="margin:25px 0;" />

      <p><strong>Total :</strong> ${commande.total.toFixed(2)} €</p>
      <p><strong>Paiement :</strong> ${commande.paiement}</p>

      <hr style="margin:25px 0;" />

      <p style="margin-top:20px; line-height:1.6;">
        Merci pour votre confiance 🙌<br />
        <strong>Samoussas Phils</strong>
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Samoussas Phils" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "Nouvelle commande",
    html,
  });

  await transporter.sendMail({
    from: `"Samoussas Phils" <${process.env.EMAIL_USER}>`,
    to: commande.email,
    subject: "Confirmation de votre commande",
    html,
  });
}