import type { Metadata } from "next";
import Link from "next/link";
import { getSiteData } from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/seo";
import { directionsUrl, fullAddress, telHref } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { IconBag, IconCalendar, IconPhone, IconRoute, IconTrain } from "@/components/icons";

export const metadata: Metadata = {
  title: "Restaurant Halal près de Frais-Vallon (Marseille 13013)",
  description:
    "À une station M1 de Frais-Vallon, La Grillade de Malpa à Malpassé (13013) prépare vos sandwichs, assiettes grillées et burgers halal jusqu'à 1h.",
  alternates: { canonical: "/restaurant-frais-vallon" },
};

export default async function FraisVallonPage() {
  const data = await getSiteData();
  const { settings: s, uberEats } = data;
  const address = fullAddress(s);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Restaurant près de Frais-Vallon", path: "/restaurant-frais-vallon" },
        ])}
      />

      <section className="grain border-b border-coal-800 py-16 sm:py-24">
        <div className="container-x">
          <p className="eyebrow">Ligne M1 · Frais-Vallon ↔ Malpassé</p>
          <h1 className="font-display mt-2 text-4xl font-bold uppercase sm:text-6xl">
            Où manger halal près de Frais-Vallon ?
          </h1>
          <p className="lead mt-4 max-w-2xl">
            Située juste à côté de Frais-Vallon dans le 13e arrondissement, {s.name} vous accueille au{" "}
            {address} pour des viandes grillées à la commande, en salle, à emporter ou en livraison.
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
                Commander vers Frais-Vallon ({uberEats.name})
              </a>
            ) : null}
            {s.clickAndCollectEnabled ? (
              <Link href="/commander" className="btn-ember">
                <IconBag className="size-5" />
                Click &amp; Collect
              </Link>
            ) : null}
            <Link href="/carte" className="btn-ghost">
              Voir la carte
            </Link>
            <Link href="/reservation" className="btn-ghost">
              <IconCalendar className="size-5" />
              Réserver une table
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-8 md:grid-cols-2">
          <div className="card p-6 sm:p-8">
            <IconTrain className="size-7 text-amber-400" />
            <h2 className="font-display mt-4 text-2xl font-bold uppercase">
              Direct par le métro M1 ou par la route
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Les stations Frais-Vallon et Malpassé se suivent sur la ligne M1 du métro marseillais. Que
              vous veniez en métro ou en voiture en quelques minutes, notre restaurant du 1 Avenue de
              Valdonne est sur votre trajet.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={directionsUrl(`${s.name}, ${address}`)}
                target="_blank"
                rel="noopener"
                data-track="Itinéraire"
                className="btn-ghost text-xs"
              >
                <IconRoute className="size-4" />
                Calculer l&apos;itinéraire
              </a>
              <a href={telHref(s.phone)} data-track="Appeler" className="btn-ghost text-xs">
                <IconPhone className="size-4" />
                {s.phone}
              </a>
            </div>
          </div>

          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold uppercase">
              Assiettes familiales, sandwichs &amp; livraison dans le 13013
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Pour un repas en famille ou entre voisins de Frais-Vallon, nos assiettes 2 et 3 viandes
              servies avec frites et salade sont idéales à partager. Vous pouvez aussi commander depuis
              votre canapé sur {uberEats?.name ?? "Uber Eats"} tous les jours jusqu&apos;à 01h00.
            </p>
            <div className="mt-6">
              <Link href="/carte" className="btn-primary text-xs">
                Découvrir la carte complète →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

