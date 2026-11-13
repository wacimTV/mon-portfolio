import Link from "next/link";
import type { SiteData } from "@/lib/data";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { IconBag } from "@/components/icons";
import { formatPrice } from "@/lib/site";

/** Aperçu de la carte sur l'accueil : plats mis en avant + promos. */
export function MenuHighlights({ data }: { data: SiteData }) {
  const all = data.categories.flatMap((c) => c.items);
  const picks = [...all.filter((i) => i.promoLabel), ...all.filter((i) => i.featured && !i.promoLabel)].slice(0, 6);
  const shown = picks.length ? picks : all.slice(0, 6);
  const cats = data.categories.filter((c) => c.items.length);

  return (
    <section id="carte" aria-labelledby="carte-title" className="py-20 sm:py-28">
      <div className="container-x">
        <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">La carte</p>
            <h2 id="carte-title" className="h2 mt-2">
              Sandwichs, assiettes &amp; burgers halal
            </h2>
            <p className="lead mt-4 max-w-2xl">
              Des viandes grillées à la commande, du pain frais et des portions généreuses à petits prix
              {all.length ? <>, à partir de {formatPrice(Math.min(...all.map((i) => i.priceCents)))}</> : null}.
              Parfait pour un déjeuner rapide, un repas en famille ou une faim de fin de soirée.
            </p>
          </div>
          <Link href="/carte" className="btn-ghost shrink-0">
            Toute la carte et les prix
          </Link>
        </div>

        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Catégories de la carte">
          {cats.map((c) => (
            <li key={c.id}>
              <Link
                href={`/carte#${c.slug}`}
                className="inline-flex min-h-10 items-center rounded-full border border-coal-600 px-4 text-sm font-medium hover:border-amber-400 hover:text-amber-400"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {shown.map((item) => (
            <div key={item.id} className="reveal">
              <MenuItemCard item={item} />
            </div>
          ))}
        </div>

        {data.uberEats ? (
          <div className="mt-10 flex justify-center">
            <a href={data.uberEats.url} target="_blank" rel="noopener" className="btn-primary">
              <IconBag className="size-5" />
              Commander sur Uber Eats
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
