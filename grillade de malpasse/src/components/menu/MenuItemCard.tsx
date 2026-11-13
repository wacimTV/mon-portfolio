import type { SiteData } from "@/lib/data";
import { formatPrice } from "@/lib/site";
import { parseAllergens } from "@/lib/allergens";
import { PhotoSlot } from "@/components/PhotoSlot";

type Item = SiteData["categories"][number]["items"][number];

export function MenuItemCard({
  item,
  showPhoto = true,
  showLegal = false,
  headingLevel = 3,
}: {
  item: Item;
  showPhoto?: boolean;
  showLegal?: boolean;
  headingLevel?: 3 | 4;
}) {
  const H = `h${headingLevel}` as "h3" | "h4";
  const itemAllergens = showLegal ? parseAllergens(item.allergens) : [];

  return (
    <article className="card group flex gap-4 p-4 transition hover:border-amber-500/50 sm:p-5">
      {showPhoto ? (
        <PhotoSlot
          src={item.image}
          alt={`${item.name} — grillade halal, La Grillade de Malpa Marseille`}
          className="size-24 shrink-0 rounded-xl sm:size-28"
          sizes="112px"
          compact
        />
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <H className="font-display text-xl leading-tight font-semibold uppercase">{item.name}</H>
          <p className="font-display shrink-0 text-xl font-bold text-amber-400">{formatPrice(item.priceCents)}</p>
        </div>
        {item.promoLabel ? (
          <p className="mt-1.5 w-fit rounded-full bg-ember-600 px-2.5 py-0.5 text-xs font-bold tracking-wide text-white uppercase">
            {item.promoLabel}
          </p>
        ) : null}
        {item.description ? <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p> : null}
        {showLegal && item.meatOrigin ? (
          <p className="mt-2 text-xs text-muted/90">
            <span className="font-semibold text-cream">Origine viande :</span> {item.meatOrigin}
          </p>
        ) : null}
        {showLegal && itemAllergens.length > 0 ? (
          <div className="mt-2 flex flex-wrap items-center gap-1" aria-label="Allergènes présents">
            {itemAllergens.map((al) => (
              <span
                key={al.code}
                title={al.label}
                className="rounded border border-amber-400/40 bg-coal-800 px-1.5 py-0.5 text-[0.68rem] font-semibold tracking-wider text-amber-400 uppercase"
              >
                {al.short}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

