import Link from "next/link";
import { getSiteData } from "@/lib/data";
import { NAV, telHref } from "@/lib/site";
import { IconBag, IconFlame, IconPhone } from "@/components/icons";
import { MobileMenu } from "@/components/layout/MobileMenu";

export async function Header() {
  const { settings, uberEats } = await getSiteData();
  const navItems = settings.clickAndCollectEnabled
    ? [{ href: "/commander", label: "Click & Collect" }, ...NAV]
    : NAV;
  return (
    <>
      {settings.announcement ? (
        <div className="bg-ember-600 px-4 py-2 text-center text-sm font-semibold text-white">
          {settings.announcement}
        </div>
      ) : null}
      <header className="sticky top-0 z-50 border-b border-coal-800/80 bg-coal-950/85 backdrop-blur-md supports-[backdrop-filter]:bg-coal-950/70">
        <div className="container-x flex h-[4.25rem] items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap" aria-label="La Grillade de Malpa — accueil">
            <IconFlame className="size-7 shrink-0 text-amber-500" />
            <span className="font-display text-xl leading-none font-bold uppercase">
              La Grillade <span className="text-amber-400">de Malpa</span>
            </span>
          </Link>
          <nav aria-label="Navigation principale" className="hidden xl:block">
            <ul className="flex items-center gap-5 text-[0.92rem] font-medium">
              {NAV.map((n) => (
                <li key={n.href} className=" shrink-0">
                  <Link href={n.href} className="whitespace-nowrap text-cream/90 transition hover:text-amber-400">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden shrink-0 items-center gap-2.5 md:flex">
            <a
              href={telHref(settings.phone)}
              data-track="Appeler"
              aria-label={`Appeler le ${settings.phone}`}
              className="btn-ghost min-h-10 shrink-0 px-3.5 py-2 text-sm whitespace-nowrap"
            >
              <IconPhone className="size-4 shrink-0" />
              <span className="hidden 2xl:inline">{settings.phone}</span>
              <span className="2xl:hidden">{settings.phone}</span>
            </a>
            {settings.clickAndCollectEnabled ? (
              <Link
                href="/commander"
                className="btn-ember min-h-10 shrink-0 px-4 py-2 text-sm whitespace-nowrap"
              >
                <IconBag className="size-4 shrink-0" />
                À emporter
              </Link>
            ) : uberEats ? (
              <a
                href={uberEats.url}
                target="_blank"
                rel="noopener"
                data-track="Uber Eats"
                className="btn-primary min-h-10 shrink-0 px-4 py-2 text-sm whitespace-nowrap"
              >
                <IconBag className="size-4 shrink-0" />
                Commander
              </a>
            ) : null}
          </div>
          <MobileMenu nav={navItems} phone={settings.phone} phoneHref={telHref(settings.phone)} />
        </div>
      </header>
    </>
  );
}

