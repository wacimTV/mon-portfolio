"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDown, Instagram, Linkedin, MapPin, Globe } from "lucide-react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ParticleField } from "@/components/particle-field"

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} id="hero" aria-label="Présentation" className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24 pb-28 md:py-24">
      <ParticleField />

      <motion.div className="relative z-10 mx-auto max-w-5xl text-center" style={{ y, opacity }}>
        <motion.div
          initial={{ y: 8 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="mb-4"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            Wacim Ammouche
          </p>
        </motion.div>

        <motion.h1
          className="mb-3 font-serif text-4xl font-medium leading-[1.15] tracking-tight sm:text-5xl md:text-6xl"
          initial={{ y: 8 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
        >
          Développeur web & Community Manager à Marseille
        </motion.h1>

        <motion.p
          className="mb-6 text-gradient font-serif text-xl font-medium sm:text-2xl"
          initial={{ y: 8 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          Création de sites internet et gestion de réseaux sociaux
        </motion.p>

        <motion.p
          className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
          initial={{ y: 8 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Je crée des sites rapides et bien référencés, et je gère l&apos;Instagram et le TikTok des commerces, restaurants et indépendants. Basé à Marseille, je me déplace dans tout le 13 et je travaille aussi à distance, en visio, à l&apos;international. Devis gratuit sous 24h.
        </motion.p>

        <motion.div
          className="mb-10 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <span className="flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            Sur place dans les Bouches-du-Rhône
          </span>
          <span className="flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs sm:text-sm text-muted-foreground">
            <Globe className="h-3.5 w-3.5 text-accent" />
            À distance à l&apos;international
          </span>
        </motion.div>

        <motion.div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button size="lg" className="px-8" asChild>
            <a href="#contact">Demander un devis gratuit</a>
          </Button>
          <Button size="lg" variant="outline" className="px-8 bg-transparent" asChild>
            <a href="/community-management" id="hero-community-management">
              Voir mes formules Community Management
            </a>
          </Button>
        </motion.div>

        <motion.div
          className="mt-16 flex items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {[
            { icon: Linkedin, href: "https://www.linkedin.com/in/wacim-ammouche-4a20031b1/", label: "LinkedIn" },
            { icon: Instagram, href: "https://www.instagram.com/wacim.digital/?hl=fr", label: "Instagram" },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label={label}
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          repeatDelay: 1,
        }}
      >
        <ArrowDown className="h-5 w-5 text-muted-foreground" />
      </motion.div>
    </section>
  )
}
