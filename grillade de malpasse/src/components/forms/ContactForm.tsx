"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitContact, type FormState } from "@/lib/actions/public";
import { IconCheck, IconMail } from "@/components/icons";

const initialState: FormState = { ok: false };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState);

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
            <h3 className="font-display text-2xl font-bold uppercase">Message envoyé</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream">{state.message}</p>
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

      {/* Honeypot anti-spam */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="cnt-website">Ne pas remplir ce champ</label>
        <input id="cnt-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="cnt-name" className="label">
            Nom *
          </label>
          <input
            id="cnt-name"
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
          <label htmlFor="cnt-phone" className="label">
            Téléphone (facultatif)
          </label>
          <input
            id="cnt-phone"
            name="phone"
            type="tel"
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
        <label htmlFor="cnt-email" className="label">
          Email *
        </label>
        <input
          id="cnt-email"
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
        <label htmlFor="cnt-message" className="label">
          Votre message *
        </label>
        <textarea
          id="cnt-message"
          name="message"
          rows={4}
          required
          placeholder="Question sur la carte, commande de groupe, événement…"
          aria-invalid={Boolean(state.errors?.message)}
          className="input"
        />
        {state.errors?.message ? (
          <p className="text-xs text-ember-500">{state.errors.message}</p>
        ) : null}
      </div>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-muted">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 size-4 shrink-0 accent-amber-500"
        />
        <span>
          J&apos;accepte que mes données soient utilisées pour répondre à ma demande, conformément à la{" "}
          <Link href="/confidentialite" className="underline hover:text-amber-400">
            politique de confidentialité
          </Link>
          . *
        </span>
      </label>
      {state.errors?.consent ? (
        <p className="text-xs text-ember-500">{state.errors.consent}</p>
      ) : null}

      <button type="submit" disabled={isPending} className="btn-primary w-full disabled:opacity-50">
        <IconMail className="size-5" />
        {isPending ? "Envoi en cours…" : "Envoyer le message"}
      </button>
    </form>
  );
}

