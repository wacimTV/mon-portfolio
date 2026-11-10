import type { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Code,
  Globe,
  Smartphone,
  Zap,
  ShoppingCart,
  ArrowRight,
  CheckCircle,
  MapPin,
  Clock,
  BadgeCheck,
  RefreshCw,
  ChevronDown,
  Video,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DEFAULT_OG_IMAGE } from "@/lib/seo"

export const metadata: Metadata = {
  title: {
    absolute: "Création de site internet à Marseille | Développeur web",
  },
  description:
    "Création de sites vitrines, e-commerce et applications web à Marseille. Sites rapides et bien référencés par un freelance local. Devis gratuit sous 24h.",
  alternates: {
    canonical: "https://www.wacimammouche.fr/developpeur-web-marseille",
  },
  openGraph: {
    title: "Création de site internet à Marseille | Développeur web",
    description:
      "Création de sites vitrines, e-commerce et applications web à Marseille. Sites rapides et bien référencés par un freelance local. Devis gratuit sous 24h.",
    type: "website",
    locale: "fr_FR",
    url: "https://www.wacimammouche.fr/developpeur-web-marseille",
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
    title: "Création de site internet à Marseille | Développeur web",
    description:
      "Création de sites vitrines, e-commerce et applications web à Marseille. Sites rapides et bien référencés par un freelance local. Devis gratuit sous 24h.",
    images: [DEFAULT_OG_IMAGE.url],
  },
}

function PageJsonLd() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Création de site internet à Marseille",
    description:
      "Création de sites vitrines, e-commerce et applications web à Marseille. Développeur web freelance, sites rapides et bien référencés. Devis gratuit sous 24h.",
    url: "https://www.wacimammouche.fr/developpeur-web-marseille",
    provider: {
      "@type": "Person",
      name: "Wacim Ammouche",
      url: "https://www.wacimammouche.fr",
    },
    areaServed: [
      { "@type": "City", name: "Marseille" },
      { "@type": "AdministrativeArea", name: "Bouches-du-Rhône" },
      { "@type": "Country", name: "France" },
    ],
    knowsLanguage: ["fr", "en"],
    serviceType: [
      "Création de sites internet",
      "Développement web",
      "E-commerce",
      "Applications web",
      "Refonte de sites web",
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
        name: "Création de sites internet à Marseille",
        item: "https://www.wacimammouche.fr/developpeur-web-marseille",
      },
    ],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Combien de temps faut-il pour créer un site internet ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Le délai dépend de la taille du projet et de la rapidité des échanges (contenus, photos, validation). Je vous indique un délai précis dans le devis.",
        },
      },
      {
        "@type": "Question",
        name: "Comment se déroule un projet de création de site ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "J'échange avec vous sur vos besoins, je vous envoie un devis gratuit sous 24h, puis je crée le site et le mets en ligne.",
        },
      },
      {
        "@type": "Question",
        name: "Pouvez-vous refaire mon site existant ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui. Je modernise les sites existants : design, vitesse, version mobile et référencement.",
        },
      },
      {
        "@type": "Question",
        name: "Mon site sera-t-il bien référencé sur Google ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Je mets en place les bases du référencement naturel : structure, balises, vitesse et affichage mobile. Les résultats dépendent aussi de la concurrence et du temps, je ne peux donc pas garantir une position précise.",
        },
      },
      {
        "@type": "Question",
        name: "Travaillez-vous uniquement à Marseille ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Je suis basé à Marseille et je me déplace dans tout le département des Bouches-du-Rhône. Je peux aussi réaliser mes prestations à distance, en visioconférence, pour des clients à l'international.",
        },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}

