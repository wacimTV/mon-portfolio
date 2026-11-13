"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import { submitReservation, type FormState } from "@/lib/actions/public";
import { trackEvent } from "@/lib/analytics";
import {
  addDays,
  fromMin,
  futureSlots,
  parisNow,
  slotLabel,
  slotsForDate,
  type DayHours,
} from "@/lib/hours";
import { IconCalendar, IconCheck } from "@/components/icons";

const initialState: FormState = { ok: false };

export function ReservationForm({
  hours,
  closures,
  maxGuestsOnline,
  phone,
}: {
  hours: DayHours[];
  closures: string[];
  maxGuestsOnline: number;
  phone: string;
}) {
  const [state, formAction, isPending] = useActionState(submitReservation, initialState);
  const [today, setToday] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    const id = setTimeout(() => {
      const now = parisNow();
      setToday(now.ymd);
      const todaySlots = futureSlots(slotsForDate(hours, closures, now.ymd), now.ymd);
      setSelectedDate((prev) => prev || (todaySlots.length > 0 ? now.ymd : addDays(now.ymd, 1)));
    }, 0);
    return () => clearTimeout(id);
  }, [hours, closures]);

  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    const raw = slotsForDate(hours, closures, selectedDate);
    return futureSlots(raw, selectedDate);
  }, [hours, closures, selectedDate]);

  const maxDate = today ? addDays(today, 90) : undefined;

  useEffect(() => {
    if (state.ok) {
      trackEvent("Réservation envoyée");
    }
  }, [state.ok]);

  if (state.ok && state.message) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="card border-uber/60 bg-coal-900 p-6 sm:p-8"
      >
        <div className="flex items-start gap-4">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-uber/20 text-[#7ef0b4]">
            <IconCheck className="size-6" />
          </span>
          <div>
            <h3 className="font-display text-2xl font-bold uppercase">
              Demande de réservation envoyée
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-cream">{state.message}</p>
            <p className="mt-3 text-xs text-muted">
              Besoin d&apos;une confirmation immédiate ou d&apos;un changement ? Appelez-nous au{" "}
              <strong className="text-amber-400">{phone}</strong>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="card space-y-5 p-6 sm:p-8">
      {state.message && !state.ok ? (
        <div
          role="alert"
          className="rounded-xl border border-ember-500/60 bg-ember-700/20 px-4 py-3 text-sm text-[#ffb59e]"
        >
          {state.message}
        </div>
      ) : null}

      {/* Champ honeypot anti-spam invisible */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="res-website">Ne pas remplir ce champ</label>
        <input id="res-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="res-name" className="label">
            Nom et prénom *
          </label>
          <input
            id="res-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Ex. Karim Benali"
            aria-invalid={Boolean(state.errors?.name)}
            className="input"
          />
          {state.errors?.name ? (
            <p className="text-xs text-ember-500">{state.errors.name}</p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="res-phone" className="label">
            Téléphone *
          </label>
          <input
            id="res-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="Ex. 06 12 34 56 78"
            aria-invalid={Boolean(state.errors?.phone)}
            className="input"
          />
          {state.errors?.phone ? (
            <p className="text-xs text-ember-500">{state.errors.phone}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="res-email" className="label">
            Email (pour la confirmation) *
          </label>
          <input
            id="res-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="vous@exemple.fr"
            aria-invalid={Boolean(state.errors?.email)}
            className="input"
          />
          {state.errors?.email ? (
            <p className="text-xs text-ember-500">{state.errors.email}</p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="res-guests" className="label">
            Nombre de personnes *
          </label>
          <select
            id="res-guests"
            name="guests"
            defaultValue="2"
            aria-invalid={Boolean(state.errors?.guests)}
            className="input"
          >
            {Array.from({ length: maxGuestsOnline }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n} className="bg-coal-900 text-cream">
                {n} {n === 1 ? "personne" : "personnes"}
              </option>
            ))}
          </select>
          {state.errors?.guests ? (
            <p className="text-xs text-ember-500">{state.errors.guests}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="res-date" className="label">
            Date *
          </label>
          <input
            id="res-date"
            name="date"
            type="date"
            required
            min={today || undefined}
            max={maxDate}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            aria-invalid={Boolean(state.errors?.date)}
            className="input"
          />
          {state.errors?.date ? (
            <p className="text-xs text-ember-500">{state.errors.date}</p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="res-time" className="label">
            Créneau horaire (11h00 – 00h30) *
          </label>
          <select
            id="res-time"
            name="time"
            required
            disabled={availableSlots.length === 0}
            aria-invalid={Boolean(state.errors?.time)}
            className="input"
          >
            {availableSlots.length === 0 ? (
              <option value="" className="bg-coal-900 text-cream">
                Aucun créneau disponible à cette date
              </option>
            ) : (
              availableSlots.map((min) => {
                const val = fromMin(min);
                return (
                  <option key={min} value={val} className="bg-coal-900 text-cream">
                    {slotLabel(min)}
                  </option>
                );
              })
            )}
          </select>
          {state.errors?.time ? (
            <p className="text-xs text-ember-500">{state.errors.time}</p>
          ) : null}
        </div>
      </div>

      <div className="field">
        <label htmlFor="res-message" className="label">
          Précisions (anniversaire, poussette, allergies, demande particulière…)
        </label>
        <textarea
          id="res-message"
          name="message"
          rows={3}
          placeholder="Facultatif"
          className="input"
        />
      </div>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-muted">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 size-4 shrink-0 accent-amber-500"
        />
        <span>
          J&apos;accepte que mes informations soient utilisées uniquement pour traiter ma réservation,
          conformément à la{" "}
          <Link href="/confidentialite" className="underline hover:text-amber-400">
            politique de confidentialité
          </Link>
          . *
        </span>
      </label>
      {state.errors?.consent ? (
        <p className="text-xs text-ember-500">{state.errors.consent}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending || availableSlots.length === 0}
        className="btn-primary w-full disabled:opacity-50"
      >
        <IconCalendar className="size-5" />
        {isPending ? "Envoi en cours…" : "Confirmer ma demande de réservation"}
      </button>
    </form>
  );
}
