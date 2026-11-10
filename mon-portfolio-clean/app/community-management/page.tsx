import type { Metadata } from "next"
import { SocialPlansPage } from "@/components/social-plans/social-plans-page"
import { faqs, plans } from "@/components/social-plans-data"
import { DEFAULT_OG_IMAGE } from "@/lib/seo"
import "./social-plans.css"

export const metadata: Metadata = {
  title: {
    absolute: "Community Manager Marseille | Réseaux sociaux dès 250 €/mois",
  },
  description:
    "Community manager freelance à Marseille : gestion Instagram et TikTok, création de contenus et stratégie. Formules dès 250 €/mois. Devis gratuit sous 24h.",
  alternates: {
    canonical: "https://www.wacimammouche.fr/community-management",
  },
  openGraph: {
    title: "Community Manager Marseille | Réseaux sociaux dès 250 €/mois",
    description:
      "Community manager freelance à Marseille : gestion Instagram et TikTok, création de contenus et stratégie. Formules dès 250 €/mois. Devis gratuit sous 24h.",
    type: "website",
    locale: "fr_FR",
    url: "https://www.wacimammouche.fr/community-management",
    images: [
      {
        url: DEFAULT_OG_IMAGE.url,
        width: DEFAULT_OG_IMAGE.width,
        height: DEFAULT_OG_IMAGE.height,
        alt: "Community Manager à Marseille - Wacim Ammouche",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Manager Marseille | Réseaux sociaux dès 250 €/mois",
    description:
      "Community manager freelance à Marseille : gestion Instagram et TikTok, création de contenus et stratégie. Formules dès 250 €/mois. Devis gratuit sous 24h.",
    images: [DEFAULT_OG_IMAGE.url],
  },
}

const socialFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Accueil",
      item: "https://www.wacimammouche.fr",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Community Manager & Réseaux Sociaux Marseille",
      item: "https://www.wacimammouche.fr/community-management",
    },
  ],
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Community Manager & Gestion des réseaux sociaux à Marseille",
  description:
    "Gestion professionnelle des réseaux sociaux Instagram et TikTok pour entreprises, commerces et restaurants, sur place dans les Bouches-du-Rhône ou à distance à l'international.",
  provider: {
    "@type": "ProfessionalService",
    name: "Wacim Ammouche",
    url: "https://www.wacimammouche.fr",
  },
  areaServed: [
    { "@type": "City", name: "Marseille" },
    { "@type": "AdministrativeArea", name: "Bouches-du-Rhône" },
    { "@type": "Country", name: "France" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Formules Community Management",
    itemListElement: plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      description: plan.tagline,
      price: plan.price.replace(/[^0-9]/g, ""),
      priceCurrency: "EUR",
      valueAddedTaxIncluded: true,
    })),
  },
}

export default function FormulesReseauxSociauxPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(socialFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <SocialPlansPage />
    </>
  )
}

