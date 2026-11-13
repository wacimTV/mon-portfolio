import type { SiteData } from "@/lib/data";
import { formatPrice } from "@/lib/site";

/**
 * Affiche les formules & promotions actives.
 * Totalement masqué s'il n'y a aucune offre active.
 */
export function OffersSection({
  offers,
  compact = false,
}: {
  offers: SiteData["offers"];
  compact?: boolean;
}) {
  if (!offers || offers.length === 0) return null;

  return (
    <section
      id="formules"
      aria-labelledby="formules-title"
      className={compact ? "py-10" : "border-t border-coal-800 bg-coal-950 py-16 sm:py-24"}
    >
      <div className="container-x">
        <div className="reveal">
          <p className="eyebrow">Formules &amp; offres</p>
          <h2 id="formules-title" className="h2 mt-2">
            Nos formules du moment
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <article
              key={offer.id}
              className="card reveal flex flex-col justify-between border-amber-500/40 p-6"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-2xl font-bold uppercase">{offer.title}</h3>
                  {offer.priceCents !== null && offer.priceCents !== undefined ? (
                    <span className="font-display shrink-0 text-2xl font-bold text-amber-400">
                      {formatPrice(offer.priceCents)}
                    </span>
                  ) : null}
                </div>
                {offer.badge ? (
                  <p className="mt-2 inline-block rounded-full bg-ember-600 px-3 py-0.5 text-xs font-bold tracking-wide text-white uppercase">
                    {offer.badge}
                  </p>
                ) : null}
                {offer.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted">{offer.description}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

