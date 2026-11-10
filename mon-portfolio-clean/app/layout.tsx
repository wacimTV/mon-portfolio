import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { MobileContactBar } from "@/components/mobile-contact-bar";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const siteUrl = "https://www.wacimammouche.fr";

// viewport-fit=cover : nécessaire pour que env(safe-area-inset-bottom) fonctionne sur iOS
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Développeur Web & Community Manager à Marseille",
    template: "%s | Wacim Ammouche",
  },
  description:
    "Développeur web & community manager à Marseille : sites internet, e-commerce et réseaux sociaux, sur place dans le 13 ou en visio. Devis gratuit sous 24h.",
  authors: [{ name: "Wacim Ammouche", url: siteUrl }],
  creator: "Wacim Ammouche",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Développeur Web & Community Manager à Marseille",
    description:
      "Développeur web & community manager à Marseille : sites internet, e-commerce et réseaux sociaux, sur place dans le 13 ou en visio. Devis gratuit sous 24h.",
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Wacim Ammouche",
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
    title: "Développeur Web & Community Manager à Marseille",
    description:
      "Développeur web & community manager à Marseille : sites internet, e-commerce et réseaux sociaux, sur place dans le 13 ou en visio. Devis gratuit sous 24h.",
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

// JSON-LD Structured Data
function JsonLd() {
  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Wacim Ammouche — Développeur Web & Community Manager",
    description:
      "Développeur web freelance et community manager basé à Marseille. Sites internet, e-commerce, commande en ligne et réseaux sociaux : sur place dans les Bouches-du-Rhône ou à distance à l'international. Devis gratuit sous 24h.",
    url: siteUrl,
    email: "w.ammouche13@gmail.com",
    telephone: "+33782135483",
    image: `${siteUrl}/icon.png`,
    logo: `${siteUrl}/icon.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Marseille",
      postalCode: "13000",
      addressRegion: "Provence-Alpes-Côte d'Azur",
      addressCountry: "FR",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Marseille",
      },
      {
        "@type": "AdministrativeArea",
        name: "Bouches-du-Rhône",
      },
      {
        "@type": "Country",
        name: "France",
      },
    ],
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.2965,
      longitude: 5.3698,
    },
    sameAs: [
      "https://www.linkedin.com/in/wacim-ammouche-4a20031b1/",
      "https://www.instagram.com/wacim.digital/",
    ],
    knowsLanguage: ["fr", "en"],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Création de sites internet",
          description:
            "Conception et développement de sites web modernes, rapides et optimisés SEO, sur place dans le 13 ou à distance à l'international.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Commande et réservation en ligne pour restaurants et entreprises",
          description:
            "Système de commande en ligne et de réservation directe sur le site pour restaurants, commerces et toutes les entreprises.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Community Management & Gestion des réseaux sociaux",
          description:
            "Gestion des réseaux sociaux Instagram et TikTok. Création de contenus et stratégie de communication digitale.",
        },
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "250",
          priceCurrency: "EUR",
          valueAddedTaxIncluded: true,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Carte NFC & QR Code pour avis Google",
          description:
            "Installation de cartes NFC et QR Code pour faciliter la collecte d'avis Google.",
        },
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "50",
          priceCurrency: "EUR",
          valueAddedTaxIncluded: true,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <MobileContactBar />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
