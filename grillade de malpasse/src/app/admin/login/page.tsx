"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAdmin, type LoginState } from "@/lib/actions/admin";
import { IconFlame } from "@/components/icons";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);

  return (
    <main className="container-x flex min-h-svh items-center justify-center py-12">
      <div className="card w-full max-w-md p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <IconFlame className="size-6 text-amber-500" />
          <span className="font-display text-lg font-bold uppercase">
            La Grillade de Malpa
          </span>
        </div>

        <h1 className="font-display mt-4 text-3xl font-bold uppercase">
          Espace administrateur
        </h1>
        <p className="mt-1 text-xs text-muted">
          Accès réservé au responsable du restaurant.
        </p>

        {state.error ? (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-ember-500/60 bg-ember-700/20 px-4 py-3 text-xs text-[#ffb59e]"
          >
            {state.error}
          </div>
        ) : null}

        <form action={formAction} className="mt-6 space-y-4">
          <div className="field">
            <label htmlFor="admin-email" className="label">
              Email administrateur
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="input"
            />
          </div>

          <div className="field">
            <label htmlFor="admin-password" className="label">
              Mot de passe
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="input"
            />
          </div>

          <button type="submit" disabled={isPending} className="btn-primary w-full disabled:opacity-50">
            {isPending ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          <Link href="/" className="hover:text-amber-400">
            ← Retour au site public
          </Link>
        </p>
      </div>
    </main>
  );
}

