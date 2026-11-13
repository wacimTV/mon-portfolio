import {
  Camera,
  CalendarClock,
  FileText,
  LineChart,
  MessageCircle,
  Palette,
  Target,
  Video,
  Store,
  Hammer,
  UtensilsCrossed,
  Croissant,
  Scissors,
  Hotel,
  User,
  Building2,
  MessageSquare,
  Sparkles,
  Rocket,
  BarChart3,
  type LucideIcon,
} from "lucide-react"

export type PlanId = "essentielle" | "standard" | "premium"

export interface Plan {
  id: PlanId
  name: string
  price: string
  tagline: string
  features: string[]
  cta: string
  featured?: boolean
}

export const plans: Plan[] = [
  {
    id: "essentielle",
    name: "Formule Essentielle",
    price: "250 €",
    tagline: "Pour les entreprises qui veulent commencer à communiquer régulièrement.",
    features: [
      "Instagram et TikTok",
      "1 publication par semaine, soit environ 4 par mois",
      "2 stories par semaine",
      "Création de visuels",
      "Stratégie de communication",
    ],
    cta: "Choisir la formule Essentielle",
  },
  {
    id: "standard",
    name: "Formule Standard",
    price: "450 €",
    tagline: "Pour les entreprises qui souhaitent développer davantage leur visibilité.",
    features: [
      "Instagram et TikTok",
      "3 publications par semaine, soit environ 12 par mois",
      "3 stories par semaine",
      "Création de visuels",
      "Stratégie de communication",
      "Rapport mensuel",
    ],
    cta: "Choisir la formule Standard",
    featured: true,
  },
  {
    id: "premium",
    name: "Formule Premium",
    price: "750 €",
    tagline: "Pour les entreprises qui souhaitent une communication plus soutenue.",
    features: [
      "Instagram et TikTok",
      "4 à 5 publications par semaine, soit environ 16 à 20 par mois",
      "4 stories par semaine",
      "Création complète des contenus",
      "Gestion des commentaires et des messages",
      "Stratégie de communication",
      "Suivi et rapport mensuel",
    ],
    cta: "Choisir la formule Premium",
  },
]

export const benefits: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Camera, title: "Publications professionnelles", text: "Des publications soignées, pensées pour valoriser votre activité." },
  { icon: Video, title: "Stories et vidéos courtes", text: "Des formats dynamiques adaptés à Instagram et TikTok." },
  { icon: FileText, title: "Rédaction des textes", text: "Des textes adaptés à la communication de votre entreprise." },
  { icon: CalendarClock, title: "Planification", text: "Programmation des publications selon un calendrier défini ensemble." },
  { icon: MessageCircle, title: "Commentaires et messages", text: "Gestion des échanges avec votre communauté, selon la formule choisie." },
  { icon: Palette, title: "Identité de marque", text: "Une cohérence visuelle qui rend votre entreprise reconnaissable." },
  { icon: Target, title: "Stratégie adaptée", text: "Une stratégie de communication construite autour de vos objectifs." },
  { icon: LineChart, title: "Statistiques et suivi", text: "Analyse des performances lorsque cela est inclus dans la formule." },
]

export const steps: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: MessageSquare, title: "Échange", text: "Comprendre votre activité, vos objectifs et votre clientèle." },
  { icon: Sparkles, title: "Création", text: "Préparer les visuels, les textes et les contenus." },
  { icon: Rocket, title: "Publication", text: "Organiser et publier les contenus selon le calendrier convenu." },
  { icon: BarChart3, title: "Suivi", text: "Analyser les performances et identifier des pistes d'amélioration, selon la formule choisie." },
]

export const sectors: { icon: LucideIcon; label: string }[] = [
  { icon: Store, label: "Commerçants" },
  { icon: Hammer, label: "Artisans" },
  { icon: UtensilsCrossed, label: "Restaurants" },
  { icon: Croissant, label: "Boulangeries" },
  { icon: Scissors, label: "Salons de coiffure et instituts de beauté" },
  { icon: Hotel, label: "Hôtels" },
  { icon: User, label: "Indépendants" },
  { icon: Building2, label: "PME" },
]

export const faqs: { q: string; a: string }[] = [
  {
    q: "Quelle formule choisir pour mon entreprise ?",
    a: "L'Essentielle convient pour commencer à communiquer régulièrement. La Standard permet de développer davantage votre visibilité avec un rythme plus soutenu et un rapport mensuel. La Premium s'adresse aux entreprises qui souhaitent une communication complète incluant la gestion des commentaires et des messages. En cas de doute, demandez un devis gratuit : je vous orienterai selon vos objectifs.",
  },
  {
    q: "Dois-je fournir les photos et les vidéos ?",
    a: "Nous définissons ensemble les modalités concernant les visuels lors de notre premier échange, en fonction des besoins de votre activité et de la formule choisie.",
  },
  {
    q: "Puis-je modifier ma formule plus tard ?",
    a: "Oui, bien sûr ! Vous pouvez changer de formule à tout moment selon l’évolution de vos besoins et de votre activité. Je vous conseillerai l’offre la plus adaptée à vos objectifs.",
  },
  {
    q: "Comment se déroule le premier mois ?",
    a: "Tout commence par un échange pour comprendre votre activité, vos objectifs et votre clientèle. Je prépare ensuite les visuels, les textes et les contenus, puis je les publie selon le calendrier convenu.",
  },
  {
    q: "Les publications sont-elles adaptées à mon activité ?",
    a: "Oui. Les contenus sont adaptés à votre secteur d'activité, à vos objectifs et à l'identité de votre entreprise.",
  },
  {
    q: "Comment demander un devis ?",
    a: "Cliquez sur « Demander un devis gratuit » ou sur le bouton d'une formule, puis remplissez le court formulaire. Le devis est gratuit et sans engagement, et je réponds sous 24 heures. Vous pouvez aussi me contacter directement via le formulaire de contact du site.",
  },
  {
    q: "Y a-t-il une durée d'engagement ?",
    a: "La durée d'engagement, les conditions de résiliation et les modalités de paiement sont à confirmer lors du devis. La demande de devis, elle, est gratuite et sans engagement.",
  },
]
