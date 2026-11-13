import Link from "next/link";
import { getSiteData } from "@/lib/data";
import { directionsUrl, fullAddress, telHref } from "@/lib/site";
import { IconBag, IconPhone, IconRoute } from "@/components/icons";

/** Barre d'actions fixe en bas de l'écran (mobile uniquement — 3 boutons maximum). */
export async function MobileBar() {
  const { settings, uberEats } = await getSiteData();
  const item = "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-xs font-semibold whitespace-nowrap";
  return (
    <nav
      aria-label="Actions rapides"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-coal-700 bg-coal-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <div className="flex">
        {settings.clickAndCollectEnabled ? (
          <Link href="/commander" className={`${item} text-cream`}>
            <IconBag className="size-5 text-amber-400" />
            À emporter
          </Link>
        ) : (
          <a href={telHref(settings.phone)} data-track="Appeler" className={`${item} text-cream`}>
            <IconPhone className="size-5 text-amber-400" />
            Appeler
          </a>
        )}
        {uberEats ? (
          <a
            href={uberEats.url}
            target="_blank"
            rel="noopener"
            data-track="Uber Eats"
            className={`${item} bg-amber-500 text-coal-950`}
          >
            <IconBag className="size-5" />
            Uber Eats
          </a>
        ) : null}
        <a
          href={directionsUrl(`${settings.name}, ${fullAddress(settings)}`)}
          target="_blank"
          rel="noopener"
          data-track="Itinéraire"
          className={`${item} text-cream`}
        >
          <IconRoute className="size-5 text-amber-400" />
          Itinéraire
        </a>
      </div>
    </nav>
  );
}

