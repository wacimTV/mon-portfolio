import type { Metadata } from "next";
import Link from "next/link";
import { getSiteData } from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Delivery } from "@/components/sections/Delivery";

export const metadata: Metadata = {
  title: "Livraison Grillade Halal Marseille 13, 14, 12 — Uber Eats",
  description:
    "Grillade halal en livraison à Marseille 13013 (Malpassé), 13014 et 13012 avec La Grillade de Malpa sur Uber Eats (4,4/5). Ouvert jusqu'à 1h.",
  alternates: { canonical: "/livraison-marseille-13" },
};

export default async function LivraisonPage() {
  const data = await getSiteData();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Livraison & à emporter", path: "/livraison-marseille-13" },
        ])}
      />
      <Delivery data={data} headingLevel={1} />
      <section className="py-14">
        <div className="container-x flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted">
            Consultez toute la carte avant de passer votre commande en livraison ou à emporter.
          </p>
          <Link href="/carte" className="btn-ghost">
            Voir la carte complète →
          </Link>
        </div>
      </section>
    </>
  );
}

