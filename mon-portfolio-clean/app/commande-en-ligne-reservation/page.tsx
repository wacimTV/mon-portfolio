import type { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Utensils,
  Smartphone,
  CreditCard,
  TrendingUp,
  Clock,
  MapPin,
  BadgeCheck,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Globe,
  CalendarCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DEFAULT_OG_IMAGE } from "@/lib/seo"

export const metadata: Metadata = {
  title: {
    absolute: "Commande en ligne & réservation à Marseille | 0 commission",
  },
  description:
    "Commande en ligne et réservation directe sur votre site, pour restaurants et entreprises à Marseille. Zéro commission. Devis gratuit sous 24h.",
  alternates: { canonical: "https://www.wacimammouche.fr/commande-en-ligne-reservation" },
  openGraph: {
    title: "Commande en ligne & réservation à Marseille | 0 commission",
    description:
      "Commande en ligne et réservation directe sur votre site, pour restaurants et entreprises à Marseille. Zéro commission. Devis gratuit sous 24h.",
    type: "website",
    locale: "fr_FR",
    url: "https://www.wacimammouche.fr/commande-en-ligne-reservation",
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
    title: "Commande en ligne & réservation à Marseille | 0 commission",
    description:
      "Commande en ligne et réservation directe sur votre site, pour restaurants et entreprises à Marseille. Zéro commission. Devis gratuit sous 24h.",
    images: [DEFAULT_OG_IMAGE.url],
  },
}

function PageJsonLd() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Commande en ligne et réservation directe sur le site pour restaurants et entreprises",
    description:
      "Mise en place d'un système de commande en ligne direct et de réservation sur le site pour restaurants, commerces et toutes les entreprises, sur place dans les Bouches-du-Rhône ou à distance à l'international.",
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
        name: "Commande en Ligne & Réservation",
        item: "https://www.wacimammouche.fr/commande-en-ligne-reservation",
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}

const keyBenefits = [
  {
    icon: TrendingUp,
    title: "Zéro commission sur vos commandes et réservations",
    description:
      "Contrairement aux plateformes qui prélèvent jusqu'à 30% sur chaque commande ou réservation, vous conservez l'intégralité de vos revenus et valorisez votre travail.",
  },
  {
    icon: CalendarCheck,
    title: "Réservation directe pour toutes les entreprises",
    description:
      "Vos clients peuvent faire des réservations directement sur votre site web : tables de restaurant, créneaux horaires, soins ou prestations pour toute entreprise.",
  },
  {
    icon: Smartphone,
    title: "Expérience fluide sur smartphone",
    description:
      "Une interface web intuitive sans obligation d'installer une application : vos clients commandent en Click & Collect ou réservent en quelques secondes.",
  },
  {
    icon: CreditCard,
    title: "Paiement en ligne sécurisé ou sur place",
    description:
      "Offrez le choix à vos clients : paiement en ligne par carte bancaire ou règlement au comptoir lors du retrait de leur commande ou du rendez-vous.",
  },
  {
    icon: Utensils,
    title: "Gestion facile de vos produits, menus et créneaux",
    description:
      "Modifiez vos plats, formules, services, disponibilités ou ruptures de stock en quelques clics depuis une interface d'administration claire.",
  },
  {
    icon: Clock,
    title: "Notifications instantanées et gain de temps",
    description:
      "Chaque commande et réservation arrive instantanément sur votre tableau de bord, vous évitant les interruptions téléphoniques en plein service.",
  },
]

export default function CommandeEnLignePage() {
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
              <span className="text-foreground">Commande & Réservation en ligne</span>
            </nav>

            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-accent">
              Restaurants, Commerces & Entreprises
            </span>

            <h1 className="mb-6 font-serif text-4xl font-medium leading-[1.15] tracking-tight sm:text-5xl md:text-6xl">
              Commande en Ligne & Réservation Directe sur le Site
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
              Propulsez votre établissement avec une solution de Click & Collect et de réservation directe sur votre site internet, rapide, élégante et sans commission. Vos clients peuvent passer commande ou faire des réservations directement en ligne pour toutes les entreprises. Sur place dans le 13 ou à distance à l'international.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="group px-8" asChild>
                <a href="/#contact">
                  Demander un devis gratuit
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="px-8 bg-transparent" asChild>
                <Link href="/developpeur-web-marseille">
                  Mes offres de création de sites
                </Link>
              </Button>
            </div>

            {/* Badges de réassurance */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: MapPin, text: "Sur place dans le 13" },
                { icon: Globe, text: "À distance à l'international" },
                { icon: ShieldCheck, text: "Sans commission de plateforme" },
                { icon: BadgeCheck, text: "Devis gratuit et sans engagement" },
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

        {/* Contenu éditorial & Avantages */}
        <section className="py-20 px-6 bg-secondary/30">
          <div className="mx-auto max-w-5xl">
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-sm font-medium uppercase tracking-widest text-accent">
                Pourquoi installer votre propre système ?
              </span>
              <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
                Une alternative rentable aux plateformes intermédiaires
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-muted-foreground leading-relaxed">
                De nombreux professionnels et restaurateurs voient leurs marges rognées par les commissions des plateformes tierces. En tant que{" "}
                <Link href="/" className="text-accent underline underline-offset-4 hover:text-foreground">
                  développeur web et community manager à Marseille
                </Link>
                , je conçois des solutions de commande en ligne et de réservation directe qui appartiennent à 100% à votre entreprise.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {keyBenefits.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-accent/10 p-3">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mb-2 font-serif text-xl font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Détails techniques & Fonctionnalités */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-4xl space-y-12">
            <div>
              <h2 className="font-serif text-2xl font-medium md:text-3xl mb-4">
                Comment fonctionnent la commande et la réservation directe sur votre site ?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Vos clients scannent votre QR code ou accèdent directement à votre site internet depuis leur smartphone ou ordinateur. Ils peuvent passer commande en Click & Collect en quelques instants ou effectuer une réservation directement sur le site en choisissant leur créneau et leurs options.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Cette fonctionnalité de réservation directe sur le site est conçue pour toutes les entreprises : réservation de tables pour restaurants et brasseries, mais également prise de rendez-vous et réservation de créneaux pour salons, instituts, artisans, prestataires de services et professionnels indépendants.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                De votre côté, chaque commande ou réservation arrive instantanément sur votre tableau de bord, smartphone ou boîte mail. Vous gagnez un temps précieux au téléphone pendant vos heures d&apos;activité et éliminez tout risque d&apos;erreur.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
              <h3 className="font-serif text-xl font-medium mb-4">
                Accompagnement complet pour les restaurateurs & entreprises
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>
                    Synchronisation avec mon offre de{" "}
                    <Link href="/developpeur-web-marseille" className="text-accent hover:underline">
                      création de site internet
                    </Link>{" "}
                    ou intégration directe sur votre site existant.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>
                    Collecte d&apos;avis facilitée grâce à mes{" "}
                    <Link href="/carte-nfc-avis-google-marseille" className="text-accent hover:underline">
                      cartes NFC pour avis Google
                    </Link>{" "}
                    posées sur votre comptoir.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>
                    Visibilité accrue sur les réseaux avec mes{" "}
                    <Link href="/community-management" className="text-accent hover:underline">
                      formules de community management pour Instagram et TikTok
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
              Prêt à lancer votre commande en ligne sans commission ?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Contactez-moi pour étudier votre carte et vos besoins. Devis gratuit et échange personnalisé sans engagement. Sur place dans le 13 ou à distance à l'international.
            </p>
            <Button size="lg" className="group px-8" asChild>
              <a href="/#contact">
                Demander mon devis restaurant gratuit
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
