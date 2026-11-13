import type { Metadata } from "next";
import Link from "next/link";
import { getSiteData } from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/seo";
import { fullAddress, telHref } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { ClickAndCollectBuilder } from "@/components/forms/ClickAndCollectBuilder";
import { IconPhone } from "@/components/icons";

export const metadata: Metadata = {
  title: {
    absolute: "Click & Collect à Emporter · La Grillade de Malpa (13013)",
  },
  description:
    "Commandez vos grillades halal, sandwichs, assiettes et burgers en Click & Collect à Malpassé (Marseille 13013). Retrait rapide et paiement sur place.",
  alternates: { canonical: "/commander" },
};

export default async function CommanderPage() {
  const data = await getSiteData();
  const { settings: s, categories, hours, closures, uberEats } = data;
  const address = fullAddress(s);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Click & Collect", path: "/commander" }])} />
      <section className="grain border-b border-coal-800 py-14 sm:py-20">
        <div className="container-x">
          <p className="eyebrow">Click &amp; Collect · Retrait au comptoir</p>
          <h1 className="font-display mt-2 text-4xl font-bold uppercase sm:text-6xl">
            Commander à emporter
          </h1>
          <p className="lead mt-4 max-w-2xl">
            Composez votre commande en ligne, choisissez votre créneau de retrait (au moins 20 min de
            préparation) et réglez directement sur place au {address}.
          </p>
        </div>
      </section>

      <div className="container-x py-14 sm:py-20">
        {s.clickAndCollectEnabled ? (
          <ClickAndCollectBuilder
            categories={categories}
            hours={hours}
            closures={closures.map((c) => c.date)}
            phone={s.phone}
            address={address}
          />
        ) : (
          <div className="card mx-auto max-w-2xl p-8 text-center">
            <h2 className="font-display text-2xl font-bold uppercase">
              Click &amp; Collect momentanément fermé
            </h2>
            <p className="mt-3 text-sm text-muted">
              La prise de commande en ligne à emporter est actuellement désactivée. Vous pouvez nous
              appeler directement ou commander en livraison.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href={telHref(s.phone)} data-track="Appeler" className="btn-primary">
                <IconPhone className="size-5" />
                Appeler le {s.phone}
              </a>
              {uberEats ? (
                <a
                  href={uberEats.url}
                  target="_blank"
                  rel="noopener"
                  data-track="Uber Eats"
                  className="btn-ghost"
                >
                  Commander sur {uberEats.name}
                </a>
              ) : null}
              <Link href="/carte" className="btn-ghost">
                Voir la carte
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

