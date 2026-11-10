"use client"

import type React from "react"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Car,
  Video,
  Clock,
  ChevronDown,
  ArrowRight,
  BadgeCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { TurnstileWidget, TURNSTILE_SITE_KEY, type TurnstileHandle } from "@/components/turnstile-widget"
import { PROJECT_TYPES, BUDGETS } from "@/lib/contact-options"

// ─── FAQ Data ────────────────────────────────────────────────────────────────
const faqItems = [
  {
    q: "Quel est le prix d'un site internet pour un restaurant à Marseille ?",
    a: "Le prix dépend de votre projet : site vitrine, commande ou réservation en ligne directe, nombre de pages, paiement en ligne, gestion des produits et des créneaux. Je vous propose un devis gratuit, détaillé et sans engagement, sous 24h, après un échange sur vos besoins.",
  },
  {
    q: "Quel est le délai de création d'un site web ?",
    a: "En moyenne, comptez 1 à 3 semaines pour un site vitrine professionnel ou un site de restaurant après réception de vos contenus. Pour un projet e-commerce ou sur-mesure plus complexe, prévoyez entre 3 et 6 semaines.",
  },
  {
    q: "Quelle est la différence entre un site vitrine et un site e-commerce ?",
    a: "Un site vitrine présente votre activité, vos réalisations et vos coordonnées pour inciter vos visiteurs à vous contacter ou visiter votre établissement. Un site e-commerce intègre en plus un catalogue produit complet, un panier et le paiement sécurisé en ligne.",
  },
  {
    q: "En combien de temps recevez-vous une réponse ?",
    a: "Je réponds à chaque demande sous 24 heures, souvent bien plus tôt. Vous ne resterez jamais sans nouvelles.",
  },
  {
    q: "Proposez-vous un devis gratuit ?",
    a: "Oui, entièrement gratuit et sans engagement. Après analyse de votre projet, je vous transmets une proposition claire et détaillée.",
  },
  {
    q: "Travaillez-vous à distance ?",
    a: "Absolument. Je collabore en visioconférence avec des clients à l'international. La distance n'est pas un obstacle.",
  },
  {
    q: "Vous déplacez-vous chez vos clients ?",
    a: "Oui, je me déplace dans tout le département des Bouches-du-Rhône (13) pour les rendez-vous en présentiel.",
  },
]

// ─── Reassurance Badges ───────────────────────────────────────────────────────
const badges = [
  { icon: Clock, label: "Réponse sous 24h" },
  { icon: BadgeCheck, label: "Devis gratuit" },
  { icon: BadgeCheck, label: "Sans engagement" },
  { icon: Clock, label: "Disponible 7j/7" },
  { icon: Car, label: "Déplacement dans le 13" },
]