const services = [
  {
    icon: Globe,
    title: "Site vitrine",
    description:
      "Un site internet professionnel qui présente votre activité, vos services et vos coordonnées. Idéal pour gagner en visibilité près de chez vous et sur le web.",
    link: "/#contact",
    linkText: "Demander un devis site vitrine",
  },
  {
    icon: ShoppingCart,
    title: "Site e-commerce",
    description:
      "Vendez vos produits en ligne avec une boutique rapide, sécurisée et facile à gérer. Paiement par carte bancaire intégré.",
    link: "/#contact",
    linkText: "Créer une boutique en ligne",
  },
  {
    icon: Smartphone,
    title: "Commande & Réservation en ligne",
    description:
      "Permettez à vos clients de commander ou de faire des réservations directement sur votre site web. Une solution sans intermédiaire idéale pour les restaurants et toutes les entreprises.",
    link: "/commande-en-ligne-reservation",
    linkText: "Découvrir la commande et réservation en ligne",
  },
  {
    icon: RefreshCw,
    title: "Refonte de site internet",
    description:
      "Modernisez votre site vieillissant : vitesse de chargement accrue, refonte graphique contemporaine et optimisation de votre référencement naturel.",
    link: "/refonte-site-internet-marseille",
    linkText: "En savoir plus sur la refonte de site web",
  },
  {
    icon: Zap,
    title: "Community Management & Réseaux Sociaux",
    description:
      "Gestion de vos réseaux sociaux Instagram et TikTok, création de contenus et stratégie de visibilité en ligne pour développer votre audience.",
    link: "/community-management",
    linkText: "Consulter mes formules de community management",
  },
  {
    icon: Code,
    title: "Application web sur-mesure",
    description:
      "Développement d'applications web complexes et d'outils métier spécifiques bâtis avec Next.js, React et TypeScript.",
    link: "/#contact",
    linkText: "Étudier votre projet d'application web",
  },
]

const processSteps = [
  {
    step: "01",
    title: "Échange sur votre projet",
    description:
      "Sur place dans les Bouches-du-Rhône ou en visio à l'international, j'échange avec vous sur vos besoins, vos objectifs et vos inspirations.",
  },
  {
    step: "02",
    title: "Devis gratuit sous 24h",
    description:
      "Je vous transmets une proposition claire, détaillée et sans engagement avec un calendrier précis.",
  },
  {
    step: "03",
    title: "Création et mise en ligne",
    description:
      "Je conçois et développe votre site sur-mesure, optimisé pour le référencement et prêt pour vos clients.",
  },
]

const advantages = [
  "Développeur basé à Marseille, disponible pour des rendez-vous en personne",
  "Déplacement dans tout le département des Bouches-du-Rhône (13)",
  "Prestations réalisables à distance en visioconférence à l'international",
  "Sites optimisés pour le référencement naturel (SEO)",
  "Design responsive adapté mobile, tablette et ordinateur",
  "Performances et vitesse de chargement optimisées",
  "Devis gratuit et sans engagement",
  "Réponse sous 24h garantie",
]

const faqItems = [
  {
    q: "Combien de temps faut-il pour créer un site internet ?",
    a: (
      <p>
        Le délai dépend de la taille du projet et de la rapidité des échanges (contenus, photos, validation). Je vous indique un délai précis dans le devis.
      </p>
    ),
  },
  {
    q: "Comment se déroule un projet de création de site ?",
    a: (
      <p>
        J&apos;échange avec vous sur vos besoins, je vous envoie un devis gratuit sous 24h, puis je crée le site et le mets en ligne.
      </p>
    ),
  },
  {
    q: "Pouvez-vous refaire mon site existant ?",
    a: (
      <p>
        Oui. Je modernise les sites existants : design, vitesse, version mobile et référencement. Découvrez les détails de ma prestation de{" "}
        <Link href="/refonte-site-internet-marseille" className="text-accent underline underline-offset-4 hover:text-foreground">
          refonte de site internet
        </Link>
        .
      </p>
    ),
  },
  {
    q: "Mon site sera-t-il bien référencé sur Google ?",
    a: (
      <p>
        Je mets en place les bases du référencement naturel : structure, balises, vitesse et affichage mobile. Les résultats dépendent aussi de la concurrence et du temps, je ne peux donc pas garantir une position précise.
      </p>
    ),
  },
  {
    q: "Travaillez-vous uniquement à Marseille ?",
    a: (
      <p>
        Je suis basé à Marseille et je me déplace dans tout le département des Bouches-du-Rhône. Je peux aussi réaliser mes prestations à distance, en visioconférence, pour des clients à l'international.
      </p>
    ),
  },
]

