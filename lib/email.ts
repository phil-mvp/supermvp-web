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
        <td>${p.nom}</td>
        <td style="text-align:center;">${p.quantite ?? 1}</td>
        <td style="text-align:right;">${p.prix.toFixed(2)} €</td>
      </tr>
    `
    )
    .join("");

  const html = `
    <div style="font-family:Arial; max-width:600px; margin:auto;">
      <h2 style="color:#d32f2f;">🧾 Confirmation de commande</h2>

      <p>Bonjour <strong>${commande.nom}</strong>,</p>

      <p>Merci pour votre commande 🙏</p>

      <h3>Détails de la commande :</h3>

      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr>
            <th align="left">Produit</th>
            <th align="center">Quantité</th>
            <th align="right">Prix</th>
          </tr>
        </thead>
        <tbody>
          ${lignesProduits}
        </tbody>
      </table>

      <hr />

      <p><strong>Total :</strong> ${commande.total.toFixed(2)} €</p>
      <p><strong>Paiement :</strong> ${commande.paiement}</p>

      <hr />

      <p style="margin-top:20px;">
        Merci pour votre confiance 🙌<br/>
        <strong>Samoussas Phils</strong>
      </p>

    <hr style="margin:30px 0;" />

    <div style="text-align:center;">
    <p style="font-size:14px; color:#555;">
    Retrouvez-nous :
     </p>

    <img 
    src="https://supermvp-web.vercel.app/images/carte.png"
    alt="Carte Samoussas Phils"
    style="max-width:100%; border-radius:12px;"
    />
    </div>


    </div>
  `;

  // EMAIL ADMIN
  await transporter.sendMail({
    from: `"Samoussas Phils" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "Nouvelle commande",
    html,
  });

  // EMAIL CLIENT
  await transporter.sendMail({
    from: `"Samoussas Phils" <${process.env.EMAIL_USER}>`,
    to: commande.email,
    subject: "Confirmation de votre commande",
    html,
  });
}