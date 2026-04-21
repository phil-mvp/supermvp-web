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
    <main className="relative min-h-screen w-full overflow-hidden px-4 py-6 md:px-6 lg:px-10">
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
          {/* CADRE PRINCIPAL */}
          <div className="grid overflow-hidden rounded-[28px] border border-[#ead7a4] bg-white/90 shadow-xl md:grid-cols-[1fr_1.4fr]">
            {/* === GAUCHE === */}
            <div className="relative bg-gradient-to-br from-[#e9d08a] via-[#dcbf72] to-[#cfa653] p-6 text-[#4b2e05] md:p-8 lg:p-10">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/20 blur-3xl" />

              <div className="relative z-10">
                <p className="mb-2 inline-block rounded-full border border-[#cfa653] bg-white/40 px-3 py-1 text-sm font-medium">
                  Étape 1
                </p>

                <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">
                  Vos coordonnées
                </h1>

                <p className="mt-4 max-w-md text-sm text-[#5a3a08] md:text-base">
                  Renseignez vos coordonnées avant le paiement.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="rounded-xl border border-[#d6b86a] bg-white/40 p-3">
                    <p className="text-xs font-semibold uppercase text-[#7a5200]">
                      Simple
                    </p>
                    <p className="text-sm">Formulaire rapide</p>
                  </div>

                  <div className="rounded-xl border border-[#d6b86a] bg-white/40 p-3">
                    <p className="text-xs font-semibold uppercase text-[#7a5200]">
                      Sécurisé
                    </p>
                    <p className="text-sm">Avant paiement sécurisé</p>
                  </div>
                </div>
              </div>
            </div>

            {/* === FORMULAIRE === */}
            <div className="p-5 md:p-6 lg:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#3a2a10] md:text-2xl">
                  Informations client
                </h2>
                <p className="mt-1 text-sm text-[#7a6a4f]">
                  Merci de compléter tous les champs.
                </p>
              </div>

              <form className="space-y-5">
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-base font-semibold text-[#4b2e05]">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      placeholder="Ex : Philippe Dupont"
                      autoComplete="name"
                      className="w-full rounded-xl border border-[#e5d3a3] px-4 py-3 text-base outline-none focus:border-[#cfa653]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-base font-semibold text-[#4b2e05]">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nom@email.com"
                      autoComplete="email"
                      inputMode="email"
                      className="w-full rounded-xl border border-[#e5d3a3] px-4 py-3 text-base outline-none focus:border-[#cfa653]"
                    />
                    <p className="mt-1 text-xs text-[#7a6a4f]">
                      Exemple : samoussasphils@gmail.com
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-base font-semibold text-[#4b2e05]">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={telephone}
                      onChange={(e) =>
                        setTelephone(nettoyerTelephone(e.target.value))
                      }
                      placeholder="06-12-34-56-78"
                      autoComplete="tel"
                      inputMode="tel"
                      className="w-full rounded-xl border border-[#e5d3a3] px-4 py-3 text-base outline-none focus:border-[#cfa653]"
                    />
                    <p className="mt-1 text-xs text-[#7a6a4f]">
                      Formats acceptés : 06-12-34-56-78, 06.12.34.56.78 ou 06 12
                      34 56 78
                    </p>
                  </div>

                  <div className="xl:col-span-2">
                    <label className="mb-2 block text-base font-semibold text-[#4b2e05]">
                      Adresse
                    </label>
                    <textarea
                      value={adresse}
                      onChange={(e) => setAdresse(e.target.value)}
                      placeholder="Ex : 12 rue de Paris, 93200 Saint-Denis"
                      autoComplete="street-address"
                      className="min-h-[120px] w-full rounded-xl border border-[#e5d3a3] px-4 py-3 text-base outline-none focus:border-[#cfa653]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-[#7a6a4f]">
                    Étape suivante : paiement
                  </p>

                  <button
                    type="button"
                    onClick={continuerVersPaiement}
                    className="cursor-pointer rounded-xl bg-[#cfa653] px-6 py-3 text-base font-semibold text-white hover:bg-[#b8933f]"
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