export default function DeveloppeurWebMarseillePage() {
  return (
    <>
      <PageJsonLd />
      <Navigation />
      <main id="main-content" className="relative">
        {/* Hero Section */}
        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 pt-24 pb-16">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            {/* Breadcrumb */}
            <nav
              aria-label="Fil d'Ariane"
              className="mb-8 flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <Link
                href="/"
                className="transition-colors hover:text-foreground"
              >
                Accueil
              </Link>
              <span aria-hidden="true">›</span>
              <span className="text-foreground">
                Création de sites internet
              </span>
            </nav>

            <h1 className="mb-6 font-serif text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">Création de sites internet</span>
              <span className="block text-gradient">à Marseille</span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Développeur web freelance basé à Marseille, je conçois des sites internet
              sur-mesure, des boutiques e-commerce et des solutions web rapides,
              soignées et optimisées pour le référencement naturel.
            </p>

            <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
              <span className="flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                Sur place dans le 13
              </span>
              <span className="flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs sm:text-sm text-muted-foreground">
                <Globe className="h-3.5 w-3.5 text-accent" />
                À distance à l&apos;international
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="group px-8" asChild>
                <a href="/#contact">
                  Demander un devis gratuit
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 bg-transparent"
                asChild
              >
                <Link href="/refonte-site-internet-marseille">
                  Découvrir la refonte de site
                </Link>
              </Button>
            </div>

            {/* Badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: MapPin, text: "Marseille & Bouches-du-Rhône" },
                { icon: Video, text: "Visio à l'international" },
                { icon: Clock, text: "Réponse sous 24h" },
                { icon: BadgeCheck, text: "Devis gratuit" },
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

        {/* Comment ça se passe */}
        <section className="py-24 px-6 border-t border-border">
          <div className="mx-auto max-w-5xl">
            <div className="mb-16 text-center">
              <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-accent">
                Méthode de travail
              </span>
              <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
                Comment ça se passe ?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Un accompagnement direct et transparent en trois étapes simples.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {processSteps.map((item) => (
                <div
                  key={item.step}
                  className="relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent"
                >
                  <div className="mb-4 font-serif text-3xl font-medium text-accent">
                    {item.step}
                  </div>
                  <h3 className="mb-2 font-serif text-xl font-medium">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 px-6 bg-secondary/30">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-accent">
                Mes prestations
              </span>
              <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
                Création de sites internet
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Du site vitrine à l&apos;application web complexe, je
                développe des solutions adaptées à vos besoins et à votre
                budget. Chaque projet est pensé pour être rapide, moderne et
                bien référencé sur Google.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent"
                >
                  <div>
                    <div className="mb-4 inline-flex rounded-xl bg-accent/10 p-3">
                      <service.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="mb-3 font-serif text-xl font-medium">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>
                  <Link
                    href={service.link}
                    className="inline-flex items-center text-sm font-medium text-accent hover:underline mt-auto"
                  >
                    {service.linkText}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pourquoi me choisir */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-accent">
                Pourquoi me choisir
              </span>
              <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
                Un développeur web freelance proche de vous
              </h2>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {advantages.map((adv) => (
                <li
                  key={adv}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm">{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 bg-secondary/30">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-accent">
                Questions fréquentes
              </span>
              <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
                Foire aux questions
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Toutes les réponses pour bien préparer votre projet de création de site web.
              </p>
            </div>

            <div className="space-y-4">
              {faqItems.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-border bg-card p-5 transition-colors [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-foreground hover:text-accent">
                    <span className="font-serif text-base md:text-lg">{item.q}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <div className="mt-4 pt-4 border-t border-border/60 text-sm text-muted-foreground leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-serif text-3xl font-medium tracking-tight md:text-4xl">
              Vous cherchez un développeur web pour votre projet&nbsp;?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Je m&apos;appelle{" "}
              <Link
                href="/"
                className="font-medium text-foreground underline underline-offset-4 hover:text-accent transition-colors"
              >
                Wacim Ammouche
              </Link>
              , développeur web freelance. Décrivez-moi votre projet et recevez un devis gratuit sous
              24h. Je me déplace dans tout le département des Bouches-du-Rhône et je travaille à distance à l'international.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="group px-8" asChild>
                <a href="/#contact">
                  Me contacter
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 bg-transparent"
                asChild
              >
                <Link href="/community-management">
                  Community Management
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
