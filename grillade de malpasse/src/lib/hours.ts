/**
 * Utilitaires d'horaires — utilisables côté serveur ET côté client.
 * Tous les calculs se font dans le fuseau Europe/Paris et gèrent
 * les fermetures après minuit (ex. 11:00 → 01:00).
 */

export type DayHours = {
  dayOfWeek: number; // 0 = dimanche
  openTime: string; // "HH:MM"
  closeTime: string; // "HH:MM" (si <= openTime → lendemain)
  closed: boolean;
};

export const DAY_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
export const SCHEMA_DAYS = [
  "https://schema.org/Sunday",
  "https://schema.org/Monday",
  "https://schema.org/Tuesday",
  "https://schema.org/Wednesday",
  "https://schema.org/Thursday",
  "https://schema.org/Friday",
  "https://schema.org/Saturday",
];

export const SLOT_INTERVAL = 30; // minutes
export const LAST_SLOT_BEFORE_CLOSE = 30; // dernier créneau 30 min avant la fermeture
export const MIN_LEAD_MINUTES = 30; // délai minimum avant une réservation le jour même
export const PICKUP_INTERVAL = 15; // créneaux de 15 min pour le click & collect
export const PICKUP_LEAD_MINUTES = 20; // au moins 20 min après l'heure actuelle
export const LAST_PICKUP_BEFORE_CLOSE = 15; // dernier retrait 15 min avant fermeture

