import type { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  RefreshCw,
  Zap,
  Smartphone,
  Search,
  CheckCircle,
  Clock,
  MapPin,
  BadgeCheck,
  ArrowRight,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DEFAULT_OG_IMAGE } from "@/lib/seo"

export const metadata: Metadata = {
  title: {
    absolute: "Refonte de site internet à Marseille | Design & SEO local",
  },
  description:
    "Refonte de site internet à Marseille : design moderne, Next.js, optimisation mobile et SEO local pour être mieux classé. Devis gratuit sous 24h.",
  alternates: { canonical: "https://www.wacimammouche.fr/refonte-site-internet-marseille" },
  openGraph: {
    title: "Refonte de site internet à Marseille | Design & SEO local",
    description:
      "Refonte de site internet à Marseille : design moderne, Next.js, optimisation mobile et SEO local pour être mieux classé. Devis gratuit sous 24h.",
    type: "website",
    locale: "fr_FR",
    url: "https://www.wacimammouche.fr/refonte-site-internet-marseille",
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
    title: "Refonte de site internet à Marseille | Design & SEO local",
    description:
      "Refonte de site internet à Marseille : design moderne, Next.js, optimisation mobile et SEO local pour être mieux classé. Devis gratuit sous 24h.",
    images: [DEFAULT_OG_IMAGE.url],
  },
}

function PageJsonLd() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Refonte de site internet à Marseille",
    description:
      "Audit, modernisation graphique, optimisation de la vitesse et refonte SEO complète de sites internet, sur place dans les Bouches-du-Rhône ou à distance à l'international.",
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
        name: "Refonte site internet Marseille",
        item: "https://www.wacimammouche.fr/refonte-site-internet-marseille",
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

const auditPoints = [
  {
    icon: Zap,
    title: "Chargement ultra-rapide (Next.js & Turbopack)",
    description:
      "Un site lent fait fuir plus de 50% des visiteurs avant même l'affichage. Je reconstruis votre code sur des bases modernes pour un chargement quasi instantané.",
  },
  {
    icon: Smartphone,
    title: "Responsive design irréprochable",
    description:
      "Votre site s'adapte parfaitement à tous les écrans, du smartphone à l'écran de bureau, avec une navigation fluide pensée pour convertir.",
  },
  {
    icon: Search,
    title: "Préservation et boost du référencement SEO",
    description:
      "Plan de redirection 301 méthodique pour conserver l'autorité de vos anciennes pages tout en optimisant le ciblage de mots-clés stratégiques.",
  },
  {
    icon: RefreshCw,
    title: "Image de marque contemporaine",
    description:
      "Typographies soignées, contrastes accessibles et identité visuelle haut de gamme qui rassure vos prospects dès les premières secondes.",
  },
]

export default function RefonteSiteMarseillePage() {
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
              <span className="text-foreground">Refonte de site internet</span>
            </nav>

            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-accent">
              Modernisation & Performance
            </span>

            <h1 className="mb-6 font-serif text-4xl font-medium leading-[1.15] tracking-tight sm:text-5xl md:text-6xl">
              Refonte de Site Internet à Marseille
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
              Transformez votre ancien site web en un outil commercial performant, rapide et conçu pour capter de nouveaux clients. Sur place dans le 13 ou à distance à l'international.
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
                  Voir mes prestations web
                </Link>
              </Button>
            </div>

            {/* Badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: MapPin, text: "Sur place dans le 13" },
                { icon: Globe, text: "À distance à l'international" },
                { icon: Clock, text: "Réponse sous 24h" },
                { icon: BadgeCheck, text: "Préservation SEO garantie" },
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

        {/* Pourquoi refondre son site */}
        <section className="py-20 px-6 bg-secondary/30">
          <div className="mx-auto max-w-5xl">
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-sm font-medium uppercase tracking-widest text-accent">
                Signes d&apos;obsolescence
              </span>
              <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
                Quand devez-vous envisager une refonte web ?
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-muted-foreground leading-relaxed">
                Technologies dépassées, plugins WordPress vulnérables, design non adapté aux smartphones modernes ou absence totale de demandes de contact : ces signaux indiquent qu&apos;il est temps de renouveler votre vitrine. En tant que{" "}
                <Link href="/" className="text-accent underline underline-offset-4 hover:text-foreground">
                  développeur web et community manager à Marseille
                </Link>
                , je vous accompagne dans chaque étape technique de cette transition.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {auditPoints.map((point) => (
                <div
                  key={point.title}
                  className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-accent/10 p-3">
                    <point.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mb-2 font-serif text-xl font-medium">{point.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Méthodologie et maillage */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-4xl space-y-10">
            <div>
              <h2 className="font-serif text-2xl font-medium md:text-3xl mb-4">
                Une refonte sans risque pour votre activité
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                La plus grande crainte lors d&apos;une refonte est la perte du référencement naturel durement acquis. C&apos;est pourquoi je cartographie chaque URL existante pour appliquer des redirections 301 strictes, tout en améliorant la vitesse de chargement et l&apos;architecture sémantique des balises HTML.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                C&apos;est également l&apos;occasion idéale d&apos;ajouter de nouvelles fonctionnalités à forte valeur ajoutée, comme un module de{" "}
                <Link href="/commande-en-ligne-reservation" className="text-accent hover:underline">
                  commande et réservation directe en ligne
                </Link>{" "}
                ou une intégration avec votre stratégie de{" "}
                <Link href="/community-management" className="text-accent hover:underline">
                  community management et visibilité sur les réseaux sociaux
                </Link>
                .
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
              <h3 className="font-serif text-xl font-medium mb-3">
                Envie d&apos;un projet clé en main ?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Découvrez mes compétences de{" "}
                <Link href="/developpeur-web-marseille" className="text-accent hover:underline">
                  création de site web sur-mesure
                </Link>{" "}
                pour concevoir un projet pérenne et évolutif adapté à votre secteur. Sur place dans le 13 ou à distance à l'international.
              </p>
              <Button size="lg" className="group px-8" asChild>
                <a href="/#contact">
                  Discuter de la refonte de votre site
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
