import type { Metadata } from "next";
import Link from "next/link";
import { getSiteData } from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/seo";
import { directionsUrl, fullAddress, telHref } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { IconBag, IconCalendar, IconPhone, IconRoute, IconTrain } from "@/components/icons";

export const metadata: Metadata = {
  title: "Restaurant Grillade Halal près de La Rose (Marseille 13013)",
  description:
    "À quelques minutes de La Rose en métro M1 ou en voiture, La Grillade de Malpa à Malpassé (13013) propose grillades halal, burgers et livraison Uber Eats.",
  alternates: { canonical: "/restaurant-la-rose" },
};

export default async function LaRosePage() {
  const data = await getSiteData();
  const { settings: s, uberEats } = data;
  const address = fullAddress(s);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Restaurant près de La Rose", path: "/restaurant-la-rose" },
        ])}
      />

      <section className="grain border-b border-coal-800 py-16 sm:py-24">
        <div className="container-x">
          <p className="eyebrow">Marseille 13e · Secteur La Rose &amp; Malpassé</p>
          <h1 className="font-display mt-2 text-4xl font-bold uppercase sm:text-6xl">
            Grillade et fast-food halal à quelques minutes de La Rose
          </h1>
          <p className="lead mt-4 max-w-2xl">
            Depuis La Rose (terminus de la ligne M1 dans le 13013), rejoignez facilement {s.name} à
            Malpassé ({address}) ou faites-vous livrer vos grillades halal à domicile.
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
                Livraison vers La Rose ({uberEats.name})
              </a>
            ) : null}
            {s.clickAndCollectEnabled ? (
              <Link href="/commander" className="btn-ember">
                <IconBag className="size-5" />
                Commander à emporter
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
              Liaison directe sur la ligne M1
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              La station Malpassé se trouve à deux arrêts de métro de La Rose sur la ligne M1. En voiture
              comme en transports, vous êtes à quelques minutes du {address} pour une pause déjeuner rapide
              ou un dîner jusqu&apos;à 1h du matin.
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
                Itinéraire depuis La Rose
              </a>
              <a href={telHref(s.phone)} data-track="Appeler" className="btn-ghost text-xs">
                <IconPhone className="size-4" />
                {s.phone}
              </a>
            </div>
          </div>

          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold uppercase">
              Sur place, Click &amp; Collect ou livraison dans le 13e
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Sandwichs 1 ou 2 viandes, assiettes grillées, menus burgers et snacks tex-mex : commandez en
              ligne à emporter (paiement sur place) ou via {uberEats?.name ?? "Uber Eats"} dans tout le
              13013.
            </p>
            <div className="mt-6">
              <Link href="/carte" className="btn-primary text-xs">
                Voir la carte et les prix →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

