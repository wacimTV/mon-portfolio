import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-x flex min-h-[70svh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Erreur 404</p>
      <h1 className="font-display mt-2 text-5xl font-bold uppercase sm:text-6xl">
        Page introuvable
      </h1>
      <p className="lead mt-4 max-w-md">
        Cette page n&apos;existe pas ou a été déplacée. Retournez à l&apos;accueil ou consultez notre carte.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Retour à l&apos;accueil
        </Link>
        <Link href="/carte" className="btn-ghost">
          Voir la carte
        </Link>
      </div>
    </main>
  );
}

