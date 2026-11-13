"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import { submitOrder, type OrderFormState } from "@/lib/actions/public";
import type { SiteData } from "@/lib/data";
import { pickupSlotsForToday, type DayHours } from "@/lib/hours";
import { formatPrice } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { IconBag, IconCheck } from "@/components/icons";

const initialState: OrderFormState = { ok: false };

export function ClickAndCollectBuilder({
  categories,
  hours,
  closures,
  phone,
  address,
}: {
  categories: SiteData["categories"];
  hours: DayHours[];
  closures: string[];
  phone: string;
  address: string;
}) {
  const [state, formAction, isPending] = useActionState(submitOrder, initialState);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [slots, setSlots] = useState<
    { serviceDate: string; min: number; time: string; label: string }[]
  >([]);

  useEffect(() => {
    const update = () => setSlots(pickupSlotsForToday(hours, closures));
    const t = setTimeout(update, 0);
    const id = setInterval(update, 60_000);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, [hours, closures]);

  useEffect(() => {
    if (state.ok) {
      trackEvent("Commande envoyée");
    }
  }, [state.ok]);

  const activeCategories = useMemo(
    () => categories.filter((c) => c.items.length > 0),
    [categories],
  );

  const allItems = useMemo(
    () => new Map(categories.flatMap((c) => c.items).map((i) => [i.id, i])),
    [categories],
  );

  const cartLines = useMemo(() => {
    const list: { id: number; name: string; unitPriceCents: number; quantity: number }[] = [];
    for (const [idStr, qty] of Object.entries(cart)) {
      if (qty <= 0) continue;
      const item = allItems.get(Number(idStr));
      if (item) {
        list.push({
          id: item.id,
          name: item.name,
          unitPriceCents: item.priceCents,
          quantity: qty,
        });
      }
    }
    return list;
  }, [cart, allItems]);

  const totalCents = useMemo(
    () => cartLines.reduce((acc, l) => acc + l.unitPriceCents * l.quantity, 0),
    [cartLines],
  );

  const itemsJson = useMemo(
    () =>
      JSON.stringify(
        cartLines.map((l) => ({ menuItemId: l.id, quantity: l.quantity })),
      ),
    [cartLines],
  );

  const setQty = (id: number, delta: number) => {
    setCart((prev) => {
      const next = Math.max(0, Math.min(30, (prev[id] ?? 0) + delta));
      const copy = { ...prev };
      if (next === 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  };

  if (state.ok && state.message) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="card mx-auto max-w-2xl border-uber/60 bg-coal-900 p-6 sm:p-10"
      >
        <div className="flex items-start gap-4">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-uber/20 text-[#7ef0b4]">
            <IconCheck className="size-6" />
          </span>
          <div>
            <p className="eyebrow">Commande #{state.orderId}</p>
            <h2 className="font-display mt-1 text-3xl font-bold uppercase">
              Commande à emporter envoyée !
            </h2>
            <p className="mt-3 text-base leading-relaxed text-cream">{state.message}</p>
            <p className="mt-4 text-sm text-muted">
              📍 Retrait au comptoir : <strong className="text-cream">{address}</strong> · Paiement sur place.
              <br />
              📞 Une question ou un retard ? Appelez le{" "}
              <strong className="text-amber-400">{phone}</strong>.
            </p>
            <div className="mt-6">
              <Link href="/" className="btn-ghost text-sm">
                ← Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-start">
      {/* Sélection des plats */}
      <div className="space-y-10">
        {activeCategories.map((cat) => (
          <section key={cat.id} aria-labelledby={`cc-cat-${cat.slug}`}>
            <h2
              id={`cc-cat-${cat.slug}`}
              className="font-display border-b border-coal-800 pb-3 text-2xl font-bold uppercase sm:text-3xl"
            >
              {cat.name}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {cat.items.map((item) => {
                const qty = cart[item.id] ?? 0;
                return (
                  <div
                    key={item.id}
                    className={`card flex flex-col justify-between p-4 transition ${
                      qty > 0 ? "border-amber-500/70 bg-coal-850" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-lg font-semibold uppercase">
                          {item.name}
                        </h3>
                        <span className="font-display shrink-0 text-lg font-bold text-amber-400">
                          {formatPrice(item.priceCents)}
                        </span>
                      </div>
                      {item.description ? (
                        <p className="mt-1 text-xs leading-relaxed text-muted">
                          {item.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                      {qty > 0 ? (
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/50 bg-coal-900 px-2 py-1">
                          <button
                            type="button"
                            onClick={() => setQty(item.id, -1)}
                            aria-label={`Retirer un ${item.name}`}
                            className="inline-flex size-8 items-center justify-center rounded-full bg-coal-800 text-base font-bold text-cream hover:bg-coal-700"
                          >
                            −
                          </button>
                          <span className="min-w-6 text-center text-sm font-bold">{qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(item.id, 1)}
                            aria-label={`Ajouter un ${item.name}`}
                            className="inline-flex size-8 items-center justify-center rounded-full bg-amber-500 text-base font-bold text-coal-950 hover:bg-amber-400"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setQty(item.id, 1)}
                          className="btn-ghost min-h-9 px-4 py-1.5 text-xs"
                        >
                          + Ajouter
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Panier et formulaire de retrait */}
      <form
        action={formAction}
        noValidate
        className="card sticky top-24 space-y-5 p-6 sm:p-7"
      >
        <div className="flex items-center justify-between border-b border-coal-800 pb-4">
          <h2 className="font-display text-2xl font-bold uppercase">
            Votre commande à emporter
          </h2>
          <span className="rounded-full bg-coal-800 px-3 py-1 text-xs font-semibold text-amber-400">
            Paiement sur place
          </span>
        </div>

        {state.message && !state.ok ? (
          <div
            role="alert"
            className="rounded-xl border border-ember-500/60 bg-ember-700/20 px-4 py-3 text-xs text-[#ffb59e]"
          >
            {state.message}
          </div>
        ) : null}

        <input type="hidden" name="itemsJson" value={itemsJson} />

        {/* Honeypot */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="ord-website">Ne pas remplir</label>
          <input id="ord-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {cartLines.length === 0 ? (
          <p className="rounded-xl border border-dashed border-coal-700 p-4 text-center text-sm text-muted">
            Sélectionnez vos plats dans la carte pour composer votre commande.
          </p>
        ) : (
          <div className="space-y-2 border-b border-coal-800 pb-4">
            <ul className="space-y-2 text-sm">
              {cartLines.map((line) => (
                <li key={line.id} className="flex items-center justify-between gap-2">
                  <span>
                    <strong className="text-amber-400">{line.quantity}×</strong> {line.name}
                  </span>
                  <span className="font-semibold">
                    {formatPrice(line.unitPriceCents * line.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between pt-2 font-display text-xl font-bold uppercase">
              <span>Total à régler au comptoir</span>
              <span className="text-amber-400">{formatPrice(totalCents)}</span>
            </div>
          </div>
        )}

        <div className="field">
          <label htmlFor="ord-slot" className="label">
            Heure de retrait souhaitée (créneaux de 15 min) *
          </label>
          <select
            id="ord-slot"
            name="slot"
            required
            disabled={slots.length === 0}
            aria-invalid={Boolean(state.errors?.slot)}
            className="input"
          >
            {slots.length === 0 ? (
              <option value="" className="bg-coal-900">
                Aucun créneau disponible actuellement
              </option>
            ) : (
              slots.map((s) => (
                <option
                  key={`${s.serviceDate}|${s.time}`}
                  value={`${s.serviceDate}|${s.time}`}
                  className="bg-coal-900 text-cream"
                >
                  {s.label}
                </option>
              ))
            )}
          </select>
          {state.errors?.slot ? (
            <p className="text-xs text-ember-500">{state.errors.slot}</p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="field">
            <label htmlFor="ord-name" className="label">
              Nom et prénom *
            </label>
            <input
              id="ord-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Votre nom"
              aria-invalid={Boolean(state.errors?.name)}
              className="input"
            />
            {state.errors?.name ? (
              <p className="text-xs text-ember-500">{state.errors.name}</p>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="ord-phone" className="label">
              Téléphone *
            </label>
            <input
              id="ord-phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="06 12 34 56 78"
              aria-invalid={Boolean(state.errors?.phone)}
              className="input"
            />
            {state.errors?.phone ? (
              <p className="text-xs text-ember-500">{state.errors.phone}</p>
            ) : null}
          </div>
        </div>

        <div className="field">
          <label htmlFor="ord-email" className="label">
            Email (optionnel, pour recevoir le récapitulatif)
          </label>
          <input
            id="ord-email"
            name="email"
            type="email"
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
          <label htmlFor="ord-note" className="label">
            Précisions (choix des viandes, sauces, cuisson…)
          </label>
          <textarea
            id="ord-note"
            name="note"
            rows={2}
            placeholder="Ex. Sandwich 1 viande : kefta, sauce algérienne…"
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
            J&apos;accepte que mes coordonnées soient utilisées pour préparer ma commande à emporter,
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
          disabled={isPending || cartLines.length === 0 || slots.length === 0}
          className="btn-primary w-full disabled:opacity-50"
        >
          <IconBag className="size-5" />
          {isPending
            ? "Envoi de la commande…"
            : `Valider ma commande (${formatPrice(totalCents)})`}
        </button>
      </form>
    </div>
  );
}

