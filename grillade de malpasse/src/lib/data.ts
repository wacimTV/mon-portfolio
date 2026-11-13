import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/db";
import { addDays, parisNow } from "@/lib/hours";

/** Tag unique : toute modification admin appelle updateTag(SITE_TAG) → mise à jour immédiate. */
export const SITE_TAG = "site";

export async function getSiteData() {
  "use cache";
  cacheLife("max");
  cacheTag(SITE_TAG);

  const [settings, hours, closures, categories, platforms, gallery, reviews, offers] = await Promise.all([
    prisma.setting.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
    prisma.openingHour.findMany({ orderBy: { dayOfWeek: "asc" } }),
    prisma.closure.findMany({ orderBy: { date: "asc" } }),
    prisma.category.findMany({
      orderBy: { sort: "asc" },
      include: { items: { where: { available: true }, orderBy: { sort: "asc" } } },
    }),
    prisma.deliveryPlatform.findMany({ where: { active: true }, orderBy: { sort: "asc" } }),
    prisma.galleryImage.findMany({ orderBy: [{ sort: "asc" }, { createdAt: "desc" }] }),
    prisma.review.findMany({ where: { visible: true }, orderBy: { createdAt: "desc" }, take: 12 }),
    prisma.offer.findMany({ where: { active: true }, orderBy: [{ sort: "asc" }, { createdAt: "desc" }] }),
  ]);

  return {
    settings,
    hours,
    // On garde un peu d'historique pour gérer le service de la veille après minuit
    closures: closures.map((c) => ({ date: c.date, reason: c.reason })),
    categories,
    platforms,
    gallery,
    reviews,
    offers,
    uberEats: platforms.find((p) => /uber/i.test(p.name)) ?? platforms[0] ?? null,
  };
}

export type SiteData = Awaited<ReturnType<typeof getSiteData>>;

/** Fermetures à venir (pour l'affichage), calculées au moment de l'appel. */
export function upcomingClosures(closures: SiteData["closures"]) {
  const today = parisNow().ymd;
  const limit = addDays(today, 60);
  return closures.filter((c) => c.date >= today && c.date <= limit);
}

