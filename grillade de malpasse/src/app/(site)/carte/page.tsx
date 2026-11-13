import type { Metadata } from "next";
import Link from "next/link";
import { getSiteData } from "@/lib/data";
import { ALLERGENS } from "@/lib/allergens";
import { breadcrumbJsonLd, menuJsonLd } from "@/lib/seo";
import { telHref } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { OffersSection } from "@/components/sections/OffersSection";
import { IconBag, IconCalendar, IconPhone } from "@/components/icons";

export const metadata: Metadata = {
  title: "La Carte — Sandwichs, Assiettes Grillades & Burgers Halal",
  description:
    "Carte de La Grillade de Malpa (Marseille 13013) : sandwich 1 ou 2 viandes dès 10 €, assiettes grillées, menus burgers halal dès 9,50 € et snacks tex-mex.",
  alternates: { canonical: "/carte" },
};

export default async function CartePage() {
  const data = await getSiteData();
  const { settings: s, categories, uberEats, offers } = data;
  const activeCategories = categories.filter((c) => c.items.length > 0);
  const emptyCategories = categories.filter((c) => c.items.length === 0);
  const hasAnyAllergens = activeCategories.some((c) =>
    c.items.some((i) => Boolean(i.allergens?.trim())),
  );

  return (
    <>
      <JsonLd
        data={[
          menuJsonLd(data),
          breadcrumbJsonLd([{ name: "La carte", path: "/carte" }]),
        ]}
      />
      <section className="grain border-b border-coal-800 py-14 sm:py-20">
        <div className="container-x">
          <p className="eyebrow">100 % halal · Marseille 13013</p>
          <h1 className="font-display mt-2 text-4xl font-bold uppercase sm:text-6xl">
            La carte de {s.name}
          </h1>
          <p className="lead mt-4 max-w-2xl">
            Viandes grillées à la commande, pain frais, frites croustillantes et sauces au choix.
            Sur place au 1 Avenue de Valdonne (Malpassé), à emporter ou en livraison.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {uberEats ? (
              <a
                href={uberEats.url}
                target="_blank"
                rel="noopener"
                data-track="Uber Eats"
                className="btn-primary"
              >
                <IconBag className="size-5" />
                Commander sur {uberEats.name}
              </a>
            ) : null}
            {s.clickAndCollectEnabled ? (
              <Link href="/commander" className="btn-ember">
                <IconBag className="size-5" />
                Commander à emporter
              </Link>
            ) : (
              <a href={telHref(s.phone)} data-track="Appeler" className="btn-ghost">
                <IconPhone className="size-5" />
                Commander à emporter : {s.phone}
              </a>
            )}
            <Link href="/reservation" className="btn-ghost">
              <IconCalendar className="size-5" />
              Réserver une table
            </Link>
          </div>

          <nav aria-label="Accès rapide aux catégories" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {activeCategories.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.slug}`}
                    className="inline-flex min-h-10 items-center rounded-full border border-coal-600 bg-coal-900 px-4 text-sm font-medium hover:border-amber-400 hover:text-amber-400"
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <OffersSection offers={offers} compact />

      <div className="container-x space-y-16 py-16 sm:py-20">
        {activeCategories.map((cat) => (
          <section key={cat.id} id={cat.slug} aria-labelledby={`title-${cat.slug}`}>
            <div className="border-b border-coal-800 pb-4">
              <h2 id={`title-${cat.slug}`} className="font-display text-3xl font-bold uppercase sm:text-4xl">
                {cat.name}
              </h2>
              {cat.description ? <p className="mt-1 text-sm text-muted">{cat.description}</p> : null}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {cat.items.map((item) => (
                <MenuItemCard key={item.id} item={item} showLegal />
              ))}
            </div>
          </section>
        ))}

        {emptyCategories.length > 0 ? (
          <section aria-labelledby="autres-cat" className="card p-6 sm:p-8">
            <h2 id="autres-cat" className="font-display text-2xl font-bold uppercase">
              Également disponibles sur place
            </h2>
            <p className="mt-2 text-sm text-muted">
              {emptyCategories.map((c) => c.name).join(" · ")} — demandez la sélection du moment au comptoir
              ou consultez notre page Uber Eats.
            </p>
          </section>
        ) : null}

        {/* Mentions légales obligatoires : origine des viandes & allergènes */}
        <section
          aria-labelledby="infos-reglementaires"
          className="card space-y-4 border-coal-700 bg-coal-900/80 p-6 text-xs leading-relaxed text-muted sm:p-8"
        >
          <h2
            id="infos-reglementaires"
            className="font-display text-lg font-bold text-cream uppercase"
          >
            Informations sur l&apos;origine des viandes &amp; les allergènes
          </h2>

          {s.meatOriginNote ? (
            <p>
              <strong className="text-cream">Origine de nos viandes :</strong> {s.meatOriginNote}
            </p>
          ) : null}

          <p>
            <strong className="text-cream">Allergènes :</strong> Liste des allergènes disponible sur
            demande au comptoir. En cas d&apos;allergie ou d&apos;intolérance alimentaire, signalez-le
            systématiquement à notre équipe avant de commander.
          </p>

          {hasAnyAllergens ? (
            <div className="pt-1">
              <p className="mb-2 font-semibold text-cream">
                Légende des abréviations des 14 allergènes réglementaires :
              </p>
              <ul className="flex flex-wrap gap-2">
                {ALLERGENS.map((a) => (
                  <li
                    key={a.code}
                    className="inline-flex items-center gap-1.5 rounded border border-coal-700 bg-coal-850 px-2 py-1"
                  >
                    <strong className="text-amber-400">{a.short}</strong>
                    <span>{a.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </div>
    </>
  );
}
