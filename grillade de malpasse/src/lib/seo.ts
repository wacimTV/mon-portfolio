import "server-only";
import type { SiteData } from "@/lib/data";
import { SCHEMA_DAYS } from "@/lib/hours";
import { SITE_URL, absoluteUrl, phoneE164 } from "@/lib/site";

const RESTAURANT_ID = `${SITE_URL}/#restaurant`;

/** Restaurant / LocalBusiness — sans AggregateRating (aucun avis collecté sur le site). */
export function restaurantJsonLd(data: SiteData) {
  const { settings: s, hours, uberEats, platforms } = data;

  // Regroupe les jours ayant les mêmes horaires
  const groups = new Map<string, string[]>();
  for (const h of hours.filter((h) => !h.closed)) {
    const k = `${h.openTime}|${h.closeTime}`;
    groups.set(k, [...(groups.get(k) ?? []), SCHEMA_DAYS[h.dayOfWeek]]);
  }

  const sameAs = [s.tiktok, s.instagram, s.facebook, s.snapchat, ...platforms.map((p) => p.url)].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "FastFoodRestaurant"],
    "@id": RESTAURANT_ID,
    name: s.name,
    description:
      "Grillade halal et fast-food à Malpassé (Marseille 13013) : sandwichs, assiettes de viandes grillées, burgers et tex-mex. Sur place, à emporter et en livraison Uber Eats, tous les jours de 11h à 1h.",
    url: SITE_URL,
    telephone: phoneE164(s.phone),
    image: [absoluteUrl("/opengraph-image")],
    logo: absoluteUrl("/icon.svg"),
    priceRange: "€",
    servesCuisine: ["Grillades", "Halal", "Fast-food", "Burgers", "Sandwichs", "Tex-mex"],
    address: {
      "@type": "PostalAddress",
      streetAddress: s.street,
      addressLocality: s.city,
      postalCode: s.postalCode,
      addressRegion: "Provence-Alpes-Côte d'Azur",
      addressCountry: "FR",
    },
    geo: { "@type": "GeoCoordinates", latitude: s.latitude, longitude: s.longitude },
    hasMap: s.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.name} ${s.street} ${s.postalCode} ${s.city}`)}`,
    areaServed: s.deliveryZones.split(",").map((z) => ({ "@type": "City", name: z.trim() })).filter((z) => z.name),
    openingHoursSpecification: [...groups.entries()].map(([k, days]) => {
      const [opens, closes] = k.split("|");
      return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes };
    }),
    hasMenu: absoluteUrl("/carte"),
    acceptsReservations: absoluteUrl("/reservation"),
    sameAs,
    ...(uberEats
      ? {
          potentialAction: {
            "@type": "OrderAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: uberEats.url,
              inLanguage: "fr",
              actionPlatform: [
                "https://schema.org/DesktopWebPlatform",
                "https://schema.org/MobileWebPlatform",
                "https://schema.org/IOSPlatform",
                "https://schema.org/AndroidPlatform",
              ],
            },
          },
        }
      : {}),
  };
}

export function menuJsonLd(data: SiteData) {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${absoluteUrl("/carte")}#menu`,
    name: `Carte — ${data.settings.name}`,
    url: absoluteUrl("/carte"),
    inLanguage: "fr",
    hasMenuSection: data.categories
      .filter((c) => c.items.length)
      .map((c) => ({
        "@type": "MenuSection",
        name: c.name,
        ...(c.description ? { description: c.description } : {}),
        hasMenuItem: c.items.map((i) => ({
          "@type": "MenuItem",
          name: i.name,
          ...(i.description ? { description: i.description } : {}),
          suitableForDiet: "https://schema.org/HalalDiet",
          offers: { "@type": "Offer", price: (i.priceCents / 100).toFixed(2), priceCurrency: "EUR" },
        })),
      })),
  };
}

export function faqJsonLd(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Accueil", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
