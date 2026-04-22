import Link from "next/link";

const produits = [
  {
    nom: "Samoussas Bœuf (sauce soja oignon-vert)",
    image: "/images/boeuf.jpg",
    modedecuisson:
      "👉Cuisson dans un bain d'huile impérativement. 🔥Thermostat <160°c et 170°c> durée environ 5 mn.",
    description:
      "Un samoussa croustillant garni d’un bœuf savoureux et délicatement assaisonné.",
    composition:
      "🥩Bœuf haché, oignon, tomate, épices, huile et garni d'une pâte à pain.",
    allergenes: "Gluten, fruits à coque.",
    info: "Tous les produits origine: viande française et farine bio.",
  },
  {
    nom: "Samoussas Fromage (comté, meule-fruitée, tomme des Alpes)",
    image: "/images/fromage.jpg",
    modedecuisson:
      "👉Cuisson dans un bain d'huile impérativement. 🔥Thermostat <160°c> durée environ 3 mn.",
    description:
      "Une version fondante et généreuse, idéale pour les amateurs de fromage.",
    composition:
      "🧀Fromages pâtes pressées cuites, épices, huile et garni d'une pâte à pain.",
    allergenes: "Lait, gluten.",
    info: "Tous les fromages origine: France et farine bio.",
  },
  {
    nom: "Samoussas Poulet (curry coriandre)",
    image: "/images/poulet.jpg",
    modedecuisson:
      "👉Cuisson dans un bain d'huile impérativement. 🔥Thermostat <160°c et 170°c> durée environ 5 mn.",
    description:
      "Un samoussa au poulet tendre, parfumé et légèrement épicé.",
    composition:
      "🍗Poulet, oignon, tomate, épices, huile et garni d'une pâte à pain.",
    allergenes: "Gluten.",
    info: "Tous les produits origine: viande française et farine bio.",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden px-3 py-3 md:px-5 lg:px-6">
      {/* IMAGE DE FOND */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/fondEcran.jpg"
          alt=""
          className="h-full w-full object-cover scale-110 blur-[2px] opacity-30"
        />
      </div>

      {/* CONTENU */}
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {/* HERO PRO */}
       
       <section
  className="mt-3 rounded-[24px] px-4 py-5 shadow-[0_14px_35px_rgba(0,0,0,0.16)] md:px-6 md:py-6"
  style={{
    background:
      "linear-gradient(135deg, rgba(248,238,214,0.96), rgba(238,220,150,0.92))",
  }}
>
  <div className="grid items-center gap-4 md:grid-cols-[190px_1fr_190px]">
    
    {/* LOGO GAUCHE */}
    <div className="flex justify-center md:justify-start">
      <img
        src="/images/Logosamoussas.png"
        alt="Logo gauche"
        className="w-[120px] md:w-[170px] lg:w-[210px] object-contain rounded-lg"
      />
    </div>

    {/* CONTENU CENTRE */}
    <div className="text-center">
      <h1
        style={{ fontFamily: "'Playfair Display', serif" }}
        className="text-3xl font-bold text-[#7c2d12] md:text-4xl"
      >
        Samoussas Prestige
      </h1>

      <p className="mt-2 text-base italic text-[#92400e] md:text-lg">
        Le goût qui fait la différence
      </p>

      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#4b2e05] md:text-base">
        Des Samoussas Croustillants, Généreux et Savoureux.
        A déguster pour vos apéritifs, repas et moments gourmands.
      </p>

      <div className="mt-4">
        <Link href="/produits">
          <button
            className="cursor-pointer rounded-xl px-6 py-2.5 text-base font-bold text-white transition hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #16a34a, #15803d)",
              boxShadow: "0 8px 20px rgba(22,163,74,0.30)",
            }}
          >
            Voir en boutique
          </button>
        </Link>
      </div>
    </div>

    {/* LOGO DROIT */}
    <div className="flex justify-center md:justify-end">
      <img
        src="/images/Logosamoussas.png"
        alt="Logo droit"
        className="w-[120px] md:w-[170px] lg:w-[210px] object-contain rounded-lg"
      />
    </div>

  </div>
</section>

        {/* INTRO */}
        <section className="mt-3 rounded-[18px] bg-white/90 px-2 py-1 text-center shadow-md">
          <h2 className="text-xl font-bold text-[#3a2a10] md:text-2xl">
            Nos spécialités
          </h2>
          <p className="mt-1 text-xs text-[#6b7280] md:text-sm">
            Découvrez chaque recette, sa composition et les allergènes associés.
          </p>
        </section>

        {/* PRODUITS */}
        <section className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {produits.map((produit) => (
            <article
              key={produit.nom}
              className="overflow-hidden rounded-[18px] bg-white/95 shadow-lg transition hover:scale-[1.01]"
            >
              <img
                src={produit.image}
                alt={produit.nom}
                className="h-[190px] w-full object-cover"
              />

              <div className="p-4">
                <h3 className="text-xl font-bold text-[#4b2e05]">
                  {produit.nom}
                </h3>

                <p className="mt-2 text-sm leading-5 text-[#555]">
                  {produit.description}
                </p>

                <div className="mt-3 rounded-xl border border-[#fdba74] bg-[#fff7ed] p-3">
                  <p className="text-xs font-bold text-[#9a3412]">
                    🔥 Mode de cuisson
                  </p>
                  <p className="mt-1 text-sm leading-5 text-[#4b2e05]">
                    {produit.modedecuisson}
                  </p>
                </div>

                <div className="mt-3 rounded-xl border border-[#d9c39a] bg-[#fffdf8] p-3">
                  <p className="text-xs font-bold text-[#7a5200]">
                    ℹ️ Informations
                  </p>
                  <p className="mt-1 text-sm leading-5 text-[#4b2e05]">
                    {produit.info}
                  </p>
                </div>

                <div className="mt-3 rounded-xl border border-[#ead7a4] bg-[#fffaf0] p-3">
                  <p className="text-xs font-bold text-[#7a5200]">
                    Composition
                  </p>
                  <p className="mt-1 text-sm leading-5 text-[#4b2e05]">
                    {produit.composition}
                  </p>
                </div>

                <div className="mt-3 rounded-xl border border-[#f3c5c5] bg-[#fff5f5] p-3">
                  <p className="text-xs font-bold text-[#991b1b]">
                    ⚠ Allergènes
                  </p>
                  <p className="mt-1 text-sm leading-5 text-[#7f1d1d]">
                    {produit.allergenes}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}