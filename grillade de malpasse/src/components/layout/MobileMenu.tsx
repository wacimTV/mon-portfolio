"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IconClose, IconMenu } from "@/components/icons";

export function MobileMenu({
  nav,
  phoneHref,
  phone,
}: {
  nav: { href: string; label: string }[];
  phoneHref: string;
  phone: string;
}) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        ref={btn}
        type="button"
        className="inline-flex size-12 items-center justify-center rounded-full border border-cream/20 text-cream"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <IconClose className="size-6" /> : <IconMenu className="size-6" />}
      </button>
      <nav
        id="mobile-nav"
        aria-label="Navigation mobile"
        hidden={!open}
        className="fixed inset-x-0 top-[4.25rem] bottom-0 z-40 overflow-y-auto bg-coal-950/98 px-6 pt-6 pb-28"
      >
        <ul className="flex flex-col gap-1">
          {nav.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                onClick={() => setOpen(false)}
                className="font-display block border-b border-coal-700 py-4 text-2xl font-semibold uppercase hover:text-amber-400"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <a href={phoneHref} data-track="Appeler" className="btn-primary mt-8 w-full whitespace-nowrap">
          Appeler le {phone}
        </a>
      </nav>
    </div>
  );
}

