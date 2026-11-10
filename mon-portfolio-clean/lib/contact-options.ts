// Liste autorisée du formulaire de contact.
// Partagée entre components/contact-section.tsx (menu) et app/api/contact/route.ts (validation).

export const PROJECT_TYPES = [
  "Site vitrine",
  "E-commerce",
  "Commande/réservation en ligne",
  "Refonte",
  "Community management",
  "Carte NFC avis Google",
  "Autre",
] as const

export type ProjectType = (typeof PROJECT_TYPES)[number]

export const isProjectType = (v: unknown): v is ProjectType =>
  typeof v === "string" && (PROJECT_TYPES as readonly string[]).includes(v)
