/** Constantes du site et helpers d'URL / formatage. */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = "La Grillade de Malpa";

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

/** "09 84 37 95 25" → "+33984379525" */
export function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `+33${digits.slice(1)}` : `+${digits}`;
  return `tel:${intl}`;
}

export function phoneE164(phone: string) {
  return telHref(phone).replace("tel:", "");
}

export function directionsUrl(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export function mapsSearchUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function whatsappHref(num: string, text = "Bonjour, je souhaite des informations.") {
  const digits = num.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : "";
}

export function fullAddress(s: { street: string; postalCode: string; city: string }) {
  return `${s.street}, ${s.postalCode} ${s.city}`;
}

export const NAV = [
  { href: "/carte", label: "La carte" },
  { href: "/livraison-marseille-13", label: "Livraison" },
  { href: "/#histoire", label: "Notre histoire" },
  { href: "/#galerie", label: "Galerie" },
  { href: "/#avis", label: "Avis" },
  { href: "/reservation", label: "Réserver" },
  { href: "/contact", label: "Contact" },
];

