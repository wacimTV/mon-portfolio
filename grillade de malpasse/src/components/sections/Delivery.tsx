import Link from "next/link";
import type { SiteData } from "@/lib/data";
import { telHref } from "@/lib/site";
import { IconBag, IconBolt, IconMoon, IconPhone, IconStar, IconUsers } from "@/components/icons";

export function Delivery({ data, headingLevel = 2 }: { data: SiteData; headingLevel?: 1 | 2 }) {
  const { settings: s, platforms, uberEats } = data;
  const zones = s.deliveryZones.split(",").map((z) => z.trim()).filter(Boolean);
  const H = headingLevel === 1 ? "h1" : "h2";
  const rating = Math.max(0, Math.min(5, s.uberRating));

  return (
    <section id="livraison" aria-labelledby="livraison-title" className="relative overflow-hidden bg-coal-900 py-20 sm:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="reveal">
          <p className="eyebrow">Livraison &amp; à emporter</p>
          <H id="livraison-title" className="h2 mt-2">
            Livraison à domicile dans le 13e et alentours
          </H>
          <p className="lead mt-4">
            Envie d&apos;une grillade halal sans bouger de chez vous ? Commandez en quelques clics, on prépare
            tout minute et c&apos;est livré chaud, du midi jusqu&apos;à tard le soir.
          </p>

          {uberEats ? (
            <div className="card mt-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted">Note des clients sur {uberEats.name}</p>
                <p className="mt-1 flex items-center gap-2">
                  <span className="font-display text-4xl font-bold">{String(s.uberRating).replace(".", ",")}</span>
                  <span className="text-muted">/ 5</span>
                  <span className="flex text-amber-400" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <IconStar key={n} className="size-5" filled={n <= Math.round(rating)} />
                    ))}
                  </span>
                </p>
                <p className="text-sm text-muted">{s.uberReviewCount} avis clients sur {uberEats.name}</p>
              </div>
              <a href={uberEats.url} target="_blank" rel="noopener" className="btn-primary">
                <IconBag className="size-5" />
                Commander sur {uberEats.name}
              </a>
            </div>
          ) : null}

          {platforms.length > 1 ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {platforms
                .filter((p) => p.id !== uberEats?.id)
                .map((p) => (
                  <a key={p.id} href={p.url} target="_blank" rel="noopener" className="btn-ghost">
                    Commander sur {p.name}
                  </a>
                ))}
            </div>
          ) : null}

          <div className="mt-8">
            <h3 className="font-display text-lg font-semibold uppercase">Zones livrées</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {zones.map((z) => (
                <li key={z} className="rounded-full bg-coal-800 px-3.5 py-1.5 text-sm">
                  {z}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">
              La zone exacte dépend de votre adresse : vérifiez la disponibilité directement sur l&apos;application.
            </p>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          <li className="card reveal p-6">
            <IconBolt className="size-8 text-amber-400" />
            <h3 className="font-display mt-4 text-xl font-semibold uppercase">À emporter le midi</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Pause déjeuner courte ? Appelez avant de venir, votre commande est prête quand vous arrivez.
            </p>
            <a href={telHref(s.phone)} className="mt-4 inline-flex items-center gap-2 font-semibold text-amber-400 hover:underline">
              <IconPhone className="size-4" /> {s.phone}
            </a>
          </li>
          <li className="card reveal p-6">
            <IconMoon className="size-8 text-amber-400" />
            <h3 className="font-display mt-4 text-xl font-semibold uppercase">Ouvert tard le soir</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Après le sport, le travail ou une soirée : on vous régale jusqu&apos;à 1h du matin, 7 jours sur 7.
            </p>
          </li>
          <li className="card reveal p-6 sm:col-span-2">
            <IconUsers className="size-8 text-amber-400" />
            <h3 className="font-display mt-4 text-xl font-semibold uppercase">Commandes en quantité</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Anniversaire, réunion de famille, équipe de foot ou bureau : prévenez-nous à l&apos;avance pour les
              grosses commandes, on s&apos;organise pour que tout soit prêt à l&apos;heure.
            </p>
            <Link href="/contact" className="mt-4 inline-flex font-semibold text-amber-400 hover:underline">
              Nous contacter pour un groupe →
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
