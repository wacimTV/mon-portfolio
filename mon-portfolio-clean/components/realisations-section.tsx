"use client"

import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"

// ─── Contenu ─────────────────────────────────────────────────────────────────
// Remplacer chaque [À REMPLIR] par les vraies informations.
// Les captures vont dans public/realisations/ (format conseillé : 1200×750, .jpg ou .webp).
// Une carte qui contient encore [À REMPLIR] n'est pas affichée.
type Realisation = {
  client: string
  commerce: string
  image: string
  imageAlt: string
  travail: string
  resultat: string
  lien: string
}

const TODO = "[À REMPLIR]"

const realisations: Realisation[] = [
  {
    client: TODO,
    commerce: TODO,
    image: "/realisations/[À REMPLIR].jpg",
    imageAlt: TODO,
    travail: TODO,
    resultat: TODO,
    lien: TODO,
  },
  {
    client: TODO,
    commerce: TODO,
    image: "/realisations/[À REMPLIR].jpg",
    imageAlt: TODO,
    travail: TODO,
    resultat: TODO,
    lien: TODO,
  },
  {
    client: TODO,
    commerce: TODO,
    image: "/realisations/[À REMPLIR].jpg",
    imageAlt: TODO,
    travail: TODO,
    resultat: TODO,
    lien: TODO,
  },
]

const isComplete = (r: Realisation) => !Object.values(r).some((v) => v.includes(TODO))

// ─── Composant ───────────────────────────────────────────────────────────────
export function RealisationsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const items = realisations.filter(isComplete)

  if (items.length === 0) return null

  return (
    <section id="realisations" ref={ref} aria-labelledby="realisations-title" className="relative bg-secondary/30 px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-accent">
            Réalisations
          </span>
          <h2 id="realisations-title" className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
            Des projets concrets pour des commerces locaux
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((r, i) => (
            <motion.article
              key={r.client}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <Image
                  src={r.image}
                  alt={r.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6">
                <div>
                  <h3 className="font-serif text-2xl font-medium">{r.client}</h3>
                  <p className="text-sm text-accent">{r.commerce}</p>
                </div>

                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-medium">Ce qui a été fait</dt>
                    <dd className="text-muted-foreground">{r.travail}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Résultat</dt>
                    <dd className="text-muted-foreground">{r.resultat}</dd>
                  </div>
                </dl>

                <a
                  href={r.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-accent"
                >
                  Voir le site
                  <span className="sr-only"> de {r.client}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
