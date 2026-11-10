// Listes autorisées du formulaire de contact.
// Partagées entre components/contact-section.tsx (menus) et app/api/contact/route.ts (validation).

export const PROJECT_TYPES = [
  "Site vitrine",
  "E-commerce",
  "Commande/réservation en ligne",
  "Refonte",
  "Community management",
  "Carte NFC avis Google",
  "Autre",
] as const

export const BUDGETS = [
  "< 500 €",
  "500–1 000 €",
  "1 000–2 500 €",
  "> 2 500 €",
  "Je ne sais pas",
] as const

export type ProjectType = (typeof PROJECT_TYPES)[number]
export type Budget = (typeof BUDGETS)[number]

export const isProjectType = (v: unknown): v is ProjectType =>
  typeof v === "string" && (PROJECT_TYPES as readonly string[]).includes(v)

export const isBudget = (v: unknown): v is Budget =>
  typeof v === "string" && (BUDGETS as readonly string[]).includes(v)
