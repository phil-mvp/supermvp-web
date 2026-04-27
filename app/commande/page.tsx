"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function nettoyerTelephone(valeur: string) {
  return valeur.replace(/[^0-9 .-]/g, "");
}

export default function CommandePage() {
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");

  function continuerVersPaiement() {
    const nomClean = nom.trim();
    const emailClean = email.trim();
    const telephoneClean = telephone.trim();
    const adresseClean = adresse.trim();

    if (!nomClean || !emailClean || !telephoneClean || !adresseClean) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    const client = {
      nom: nomClean,
      email: emailClean,
      telephone: telephoneClean,
      adresse: adresseClean,
    };

    localStorage.setItem("client", JSON.stringify(client));
    router.push("/paiement");
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden px-4 py-6 md:px-6 lg:px-10 text-[#111827]">
      {/* IMAGE FOND */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/fondEcran.jpg"
          alt=""
          className="h-full w-full scale-110 object-cover blur-[2px] opacity-30"
        />
      </div>

      {/* CONTENU */}
      <div className="relative z-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid overflow-hidden rounded-[28px] border border-[#ead7a4] bg-white/90 shadow-xl md:grid-cols-[1fr_1.4fr]">

            {/* GAUCHE */}
            <div className="relative bg-gradient-to-br from-[#e9d08a] via-[#dcbf72] to-[#cfa653] p-6 text-[#4b2e05] md:p-8 lg:p-10">
              <div className="relative z-10">
                <p className="mb-2 inline-block rounded-full border border-[#cfa653] bg-white/40 px-3 py-1 text-sm font-medium">
                  Étape 1
                </p>

                <h1 className="text-3xl font-extrabold md:text-4xl">
                  Vos coordonnées
                </h1>

                <p className="mt-4 text-sm md:text-base">
                  Renseignez vos coordonnées avant le paiement.
                </p>
              </div>
            </div>

            {/* FORMULAIRE */}
            <div className="p-5 md:p-6 lg:p-8">
              <h2 className="text-xl font-bold text-[#3a2a10] md:text-2xl">
                Informations client
              </h2>

              <form className="space-y-5 mt-4">
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

                  {/* NOM */}
                  <div>
                    <label className="mb-2 block font-semibold">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      placeholder="Ex : Philippe Dupont"
                      className="w-full rounded-xl border px-4 py-3 text-[#111827] placeholder-gray-400"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="mb-2 block font-semibold">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nom@email.com"
                      className="w-full rounded-xl border px-4 py-3 text-[#111827] placeholder-gray-400"
                    />
                  </div>

                  {/* TEL */}
                  <div>
                    <label className="mb-2 block font-semibold">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={telephone}
                      onChange={(e) =>
                        setTelephone(nettoyerTelephone(e.target.value))
                      }
                      placeholder="06-12-34-56-78"
                      className="w-full rounded-xl border px-4 py-3 text-[#111827] placeholder-gray-400"
                    />
                  </div>

                  {/* ADRESSE */}
                  <div className="xl:col-span-2">
                    <label className="mb-2 block font-semibold">
                      Adresse
                    </label>
                    <textarea
                      value={adresse}
                      onChange={(e) => setAdresse(e.target.value)}
                      placeholder="Ex : 12 rue de Paris, 93200 Saint-Denis"
                      className="min-h-[120px] w-full rounded-xl border px-4 py-3 text-[#111827] placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* BOUTON */}
                <div className="flex justify-between items-center pt-2">
                  <p className="text-sm text-[#6b7280]">
                    Étape suivante : paiement
                  </p>

                 <button
                 type="button"
                 onClick={continuerVersPaiement}
                 className="cursor-pointer rounded-xl bg-[#cfa653] px-6 py-3 font-semibold text-white hover:bg-[#b8933f]"
                  >
                  Continuer
                </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}