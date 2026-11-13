/**
 * Suivi d'événements sans cookies (Plausible / Umami).
 * Aucun envoi si le script d'analytics n'est pas activé dans .env.
 */
export type AnalyticsEventName =
  | "Appeler"
  | "Uber Eats"
  | "Itinéraire"
  | "Réservation envoyée"
  | "Commande envoyée";

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void;
    umami?: { track: (event: string, data?: Record<string, string | number>) => void };
  }
}

export function trackEvent(name: AnalyticsEventName, props?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.plausible === "function") {
      window.plausible(name, props ? { props } : undefined);
    }
    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(name, props);
    }
  } catch {
    // Silencieux en cas de bloqueur de script
  }
}

