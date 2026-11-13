import type { Metadata } from "next";
import Link from "next/link";
import { getSiteData } from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/seo";
import { directionsUrl, fullAddress, telHref } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { IconBag, IconCalendar, IconPhone, IconRoute } from "@/components/icons";

export const metadata: Metadata = {
  title: "Restaurant Halal près de Saint-Jérôme (Marseille 13013)",
  description:
    "À quelques minutes de Saint-Jérôme (13013), La Grillade de Malpa à Malpassé prépare vos grillades halal, sandwichs, assiettes et Uber Eats.",
  alternates: { canonical: "/restaurant-saint-jerome" },
};

export default async function SaintJeromePage() {
  const data = await getSiteData();
  const { settings: s, uberEats } = data;
  const address = fullAddress(s);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Restaurant près de Saint-Jérôme", path: "/restaurant-saint-jerome" },
        ])}
      />

      <section className="grain border-b border-coal-800 py-16 sm:py-24">
        <div className="container-x">
          <p className="eyebrow">Marseille 13013 · Voisin de Saint-Jérôme</p>
          <h1 className="font-display mt-2 text-4xl font-bold uppercase sm:text-6xl">
            Votre grillade halal à quelques minutes de Saint-Jérôme
          </h1>
          <p className="lead mt-4 max-w-2xl">
            Vous habitez, étudiez ou travaillez du côté de Saint-Jérôme dans le 13e arrondissement ?
            Située dans le quartier voisin de Malpassé au {address}, {s.name} est tout proche pour
            déjeuner, dîner ou commander en livraison.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {uberEats ? (
              <a
                href={uberEats.url}
                target="_blank"
                rel="noopener"
                data-track="Uber Eats"
                className="btn-primary"
              >
                <IconBag className="size-5" />
                Se faire livrer à Saint-Jérôme ({uberEats.name})
              </a>
            ) : null}
            {s.clickAndCollectEnabled ? (
              <Link href="/commander" className="btn-ember">
                <IconBag className="size-5" />
                Commander à emporter
              </Link>
            ) : null}
            <a
              href={directionsUrl(`${s.name}, ${address}`)}
              target="_blank"
              rel="noopener"
              data-track="Itinéraire"
              className="btn-ghost"
            >
              <IconRoute className="size-5" />
              Itinéraire depuis Saint-Jérôme
            </a>
            <Link href="/carte" className="btn-ghost">
              Voir la carte
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-8 md:grid-cols-2">
          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold uppercase">
              Accès rapide depuis Saint-Jérôme
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Malpassé et Saint-Jérôme sont deux quartiers voisins du 13013. En voiture, en deux-roues ou
              en transports en commun, vous rejoignez le {address} en quelques minutes seulement. Pratique
              pour récupérer une commande chaude ou partager une assiette sur place.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/reservation" className="btn-ghost text-xs">
                <IconCalendar className="size-4" />
                Réserver une table
              </Link>
              <a href={telHref(s.phone)} data-track="Appeler" className="btn-ghost text-xs">
                <IconPhone className="size-4" />
                {s.phone}
              </a>
            </div>
          </div>

          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold uppercase">
              Menus accessibles &amp; livraison jusqu&apos;à 1h
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Étudiants du secteur de Saint-Jérôme, familles ou travailleurs du midi : retrouvez nos
              sandwichs grillades, nos menus burgers et nos assiettes 1, 2 ou 3 viandes halal. Ouvert
              7j/7 de 11h00 à 01h00, avec livraison dans le 13e via {uberEats?.name ?? "Uber Eats"}.
            </p>
            <div className="mt-6">
              <Link href="/carte" className="btn-primary text-xs">
                Consulter tous les tarifs →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

