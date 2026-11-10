import type { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site de Wacim Ammouche, développeur web freelance et community manager à Marseille. Une question ? Devis gratuit sous 24h.",
  alternates: { canonical: "https://www.wacimammouche.fr/mentions-legales" },
  openGraph: {
    title: "Mentions légales | Wacim Ammouche",
    description:
      "Mentions légales du site de Wacim Ammouche, développeur web freelance et community manager à Marseille. Une question ? Devis gratuit sous 24h.",
    type: "website",
    locale: "fr_FR",
    url: "https://www.wacimammouche.fr/mentions-legales",
    siteName: "Wacim Ammouche",
  },
  twitter: {
    card: "summary",
    title: "Mentions légales | Wacim Ammouche",
    description:
      "Mentions légales du site de Wacim Ammouche, développeur web freelance et community manager à Marseille. Une question ? Devis gratuit sous 24h.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function MentionsLegalesPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="relative min-h-screen px-6 pt-32 pb-24">
        <div className="mx-auto max-w-3xl space-y-8">
          <nav aria-label="Fil d'Ariane" className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Accueil</Link>
            <span className="mx-2" aria-hidden="true">›</span>
            <span className="text-foreground">Mentions Légales</span>
          </nav>

          <h1 className="font-serif text-3xl font-medium tracking-tight md:text-5xl">
            Mentions Légales
          </h1>

          <section className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <h2 className="font-serif text-xl font-medium text-foreground">1. Éditeur du site</h2>
            <p>
              Le site internet <strong>https://www.wacimammouche.fr</strong> est édité par :<br />
              <strong>Wacim AMMOUCHE</strong>, Entrepreneur individuel / Développeur web freelance & Community Manager.<br />
              <strong>Localisation :</strong> Marseille, Bouches-du-Rhône (13), France.<br />
              <strong>Téléphone :</strong> 07 82 13 54 83<br />
              <strong>Email :</strong> w.ammouche13@gmail.com<br />
              <strong>Numéro SIRET :</strong> 10932844300014<br />
              <strong>TVA intracommunautaire :</strong> Franchise en base de TVA (TVA non applicable, selon l'article 293 B du CGI).
            </p>
          </section>

          <section className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <h2 className="font-serif text-xl font-medium text-foreground">2. Hébergement</h2>
            <p>
              Le site est hébergé par :<br />
              <strong>Vercel Inc.</strong><br />
              440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br />
              Site web : https://vercel.com
            </p>
          </section>

          <section className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <h2 className="font-serif text-xl font-medium text-foreground">3. Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus (textes, logos, photographies, graphismes, code source) présents sur ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Toute reproduction, modification ou diffusion sans autorisation préalable écrite de l'éditeur est interdite.
            </p>
          </section>

          <section className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <h2 className="font-serif text-xl font-medium text-foreground">4. Protection des données personnelles (RGPD)</h2>
            <p>
              Les informations recueillies via le formulaire de contact sont strictement confidentielles et uniquement utilisées pour répondre à votre demande de devis ou de prise de contact. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données en contactant directement w.ammouche13@gmail.com.
            </p>
          </section>

          <section className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <h2 className="font-serif text-xl font-medium text-foreground">5. Liens hypertextes</h2>
            <p>
              Le site contient des liens vers des sites tiers (LinkedIn, Instagram). L'éditeur décline toute responsabilité quant au contenu ou aux politiques de confidentialité de ces sites externes.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
