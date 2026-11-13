import Link from "next/link";
import type { SiteData } from "@/lib/data";
import { hoursSummary } from "@/lib/hours";
import { OpenStatus } from "@/components/OpenStatus";
import { PhotoSlot } from "@/components/PhotoSlot";
import { IconBag, IconCalendar, IconClock, IconStar, IconTrain } from "@/components/icons";

// Positions déterministes des braises (aucun calcul aléatoire au rendu)
const EMBERS = [
  { l: 6, d: 0, s: 4, x: 30 }, { l: 14, d: 3.1, s: 3, x: -20 }, { l: 23, d: 5.4, s: 5, x: 40 },
  { l: 31, d: 1.7, s: 3, x: -35 }, { l: 42, d: 6.3, s: 4, x: 25 }, { l: 51, d: 2.4, s: 3, x: -15 },
  { l: 60, d: 4.6, s: 5, x: 30 }, { l: 68, d: 0.9, s: 3, x: -40 }, { l: 77, d: 7.2, s: 4, x: 20 },
  { l: 85, d: 3.8, s: 3, x: -25 }, { l: 93, d: 5.9, s: 4, x: 15 },
];

export function Hero({ data }: { data: SiteData }) {
  const { settings: s, hours, closures, uberEats } = data;
  const summary = hoursSummary(hours);
  const hoursLabel = summary.length === 1 ? `${summary[0].label} · ${summary[0].value}` : "Voir les horaires";

  return (
    <section
      aria-labelledby="hero-title"
      className="grain relative isolate flex min-h-[calc(100svh-4.25rem)] items-center overflow-hidden"
    >
      {/* Lueur de braise */}
      <div
        aria-hidden="true"
        className="animate-flicker pointer-events-none absolute -bottom-40 left-1/2 -z-10 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(228,87,46,0.45),rgba(245,158,27,0.15),transparent)] blur-2xl"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {EMBERS.map((e, i) => (
          <span
            key={i}
            className="animate-rise absolute bottom-0 rounded-full bg-amber-400 shadow-[0_0_8px_2px_rgba(255,140,40,0.7)]"
            style={
              {
                left: `${e.l}%`,
                width: e.s,
                height: e.s,
                animationDelay: `${e.d}s`,
                "--drift": `${e.x}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-[1.25fr_1fr] lg:py-24">
        <div>
          <OpenStatus
            hours={hours}
            closures={closures.map((c) => c.date)}
            fallback={hoursLabel}
          />
          <p className="eyebrow mt-6">100 % halal · Malpassé · Marseille 13e</p>
          <h1
            id="hero-title"
            className="font-display mt-3 text-[clamp(2.75rem,9vw,5.75rem)] leading-[0.95] font-bold uppercase"
          >
            La Grillade de Malpa,
            <span className="block bg-gradient-to-r from-amber-400 via-amber-500 to-ember-500 bg-clip-text text-transparent">
              la grillade halal du 13e
            </span>
          </h1>
          <p className="lead mt-6 max-w-xl">
            Viandes grillées à la commande, sandwichs généreux, assiettes à partager, burgers et tex-mex.
            Sur place, à emporter ou livré chez vous — <strong className="text-cream">tous les jours jusqu&apos;à 1h du matin</strong>.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {uberEats ? (
              <a
                href={uberEats.url}
                target="_blank"
                rel="noopener"
                data-track="Uber Eats"
                className="btn-primary text-lg"
              >
                <IconBag className="size-5" />
                Commander sur Uber Eats
              </a>
            ) : null}
            {s.clickAndCollectEnabled ? (
              <Link href="/commander" className="btn-ember text-lg">
                <IconBag className="size-5" />
                Commander à emporter
              </Link>
            ) : null}
            <Link
              href="/reservation"
              className={s.clickAndCollectEnabled ? "btn-ghost text-lg" : "btn-ember text-lg"}
            >
              <IconCalendar className="size-5" />
              Réserver une table
            </Link>
            <Link href="/carte" className="btn-ghost text-lg">
              Voir la carte
            </Link>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
            <li className="flex items-center gap-2">
              <IconClock className="size-5 shrink-0 text-amber-400" />
              <span>{summary.length === 1 ? `7j/7 · ${summary[0].value}` : "Horaires dans le pied de page"}</span>
            </li>
            <li className="flex items-center gap-2">
              <IconStar className="size-5 shrink-0 text-amber-400" />
              <span>
                {String(s.uberRating).replace(".", ",")}/5 sur Uber Eats
              </span>
            </li>
            <li className="flex items-center gap-2">
              <IconTrain className="size-5 shrink-0 text-amber-400" />
              <span>Métro Malpassé (M1)</span>
            </li>
          </ul>
        </div>

        <div className="hidden lg:block">
          <PhotoSlot
            src={s.heroImage}
            alt="Viandes grillées halal sur le grill de La Grillade de Malpa à Marseille 13013"
            hint="Photo du grill en action ou d'une assiette mixte (format portrait)"
            className="aspect-[4/5] rounded-[2rem] shadow-2xl shadow-ember-700/30"
            sizes="(min-width: 1024px) 40vw, 0px"
            priority
          />
        </div>
      </div>
    </section>
  );
}