// ─── FAQ Item Component ───────────────────────────────────────────────────────
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="border-b border-border last:border-0"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-medium transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <span>{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-muted-foreground"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      {/* Toujours présent dans le HTML pour l'indexation SEO */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState("")
  const turnstileRef = useRef<TurnstileHandle>(null)
  // Moment où le formulaire est affiché (les robots l'envoient instantanément)
  const startedAt = useRef<number>(Date.now())

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError("Merci de patienter pendant la vérification anti-robot.")
      return
    }

    setIsLoading(true)
    setError(null)

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      projectType: (form.elements.namedItem("projectType") as HTMLSelectElement).value,
      budget: (form.elements.namedItem("budget") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      website: (form.elements.namedItem("website") as HTMLInputElement).value,
      startedAt: startedAt.current,
      turnstileToken,
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || "Erreur lors de l'envoi.")
      }

      setIsSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue. Veuillez réessayer.")
      // Un jeton Turnstile n'est valable qu'une fois : on en redemande un
      turnstileRef.current?.reset()
    } finally {
      setIsLoading(false)
    }
  }

  // Stagger children animation
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="contact" className="relative py-32 px-6 bg-secondary/30" ref={ref} aria-label="Contacter un développeur web freelance à Marseille">
      <div className="mx-auto max-w-7xl">

        {/* ── Grid: Left Info + Right Form ─────────────────────────────── */}
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">

          {/* ── Left Column ──────────────────────────────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Eyebrow */}
            <motion.span
              variants={itemVariants}
              className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-accent"
            >
              Parlons de votre projet
            </motion.span>

            {/* H2 */}
            <motion.h2
              variants={itemVariants}
              className="mb-6 font-serif text-4xl font-medium leading-tight tracking-tight md:text-5xl"
            >
              Demandez votre devis gratuit pour la création de votre site internet
            </motion.h2>

            {/* Description */}
            <motion.p variants={itemVariants} className="mb-10 text-muted-foreground leading-relaxed">
              J'accompagne les entreprises, les indépendants et les particuliers dans la création de sites web modernes,
              rapides et optimisés. À l'écoute de vos besoins, je vous garantis une réponse personnalisée à chaque
              demande — l'objectif étant toujours de trouver la solution la plus adaptée à votre projet.
            </motion.p>

            {/* Contact Info */}
            <motion.div variants={containerVariants} className="space-y-5">

              {/* Email */}
              <motion.div
                variants={itemVariants}
                className="group flex items-center gap-4 rounded-xl p-3 -mx-3 transition-colors hover:bg-accent/5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="mb-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</div>
                  <a
                    href="#contact-form"
                    className="font-medium transition-colors hover:text-accent"
                  >
                    w.ammouche13@gmail.com
                  </a>
                </div>
              </motion.div>

              {/* Téléphone */}
              <motion.div
                variants={itemVariants}
                className="group flex items-center gap-4 rounded-xl p-3 -mx-3 transition-colors hover:bg-accent/5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <Phone className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="mb-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Téléphone</div>
                  <a
                    href="tel:+33782135483"
                    className="font-medium transition-colors hover:text-accent"
                  >
                    07 82 13 54 83
                  </a>
                </div>
              </motion.div>

              {/* Localisation */}
              <motion.div
                variants={itemVariants}
                className="group flex items-center gap-4 rounded-xl p-3 -mx-3 transition-colors hover:bg-accent/5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="mb-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Localisation</div>
                  <span className="font-medium">Marseille</span>
                </div>
              </motion.div>

              {/* Déplacements */}
              <motion.div
                variants={itemVariants}
                className="group flex items-center gap-4 rounded-xl p-3 -mx-3 transition-colors hover:bg-accent/5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <Car className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="mb-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Déplacements</div>
                  <span className="font-medium">Dans tout le département des Bouches-du-Rhône (13)</span>
                </div>
              </motion.div>

              {/* Visioconférence */}
              <motion.div
                variants={itemVariants}
                className="group flex items-center gap-4 rounded-xl p-3 -mx-3 transition-colors hover:bg-accent/5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <Video className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="mb-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Visioconférence</div>
                  <span className="font-medium">Prestations réalisables à distance, à l'international</span>
                </div>
              </motion.div>

              {/* Disponibilité */}
              <motion.div
                variants={itemVariants}
                className="group flex items-center gap-4 rounded-xl p-3 -mx-3 transition-colors hover:bg-accent/5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="mb-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Disponibilité</div>
                  <div className="flex items-center gap-2 font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </span>
                    Disponible 7j/7
                  </div>
                  <div className="mt-0.5 text-sm text-muted-foreground">Réponse sous 24h garantie</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ── Right Column: Form ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <CheckCircle className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="mb-2 font-serif text-2xl font-medium">Message bien reçu !</h3>
                  <p className="text-muted-foreground max-w-xs">
                    Merci pour votre confiance. Je vous répondrai personnellement sous 24h — souvent bien plus tôt.
                  </p>
                </motion.div>
              ) : (
                <form id="contact-form" onSubmit={handleSubmit} className="space-y-5">

                  {/* Name + Email */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Jean Dupont"
                        required
                        className="bg-background transition-shadow focus:shadow-[0_0_0_3px_hsl(var(--accent)/0.15)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Adresse email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="jean@entreprise.fr"
                        required
                        className="bg-background transition-shadow focus:shadow-[0_0_0_3px_hsl(var(--accent)/0.15)]"
                      />
                    </div>
                  </div>

                  {/* Type de projet + Budget */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="projectType">Type de projet</Label>
                      <select
                        id="projectType"
                        name="projectType"
                        required
                        defaultValue=""
                        className="border-input h-9 w-full min-w-0 rounded-md border bg-background px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
                      >
                        <option value="" disabled>
                          Choisir…
                        </option>
                        {PROJECT_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">
                        Budget <span className="font-normal text-muted-foreground">(facultatif)</span>
                      </Label>
                      <select
                        id="budget"
                        name="budget"
                        defaultValue=""
                        className="border-input h-9 w-full min-w-0 rounded-md border bg-background px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
                      >
                        <option value="">Non précisé</option>
                        {BUDGETS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Décrivez brièvement votre demande"
                      required
                      className="bg-background transition-shadow focus:shadow-[0_0_0_3px_hsl(var(--accent)/0.15)]"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Présentez votre projet, vos objectifs et toute information utile. Je vous répondrai dans les meilleurs délais."
                      rows={5}
                      required
                      className="resize-none bg-background transition-shadow focus:shadow-[0_0_0_3px_hsl(var(--accent)/0.15)]"
                    />
                  </div>

                  {/* Honeypot anti-robot : invisible pour les humains, ne pas supprimer */}
                  <div
                    aria-hidden="true"
                    style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}
                  >
                    <label htmlFor="website">Ne pas remplir ce champ</label>
                    <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
                  </div>

                  {/* Cloudflare Turnstile (si NEXT_PUBLIC_TURNSTILE_SITE_KEY est défini) */}
                  <TurnstileWidget ref={turnstileRef} onToken={setTurnstileToken} />

                  {/* CTA */}
                  <Button
                    type="submit"
                    className="group w-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                        Envoi en cours…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Discutons de votre projet
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    )}
                  </Button>

                  {/* Error */}
                  {error && (
                    <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  {/* Reassurance note under button */}
                  <p className="text-center text-xs text-muted-foreground">
                    Devis gratuit · Sans engagement · Réponse sous 24h
                  </p>
                </form>
              )}
            </div>

            {/* ── Reassurance Badges ────────────────────────────────────── */}
            <motion.div
              className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.5 } },
              }}
            >
              {badges.map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                  }}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2.5 text-xs font-medium"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-accent" />
                  {label}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── Mini FAQ ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mt-24"
        >
          {/* FAQ Header */}
          <div className="mb-8 text-center">
            <span className="mb-3 inline-block text-sm font-medium uppercase tracking-widest text-accent">
              Questions fréquentes
            </span>
          </div>

          {/* FAQ Items */}
          <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card px-6 md:px-8">
            {faqItems.map((item, i) => (
              <FaqItem key={item.q} q={item.q} a={item.a} index={i} />
            ))}
          </div>

          {/* CTA below FAQ */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            Une question non listée ?{" "}
            <a
              href="#contact-form"
              className="font-medium text-accent underline-offset-4 hover:underline"
            >
              Écrivez-moi directement
            </a>
          </motion.p>
        </motion.div>

      </div>
    </section>
  )
}
