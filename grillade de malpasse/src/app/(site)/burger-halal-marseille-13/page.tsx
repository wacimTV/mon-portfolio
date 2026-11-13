import type { Metadata } from "next";
import Link from "next/link";
import { getSiteData } from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/seo";
import { formatPrice, fullAddress, telHref } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { IconBag, IconCalendar, IconPhone } from "@/components/icons";

export const metadata: Metadata = {
  title: "Burger Halal Marseille 13 — Menus & Burgers à Malpassé",
  description:
    "Burger halal à Marseille 13013 : burger simple dès 5,85 €, menu burger frites + boisson à 9,50 € et double burger chez La Grillade de Malpa.",
  alternates: { canonical: "/burger-halal-marseille-13" },
};

export default async function BurgerHalalPage() {
  const data = await getSiteData();
  const { settings: s, categories, uberEats } = data;
  const address = fullAddress(s);

  const burgerCat = categories.find((c) => c.slug === "burgers" || /burger/i.test(c.name));
  const snackCat = categories.find((c) => c.slug === "snacks-tex-mex" || /snack|tex/i.test(c.name));
  const burgers = burgerCat?.items ?? [];
  const snacks = snackCat?.items ?? [];
  const minBurger = burgers.length ? Math.min(...burgers.map((b) => b.priceCents)) : null;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Burger halal Marseille 13", path: "/burger-halal-marseille-13" },
        ])}
      />

      <section className="grain border-b border-coal-800 py-16 sm:py-24">
        <div className="container-x">
          <p className="eyebrow">Burgers 100 % halal · Malpassé 13013</p>
          <h1 className="font-display mt-2 text-4xl font-bold uppercase sm:text-6xl">
            Vos burgers et menus halal à Marseille 13e
          </h1>
          <p className="lead mt-4 max-w-2xl">
            Seul pour une petite faim{minBurger ? ` dès ${formatPrice(minBurger)}` : ""} ou en menu complet
            avec frites et boisson : découvrez les burgers halal de {s.name}, préparés à la commande au{" "}
            {address}.
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
                Commander un burger sur {uberEats.name}
              </a>
            ) : null}
            {s.clickAndCollectEnabled ? (
              <Link href="/commander" className="btn-ember">
                <IconBag className="size-5" />
                Commander à emporter
              </Link>
            ) : null}
            <Link href="/carte" className="btn-ghost">
              Voir toute la carte
            </Link>
            <Link href="/reservation" className="btn-ghost">
              <IconCalendar className="size-5" />
              Réserver une table
            </Link>
          </div>
        </div>
      </section>

      <div className="container-x space-y-14 py-16 sm:py-20">
        <section aria-labelledby="nos-burgers">
          <h2 id="nos-burgers" className="font-display text-3xl font-bold uppercase sm:text-4xl">
            Nos burgers &amp; menus
          </h2>
          <p className="mt-2 text-sm text-muted">
            Tarifs actuels de notre carte (modifiables en temps réel par le restaurant).
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {burgers.map((item) => (
              <MenuItemCard key={item.id} item={item} showLegal />
            ))}
          </div>
        </section>

        {snacks.length > 0 ? (
          <section aria-labelledby="nos-texmex">
            <h2 id="nos-texmex" className="font-display text-3xl font-bold uppercase sm:text-4xl">
              Pour accompagner votre burger : snacks &amp; tex-mex
            </h2>
            <p className="mt-2 text-sm text-muted">
              Mozza sticks, jalapeños, bouchées camembert, nuggets, wings, nems ou samoussas.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {snacks.map((item) => (
                <MenuItemCard key={item.id} item={item} showLegal />
              ))}
            </div>
          </section>
        ) : null}

        <section className="card flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase">
              Vous préférez un sandwich grillade ou une assiette ?
            </h2>
            <p className="mt-1 text-sm text-muted">
              Consultez l&apos;intégralité de notre carte halal ou appelez-nous au {s.phone}.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/carte" className="btn-primary">
              Toute la carte
            </Link>
            <a href={telHref(s.phone)} data-track="Appeler" className="btn-ghost">
              <IconPhone className="size-4" />
              {s.phone}
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