export function toMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function fromMin(min: number): string {
  const m = ((min % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** "01:00" → "01h00", "11:00" → "11h" */
export function formatTime(t: string, short = false): string {
  const [h, m] = t.split(":");
  if (short && m === "00") return `${h}h`;
  return `${h}h${m}`;
}

/** Fin de service en minutes depuis minuit du jour de service (peut dépasser 1440). */
export function closeMinutes(day: DayHours): number {
  const o = toMin(day.openTime);
  const c = toMin(day.closeTime);
  return c <= o ? c + 1440 : c;
}

/** Date et heure actuelles à Paris. */
export function parisNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  const ymd = `${get("year")}-${get("month")}-${get("day")}`;
  return { ymd, minutes: Number(get("hour")) * 60 + Number(get("minute")), dow: dowOf(ymd) };
}

export function dowOf(ymd: string): number {
  return new Date(`${ymd}T12:00:00Z`).getUTCDay();
}

export function addDays(ymd: string, n: number): string {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function dayFor(hours: DayHours[], ymd: string): DayHours | undefined {
  return hours.find((h) => h.dayOfWeek === dowOf(ymd));
}

function isServiceDay(hours: DayHours[], closures: string[], ymd: string): DayHours | null {
  const d = dayFor(hours, ymd);
  if (!d || d.closed || closures.includes(ymd)) return null;
  return d;
}

export type OpenStatus = { open: boolean; label: string; closedToday?: boolean };

/** Calcule « Ouvert maintenant / Fermé » en gérant le passage de minuit. */
export function getOpenStatus(hours: DayHours[], closures: string[], date = new Date()): OpenStatus {
  const now = parisNow(date);

  // 1) Service de la veille qui déborde après minuit
  const yesterday = addDays(now.ymd, -1);
  const y = isServiceDay(hours, closures, yesterday);
  if (y && closeMinutes(y) > 1440 && now.minutes < closeMinutes(y) - 1440) {
    return { open: true, label: `Ouvert · jusqu'à ${formatTime(y.closeTime)}` };
  }

  // 2) Service du jour
  const t = isServiceDay(hours, closures, now.ymd);
  if (t) {
    const o = toMin(t.openTime);
    const c = closeMinutes(t);
    if (now.minutes >= o && now.minutes < c) {
      return { open: true, label: `Ouvert · jusqu'à ${formatTime(t.closeTime)}` };
    }
    if (now.minutes < o) {
      return { open: false, label: `Fermé · ouvre à ${formatTime(t.openTime)}` };
    }
  }

  // 3) Prochaine ouverture
  for (let i = 1; i <= 14; i++) {
    const ymd = addDays(now.ymd, i);
    const d = isServiceDay(hours, closures, ymd);
    if (d) {
      const when = i === 1 ? "demain" : DAY_NAMES[dowOf(ymd)].toLowerCase();
      return {
        open: false,
        label: `Fermé · ouvre ${when} à ${formatTime(d.openTime)}`,
        closedToday: !t,
      };
    }
  }
  return { open: false, label: "Fermé", closedToday: true };
}

/**
 * Créneaux de réservation d'une date de service.
 * Retourne des minutes depuis minuit du jour de service (ex. 00:30 du lendemain = 1470).
 */
export function slotsForDate(hours: DayHours[], closures: string[], ymd: string): number[] {
  const d = isServiceDay(hours, closures, ymd);
  if (!d) return [];
  const start = toMin(d.openTime);
  const last = closeMinutes(d) - LAST_SLOT_BEFORE_CLOSE;
  const slots: number[] = [];
  for (let m = start; m <= last; m += SLOT_INTERVAL) slots.push(m);
  return slots;
}

/** Filtre les créneaux déjà passés si la date est aujourd'hui. */
export function futureSlots(slots: number[], ymd: string, date = new Date()): number[] {
  const now = parisNow(date);
  if (ymd < now.ymd) return [];
  if (ymd > now.ymd) return slots;
  return slots.filter((m) => m >= now.minutes + MIN_LEAD_MINUTES);
}

/**
 * Créneaux de retrait Click & Collect (toutes les 15 min, au moins 20 min après l'heure actuelle).
 * Gère aussi le service de la veille qui déborde après minuit (entre 00h00 et 01h00).
 */
export function pickupSlotsForToday(
  hours: DayHours[],
  closures: string[],
  date = new Date(),
): { serviceDate: string; min: number; time: string; label: string }[] {
  const now = parisNow(date);
  const results: { serviceDate: string; min: number; time: string; label: string }[] = [];

  // 1) Si on est après minuit et que le service de la veille est encore ouvert
  const yesterday = addDays(now.ymd, -1);
  const yDay = isServiceDay(hours, closures, yesterday);
  if (yDay && closeMinutes(yDay) > 1440) {
    const lastAfterMidnight = closeMinutes(yDay) - 1440 - LAST_PICKUP_BEFORE_CLOSE;
    for (let m = 0; m <= lastAfterMidnight; m += PICKUP_INTERVAL) {
      if (m >= now.minutes + PICKUP_LEAD_MINUTES) {
        const t = fromMin(m);
        results.push({
          serviceDate: yesterday,
          min: m + 1440,
          time: t,
          label: `Cette nuit · ${formatTime(t)}`,
        });
      }
    }
  }

  // 2) Service du jour
  const tDay = isServiceDay(hours, closures, now.ymd);
  if (tDay) {
    const start = toMin(tDay.openTime);
    const last = closeMinutes(tDay.closeTime <= tDay.openTime ? tDay : { ...tDay }) - LAST_PICKUP_BEFORE_CLOSE;
    for (let m = start; m <= last; m += PICKUP_INTERVAL) {
      if (m >= now.minutes + PICKUP_LEAD_MINUTES) {
        const t = fromMin(m);
        results.push({
          serviceDate: now.ymd,
          min: m,
          time: t,
          label: m >= 1440 ? `${formatTime(t)} (dans la nuit)` : `Aujourd'hui · ${formatTime(t)}`,
        });
      }
    }
  }

  // 3) Si aucun créneau aujourd'hui (ex. fermé ou fin de service), proposer demain
  if (results.length === 0) {
    const tomorrow = addDays(now.ymd, 1);
    const tmDay = isServiceDay(hours, closures, tomorrow);
    if (tmDay) {
      const start = toMin(tmDay.openTime);
      const last = closeMinutes(tmDay) - LAST_PICKUP_BEFORE_CLOSE;
      for (let m = start; m <= last; m += PICKUP_INTERVAL) {
        const t = fromMin(m);
        results.push({
          serviceDate: tomorrow,
          min: m,
          time: t,
          label: `Demain · ${formatTime(t)}`,
        });
      }
    }
  }

  return results;
}

export function slotLabel(min: number): string {
  const t = formatTime(fromMin(min));
  return min >= 1440 ? `${t} (dans la nuit)` : t;
}

export function formatDateFr(ymd: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${ymd}T12:00:00Z`));
}

/** Regroupe les jours ayant les mêmes horaires : « Tous les jours : 11h – 01h » */
export function hoursSummary(hours: DayHours[]): { label: string; value: string }[] {
  const ordered = [1, 2, 3, 4, 5, 6, 0].map((d) => hours.find((h) => h.dayOfWeek === d)).filter(Boolean) as DayHours[];
  const val = (h: DayHours) => (h.closed ? "Fermé" : `${formatTime(h.openTime)} – ${formatTime(h.closeTime)}`);
  if (ordered.length === 7 && ordered.every((h) => val(h) === val(ordered[0]))) {
    return [{ label: "Tous les jours", value: val(ordered[0]) }];
  }
  return ordered.map((h) => ({ label: DAY_NAMES[h.dayOfWeek], value: val(h) }));
}

