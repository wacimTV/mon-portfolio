import type { Metadata } from "next";
import { getSiteData } from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/seo";
import { fullAddress } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Politique de Confidentialité (RGPD)",
  description:
    "Politique de confidentialité et protection des données personnelles (RGPD) du restaurant La Grillade de Malpa à Marseille 13013.",
  alternates: { canonical: "/confidentialite" },
};

export default async function ConfidentialitePage() {
  const { settings: s } = await getSiteData();
  const address = fullAddress(s);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Politique de confidentialité", path: "/confidentialite" },
        ])}
      />
      <article className="container-x max-w-3xl space-y-8 py-16 sm:py-24">
        <h1 className="font-display text-4xl font-bold uppercase sm:text-5xl">
          Politique de confidentialité (RGPD)
        </h1>

        <section className="space-y-2 text-sm leading-relaxed text-muted">
          <h2 className="font-display text-xl font-semibold text-cream uppercase">
            1. Responsable du traitement
          </h2>
          <p>
            Les données collectées via les formulaires de ce site sont traitées par{" "}
            <strong className="text-cream">{s.name}</strong> ({address} · Tél. {s.phone}).
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-muted">
          <h2 className="font-display text-xl font-semibold text-cream uppercase">
            2. Données collectées et finalités
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong className="text-cream">Formulaire de réservation :</strong> nom, téléphone, email,
              date, heure, nombre de convives et message éventuel — utilisés uniquement pour gérer votre
              réservation et vous confirmer votre table.
            </li>
            <li>
              <strong className="text-cream">Commande Click &amp; Collect :</strong> nom, téléphone, email
              (optionnel), créneau de retrait et détail des plats — utilisés uniquement pour préparer votre
              commande à emporter.
            </li>
            <li>
              <strong className="text-cream">Formulaire de contact :</strong> nom, email, téléphone et
              message — utilisés uniquement pour répondre à votre demande.
            </li>
            <li>
              <strong className="text-cream">Lutte contre le spam :</strong> une empreinte hachée non
              réversible de l&apos;adresse IP est conservée temporairement (24 h maximum) pour éviter les
              abus automatisés.
            </li>
          </ul>
          <p>Aucune donnée n&apos;est vendue ni cédée à des tiers à des fins publicitaires.</p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-muted">
          <h2 className="font-display text-xl font-semibold text-cream uppercase">
            3. Durée de conservation
          </h2>
          <p>
            Les réservations et messages de contact sont conservés le temps nécessaire au traitement de la
            demande, puis supprimés régulièrement depuis l&apos;espace d&apos;administration (et au plus
            tard sous 12 mois).
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-muted">
          <h2 className="font-display text-xl font-semibold text-cream uppercase">
            4. Cookies et statistiques de visite (sans cookies)
          </h2>
          <p>
            Ce site n&apos;utilise aucun cookie publicitaire ni traceur de profilage, et ne nécessite donc
            aucun bandeau de consentement cookies. Lorsque des statistiques de fréquentation sont activées
            (via un outil respectueux de la vie privée tel que Plausible ou Umami), la mesure d&apos;audience
            et le suivi des clics principaux (« Appeler », « Uber Eats », « Itinéraire », « Réservation
            envoyée », « Commande envoyée ») sont réalisés de manière strictement anonyme et sans dépôt de
            cookie sur votre appareil. Seul un cookie technique `HttpOnly` est utilisé sur l&apos;espace
            d&apos;administration réservé au personnel du restaurant.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-muted">
          <h2 className="font-display text-xl font-semibold text-cream uppercase">
            5. Vos droits (accès, rectification, suppression)
          </h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un
            droit d&apos;accès, de rectification et de suppression de vos données. Pour l&apos;exercer,
            contactez-nous via le formulaire de contact, par téléphone au {s.phone} ou par courrier au{" "}
            {address}. Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).
          </p>
        </section>
      </article>
    </>
  );
}

