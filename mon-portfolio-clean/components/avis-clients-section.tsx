"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowUpRight, Star } from "lucide-react"

// ─── Contenu ─────────────────────────────────────────────────────────────────
// Uniquement de VRAIS avis, copiés depuis la fiche Google (texte exact, sans retouche).
// Un avis qui contient encore [À REMPLIR] n'est pas affiché.
// Pas de données structurées « Review » ici : Google ignore les avis
// auto-publiés par une entreprise sur son propre site.
type Avis = {
  nom: string
  /** Date affichée telle quelle, ex. « mars 2026 » */
  date: string
  /** Note de 1 à 5 */
  note: number
  texte: string
}

const TODO = "[À REMPLIR]"

/** Lien vers la fiche Google (bouton « Voir tous les avis ») */
const GOOGLE_REVIEWS_URL = TODO

const avis: Avis[] = [
  { nom: TODO, date: TODO, note: 5, texte: TODO },
  { nom: TODO, date: TODO, note: 5, texte: TODO },
  { nom: TODO, date: TODO, note: 5, texte: TODO },
]

const isComplete = (a: Avis) => ![a.nom, a.date, a.texte].some((v) => v.includes(TODO))

function Stars({ note }: { note: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`Note : ${note} sur 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={i < note ? "h-4 w-4 fill-amber-400 text-amber-400" : "h-4 w-4 text-border"}
        />
      ))}
    </div>
  )
}

// ─── Composant ───────────────────────────────────────────────────────────────
export function AvisClientsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const items = avis.filter(isComplete)

  if (items.length === 0 || GOOGLE_REVIEWS_URL.includes(TODO)) return null

  return (
    <section id="avis" ref={ref} aria-labelledby="avis-title" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-accent">
            Avis clients
          </span>
          <h2 id="avis-title" className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
            Ils m&apos;ont fait confiance
          </h2>
        </motion.div>

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((a, i) => (
            <motion.li
              key={`${a.nom}-${a.date}`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
            >
              <Stars note={a.note} />
              <blockquote className="flex-1 text-muted-foreground">« {a.texte} »</blockquote>
              <div className="text-sm">
                <p className="font-medium">{a.nom}</p>
                <p className="text-muted-foreground">Avis Google · {a.date}</p>
              </div>
            </motion.li>
          ))}
        </ul>

        <div className="mt-12 text-center">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-accent"
          >
            Voir tous les avis sur Google
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
