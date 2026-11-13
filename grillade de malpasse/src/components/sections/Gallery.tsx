import type { SiteData } from "@/lib/data";
import { PhotoSlot } from "@/components/PhotoSlot";
import { IconTikTok } from "@/components/icons";

const PLACEHOLDER_HINTS = [
  { alt: "Assiette grillade mixte 3 viandes halal — La Grillade de Malpa Marseille", hint: "Photo d'une assiette 2 ou 3 viandes garnie" },
  { alt: "Sandwich grillade halal garni avec frites — Malpassé 13013", hint: "Photo d'un sandwich grillade coupé en deux" },
  { alt: "Cuisson des viandes sur le grill — La Grillade de Malpa", hint: "Photo des viandes sur le grill en pleine cuisson" },
  { alt: "Menu burger halal avec frites et boisson — Marseille 13", hint: "Photo d'un burger fondant avec frites" },
  { alt: "Snacks et tex-mex : nems, samoussas, mozza sticks, wings", hint: "Photo d'un assortiment tex-mex / entrées" },
  { alt: "Salle et accueil du restaurant La Grillade de Malpa à Malpassé", hint: "Photo de la salle ou du comptoir d'accueil" },
];

export function Gallery({ data }: { data: SiteData }) {
  const { gallery, settings } = data;

  return (
    <section id="galerie" aria-labelledby="galerie-title" className="bg-coal-900 py-20 sm:py-28">
      <div className="container-x">
        <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Galerie</p>
            <h2 id="galerie-title" className="h2 mt-2">
              En direct du grill
            </h2>
            <p className="lead mt-4 max-w-2xl">
              Nos viandes grillées, nos sandwichs, nos assiettes et l&apos;ambiance du restaurant à Malpassé.
            </p>
          </div>
          {settings.tiktok ? (
            <a
              href={settings.tiktok}
              target="_blank"
              rel="noopener"
              className="btn-ghost shrink-0"
            >
              <IconTikTok className="size-5 text-amber-400" />
              Voir nos vidéos sur TikTok
            </a>
          ) : null}
        </div>

        {gallery.length > 0 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((img) => (
              <figure key={img.id} className="reveal overflow-hidden rounded-2xl border border-coal-700 bg-coal-850">
                <PhotoSlot
                  src={img.src}
                  alt={img.alt}
                  className="aspect-[4/3]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <figcaption className="px-4 py-3 text-xs text-muted">{img.alt}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PLACEHOLDER_HINTS.map((p, i) => (
              <div key={i} className="reveal">
                <PhotoSlot
                  src=""
                  alt={p.alt}
                  hint={p.hint}
                  className="aspect-[4/3] rounded-2xl"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

