"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, type DayHours, type OpenStatus as Status } from "@/lib/hours";

/**
 * Badge « Ouvert maintenant / Fermé », calculé dans le navigateur
 * (heure de Paris) et rafraîchi chaque minute.
 */
export function OpenStatus({
  hours,
  closures,
  fallback,
  className = "",
}: {
  hours: DayHours[];
  closures: string[];
  fallback: string;
  className?: string;
}) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus(hours, closures));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [hours, closures]);

  const open = status?.open;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold backdrop-blur ${
        status === null
          ? "border-cream/20 bg-coal-900/70 text-cream"
          : open
            ? "border-uber/50 bg-uber/15 text-[#7ef0b4]"
            : "border-ember-500/50 bg-ember-700/25 text-[#ffb59e]"
      } ${className}`}
      aria-live="polite"
    >
      <span className="relative flex size-2.5" aria-hidden="true">
        {open ? <span className="absolute inline-flex size-full animate-ping rounded-full bg-uber opacity-60" /> : null}
        <span
          className={`relative inline-flex size-2.5 rounded-full ${
            status === null ? "bg-amber-400" : open ? "bg-uber" : "bg-ember-500"
          }`}
        />
      </span>
      {status ? status.label : fallback}
    </span>
  );
}

