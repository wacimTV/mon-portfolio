import { Suspense } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SITE_URL, fullAddress } from "@/lib/site";
import { generateQrMatrix } from "@/lib/qr";
import { PrintButton } from "@/app/admin/qr-avis/PrintButton";
import { IconFlame } from "@/components/icons";

async function QrAvisContent() {
  await requireAdmin();
  const settings = await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  const targetUrl = settings.googleReviewUrl.trim() || SITE_URL;
  const matrix = generateQrMatrix(targetUrl);
  const quietZone = 4;
  const viewSize = matrix.length + quietZone * 2;

  return (
    <div className="min-h-svh bg-coal-950 py-10 text-cream print:bg-white print:py-0 print:text-black">
      <div className="container-x mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <Link href="/admin" className="text-xs text-amber-400 hover:underline">
            ← Retour au tableau de bord
          </Link>
          <h1 className="font-display mt-1 text-3xl font-bold uppercase">
            QR Code Avis Google (format A5 comptoir)
          </h1>
          {!settings.googleReviewUrl.trim() ? (
            <p className="mt-1 text-xs text-ember-500">
              ⚠️ Aucun « Lien Laisser un avis Google » n&apos;est encore renseigné dans les réglages : le QR
              code pointe provisoirement vers {SITE_URL}. Renseignez votre lien Google dans l&apos;admin
              pour pointer directement vers vos avis.
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted">
              Cible du QR code : <span className="text-cream">{targetUrl}</span>
            </p>
          )}
        </div>
        <PrintButton />
      </div>

      {/* Feuille A5 prête à poser sur le comptoir */}
      <article className="mx-auto flex w-full max-w-[148mm] flex-col items-center justify-between rounded-3xl border-2 border-amber-500 bg-coal-900 p-8 text-center shadow-2xl print:min-h-[200mm] print:rounded-none print:border-4 print:border-black print:bg-white print:text-black print:shadow-none">
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 text-amber-400 print:text-black">
            <IconFlame className="size-7" />
            <span className="font-display text-2xl font-bold uppercase">{settings.name}</span>
          </div>
          <p className="text-xs tracking-widest text-muted uppercase print:text-neutral-700">
            100 % Halal · Malpassé · Marseille 13e
          </p>
        </header>

        <div className="my-6 space-y-4">
          <h2 className="font-display text-4xl leading-tight font-bold uppercase">
            Vous avez aimé ?<br />
            <span className="text-amber-400 print:text-black">Laissez-nous un avis !</span>
          </h2>
          <p className="mx-auto max-w-xs text-sm text-muted print:text-neutral-700">
            Scannez ce QR code avec l&apos;appareil photo de votre téléphone en 10 secondes :
          </p>

          <div className="mx-auto inline-block rounded-2xl bg-white p-4 shadow-lg print:border-2 print:border-black print:shadow-none">
            <svg
              viewBox={`0 0 ${viewSize} ${viewSize}`}
              width={230}
              height={230}
              role="img"
              aria-label={`QR Code vers les avis Google de ${settings.name}`}
              shapeRendering="crispEdges"
            >
              <rect width={viewSize} height={viewSize} fill="#ffffff" />
              {matrix.map((row, r) =>
                row.map((cell, c) =>
                  cell ? (
                    <rect
                      key={`${r}-${c}`}
                      x={c + quietZone}
                      y={r + quietZone}
                      width={1}
                      height={1}
                      fill="#0c0a08"
                    />
                  ) : null,
                ),
              )}
            </svg>
          </div>

          <p className="font-display text-lg font-bold tracking-wide text-amber-400 uppercase print:text-black">
            ★★★★★ Merci pour votre soutien !
          </p>
        </div>

        <footer className="border-t border-coal-700 pt-4 text-xs text-muted print:border-neutral-300 print:text-neutral-700">
          {fullAddress(settings)} · Tél. {settings.phone}
        </footer>
      </article>
    </div>
  );
}

export default function QrAvisPage() {
  return (
    <Suspense
      fallback={
        <div className="container-x py-16 text-sm text-muted">
          Génération du QR code…
        </div>
      }
    >
      <QrAvisContent />
    </Suspense>
  );
}

