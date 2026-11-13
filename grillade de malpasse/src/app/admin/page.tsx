import { Suspense } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ALLERGENS } from "@/lib/allergens";
import { DAY_NAMES, formatDateFr, formatTime, parisNow } from "@/lib/hours";
import { formatPrice } from "@/lib/site";
import {
  addClosure,
  addGalleryImage,
  addReview,
  createCategory,
  createMenuItem,
  deleteCategory,
  deleteClosure,
  deleteContactMessage,
  deleteDeliveryPlatform,
  deleteGalleryImage,
  deleteMenuItem,
  deleteOffer,
  deleteOrder,
  deleteReservation,
  deleteReview,
  logoutAdmin,
  saveDeliveryPlatform,
  saveOffer,
  toggleMessageRead,
  updateCategory,
  updateHoursAndCapacity,
  updateMenuItem,
  updateOrderStatus,
  updateReservationStatus,
  updateSettings,
} from "@/lib/actions/admin";
import { AdminOrdersMonitor } from "@/components/admin/AdminOrdersMonitor";
import { IconFlame } from "@/components/icons";

const ORDER_STATUS_LABELS: Record<string, string> = {
  NEW: "Nouvelle",
  PREPARING: "En préparation",
  READY: "Prête",
  COMPLETED: "Récupérée",
  CANCELLED: "Annulée",
};

