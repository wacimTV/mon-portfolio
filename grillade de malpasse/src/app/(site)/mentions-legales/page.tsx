import type { Metadata } from "next";
import { getSiteData } from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/seo";
import { fullAddress } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description: "Mentions légales du site de La Grillade de Malpa, 1 Avenue de Valdonne, 13013 Marseille.",
  alternates: { canonical: "/mentions-legales" },
};

export default async function MentionsLegalesPage() {
  const { settings: s } = await getSiteData();
  const address = fullAddress(s);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Mentions légales", path: "/mentions-legales" }])} />
      <article className="container-x max-w-3xl space-y-8 py-16 sm:py-24">
        <h1 className="font-display text-4xl font-bold uppercase sm:text-5xl">Mentions légales</h1>

        <section className="space-y-2 text-sm leading-relaxed text-muted">
          <h2 className="font-display text-xl font-semibold text-cream uppercase">1. Éditeur du site</h2>
          <p>
            <strong className="text-cream">Nom commercial :</strong> {s.name}
          </p>
          <p>
            <strong className="text-cream">Adresse :</strong> {address}
          </p>
          <p>
            <strong className="text-cream">Téléphone :</strong> {s.phone}
          </p>
          {s.email ? (
            <p>
              <strong className="text-cream">Email :</strong> {s.email}
            </p>
          ) : null}
          <p>
            <strong className="text-cream">Forme juridique / SIRET / RCS :</strong>{" "}
            <span>[À compléter par le responsable de l&apos;établissement avant mise en ligne]</span>
          </p>
          <p>
            <strong className="text-cream">Directeur de la publication :</strong> Le représentant légal de{" "}
            {s.name}.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-muted">
          <h2 className="font-display text-xl font-semibold text-cream uppercase">2. Hébergement</h2>
          <p>
            Ce site est hébergé par le prestataire choisi lors du déploiement (ex. OVHcloud, Railway,
            Render ou Vercel — coordonnées exactes à renseigner lors de la mise en production).
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-muted">
          <h2 className="font-display text-xl font-semibold text-cream uppercase">
            3. Propriété intellectuelle
          </h2>
          <p>
            L&apos;ensemble des textes, visuels, logos et éléments graphiques présents sur ce site sont la
            propriété exclusive de {s.name}, sauf mention contraire. Toute reproduction, même partielle, est
            interdite sans autorisation écrite préalable.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-muted">
          <h2 className="font-display text-xl font-semibold text-cream uppercase">4. Prix et carte</h2>
          <p>
            Les tarifs affichés sur le site sont indiqués en euros toutes taxes comprises (TTC) à titre
            indicatif et peuvent différer des prix pratiqués sur les plateformes de livraison partenaires
            (Uber Eats, etc.).
          </p>
        </section>
      </article>
    </>
  );
}

