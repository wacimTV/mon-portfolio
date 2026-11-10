import type { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Radio,
  MapPin,
  Clock,
  BadgeCheck,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DEFAULT_OG_IMAGE } from "@/lib/seo"

export const metadata: Metadata = {
  title: {
    absolute: "Carte NFC avis Google à Marseille | Dès 50 € TTC",
  },
  description:
    "Cartes NFC et QR code pour récolter plus d'avis Google, dès 50 € TTC et sans abonnement. Pour commerces et restaurants à Marseille. Devis gratuit sous 24h.",
  alternates: { canonical: "https://www.wacimammouche.fr/carte-nfc-avis-google-marseille" },
  openGraph: {
    title: "Carte NFC avis Google à Marseille | Dès 50 € TTC",
    description:
      "Cartes NFC et QR code pour récolter plus d'avis Google, dès 50 € TTC et sans abonnement. Pour commerces et restaurants à Marseille. Devis gratuit sous 24h.",
    type: "website",
    locale: "fr_FR",
    url: "https://www.wacimammouche.fr/carte-nfc-avis-google-marseille",
    images: [
      {
        url: DEFAULT_OG_IMAGE.url,
        width: DEFAULT_OG_IMAGE.width,
        height: DEFAULT_OG_IMAGE.height,
        alt: DEFAULT_OG_IMAGE.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Carte NFC avis Google à Marseille | Dès 50 € TTC",
    description:
      "Cartes NFC et QR code pour récolter plus d'avis Google, dès 50 € TTC et sans abonnement. Pour commerces et restaurants à Marseille. Devis gratuit sous 24h.",
    images: [DEFAULT_OG_IMAGE.url],
  },
}

function PageJsonLd() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Carte NFC & QR Code Avis Google Marseille",
    description:
      "Support physique connecté sans contact NFC et QR Code pour collecter des avis Google vérifiés auprès des clients de commerces et restaurants. Installation sur place dans le 13 ou envoi à l'international.",
    offers: {
      "@type": "Offer",
      price: "50",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "ProfessionalService",
        name: "Wacim Ammouche",
        url: "https://www.wacimammouche.fr",
      },
    },
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
        name: "Carte NFC Avis Google Marseille",
        item: "https://www.wacimammouche.fr/carte-nfc-avis-google-marseille",
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}

const steps = [
  {
    step: "01",
    title: "Votre client approche son téléphone",
    description:
      "Grâce à la puce sans contact NFC intégrée ou au QR Code haute lisibilité au verso, aucune application particulière n'est nécessaire.",
  },
  {
    step: "02",
    title: "Ouverture directe de votre fiche Google",
    description:
      "Le smartphone ouvre directement la page de notation de votre profil d'établissement Google avec les 5 étoiles prêtes à être cochées.",
  },
  {
    step: "03",
    title: "Un dépôt d'avis rapide et simplifié",
    description:
      "Fini les clients qui promettent de laisser un mot chez eux et oublient. Vous facilitez le dépôt d'avis au moment le plus propice.",
  },
]

export default function CarteNfcPage() {
  return (
    <>
      <PageJsonLd />
      <Navigation />
      <main id="main-content" className="relative">
        {/* Hero */}
        <section className="relative flex min-h-[65vh] items-center justify-center overflow-hidden px-6 pt-24 pb-16">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            {/* Breadcrumb */}
            <nav
              aria-label="Fil d'Ariane"
              className="mb-8 flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <Link href="/" className="transition-colors hover:text-foreground">
                Accueil
              </Link>
              <span aria-hidden="true">›</span>
              <span className="text-foreground">Carte NFC Avis Google</span>
            </nav>

            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-accent">
              Référencement local & E-réputation
            </span>

            <h1 className="mb-6 font-serif text-4xl font-medium leading-[1.15] tracking-tight sm:text-5xl md:text-6xl">
              Carte NFC & QR Code Avis Google à Marseille
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
              Multipliez vos avis clients 5 étoiles au moment le plus opportun. Une carte connectée sans contact dès 50 € TTC pensée pour les restaurants, boutiques, salons et artisans. Installation sur place dans le 13, envoi et configuration à distance à l'international.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="group px-8" asChild>
                <a href="/#contact">
                  Commander mes cartes NFC
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="px-8 bg-transparent" asChild>
                <Link href="/community-management">
                  Découvrir mes formules réseaux sociaux
                </Link>
              </Button>
            </div>

            {/* Badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: Radio, text: "Technologie NFC sans contact & QR Code" },
                { icon: ShieldCheck, text: "Dès 50 € TTC · Sans abonnement" },
                { icon: MapPin, text: "Sur place dans le 13" },
                { icon: Globe, text: "Envoi à l'international" },
                { icon: BadgeCheck, text: "Compatible iPhone & Android" },
              ].map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm"
                >
                  <Icon className="h-4 w-4 text-accent" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Pourquoi les avis Google sont cruciaux */}
        <section className="py-20 px-6 bg-secondary/30">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-14">
              <span className="mb-3 inline-block text-sm font-medium uppercase tracking-widest text-accent">
                Visibilité locale & E-réputation
              </span>
              <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
                L&apos;arme numéro un pour booster vos avis Google Maps
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Quand un client recherche un restaurant, un commerçant ou un prestataire, son premier réflexe est de consulter la note Google et le nombre d&apos;avis récents. En combinant un support NFC avec une{" "}
                <Link href="/developpeur-web-marseille" className="text-accent underline underline-offset-4 hover:text-foreground">
                  création de site internet vitrine
                </Link>
                , vous hissez votre enseigne en tête des résultats locaux.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((item) => (
                <div key={item.step} className="rounded-2xl border border-border bg-card p-6">
                  <div className="font-serif text-3xl font-medium text-accent mb-3">{item.step}</div>
                  <h3 className="font-serif text-lg font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Synergie & Écosystème */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-4xl space-y-10">
            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="font-serif text-2xl font-medium mb-4">
                Une stratégie digitale complète pour votre commerce
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                La carte NFC est le complément parfait pour booster votre acquisition locale. En tant que{" "}
                <Link href="/" className="text-accent hover:underline">
                  développeur web freelance à Marseille
                </Link>
                , je vous aide à relier l&apos;ensemble de vos canaux :
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>
                    Proposez la commande et réservation directe sur mobile avec mon module de{" "}
                    <Link href="/commande-en-ligne-reservation" className="text-accent hover:underline">
                      commande et réservation en ligne
                    </Link>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>
                    Développez votre communauté avec mon service de{" "}
                    <Link href="/community-management" className="text-accent hover:underline">
                      community management pour Instagram et TikTok
                    </Link>
                    .
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-secondary/30">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-serif text-3xl font-medium md:text-4xl">
              Commandez vos cartes NFC configurées pour votre établissement
            </h2>
            <p className="mb-8 text-muted-foreground">
              Je configure votre lien Google Business Profile et je vous livre ou remets la carte prête à l&apos;emploi dès 50 € TTC. Installation sur place dans le 13 ou envoi à l&apos;international. Devis rapide sans engagement.
            </p>
            <Button size="lg" className="group px-8" asChild>
              <a href="/#contact">
                Demander un devis pour mes cartes NFC
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
