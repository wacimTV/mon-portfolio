import type { SiteData } from "@/lib/data";
import { hoursSummary } from "@/lib/hours";
import { directionsUrl, fullAddress, telHref, whatsappHref } from "@/lib/site";
import { ContactForm } from "@/components/forms/ContactForm";
import {
  IconCar,
  IconClock,
  IconMap,
  IconPhone,
  IconRoute,
  IconTikTok,
  IconTrain,
  IconWhatsApp,
} from "@/components/icons";

export function ContactSection({
  data,
  headingLevel = 2,
}: {
  data: SiteData;
  headingLevel?: 1 | 2;
}) {
  const { settings: s, hours } = data;
  const address = fullAddress(s);
  const H = headingLevel === 1 ? "h1" : "h2";
  const wa = whatsappHref(s.whatsapp);
  const mapQuery = encodeURIComponent(`${s.name}, ${address}`);

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-20 sm:py-28">
      <div className="container-x">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">Contact &amp; accès</p>
          <H id="contact-title" className="h2 mt-2">
            Venir ou nous écrire à Malpassé
          </H>
          <p className="lead mt-4">
            Situé au {address}, à deux pas du métro Malpassé (ligne M1). Appelez-nous, lancez
            l&apos;itinéraire ou envoyez-nous un message.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.15fr]">
          <div className="space-y-6">
            <div className="card reveal space-y-5 p-6">
              <div className="flex items-start gap-3">
                <IconMap className="mt-0.5 size-5 shrink-0 text-amber-400" />
                <div>
                  <h3 className="font-display text-lg font-semibold uppercase">Adresse</h3>
                  <p className="text-sm text-muted">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <IconPhone className="mt-0.5 size-5 shrink-0 text-amber-400" />
                <div>
                  <h3 className="font-display text-lg font-semibold uppercase">Téléphone</h3>
                  <a
                    href={telHref(s.phone)}
                    className="text-base font-bold text-amber-400 hover:underline"
                  >
                    {s.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <IconClock className="mt-0.5 size-5 shrink-0 text-amber-400" />
                <div>
                  <h3 className="font-display text-lg font-semibold uppercase">Horaires d&apos;ouverture</h3>
                  <dl className="mt-1 space-y-1 text-sm">
                    {hoursSummary(hours).map((h) => (
                      <div key={h.label} className="flex gap-3">
                        <dt className="text-muted">{h.label} :</dt>
                        <dd className="font-semibold text-cream">{h.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <IconTrain className="mt-0.5 size-5 shrink-0 text-amber-400" />
                <div>
                  <h3 className="font-display text-lg font-semibold uppercase">Accès transports</h3>
                  <p className="text-sm text-muted">
                    Métro M1 – station <strong className="text-cream">Malpassé</strong>
                    {s.transportInfo ? ` · ${s.transportInfo}` : ""}.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <IconCar className="mt-0.5 size-5 shrink-0 text-amber-400" />
                <div>
                  <h3 className="font-display text-lg font-semibold uppercase">Stationnement</h3>
                  <p className="text-sm text-muted">{s.parkingInfo}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a href={telHref(s.phone)} className="btn-primary min-h-10 px-4 py-2 text-sm">
                  <IconPhone className="size-4" />
                  Appeler
                </a>
                <a
                  href={directionsUrl(`${s.name}, ${address}`)}
                  target="_blank"
                  rel="noopener"
                  className="btn-ghost min-h-10 px-4 py-2 text-sm"
                >
                  <IconRoute className="size-4" />
                  Itinéraire Google Maps
                </a>
                {wa ? (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener"
                    className="btn-ghost min-h-10 px-4 py-2 text-sm"
                  >
                    <IconWhatsApp className="size-4" />
                    WhatsApp
                  </a>
                ) : null}
                {s.tiktok ? (
                  <a
                    href={s.tiktok}
                    target="_blank"
                    rel="noopener"
                    className="btn-ghost min-h-10 px-4 py-2 text-sm"
                  >
                    <IconTikTok className="size-4" />
                    TikTok
                  </a>
                ) : null}
              </div>
            </div>

            <div className="card reveal overflow-hidden">
              <iframe
                title={`Carte Google Maps — ${s.name}, ${address}`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-72 w-full border-0"
              />
            </div>
          </div>

          <div className="reveal">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

