"use client";

import Script from "next/script";
import { useEffect } from "react";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";

/**
 * Charge Plausible ou Umami uniquement si configuré dans .env,
 * et écoute par délégation les attributs `data-track="Appeler|Uber Eats|Itinéraire"`.
 */
export function AnalyticsTracker() {
  const plausibleDomain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN?.trim() ?? "";
  const plausibleSrc =
    process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL?.trim() || "https://plausible.io/js/script.js";
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim() ?? "";
  const umamiSrc =
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL?.trim() || "https://cloud.umami.is/script.js";

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.("[data-track]") as HTMLElement | null;
      if (!target) return;
      const ev = target.getAttribute("data-track") as AnalyticsEventName | null;
      if (ev) trackEvent(ev);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return (
    <>
      {plausibleDomain ? (
        <Script defer data-domain={plausibleDomain} src={plausibleSrc} strategy="afterInteractive" />
      ) : null}
      {umamiWebsiteId ? (
        <Script defer data-website-id={umamiWebsiteId} src={umamiSrc} strategy="afterInteractive" />
      ) : null}
    </>
  );
}

