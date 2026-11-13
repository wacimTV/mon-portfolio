import type { Metadata } from "next";
import Link from "next/link";
import { getSiteData } from "@/lib/data";
import { hoursSummary } from "@/lib/hours";
import { breadcrumbJsonLd } from "@/lib/seo";
import { fullAddress, telHref } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { IconBag, IconCalendar, IconClock, IconMoon, IconPhone } from "@/components/icons";

export const metadata: Metadata = {
  title: "Snack Ouvert Tard Marseille 13 — Grillade Halal jusqu'à 1h",
  description:
    "Faim tard le soir à Marseille 13013 ? La Grillade de Malpa à Malpassé est ouverte 7j/7 jusqu'à 1h du matin : sur place, à emporter et Uber Eats.",
  alternates: { canonical: "/snack-ouvert-tard-marseille" },
};

export default async function SnackOuvertTardPage() {
  const data = await getSiteData();
  const { settings: s, hours, categories, uberEats } = data;
  const address = fullAddress(s);
  const picks = categories.flatMap((c) => c.items).slice(0, 6);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Snack ouvert tard jusqu'à 1h", path: "/snack-ouvert-tard-marseille" },
        ])}
      />

      <section className="grain border-b border-coal-800 py-16 sm:py-24">
        <div className="container-x">
          <p className="eyebrow">Service nocturne · 7j/7 jusqu&apos;à 01h00</p>
          <h1 className="font-display mt-2 text-4xl font-bold uppercase sm:text-6xl">
            Manger tard à Marseille 13e : votre grillade halal ouverte jusqu&apos;à 1h
          </h1>
          <p className="lead mt-4 max-w-2xl">
            Fin de service, retour de soirée, match ou fringale de minuit : {s.name} vous accueille
            tous les soirs sans interruption au {address} (quartier Malpassé).
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
                Livraison du soir sur {uberEats.name}
              </a>
            ) : null}
            {s.clickAndCollectEnabled ? (
              <Link href="/commander" className="btn-ember">
                <IconBag className="size-5" />
                Commander à emporter
              </Link>
            ) : null}
            <Link href="/reservation" className="btn-ghost">
              <IconCalendar className="size-5" />
              Réserver une table (jusqu&apos;à 00h30)
            </Link>
            <a href={telHref(s.phone)} data-track="Appeler" className="btn-ghost">
              <IconPhone className="size-5" />
              {s.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-8 md:grid-cols-3">
          <div className="card p-6">
            <IconMoon className="size-7 text-amber-400" />
            <h2 className="font-display mt-4 text-2xl font-bold uppercase">
              Ouvert tous les soirs jusqu&apos;à 1h
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Alors que beaucoup de cuisines ferment dès 22h, notre grill reste allumé jusqu&apos;à 01h00 du
              matin, du lundi au dimanche.
            </p>
            <dl className="mt-4 space-y-1 text-xs">
              {hoursSummary(hours).map((h) => (
                <div key={h.label} className="flex justify-between">
                  <dt className="text-muted">{h.label}</dt>
                  <dd className="font-semibold text-amber-400">{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="card p-6">
            <IconClock className="size-7 text-amber-400" />
            <h2 className="font-display mt-4 text-2xl font-bold uppercase">
              Sur place ou à emporter rapide
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Passez commande en ligne en Click &amp; Collect ou par téléphone avant de passer au 1 Avenue de
              Valdonne : votre sandwich ou votre assiette est préparé à la commande.
            </p>
          </div>

          <div className="card p-6">
            <IconBag className="size-7 text-amber-400" />
            <h2 className="font-display mt-4 text-2xl font-bold uppercase">
              Livraison nocturne (13e, 14e, 12e)
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Pas envie de ressortir ? Retrouvez toute notre carte sur {uberEats?.name ?? "Uber Eats"} pour
              une livraison à domicile dans les secteurs desservis ({s.deliveryZones}).
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-coal-800 bg-coal-900 py-16 sm:py-20">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Envie d&apos;un repas chaud ce soir ?</p>
              <h2 className="font-display mt-1 text-3xl font-bold uppercase">
                Un aperçu de notre carte du soir
              </h2>
            </div>
            <Link href="/carte" className="btn-ghost text-sm">
              Voir toute la carte →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {picks.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

