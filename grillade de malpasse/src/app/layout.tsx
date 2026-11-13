import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
  weight: ["500", "600", "700"],
});

const description =
  "Grillade halal à Malpassé, Marseille 13013 : sandwichs, assiettes grillées, burgers et tex-mex. Sur place, à emporter ou Uber Eats 7j/7 de 11h à 1h.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Grillade halal Marseille 13013 · La Grillade de Malpa",
    template: "%s | La Grillade de Malpa",
  },
  description,
  applicationName: SITE_NAME,
  keywords: [
    "grillade Marseille",
    "grillade halal Marseille",
    "restaurant Malpassé",
    "snack Malpassé",
    "restaurant Marseille 13013",
    "fast food 13013",
    "burger halal Marseille 13",
    "livraison halal Marseille 13",
    "restaurant ouvert tard Marseille",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE_NAME,
    title: "La Grillade de Malpa — Grillade halal à Malpassé, Marseille 13e",
    description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "La Grillade de Malpa — Grillade halal Marseille 13013",
    description,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0c0a08",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${oswald.variable}`}>
      <body>
        {children}
        <AnalyticsTracker />
      </body>
    </html>
  );
}
