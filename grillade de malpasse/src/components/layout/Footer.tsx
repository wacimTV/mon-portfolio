import Link from "next/link";
import { getSiteData } from "@/lib/data";
import { hoursSummary } from "@/lib/hours";
import { directionsUrl, fullAddress, telHref, whatsappHref } from "@/lib/site";
import {
  IconBag,
  IconFacebook,
  IconFlame,
  IconInstagram,
  IconSnapchat,
  IconTikTok,
  IconWhatsApp,
} from "@/components/icons";

export async function Footer() {
  const { settings, hours, platforms } = await getSiteData();
  const address = fullAddress(settings);
  const socials = [
    { href: settings.tiktok, label: "TikTok", Icon: IconTikTok },
    { href: settings.instagram, label: "Instagram", Icon: IconInstagram },
    { href: settings.facebook, label: "Facebook", Icon: IconFacebook },
    { href: settings.snapchat, label: "Snapchat", Icon: IconSnapchat },
    { href: whatsappHref(settings.whatsapp), label: "WhatsApp", Icon: IconWhatsApp },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-coal-800 bg-coal-900 pt-14 pb-28 md:pb-10">
      <div className="container-x grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <p className="flex items-center gap-2">
            <IconFlame className="size-6 text-amber-500" />
            <span className="font-display text-xl font-bold uppercase">{settings.name}</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Grillade halal et fast-food à Malpassé, Marseille 13e. Sur place, à emporter et en livraison.
          </p>
          {socials.length ? (
            <ul className="mt-5 flex gap-3" aria-label="Réseaux sociaux">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener"
                    aria-label={`${settings.name} sur ${label}`}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-coal-600 text-cream transition hover:border-amber-400 hover:text-amber-400"
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          {settings.googleReviewUrl ? (
            <p className="mt-4">
              <a
                href={settings.googleReviewUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 underline underline-offset-4 hover:text-amber-500"
              >
                ★ Laisser un avis Google
              </a>
            </p>
          ) : null}
        </div>

        <address className="text-sm leading-relaxed not-italic">
          <h2 className="font-display mb-3 text-lg font-semibold uppercase">Nous trouver</h2>
          <p>{settings.street}</p>
          <p>
            {settings.postalCode} {settings.city}
          </p>
          <p className="mt-2">
            <a href={telHref(settings.phone)} data-track="Appeler" className="font-semibold text-amber-400 whitespace-nowrap hover:underline">
              {settings.phone}
            </a>
          </p>
          <p className="mt-2">
            <a
              href={directionsUrl(`${settings.name}, ${address}`)}
              target="_blank"
              rel="noopener"
              data-track="Itinéraire"
              className="underline underline-offset-4 hover:text-amber-400"
            >
              Itinéraire Google Maps
            </a>
          </p>
        </address>

        <div className="text-sm">
          <h2 className="font-display mb-3 text-lg font-semibold uppercase">Horaires</h2>
          <dl className="space-y-1">
            {hoursSummary(hours).map((h) => (
              <div key={h.label} className="flex justify-between gap-4">
                <dt className="text-muted">{h.label}</dt>
                <dd className="font-semibold whitespace-nowrap">{h.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-muted">Viande halal · Sur place · À emporter</p>
        </div>

        <div className="text-sm">
          <h2 className="font-display mb-3 text-lg font-semibold uppercase">Nos quartiers</h2>
          <ul className="space-y-2 text-muted">
            <li>
              <Link href="/livraison-marseille-13" className="hover:text-amber-400">
                Livraison Marseille 13e
              </Link>
            </li>
            <li>
              <Link href="/snack-ouvert-tard-marseille" className="hover:text-amber-400">
                Snack ouvert tard (1h)
              </Link>
            </li>
            <li>
              <Link href="/burger-halal-marseille-13" className="hover:text-amber-400">
                Burger halal Marseille 13
              </Link>
            </li>
            <li>
              <Link href="/restaurant-saint-jerome" className="hover:text-amber-400">
                Restaurant près de Saint-Jérôme
              </Link>
            </li>
            <li>
              <Link href="/restaurant-frais-vallon" className="hover:text-amber-400">
                Restaurant près de Frais-Vallon
              </Link>
            </li>
            <li>
              <Link href="/restaurant-la-rose" className="hover:text-amber-400">
                Restaurant près de La Rose
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <h2 className="font-display mb-3 text-lg font-semibold uppercase">Commander</h2>
          <div className="flex flex-col gap-3">
            {settings.clickAndCollectEnabled ? (
              <Link href="/commander" className="btn-ember">
                <IconBag className="size-5" />
                Commander à emporter
              </Link>
            ) : null}
            {platforms.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener"
                data-track={/uber/i.test(p.name) ? "Uber Eats" : undefined}
                className={/uber/i.test(p.name) ? "btn-primary" : "btn-ghost"}
              >
                <IconBag className="size-5" />
                Commander sur {p.name}
              </a>
            ))}
            <Link href="/reservation" className="btn-ghost">
              Réserver une table
            </Link>
          </div>
        </div>
      </div>

      <div className="container-x mt-12 flex flex-col gap-4 border-t border-coal-800 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {settings.name} · Grillade halal Marseille 13013</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li><Link href="/carte" className="hover:text-cream">La carte</Link></li>
          <li><Link href="/livraison-marseille-13" className="hover:text-cream">Livraison Marseille 13</Link></li>
          <li><Link href="/mentions-legales" className="hover:text-cream">Mentions légales</Link></li>
          <li><Link href="/confidentialite" className="hover:text-cream">Confidentialité</Link></li>
          <li><Link href="/admin" prefetch={false} rel="nofollow" className="text-muted/70 hover:text-cream">Administration</Link></li>
        </ul>
      </div>
    </footer>
  );
}

