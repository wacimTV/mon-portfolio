import type { SiteData } from "@/lib/data";
import { IconExternal, IconStar, IconTikTok } from "@/components/icons";

export function Reviews({ data }: { data: SiteData }) {
  const { settings: s, reviews, uberEats } = data;
  const rating = Math.max(0, Math.min(5, s.uberRating));
  const cleanReviewCount = String(s.uberReviewCount ?? "300").replace(/\+/g, "").trim() || "300";

  return (
    <section id="avis" aria-labelledby="avis-title" className="py-20 sm:py-28">
      <div className="container-x">
        <div className="reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Avis clients</p>
            <h2 id="avis-title" className="h2 mt-2">
              Ce que disent nos clients
            </h2>
            <p className="lead mt-4 max-w-2xl">
              La satisfaction de nos clients du 13e et de tout Marseille est notre meilleure carte de visite.
            </p>
          </div>

          <div className="card flex flex-wrap items-center gap-5 p-5">
            <div>
              <p className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
                Note sur {uberEats?.name ?? "Uber Eats"}
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold">{String(s.uberRating).replace(".", ",")}</span>
                <span className="text-sm text-muted">/ 5 (+{cleanReviewCount} avis)</span>
              </div>
              <div className="mt-1 flex text-amber-400" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((n) => (
                  <IconStar key={n} className="size-4" filled={n <= Math.round(rating)} />
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {uberEats ? (
                <a
                  href={uberEats.url}
                  target="_blank"
                  rel="noopener"
                  data-track="Uber Eats"
                  className="btn-ghost min-h-10 px-4 py-2 text-sm"
                >
                  Voir sur {uberEats.name}
                  <IconExternal className="size-4" />
                </a>
              ) : null}
              {s.googleReviewUrl ? (
                <a
                  href={s.googleReviewUrl}
                  target="_blank"
                  rel="noopener"
                  className="btn-primary min-h-10 px-4 py-2 text-sm"
                >
                  Laisser un avis Google
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <article key={r.id} className="card reveal flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex text-amber-400" aria-label={`Note ${r.rating} sur 5`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <IconStar key={n} className="size-4" filled={n <= r.rating} />
                      ))}
                    </div>
                    <span className="rounded-full bg-coal-800 px-2.5 py-0.5 text-xs text-muted">{r.source}</span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-cream">&ldquo;{r.text}&rdquo;</p>
                </div>
                <footer className="mt-4 flex items-center justify-between border-t border-coal-800 pt-3 text-xs text-muted">
                  <span className="font-semibold text-cream">{r.author}</span>
                  {r.date ? <span>{r.date}</span> : null}
                </footer>
              </article>
            ))}
          </div>
        ) : (
          <div className="card reveal mt-10 grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <h3 className="font-display text-2xl font-bold uppercase">
                Plus de {cleanReviewCount} avis vérifiés sur Uber Eats
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Nous n&apos;affichons jamais de faux témoignages. Consultez directement les notes laissées par nos
                clients après leur commande sur Uber Eats, ou laissez votre propre avis après votre passage au
                1 avenue de Valdonne.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              {uberEats ? (
                <a href={uberEats.url} target="_blank" rel="noopener" data-track="Uber Eats" className="btn-primary">
                  Lire les avis Uber Eats
                  <IconExternal className="size-4" />
                </a>
              ) : null}
              {s.googleReviewUrl ? (
                <a href={s.googleReviewUrl} target="_blank" rel="noopener" className="btn-ghost">
                  Laisser un avis Google
                </a>
              ) : null}
              {s.tiktok ? (
                <a href={s.tiktok} target="_blank" rel="noopener" className="btn-ghost">
                  <IconTikTok className="size-4" />
                  TikTok
                </a>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

