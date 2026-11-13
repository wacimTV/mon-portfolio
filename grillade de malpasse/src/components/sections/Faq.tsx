import { IconChevron } from "@/components/icons";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-coal-900 py-20 sm:py-28">
      <div className="container-x max-w-4xl">
        <div className="reveal text-center">
          <p className="eyebrow">Questions fréquentes</p>
          <h2 id="faq-title" className="h2 mt-2">
            Tout savoir avant de venir ou commander
          </h2>
          <p className="lead mx-auto mt-4 max-w-2xl">
            Halal, horaires tardifs, livraison Uber Eats, accès en métro ou réservation de groupe à Malpassé.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {items.map((item, idx) => (
            <details
              key={idx}
              className="card group open:border-amber-500/50"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display text-lg font-semibold uppercase select-none">
                <span>{item.q}</span>
                <IconChevron className="size-5 shrink-0 text-amber-400 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="border-t border-coal-800 px-6 py-4 text-sm leading-relaxed text-muted">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

