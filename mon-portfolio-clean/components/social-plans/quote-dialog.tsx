"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { AlertCircle, CheckCircle, Loader2, Send } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { plans, type PlanId } from "@/components/social-plans-data"

export type FormulaChoice = PlanId | "a-definir"

const formulaLabel: Record<FormulaChoice, string> = {
  essentielle: "Formule Essentielle – 250 € / mois TTC",
  standard: "Formule Standard – 350 € / mois TTC",
  premium: "Formule Premium – 500 € / mois TTC",
  "a-definir": "Je ne sais pas encore (à définir ensemble)",
}

type Field = "name" | "company" | "email" | "need"
type Errors = Partial<Record<Field, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  formula: FormulaChoice
  onFormulaChange: (f: FormulaChoice) => void
}

/**
 * Formulaire de demande de devis. Il réutilise l'API existante `/api/contact`
 * (Resend) : les champs spécifiques (entreprise, formule, besoin) sont regroupés
 * dans le champ `message`. La confirmation n'est affichée que si l'API répond OK.
 */
export function QuoteDialog({ open, onOpenChange, formula, onFormulaChange }: Props) {
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // Réinitialise l'état à chaque ouverture
  useEffect(() => {
    if (open) {
      setErrors({})
      setServerError(null)
      setSent(false)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const v = (k: string) => String(fd.get(k) ?? "").trim()
    const values = { name: v("name"), company: v("company"), email: v("email"), need: v("need") }

    const next: Errors = {}
    if (!values.name) next.name = "Veuillez indiquer votre nom."
    if (!values.company) next.company = "Veuillez indiquer le nom de votre entreprise."
    if (!values.email) next.email = "Veuillez indiquer votre adresse e-mail."
    else if (!EMAIL_RE.test(values.email)) next.email = "Cette adresse e-mail ne semble pas valide."
    if (values.need.length < 10) next.need = "Décrivez votre besoin en quelques mots (10 caractères minimum)."

    setErrors(next)
    setServerError(null)
    if (Object.keys(next).length > 0) {
      const first = (["name", "company", "email", "need"] as Field[]).find((k) => next[k])
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          subject: `Devis réseaux sociaux – ${formulaLabel[formula]}`,
          projectType: "Community management",
          message: [
            `Entreprise : ${values.company}`,
            `Formule souhaitée : ${formulaLabel[formula]}`,
            "",
            "Besoin :",
            values.need,
          ].join("\n"),
        }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error || "L'envoi a échoué.")
      }
      setSent(true)
    } catch (err) {
      setServerError(
        (err instanceof Error ? err.message : "Une erreur est survenue.") +
        " Votre demande n'a pas été envoyée : réessayez ou utilisez directement le formulaire de contact du site.",
      )
    } finally {
      setLoading(false)
    }
  }

  const err = (k: Field) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `quote-${k}-err` } : {})

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sp-root max-h-[92dvh] overflow-y-auto border-[var(--sp-gold-line)] sm:max-w-xl">
        {sent ? (
          <div className="flex flex-col items-center py-8 text-center" role="status">
            <span className="sp-icon mb-4 !h-16 !w-16 !rounded-full">
              <CheckCircle className="h-8 w-8" />
            </span>
            <DialogTitle className="font-serif text-2xl font-medium">Demande envoyée</DialogTitle>
            <DialogDescription className="mt-3 max-w-sm">
              Merci ! Votre demande de devis a bien été transmise. Je vous réponds personnellement sous 24h.
            </DialogDescription>
            <button type="button" className="sp-btn sp-btn--ghost mt-6" onClick={() => onOpenChange(false)}>
              Fermer
            </button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl font-medium">Demander un devis gratuit</DialogTitle>
              <DialogDescription>
                Devis gratuit et sans engagement. Les champs marqués d'un * sont obligatoires.
              </DialogDescription>
            </DialogHeader>

            <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sp-field">
                  <label htmlFor="quote-name">Nom *</label>
                  <input id="quote-name" name="name" autoComplete="name" required className="sp-input" {...err("name")} />
                  {errors.name && <p id="quote-name-err" className="sp-error">{errors.name}</p>}
                </div>
                <div className="sp-field">
                  <label htmlFor="quote-company">Entreprise *</label>
                  <input id="quote-company" name="company" autoComplete="organization" required className="sp-input" {...err("company")} />
                  {errors.company && <p id="quote-company-err" className="sp-error">{errors.company}</p>}
                </div>
              </div>

              <div className="sp-field">
                <label htmlFor="quote-email">Adresse e-mail *</label>
                <input id="quote-email" name="email" type="email" autoComplete="email" required className="sp-input" {...err("email")} />
                {errors.email && <p id="quote-email-err" className="sp-error">{errors.email}</p>}
              </div>

              <div className="sp-field">
                <label htmlFor="quote-formula">Formule souhaitée *</label>
                <select
                  id="quote-formula"
                  name="formula"
                  className="sp-input"
                  value={formula}
                  onChange={(e) => onFormulaChange(e.target.value as FormulaChoice)}
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>{formulaLabel[p.id]}</option>
                  ))}
                  <option value="a-definir">{formulaLabel["a-definir"]}</option>
                </select>
              </div>

              <div className="sp-field">
                <label htmlFor="quote-need">Votre besoin *</label>
                <textarea
                  id="quote-need"
                  name="need"
                  rows={4}
                  required
                  placeholder="Votre activité, vos objectifs, vos comptes Instagram/TikTok actuels…"
                  className="sp-input resize-none"
                  {...err("need")}
                />
                {errors.need && <p id="quote-need-err" className="sp-error">{errors.need}</p>}
              </div>

              {serverError && (
                <p role="alert" className="sp-error flex items-start gap-2 rounded-lg border border-[oklch(0.7_0.19_25/0.4)] p-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {serverError}
                </p>
              )}

              <button type="submit" className="sp-btn sp-btn--gold w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours…
                  </>
                ) : (
                  <>
                    Envoyer ma demande <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
