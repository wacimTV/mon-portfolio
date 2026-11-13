import type { SiteData } from "@/lib/data";
import { formatDateFr } from "@/lib/hours";
import { telHref } from "@/lib/site";
import { ReservationForm } from "@/components/forms/ReservationForm";
import { IconClock, IconPhone, IconUsers } from "@/components/icons";

export function ReservationSection({
  data,
  headingLevel = 2,
}: {
  data: SiteData;
  headingLevel?: 1 | 2;
}) {
  const { settings: s, hours, closures } = data;
  const H = headingLevel === 1 ? "h1" : "h2";

  return (
    <section
      id="reservation"
      aria-labelledby="reservation-title"
      className="bg-coal-900 py-20 sm:py-28"
    >
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-start">
        <div className="reveal">
          <p className="eyebrow">Réservation</p>
          <H id="reservation-title" className="h2 mt-2">
            Réserver une table à La Grillade de Malpa
          </H>
          <p className="lead mt-4">
            En famille, entre amis ou pour un anniversaire dans le 13e : réservez votre table en
            quelques secondes. Créneaux disponibles de 11h00 à 00h30.
          </p>

          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <IconClock className="mt-0.5 size-5 shrink-0 text-amber-400" />
              <div>
                <p className="font-semibold text-cream">Service continu de 11h00 à 01h00</p>
                <p className="text-muted">Dernier créneau réservable à 00h30 (30 min avant la fermeture).</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <IconUsers className="mt-0.5 size-5 shrink-0 text-amber-400" />
              <div>
                <p className="font-semibold text-cream">Groupes &amp; événements</p>
                <p className="text-muted">
                  Réservation en ligne jusqu&apos;à {s.maxGuestsOnline} personnes. Au-delà, appelez-nous directement.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <IconPhone className="mt-0.5 size-5 shrink-0 text-amber-400" />
              <div>
                <p className="font-semibold text-cream">Réservation par téléphone</p>
                <p className="text-muted">
                  Pour ce soir dans moins de 30 minutes :{" "}
                  <a href={telHref(s.phone)} className="font-semibold text-amber-400 hover:underline">
                    {s.phone}
                  </a>
                </p>
              </div>
            </li>
          </ul>

          {closures.length > 0 ? (
            <div className="mt-6 rounded-xl border border-amber-500/40 bg-coal-850 p-4 text-xs text-muted">
              <p className="font-semibold text-amber-400 uppercase">Fermetures exceptionnelles</p>
              <ul className="mt-1 space-y-1">
                {closures.slice(0, 5).map((c) => (
                  <li key={c.date}>
                    {formatDateFr(c.date)}
                    {c.reason ? ` — ${c.reason}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="reveal">
          <ReservationForm
            hours={hours}
            closures={closures.map((c) => c.date)}
            maxGuestsOnline={s.maxGuestsOnline}
            phone={s.phone}
          />
        </div>
      </div>
    </section>
  );
}