async function DashboardContent({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; status?: string }>;
}) {
  await requireAdmin();
  const filters = await searchParams;
  const dateFilter = filters.date?.trim() ?? "";
  const statusFilter = filters.status?.trim() ?? "";
  const todayYmd = parisNow().ymd;

  const [
    settings,
    hours,
    closures,
    categories,
    platforms,
    gallery,
    reviews,
    offers,
    orders,
    reservations,
    messages,
  ] = await Promise.all([
    prisma.setting.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
    prisma.openingHour.findMany({ orderBy: { dayOfWeek: "asc" } }),
    prisma.closure.findMany({ orderBy: { date: "asc" } }),
    prisma.category.findMany({
      orderBy: { sort: "asc" },
      include: { items: { orderBy: { sort: "asc" } } },
    }),
    prisma.deliveryPlatform.findMany({ orderBy: { sort: "asc" } }),
    prisma.galleryImage.findMany({ orderBy: [{ sort: "asc" }, { createdAt: "desc" }] }),
    prisma.review.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.offer.findMany({ orderBy: [{ sort: "asc" }, { createdAt: "desc" }] }),
    prisma.order.findMany({
      include: { items: true },
      orderBy: [{ createdAt: "desc" }],
      take: 100,
    }),
    prisma.reservation.findMany({
      where: {
        ...(dateFilter ? { date: dateFilter } : {}),
        ...(statusFilter && ["PENDING", "CONFIRMED", "CANCELLED"].includes(statusFilter)
          ? { status: statusFilter }
          : {}),
      },
      orderBy: [{ date: "desc" }, { time: "asc" }],
      take: 100,
    }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
  ]);

  // Commandes du jour en premier, puis le reste
  const sortedOrders = [...orders].sort((a, b) => {
    const aToday = a.pickupDate === todayYmd ? 1 : 0;
    const bToday = b.pickupDate === todayYmd ? 1 : 0;
    if (aToday !== bToday) return bToday - aToday;
    return b.id - a.id;
  });

  const latestOrderId = orders.reduce((max, o) => (o.id > max ? o.id : max), 0);
  const newOrdersCount = orders.filter((o) => o.status === "NEW").length;
  const unreadCount = messages.filter((m) => !m.read).length;
  const pendingCount = reservations.filter((r) => r.status === "PENDING").length;

  return (
    <div className="min-h-svh pb-20">
      <AdminOrdersMonitor latestOrderId={latestOrderId} />

      <header className="sticky top-0 z-40 border-b border-coal-800 bg-coal-950/95 backdrop-blur">
        <div className="container-x flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <IconFlame className="size-6 text-amber-500" />
            <div>
              <h1 className="font-display text-xl font-bold uppercase">
                Administration · {settings.name}
              </h1>
              <p className="text-xs text-muted">
                Toute modification enregistrée ici est visible immédiatement sur le site.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/admin/qr-avis" className="btn-ghost min-h-10 px-4 py-2 text-xs">
              QR Code Avis Google
            </Link>
            <Link href="/" target="_blank" className="btn-ghost min-h-10 px-4 py-2 text-xs">
              Voir le site public ↗
            </Link>
            <form action={logoutAdmin}>
              <button type="submit" className="btn-ember min-h-10 px-4 py-2 text-xs">
                Déconnexion
              </button>
            </form>
          </div>
        </div>

        <nav aria-label="Sections admin" className="border-t border-coal-800 bg-coal-900">
          <ul className="container-x flex flex-wrap gap-4 py-2.5 text-xs font-semibold uppercase">
            <li>
              <a href="#sec-commandes" className="text-amber-400 hover:underline">
                Commandes ({newOrdersCount} nouvelles)
              </a>
            </li>
            <li>
              <a href="#sec-reservations" className="hover:text-amber-400">
                Réservations ({pendingCount} en attente)
              </a>
            </li>
            <li>
              <a href="#sec-messages" className="hover:text-amber-400">
                Messages ({unreadCount} non lus)
              </a>
            </li>
            <li>
              <a href="#sec-carte" className="hover:text-amber-400">
                La carte
              </a>
            </li>
            <li>
              <a href="#sec-formules" className="hover:text-amber-400">
                Formules ({offers.filter((o) => o.active).length})
              </a>
            </li>
            <li>
              <a href="#sec-horaires" className="hover:text-amber-400">
                Horaires &amp; capacité
              </a>
            </li>
            <li>
              <a href="#sec-livraison" className="hover:text-amber-400">
                Livraison &amp; réglages
              </a>
            </li>
            <li>
              <a href="#sec-galerie" className="hover:text-amber-400">
                Galerie &amp; avis
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="container-x mt-8 space-y-14">
        {/* ── 0. COMMANDES CLICK & COLLECT ──────────────────────────── */}
        <section id="sec-commandes" className="card p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-coal-800 pb-4">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase">
                Commandes Click &amp; Collect ({orders.length})
              </h2>
              <p className="text-xs text-muted">
                Commandes du jour ({formatDateFr(todayYmd)}) affichées en premier · Rafraîchissement
                automatique toutes les 30 s + signal sonore.
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                settings.clickAndCollectEnabled
                  ? "bg-uber/20 text-[#7ef0b4]"
                  : "bg-ember-700/30 text-[#ffb59e]"
              }`}
            >
              Click &amp; Collect : {settings.clickAndCollectEnabled ? "Activé" : "Désactivé"}
            </span>
          </div>

          {sortedOrders.length === 0 ? (
            <p className="mt-6 text-sm text-muted">Aucune commande Click &amp; Collect pour le moment.</p>
          ) : (
            <div className="mt-6 space-y-3">
              {sortedOrders.map((ord) => {
                const isToday = ord.pickupDate === todayYmd;
                return (
                  <div
                    key={ord.id}
                    className={`flex flex-col justify-between gap-4 rounded-xl border p-4 lg:flex-row lg:items-center ${
                      ord.status === "NEW"
                        ? "border-amber-500 bg-coal-850"
                        : "border-coal-700 bg-coal-900"
                    }`}
                  >
                    <div className="space-y-1.5 text-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                            ord.status === "READY" || ord.status === "COMPLETED"
                              ? "bg-uber/20 text-[#7ef0b4]"
                              : ord.status === "CANCELLED"
                                ? "bg-ember-700/30 text-[#ffb59e]"
                                : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {ORDER_STATUS_LABELS[ord.status] ?? ord.status}
                        </span>
                        {isToday ? (
                          <span className="rounded bg-ember-600 px-2 py-0.5 text-[0.7rem] font-bold text-white uppercase">
                            Aujourd&apos;hui
                          </span>
                        ) : null}
                        <strong className="font-display text-lg uppercase">
                          #{ord.id} · {ord.name}
                        </strong>
                        <span className="font-display text-lg font-bold text-amber-400">
                          {formatPrice(ord.totalCents)}
                        </span>
                      </div>

                      <p className="text-xs text-cream">
                        🕒 Retrait : <strong>{formatDateFr(ord.pickupDate)}</strong> à{" "}
                        <strong className="text-amber-400">{formatTime(ord.pickupTime)}</strong> · 📞{" "}
                        <a href={`tel:${ord.phone}`} className="text-amber-400 underline">
                          {ord.phone}
                        </a>
                        {ord.email ? ` · ✉️ ${ord.email}` : ""}
                      </p>

                      <ul className="flex flex-wrap gap-2 pt-1 text-xs">
                        {ord.items.map((it) => (
                          <li
                            key={it.id}
                            className="rounded-lg border border-coal-700 bg-coal-850 px-2.5 py-1"
                          >
                            <strong className="text-amber-400">{it.quantity}×</strong> {it.name} (
                            {formatPrice(it.unitPriceCents * it.quantity)})
                          </li>
                        ))}
                      </ul>

                      {ord.note ? (
                        <p className="text-xs text-muted">Remarque : &ldquo;{ord.note}&rdquo;</p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {(["NEW", "PREPARING", "READY", "COMPLETED", "CANCELLED"] as const).map(
                        (st) => (
                          <form key={st} action={updateOrderStatus}>
                            <input type="hidden" name="id" value={ord.id} />
                            <input type="hidden" name="status" value={st} />
                            <button
                              type="submit"
                              disabled={ord.status === st}
                              className="rounded-lg border border-coal-600 px-2.5 py-1.5 text-xs font-semibold hover:border-amber-400 disabled:opacity-40"
                            >
                              {ORDER_STATUS_LABELS[st]}
                            </button>
                          </form>
                        ),
                      )}
                      <form action={deleteOrder}>
                        <input type="hidden" name="id" value={ord.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-ember-600/50 px-2.5 py-1.5 text-xs text-ember-500 hover:bg-ember-600 hover:text-white"
                        >
                          Supprimer
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── 1. RÉSERVATIONS ───────────────────────────────────────── */}
        <section id="sec-reservations" className="card p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-coal-800 pb-4">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase">1. Réservations</h2>
              <p className="text-xs text-muted">
                Capacité actuelle : {settings.slotCapacity} couverts max par créneau de 30 min.
              </p>
            </div>

            <form method="get" className="flex flex-wrap items-center gap-2 text-xs">
              <input
                type="date"
                name="date"
                defaultValue={dateFilter}
                className="rounded-lg border border-coal-600 bg-coal-850 px-3 py-2 text-cream"
              />
              <select
                name="status"
                defaultValue={statusFilter}
                className="rounded-lg border border-coal-600 bg-coal-850 px-3 py-2 text-cream"
              >
                <option value="">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="CONFIRMED">Confirmée</option>
                <option value="CANCELLED">Annulée</option>
              </select>
              <button type="submit" className="btn-primary min-h-9 px-4 py-1.5 text-xs">
                Filtrer
              </button>
              {dateFilter || statusFilter ? (
                <Link href="/admin" className="btn-ghost min-h-9 px-3 py-1.5 text-xs">
                  Réinitialiser
                </Link>
              ) : null}
            </form>
          </div>

          {reservations.length === 0 ? (
            <p className="mt-6 text-sm text-muted">Aucune réservation pour ces critères.</p>
          ) : (
            <div className="mt-6 space-y-3">
              {reservations.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-coal-700 bg-coal-850 p-4 lg:flex-row lg:items-center"
                >
                  <div className="space-y-1 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                          r.status === "CONFIRMED"
                            ? "bg-uber/20 text-[#7ef0b4]"
                            : r.status === "CANCELLED"
                              ? "bg-ember-700/30 text-[#ffb59e]"
                              : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {r.status === "CONFIRMED"
                          ? "Confirmée"
                          : r.status === "CANCELLED"
                            ? "Annulée"
                            : "En attente"}
                      </span>
                      <strong className="font-display text-lg uppercase">{r.name}</strong>
                      <span className="text-muted">· {r.guests} pers.</span>
                    </div>
                    <p className="text-xs text-cream">
                      📅 {formatDateFr(r.date)} à <strong>{formatTime(r.time)}</strong> · 📞{" "}
                      <a href={`tel:${r.phone}`} className="text-amber-400 underline">
                        {r.phone}
                      </a>{" "}
                      · ✉️ {r.email}
                    </p>
                    {r.message ? (
                      <p className="text-xs text-muted">Note : &ldquo;{r.message}&rdquo;</p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {(["PENDING", "CONFIRMED", "CANCELLED"] as const).map((st) => (
                      <form key={st} action={updateReservationStatus}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="status" value={st} />
                        <button
                          type="submit"
                          disabled={r.status === st}
                          className="rounded-lg border border-coal-600 px-3 py-1.5 text-xs font-semibold hover:border-amber-400 disabled:opacity-40"
                        >
                          {st === "PENDING"
                            ? "En attente"
                            : st === "CONFIRMED"
                              ? "Confirmer"
                              : "Annuler"}
                        </button>
                      </form>
                    ))}
                    <form action={deleteReservation}>
                      <input type="hidden" name="id" value={r.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-ember-600/50 px-3 py-1.5 text-xs text-ember-500 hover:bg-ember-600 hover:text-white"
                      >
                        Supprimer
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── 2. MESSAGES DE CONTACT ────────────────────────────────── */}
        <section id="sec-messages" className="card p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold uppercase">
            2. Messages de contact ({messages.length})
          </h2>

          {messages.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Aucun message reçu pour le moment.</p>
          ) : (
            <div className="mt-6 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-xl border p-4 ${
                    m.read ? "border-coal-800 bg-coal-900" : "border-amber-500/50 bg-coal-850"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm">
                      <strong>{m.name}</strong> ·{" "}
                      <a href={`mailto:${m.email}`} className="text-amber-400 underline">
                        {m.email}
                      </a>
                      {m.phone ? ` · ${m.phone}` : ""}
                    </div>
                    <div className="flex items-center gap-2">
                      <form action={toggleMessageRead}>
                        <input type="hidden" name="id" value={m.id} />
                        <input type="hidden" name="read" value={m.read ? "false" : "true"} />
                        <button
                          type="submit"
                          className="rounded-lg border border-coal-600 px-3 py-1 text-xs hover:border-amber-400"
                        >
                          {m.read ? "Marquer non lu" : "Marquer comme lu"}
                        </button>
                      </form>
                      <form action={deleteContactMessage}>
                        <input type="hidden" name="id" value={m.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-ember-600/50 px-3 py-1 text-xs text-ember-500 hover:bg-ember-600 hover:text-white"
                        >
                          Supprimer
                        </button>
                      </form>
                    </div>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── 3. LA CARTE ───────────────────────────────────────────── */}
        <section id="sec-carte" className="card space-y-8 p-6 sm:p-8">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase">
              3. Gestion de la carte (plats, prix, origine viandes, allergènes, photos)
            </h2>
            <p className="text-xs text-muted">
              Ajoutez des plats, modifiez les tarifs, renseignez l&apos;origine des viandes et cochez les
              14 allergènes réglementaires.
            </p>
          </div>

          {/* Ajouter un plat */}
          <form
            action={createMenuItem}
            className="space-y-4 rounded-2xl border border-amber-500/40 bg-coal-850 p-5"
          >
            <h3 className="font-display text-lg font-bold text-amber-400 uppercase">
              + Ajouter un nouveau plat
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <select name="categoryId" required className="input">
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-coal-900">
                    {c.name}
                  </option>
                ))}
              </select>
              <input name="name" placeholder="Nom du plat *" required className="input" />
              <input
                name="price"
                placeholder="Prix en € (ex. 10.00) *"
                required
                className="input"
              />
              <input
                name="promoLabel"
                placeholder="Badge promo (ex. Nouveau, Promo)"
                className="input"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                name="description"
                placeholder="Description (ingrédients, accompagnement…)"
                className="input"
              />
              <input
                name="meatOrigin"
                placeholder="Origine viande (ex. Bœuf : France, Volaille : UE)"
                className="input"
              />
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                aria-label="Photo du plat"
                className="input text-xs"
              />
            </div>
            <fieldset className="rounded-xl border border-coal-700 bg-coal-900 p-3">
              <legend className="px-2 text-xs font-semibold text-muted">
                Allergènes présents (14 allergènes réglementaires)
              </legend>
              <div className="mt-1 flex flex-wrap gap-3 text-xs">
                {ALLERGENS.map((a) => (
                  <label key={a.code} className="inline-flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      name="allergens"
                      value={a.code}
                      className="size-3.5 accent-amber-500"
                    />
                    <span>{a.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" name="featured" className="size-4 accent-amber-500" />
                Mettre en avant sur la page d&apos;accueil
              </label>
              <button type="submit" className="btn-primary min-h-10 px-5 py-2 text-xs">
                Ajouter à la carte
              </button>
            </div>
          </form>

          {/* Ajouter une catégorie */}
          <form
            action={createCategory}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-coal-700 bg-coal-850 p-4"
          >
            <span className="font-display text-sm font-bold uppercase">Nouvelle catégorie :</span>
            <input
              name="name"
              placeholder="Nom (ex. Desserts)"
              required
              className="rounded-lg border border-coal-600 bg-coal-900 px-3 py-2 text-xs"
            />
            <input
              name="description"
              placeholder="Description courte"
              className="min-w-60 flex-1 rounded-lg border border-coal-600 bg-coal-900 px-3 py-2 text-xs"
            />
            <input
              name="sort"
              type="number"
              defaultValue={categories.length}
              aria-label="Ordre d'affichage"
              className="w-20 rounded-lg border border-coal-600 bg-coal-900 px-3 py-2 text-xs"
            />
            <button type="submit" className="btn-ghost min-h-9 px-4 py-1.5 text-xs">
              Créer la catégorie
            </button>
          </form>

          {/* Liste des catégories et plats */}
          <div className="space-y-6">
            {categories.map((cat) => (
              <div key={cat.id} className="rounded-2xl border border-coal-700 bg-coal-850 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-coal-700 pb-3">
                  <form action={updateCategory} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="id" value={cat.id} />
                    <input
                      name="name"
                      defaultValue={cat.name}
                      aria-label="Nom de la catégorie"
                      className="font-display rounded-lg border border-coal-600 bg-coal-900 px-3 py-1.5 text-lg font-bold uppercase"
                    />
                    <input
                      name="description"
                      defaultValue={cat.description}
                      placeholder="Description"
                      aria-label="Description de la catégorie"
                      className="min-w-56 rounded-lg border border-coal-600 bg-coal-900 px-3 py-1.5 text-xs"
                    />
                    <input
                      name="sort"
                      type="number"
                      defaultValue={cat.sort}
                      aria-label="Ordre"
                      className="w-16 rounded-lg border border-coal-600 bg-coal-900 px-2 py-1.5 text-xs"
                    />
                    <button
                      type="submit"
                      className="rounded-lg border border-coal-600 px-3 py-1.5 text-xs hover:border-amber-400"
                    >
                      Enregistrer catégorie
                    </button>
                  </form>

                  <form action={deleteCategory}>
                    <input type="hidden" name="id" value={cat.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-ember-600/40 px-3 py-1.5 text-xs text-ember-500 hover:bg-ember-600 hover:text-white"
                    >
                      Supprimer catégorie
                    </button>
                  </form>
                </div>

                {cat.items.length === 0 ? (
                  <p className="mt-3 text-xs text-muted">
                    Catégorie vide (elle sera affichée automatiquement dès qu&apos;un plat y sera ajouté).
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {cat.items.map((item) => {
                      const activeAllergens = new Set(
                        (item.allergens ?? "")
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      );
                      return (
                        <div
                          key={item.id}
                          className="rounded-xl border border-coal-700 bg-coal-900 p-4"
                        >
                          <form action={updateMenuItem} className="space-y-3">
                            <input type="hidden" name="id" value={item.id} />
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                              <select
                                name="categoryId"
                                defaultValue={item.categoryId}
                                aria-label="Catégorie"
                                className="rounded-lg border border-coal-600 bg-coal-850 px-3 py-2 text-xs"
                              >
                                {categories.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.name}
                                  </option>
                                ))}
                              </select>
                              <input
                                name="name"
                                defaultValue={item.name}
                                aria-label="Nom du plat"
                                className="rounded-lg border border-coal-600 bg-coal-850 px-3 py-2 text-xs font-semibold"
                              />
                              <input
                                name="price"
                                defaultValue={(item.priceCents / 100).toFixed(2)}
                                aria-label="Prix en euros"
                                className="rounded-lg border border-coal-600 bg-coal-850 px-3 py-2 text-xs"
                              />
                              <input
                                name="promoLabel"
                                defaultValue={item.promoLabel}
                                placeholder="Badge promo"
                                aria-label="Badge promo"
                                className="rounded-lg border border-coal-600 bg-coal-850 px-3 py-2 text-xs"
                              />
                              <input
                                name="sort"
                                type="number"
                                defaultValue={item.sort}
                                aria-label="Ordre"
                                className="rounded-lg border border-coal-600 bg-coal-850 px-3 py-2 text-xs"
                              />
                            </div>

                            <div className="grid gap-2 sm:grid-cols-3">
                              <input
                                name="description"
                                defaultValue={item.description}
                                placeholder="Description"
                                aria-label="Description"
                                className="rounded-lg border border-coal-600 bg-coal-850 px-3 py-2 text-xs"
                              />
                              <input
                                name="meatOrigin"
                                defaultValue={item.meatOrigin}
                                placeholder="Origine viande (ex. Bœuf : France)"
                                aria-label="Origine de la viande"
                                className="rounded-lg border border-coal-600 bg-coal-850 px-3 py-2 text-xs"
                              />
                              <input
                                type="file"
                                name="imageFile"
                                accept="image/*"
                                aria-label="Remplacer la photo"
                                className="rounded-lg border border-coal-600 bg-coal-850 px-3 py-1.5 text-xs"
                              />
                            </div>

                            <div className="flex flex-wrap gap-2.5 rounded-lg border border-coal-800 bg-coal-850 p-2.5 text-[0.72rem]">
                              <span className="font-semibold text-muted">Allergènes :</span>
                              {ALLERGENS.map((a) => (
                                <label key={a.code} className="inline-flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    name="allergens"
                                    value={a.code}
                                    defaultChecked={activeAllergens.has(a.code)}
                                    className="size-3.5 accent-amber-500"
                                  />
                                  <span>{a.label}</span>
                                </label>
                              ))}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div className="flex flex-wrap items-center gap-4">
                                <label className="flex items-center gap-1.5">
                                  <input
                                    type="checkbox"
                                    name="available"
                                    defaultChecked={item.available}
                                    className="size-4 accent-amber-500"
                                  />
                                  Disponible ({formatPrice(item.priceCents)})
                                </label>
                                <label className="flex items-center gap-1.5">
                                  <input
                                    type="checkbox"
                                    name="featured"
                                    defaultChecked={item.featured}
                                    className="size-4 accent-amber-500"
                                  />
                                  Mis en avant (accueil)
                                </label>
                                {item.image ? (
                                  <label className="flex items-center gap-1.5 text-amber-400">
                                    <input
                                      type="checkbox"
                                      name="clearImage"
                                      className="size-4 accent-ember-500"
                                    />
                                    Retirer la photo actuelle
                                  </label>
                                ) : (
                                  <span className="text-muted">
                                    Aucune photo (placeholder affiché)
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="submit"
                                  className="rounded-lg bg-amber-500 px-3 py-1.5 font-semibold text-coal-950 hover:bg-amber-400"
                                >
                                  Enregistrer
                                </button>
                              </div>
                            </div>
                          </form>

                          <form action={deleteMenuItem} className="mt-2 flex justify-end">
                            <input type="hidden" name="id" value={item.id} />
                            <button
                              type="submit"
                              className="text-xs text-ember-500 hover:underline"
                            >
                              Supprimer ce plat
                            </button>
                          </form>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── 3bis. FORMULES & PROMOTIONS ───────────────────────────── */}
        <section id="sec-formules" className="card space-y-6 p-6 sm:p-8">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase">
              Formules &amp; promotions (Étudiant, Midi, Famille…)
            </h2>
            <p className="text-xs text-muted">
              Les formules actives s&apos;affichent automatiquement sur l&apos;accueil (entre la carte et la
              livraison) et en haut de /carte. S&apos;il n&apos;y en a aucune, la section reste masquée.
            </p>
          </div>

          <form
            action={saveOffer}
            className="grid gap-3 rounded-2xl border border-amber-500/40 bg-coal-850 p-5 sm:grid-cols-2 lg:grid-cols-5"
          >
            <input
              name="title"
              placeholder="Titre de la formule *"
              required
              className="input text-xs"
            />
            <input
              name="badge"
              placeholder="Badge (Étudiant, Midi, Famille)"
              className="input text-xs"
            />
            <input
              name="price"
              placeholder="Prix en € (optionnel)"
              className="input text-xs"
            />
            <input
              name="description"
              placeholder="Description détaillée"
              className="input text-xs sm:col-span-2 lg:col-span-1"
            />
            <button type="submit" className="btn-primary min-h-10 px-4 py-2 text-xs">
              + Ajouter la formule
            </button>
          </form>

          {offers.length > 0 ? (
            <div className="space-y-3">
              {offers.map((of) => (
                <div
                  key={of.id}
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-coal-700 bg-coal-850 p-3"
                >
                  <form action={saveOffer} className="flex flex-1 flex-wrap items-center gap-2">
                    <input type="hidden" name="id" value={of.id} />
                    <input
                      name="title"
                      defaultValue={of.title}
                      aria-label="Titre"
                      className="w-44 rounded-lg border border-coal-600 bg-coal-900 px-3 py-1.5 text-xs font-semibold"
                    />
                    <input
                      name="badge"
                      defaultValue={of.badge}
                      placeholder="Badge"
                      aria-label="Badge"
                      className="w-32 rounded-lg border border-coal-600 bg-coal-900 px-3 py-1.5 text-xs"
                    />
                    <input
                      name="price"
                      defaultValue={
                        of.priceCents !== null && of.priceCents !== undefined
                          ? (of.priceCents / 100).toFixed(2)
                          : ""
                      }
                      placeholder="Prix €"
                      aria-label="Prix"
                      className="w-24 rounded-lg border border-coal-600 bg-coal-900 px-3 py-1.5 text-xs"
                    />
                    <input
                      name="description"
                      defaultValue={of.description}
                      placeholder="Description"
                      aria-label="Description"
                      className="min-w-48 flex-1 rounded-lg border border-coal-600 bg-coal-900 px-3 py-1.5 text-xs"
                    />
                    <input
                      name="sort"
                      type="number"
                      defaultValue={of.sort}
                      aria-label="Ordre"
                      className="w-16 rounded-lg border border-coal-600 bg-coal-900 px-2 py-1.5 text-xs"
                    />
                    <label className="flex items-center gap-1.5 text-xs">
                      <input
                        type="checkbox"
                        name="active"
                        defaultChecked={of.active}
                        className="size-4 accent-amber-500"
                      />
                      Active
                    </label>
                    <button
                      type="submit"
                      className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-coal-950"
                    >
                      Enregistrer
                    </button>
                  </form>
                  <form action={deleteOffer}>
                    <input type="hidden" name="id" value={of.id} />
                    <button type="submit" className="px-2 text-xs text-ember-500 hover:underline">
                      Supprimer
                    </button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted">
              Aucune formule créée pour le moment (la section « Nos formules » est masquée sur le site).
            </p>
          )}
        </section>

        {/* ── 4. HORAIRES, CAPACITÉ & FERMETURES ────────────────────── */}
        <section id="sec-horaires" className="card space-y-8 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold uppercase">
            4. Horaires d&apos;ouverture, fermetures exceptionnelles &amp; capacité
          </h2>

          <form action={updateHoursAndCapacity} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="field">
                <label htmlFor="adm-cap" className="label">
                  Capacité maximale par créneau de 30 min (couverts)
                </label>
                <input
                  id="adm-cap"
                  name="slotCapacity"
                  type="number"
                  min={1}
                  defaultValue={settings.slotCapacity}
                  className="input"
                />
              </div>
              <div className="field">
                <label htmlFor="adm-maxg" className="label">
                  Taille maximale d&apos;un groupe réservable en ligne
                </label>
                <input
                  id="adm-maxg"
                  name="maxGuestsOnline"
                  type="number"
                  min={1}
                  defaultValue={settings.maxGuestsOnline}
                  className="input"
                />
              </div>
            </div>

            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                const h = hours.find((x) => x.dayOfWeek === d) ?? {
                  dayOfWeek: d,
                  openTime: "11:00",
                  closeTime: "01:00",
                  closed: false,
                };
                return (
                  <div
                    key={d}
                    className="grid items-center gap-3 rounded-xl border border-coal-700 bg-coal-850 px-4 py-3 sm:grid-cols-4"
                  >
                    <span className="font-display font-semibold uppercase">{DAY_NAMES[d]}</span>
                    <label className="flex items-center gap-2 text-xs">
                      Ouverture
                      <input
                        type="time"
                        name={`open_${d}`}
                        defaultValue={h.openTime}
                        className="rounded-lg border border-coal-600 bg-coal-900 px-2.5 py-1.5"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      Fermeture
                      <input
                        type="time"
                        name={`close_${d}`}
                        defaultValue={h.closeTime}
                        className="rounded-lg border border-coal-600 bg-coal-900 px-2.5 py-1.5"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        name={`closed_${d}`}
                        defaultChecked={h.closed}
                        className="size-4 accent-ember-500"
                      />
                      Fermé ce jour
                    </label>
                  </div>
                );
              })}
            </div>

            <button type="submit" className="btn-primary min-h-10 px-6 py-2 text-xs">
              Enregistrer les horaires et la capacité
            </button>
          </form>

          <div className="border-t border-coal-800 pt-6">
            <h3 className="font-display text-lg font-bold uppercase">
              Fermetures exceptionnelles
            </h3>
            <form action={addClosure} className="mt-3 flex flex-wrap gap-3">
              <input
                type="date"
                name="date"
                required
                aria-label="Date de fermeture"
                className="rounded-lg border border-coal-600 bg-coal-850 px-3 py-2 text-xs"
              />
              <input
                name="reason"
                placeholder="Motif (ex. Aïd, travaux, congés…)"
                className="min-w-60 flex-1 rounded-lg border border-coal-600 bg-coal-850 px-3 py-2 text-xs"
              />
              <button type="submit" className="btn-ghost min-h-9 px-4 py-1.5 text-xs">
                Ajouter une date de fermeture
              </button>
            </form>

            {closures.length > 0 ? (
              <ul className="mt-4 space-y-2 text-xs">
                {closures.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between rounded-lg border border-coal-700 bg-coal-850 px-3 py-2"
                  >
                    <span>
                      <strong>{formatDateFr(c.date)}</strong>
                      {c.reason ? ` — ${c.reason}` : ""}
                    </span>
                    <form action={deleteClosure}>
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className="text-ember-500 hover:underline">
                        Retirer
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>

        {/* ── 5. LIVRAISON, COORDONNÉES & RÉSEAUX SOCIAUX ───────────── */}
        <section id="sec-livraison" className="card space-y-8 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold uppercase">
            5. Plateformes de livraison, infos restaurant &amp; réseaux sociaux
          </h2>

          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-amber-400 uppercase">
              Plateformes de livraison (Uber Eats, Deliveroo…)
            </h3>
            {platforms.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-coal-700 bg-coal-850 p-3"
              >
                <form action={saveDeliveryPlatform} className="flex flex-1 flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={p.id} />
                  <input
                    name="name"
                    defaultValue={p.name}
                    aria-label="Nom de la plateforme"
                    className="w-40 rounded-lg border border-coal-600 bg-coal-900 px-3 py-1.5 text-xs font-semibold"
                  />
                  <input
                    name="url"
                    defaultValue={p.url}
                    aria-label="URL de la plateforme"
                    className="min-w-64 flex-1 rounded-lg border border-coal-600 bg-coal-900 px-3 py-1.5 text-xs"
                  />
                  <label className="flex items-center gap-1.5 text-xs">
                    <input
                      type="checkbox"
                      name="active"
                      defaultChecked={p.active}
                      className="size-4 accent-amber-500"
                    />
                    Active
                  </label>
                  <button
                    type="submit"
                    className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-coal-950"
                  >
                    Enregistrer
                  </button>
                </form>
                <form action={deleteDeliveryPlatform}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="px-2 text-xs text-ember-500 hover:underline">
                    Supprimer
                  </button>
                </form>
              </div>
            ))}

            <form
              action={saveDeliveryPlatform}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-coal-600 p-3"
            >
              <input
                name="name"
                placeholder="Nouvelle plateforme (ex. Deliveroo)"
                required
                className="w-56 rounded-lg border border-coal-600 bg-coal-900 px-3 py-1.5 text-xs"
              />
              <input
                name="url"
                placeholder="https://..."
                required
                className="min-w-64 flex-1 rounded-lg border border-coal-600 bg-coal-900 px-3 py-1.5 text-xs"
              />
              <button type="submit" className="btn-ghost min-h-9 px-4 py-1.5 text-xs">
                + Ajouter plateforme
              </button>
            </form>
          </div>

          <form action={updateSettings} className="space-y-4 border-t border-coal-800 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="font-display text-lg font-bold text-amber-400 uppercase">
                Infos générales, Click &amp; Collect, mention viandes, GPS &amp; réseaux
              </h3>
              <label className="flex items-center gap-2 rounded-xl border border-amber-500/50 bg-coal-850 px-4 py-2 text-xs font-semibold">
                <input
                  type="checkbox"
                  name="clickAndCollectEnabled"
                  defaultChecked={settings.clickAndCollectEnabled}
                  className="size-4 accent-amber-500"
                />
                Activer le Click &amp; Collect (/commander)
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="field">
                <label className="label">Nom du restaurant</label>
                <input name="name" defaultValue={settings.name} className="input" />
              </div>
              <div className="field">
                <label className="label">Téléphone</label>
                <input name="phone" defaultValue={settings.phone} className="input" />
              </div>
              <div className="field">
                <label className="label">WhatsApp (ex. 33612345678, vide = masqué)</label>
                <input name="whatsapp" defaultValue={settings.whatsapp} className="input" />
              </div>
              <div className="field">
                <label className="label">Adresse (rue)</label>
                <input name="street" defaultValue={settings.street} className="input" />
              </div>
              <div className="field">
                <label className="label">Code postal</label>
                <input name="postalCode" defaultValue={settings.postalCode} className="input" />
              </div>
              <div className="field">
                <label className="label">Ville</label>
                <input name="city" defaultValue={settings.city} className="input" />
              </div>
              <div className="field">
                <label className="label">Note Uber Eats</label>
                <input name="uberRating" defaultValue={settings.uberRating} className="input" />
              </div>
              <div className="field">
                <label className="label">Nombre d&apos;avis Uber Eats</label>
                <input name="uberReviewCount" defaultValue={settings.uberReviewCount} className="input" />
              </div>
              <div className="field">
                <label className="label">Zones livrées (séparées par des virgules)</label>
                <input name="deliveryZones" defaultValue={settings.deliveryZones} className="input" />
              </div>
              <div className="field">
                <label className="label">TikTok</label>
                <input name="tiktok" defaultValue={settings.tiktok} className="input" />
              </div>
              <div className="field">
                <label className="label">Instagram (vide = icône masquée)</label>
                <input name="instagram" defaultValue={settings.instagram} className="input" />
              </div>
              <div className="field">
                <label className="label">Facebook (vide = icône masquée)</label>
                <input name="facebook" defaultValue={settings.facebook} className="input" />
              </div>
              <div className="field">
                <label className="label">Snapchat (vide = icône masquée)</label>
                <input name="snapchat" defaultValue={settings.snapchat} className="input" />
              </div>
              <div className="field">
                <label className="label">Lien fiche Google Maps</label>
                <input name="googleMapsUrl" defaultValue={settings.googleMapsUrl} className="input" />
              </div>
              <div className="field">
                <label className="label">
                  Lien « Laisser un avis Google » (affiche les boutons + QR code)
                </label>
                <input name="googleReviewUrl" defaultValue={settings.googleReviewUrl} className="input" />
              </div>
              <div className="field">
                <label className="label">
                  Latitude GPS (à copier depuis Google Maps : clic droit sur le restaurant)
                </label>
                <input name="latitude" defaultValue={settings.latitude} className="input" />
              </div>
              <div className="field">
                <label className="label">
                  Longitude GPS (à copier depuis Google Maps : clic droit sur le restaurant)
                </label>
                <input name="longitude" defaultValue={settings.longitude} className="input" />
              </div>
              <div className="field">
                <label className="label">Email public (optionnel)</label>
                <input name="email" defaultValue={settings.email} className="input" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="field">
                <label className="label">Bandeau d&apos;annonce en haut du site (vide = masqué)</label>
                <input
                  name="announcement"
                  defaultValue={settings.announcement}
                  placeholder="Ex. Match de l'OM ce soir : commandez vos assiettes à partager !"
                  className="input"
                />
              </div>
              <div className="field">
                <label className="label">Infos stationnement &amp; parking</label>
                <input name="parkingInfo" defaultValue={settings.parkingInfo} className="input" />
              </div>
              <div className="field">
                <label className="label">
                  Infos transports complémentaires (ex. lignes de bus RTM — vide = affiche uniquement
                  « Métro M1 – station Malpassé »)
                </label>
                <input
                  name="transportInfo"
                  defaultValue={settings.transportInfo}
                  placeholder="Ex. Bus RTM lignes…"
                  className="input"
                />
              </div>
              <div className="field">
                <label className="label">
                  Mention générale « Origine de nos viandes » (affichée en bas de /carte)
                </label>
                <input
                  name="meatOriginNote"
                  defaultValue={settings.meatOriginNote}
                  placeholder="Ex. Bœuf : France · Volaille : France / UE · Agneau : UE"
                  className="input"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="field">
                <label className="label">Vraie photo d&apos;accueil (Hero)</label>
                <input type="file" name="heroImageFile" accept="image/*" className="input text-xs" />
                {settings.heroImage ? (
                  <label className="flex items-center gap-2 text-xs text-amber-400">
                    <input type="checkbox" name="clearHeroImage" className="size-4" />
                    Retirer la photo d&apos;accueil actuelle
                  </label>
                ) : null}
              </div>
              <div className="field">
                <label className="label">Vraie photo « Notre histoire »</label>
                <input type="file" name="storyImageFile" accept="image/*" className="input text-xs" />
                {settings.storyImage ? (
                  <label className="flex items-center gap-2 text-xs text-amber-400">
                    <input type="checkbox" name="clearStoryImage" className="size-4" />
                    Retirer la photo « Notre histoire » actuelle
                  </label>
                ) : null}
              </div>
            </div>

            <button type="submit" className="btn-primary min-h-10 px-6 py-2 text-xs">
              Enregistrer tous les réglages
            </button>
          </form>
        </section>

        {/* ── 6. GALERIE PHOTOS & AVIS CLIENTS ──────────────────────── */}
        <section id="sec-galerie" className="card space-y-8 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-bold uppercase">
              6. Galerie photos &amp; avis clients vérifiés
            </h2>
            <Link href="/admin/qr-avis" className="btn-ghost min-h-9 px-4 py-1.5 text-xs">
              🖨️ Ouvrir l&apos;affiche QR Code Avis (A5)
            </Link>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-amber-400 uppercase">
              Ajouter une photo à la galerie
            </h3>
            <form action={addGalleryImage} className="mt-3 flex flex-wrap items-center gap-3">
              <input
                type="file"
                name="file"
                accept="image/*"
                required
                aria-label="Fichier photo"
                className="rounded-lg border border-coal-600 bg-coal-850 px-3 py-2 text-xs"
              />
              <input
                name="alt"
                placeholder="Description SEO de la photo (ex. Assiette 3 viandes grillées halal)"
                required
                className="min-w-64 flex-1 rounded-lg border border-coal-600 bg-coal-850 px-3 py-2 text-xs"
              />
              <button type="submit" className="btn-primary min-h-9 px-4 py-1.5 text-xs">
                Ajouter à la galerie
              </button>
            </form>

            {gallery.length > 0 ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((g) => (
                  <li
                    key={g.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-coal-700 bg-coal-850 p-3 text-xs"
                  >
                    <span className="truncate">{g.alt}</span>
                    <form action={deleteGalleryImage}>
                      <input type="hidden" name="id" value={g.id} />
                      <button type="submit" className="text-ember-500 hover:underline">
                        Supprimer
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-muted">
                Aucune photo uploadée : les emplacements « À REMPLACER PAR UNE VRAIE PHOTO » sont affichés.
              </p>
            )}
          </div>

          <div className="border-t border-coal-800 pt-6">
            <h3 className="font-display text-lg font-bold text-amber-400 uppercase">
              Ajouter un vrai avis client (Google / Uber Eats)
            </h3>
            <form action={addReview} className="mt-3 grid gap-3 sm:grid-cols-4">
              <input
                name="author"
                placeholder="Prénom / Nom du client *"
                required
                className="rounded-lg border border-coal-600 bg-coal-850 px-3 py-2 text-xs"
              />
              <select
                name="rating"
                defaultValue="5"
                aria-label="Note"
                className="rounded-lg border border-coal-600 bg-coal-850 px-3 py-2 text-xs"
              >
                <option value="5">5 / 5</option>
                <option value="4">4 / 5</option>
              </select>
              <input
                name="source"
                defaultValue="Google"
                placeholder="Source (Google, Uber Eats)"
                className="rounded-lg border border-coal-600 bg-coal-850 px-3 py-2 text-xs"
              />
              <input
                name="date"
                placeholder="Date (ex. Octobre 2026)"
                className="rounded-lg border border-coal-600 bg-coal-850 px-3 py-2 text-xs"
              />
              <input
                name="text"
                placeholder="Texte exact de l'avis *"
                required
                className="rounded-lg border border-coal-600 bg-coal-850 px-3 py-2 text-xs sm:col-span-3"
              />
              <button type="submit" className="btn-ghost min-h-9 px-4 py-1.5 text-xs">
                Publier l&apos;avis
              </button>
            </form>

            {reviews.length > 0 ? (
              <ul className="mt-4 space-y-2 text-xs">
                {reviews.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-coal-700 bg-coal-850 px-3 py-2"
                  >
                    <span>
                      <strong>{r.author}</strong> ({r.rating}/5 · {r.source}) : &ldquo;{r.text}&rdquo;
                    </span>
                    <form action={deleteReview}>
                      <input type="hidden" name="id" value={r.id} />
                      <button type="submit" className="text-ember-500 hover:underline">
                        Supprimer
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; status?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="container-x py-16 text-sm text-muted">
          Chargement du tableau de bord…
        </div>
      }
    >
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}
