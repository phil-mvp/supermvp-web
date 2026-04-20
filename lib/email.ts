import nodemailer from "nodemailer";

export async function envoyerEmailCommande(commande: any) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = `
Nouvelle commande reçue 🚀

Nom : ${commande.nom}
Email : ${commande.email}
Téléphone : ${commande.telephone}
Adresse : ${commande.adresse}

Total : ${commande.total} €
`;

 await transporter.sendMail({
  from: `"Samoussas Phils" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER,
  subject: "Nouvelle commande",
  text: message,
});

// 👉 EMAIL CLIENT
await transporter.sendMail({
  from: `"Samoussas Phils" <${process.env.EMAIL_USER}>`,
  to: commande.email,
  subject: "Confirmation de votre commande",
  text: `
Bonjour ${commande.nom},

Votre commande a bien été reçue ✅

Total : ${commande.total} €

Merci pour votre confiance 🙏
Samoussas Phils
`,
});
}