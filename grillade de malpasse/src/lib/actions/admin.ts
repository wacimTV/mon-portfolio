"use server";

import bcrypt from "bcryptjs";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { SITE_TAG } from "@/lib/data";
import {
  clearSessionCookie,
  createSessionToken,
  requireAdmin,
  setSessionCookie,
} from "@/lib/auth";
import { clearRate, clientKey, hitRate, isRateLimited } from "@/lib/rate-limit";
import { saveUploadedImage } from "@/lib/upload";
import { formatDateFr, formatTime } from "@/lib/hours";
import { mailLayout, sendMail } from "@/lib/mail";

function invalidateSite() {
  updateTag(SITE_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `cat-${Date.now()}`;
}

export type LoginState = { error?: string };

export async function loginAdmin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const key = await clientKey("admin-login");
  if (await isRateLimited(key, 5, 15 * 60 * 1000)) {
    return { error: "Trop de tentatives de connexion. Réessayez dans 15 minutes." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const expectedEmail = process.env.ADMIN_EMAIL ?? "";
  const hashB64 = process.env.ADMIN_PASSWORD_HASH_B64 ?? "";
  const hash = hashB64 ? Buffer.from(hashB64, "base64").toString("utf8") : "";

  if (!expectedEmail || !hash) {
    return {
      error: "Compte administrateur non configuré (vérifiez ADMIN_EMAIL et ADMIN_PASSWORD_HASH_B64 dans .env).",
    };
  }

  const emailOk = email.toLowerCase() === expectedEmail.toLowerCase();
  const passOk = emailOk ? await bcrypt.compare(password, hash) : false;

  if (!emailOk || !passOk) {
    await hitRate(key);
    return { error: "Identifiants incorrects." };
  }

  await clearRate(key);
  const token = await createSessionToken(expectedEmail);
  await setSessionCookie(token);
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearSessionCookie();
  redirect("/admin/login");
}

/* ── Réservations ────────────────────────────────────────────── */
export async function updateReservationStatus(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!id || !["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) return;

  const updated = await prisma.reservation.update({
    where: { id },
    data: { status },
  });

  if (status === "CONFIRMED" || status === "CANCELLED") {
    const settings = await prisma.setting.findFirst();
    const restName = settings?.name ?? "La Grillade de Malpa";
    const subject =
      status === "CONFIRMED"
        ? `Réservation confirmée — ${restName}`
        : `Mise à jour de votre réservation — ${restName}`;
    const statusLabel = status === "CONFIRMED" ? "Confirmée ✅" : "Annulée";
    await sendMail({
      to: updated.email,
      subject,
      text: `Bonjour ${updated.name},\n\nLe statut de votre réservation du ${formatDateFr(updated.date)} à ${formatTime(updated.time)} (${updated.guests} pers.) est désormais : ${statusLabel}.\n\nÀ très vite chez ${restName} !`,
      html: mailLayout(
        subject,
        [
          ["Date", formatDateFr(updated.date)],
          ["Heure", formatTime(updated.time)],
          ["Personnes", `${updated.guests}`],
          ["Statut", statusLabel],
        ],
        `Bonjour ${updated.name}, voici une mise à jour concernant votre réservation.`,
      ),
    });
  }

  revalidatePath("/admin");
}

export async function deleteReservation(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.reservation.delete({ where: { id } });
  revalidatePath("/admin");
}

/* ── Messages de contact ─────────────────────────────────────── */
export async function toggleMessageRead(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const read = formData.get("read") === "true";
  if (!id) return;
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin");
}

export async function deleteContactMessage(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin");
}

/* ── Carte : catégories & plats ──────────────────────────────── */
export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sort = Number(formData.get("sort") ?? 0);
  if (!name) return;

  await prisma.category.create({
    data: { name, slug: slugify(name), description, sort },
  });
  invalidateSite();
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sort = Number(formData.get("sort") ?? 0);
  if (!id || !name) return;

  await prisma.category.update({
    where: { id },
    data: { name, slug: slugify(name), description, sort },
  });
  invalidateSite();
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.category.delete({ where: { id } });
  invalidateSite();
}

export async function createMenuItem(formData: FormData) {
  await requireAdmin();
  const categoryId = Number(formData.get("categoryId"));
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceEuros = Number(String(formData.get("price") ?? "0").replace(",", "."));
  const promoLabel = String(formData.get("promoLabel") ?? "").trim();
  const meatOrigin = String(formData.get("meatOrigin") ?? "").trim();
  const allergens = formData
    .getAll("allergens")
    .map((v) => String(v).trim())
    .filter(Boolean)
    .join(",");
  const featured = formData.get("featured") === "on";
  const available = formData.get("available") !== "off";
  const sort = Number(formData.get("sort") ?? 0);
  const file = formData.get("imageFile") as File | null;

  if (!categoryId || !name || Number.isNaN(priceEuros)) return;
  const uploaded = await saveUploadedImage(file, 900);

  await prisma.menuItem.create({
    data: {
      categoryId,
      name,
      description,
      priceCents: Math.round(priceEuros * 100),
      image: uploaded,
      promoLabel,
      meatOrigin,
      allergens,
      featured,
      available,
      sort,
    },
  });
  invalidateSite();
}

export async function updateMenuItem(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const categoryId = Number(formData.get("categoryId"));
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceEuros = Number(String(formData.get("price") ?? "0").replace(",", "."));
  const promoLabel = String(formData.get("promoLabel") ?? "").trim();
  const meatOrigin = String(formData.get("meatOrigin") ?? "").trim();
  const allergens = formData
    .getAll("allergens")
    .map((v) => String(v).trim())
    .filter(Boolean)
    .join(",");
  const featured = formData.get("featured") === "on";
  const available = formData.get("available") === "on";
  const sort = Number(formData.get("sort") ?? 0);
  const clearImage = formData.get("clearImage") === "on";
  const file = formData.get("imageFile") as File | null;

  if (!id || !categoryId || !name || Number.isNaN(priceEuros)) return;
  const uploaded = await saveUploadedImage(file, 900);

  await prisma.menuItem.update({
    where: { id },
    data: {
      categoryId,
      name,
      description,
      priceCents: Math.round(priceEuros * 100),
      promoLabel,
      meatOrigin,
      allergens,
      featured,
      available,
      sort,
      ...(clearImage ? { image: "" } : uploaded ? { image: uploaded } : {}),
    },
  });
  invalidateSite();
}

export async function deleteMenuItem(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.menuItem.delete({ where: { id } });
  invalidateSite();
}

/* ── Horaires, fermetures & capacité ─────────────────────────── */
export async function updateHoursAndCapacity(formData: FormData) {
  await requireAdmin();
  const slotCapacity = Math.max(1, Number(formData.get("slotCapacity") ?? 20));
  const maxGuestsOnline = Math.max(1, Number(formData.get("maxGuestsOnline") ?? 20));

  await prisma.setting.update({
    where: { id: 1 },
    data: { slotCapacity, maxGuestsOnline },
  });

  for (let d = 0; d < 7; d++) {
    const openTime = String(formData.get(`open_${d}`) ?? "11:00");
    const closeTime = String(formData.get(`close_${d}`) ?? "01:00");
    const closed = formData.get(`closed_${d}`) === "on";
    await prisma.openingHour.upsert({
      where: { dayOfWeek: d },
      update: { openTime, closeTime, closed },
      create: { dayOfWeek: d, openTime, closeTime, closed },
    });
  }
  invalidateSite();
}

export async function addClosure(formData: FormData) {
  await requireAdmin();
  const date = String(formData.get("date") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
  await prisma.closure.upsert({
    where: { date },
    update: { reason },
    create: { date, reason },
  });
  invalidateSite();
}

export async function deleteClosure(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.closure.delete({ where: { id } });
  invalidateSite();
}

/* ── Plateformes de livraison ────────────────────────────────── */
export async function saveDeliveryPlatform(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id") ?? 0);
  const name = String(formData.get("name") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const active = formData.get("active") === "on";
  const sort = Number(formData.get("sort") ?? 0);
  if (!name || !url) return;

  if (id > 0) {
    await prisma.deliveryPlatform.update({
      where: { id },
      data: { name, url, active, sort },
    });
  } else {
    await prisma.deliveryPlatform.create({
      data: { name, url, active: true, sort },
    });
  }
  invalidateSite();
}

export async function deleteDeliveryPlatform(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.deliveryPlatform.delete({ where: { id } });
  invalidateSite();
}

/* ── Réglages généraux & réseaux sociaux ─────────────────────── */
export async function updateSettings(formData: FormData) {
  await requireAdmin();
  const heroFile = formData.get("heroImageFile") as File | null;
  const storyFile = formData.get("storyImageFile") as File | null;
  const clearHero = formData.get("clearHeroImage") === "on";
  const clearStory = formData.get("clearStoryImage") === "on";

  const heroUploaded = await saveUploadedImage(heroFile, 1400);
  const storyUploaded = await saveUploadedImage(storyFile, 1200);

  await prisma.setting.update({
    where: { id: 1 },
    data: {
      name: String(formData.get("name") ?? "La Grillade de Malpa").trim(),
      phone: String(formData.get("phone") ?? "09 84 37 95 25").trim(),
      whatsapp: String(formData.get("whatsapp") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      street: String(formData.get("street") ?? "1 Avenue de Valdonne").trim(),
      postalCode: String(formData.get("postalCode") ?? "13013").trim(),
      city: String(formData.get("city") ?? "Marseille").trim(),
      latitude: Number(formData.get("latitude") ?? 43.3318),
      longitude: Number(formData.get("longitude") ?? 5.4135),
      uberRating: Number(String(formData.get("uberRating") ?? "4.4").replace(",", ".")),
      uberReviewCount: String(formData.get("uberReviewCount") ?? "300+").trim(),
      deliveryZones: String(formData.get("deliveryZones") ?? "").trim(),
      announcement: String(formData.get("announcement") ?? "").trim(),
      parkingInfo: String(formData.get("parkingInfo") ?? "").trim(),
      transportInfo: String(formData.get("transportInfo") ?? "").trim(),
      meatOriginNote: String(formData.get("meatOriginNote") ?? "").trim(),
      clickAndCollectEnabled: formData.get("clickAndCollectEnabled") === "on",
      googleMapsUrl: String(formData.get("googleMapsUrl") ?? "").trim(),
      googleReviewUrl: String(formData.get("googleReviewUrl") ?? "").trim(),
      tiktok: String(formData.get("tiktok") ?? "").trim(),
      instagram: String(formData.get("instagram") ?? "").trim(),
      facebook: String(formData.get("facebook") ?? "").trim(),
      snapchat: String(formData.get("snapchat") ?? "").trim(),
      ...(clearHero ? { heroImage: "" } : heroUploaded ? { heroImage: heroUploaded } : {}),
      ...(clearStory ? { storyImage: "" } : storyUploaded ? { storyImage: storyUploaded } : {}),
    },
  });
  invalidateSite();
}

/* ── Galerie photos ──────────────────────────────────────────── */
export async function addGalleryImage(formData: FormData) {
  await requireAdmin();
  const alt = String(formData.get("alt") ?? "").trim();
  const sort = Number(formData.get("sort") ?? 0);
  const file = formData.get("file") as File | null;
  if (!alt || !file || file.size === 0) return;

  const src = await saveUploadedImage(file, 1400);
  if (!src) return;

  await prisma.galleryImage.create({ data: { src, alt, sort } });
  invalidateSite();
}

export async function deleteGalleryImage(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.galleryImage.delete({ where: { id } });
  invalidateSite();
}

/* ── Avis clients vérifiés ───────────────────────────────────── */
export async function addReview(formData: FormData) {
  await requireAdmin();
  const author = String(formData.get("author") ?? "").trim();
  const rating = Math.max(1, Math.min(5, Number(formData.get("rating") ?? 5)));
  const text = String(formData.get("text") ?? "").trim();
  const source = String(formData.get("source") ?? "Google").trim();
  const date = String(formData.get("date") ?? "").trim();
  if (!author || !text) return;

  await prisma.review.create({
    data: { author, rating, text, source, date, visible: true },
  });
  invalidateSite();
}

export async function deleteReview(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.review.delete({ where: { id } });
  invalidateSite();
}

/* ── Formules & promotions (Offer) ───────────────────────────── */
export async function saveOffer(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id") ?? 0);
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const badge = String(formData.get("badge") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim().replace(",", ".");
  const priceCents =
    priceRaw === "" || Number.isNaN(Number(priceRaw))
      ? null
      : Math.round(Number(priceRaw) * 100);
  const active = id > 0 ? formData.get("active") === "on" : true;
  const sort = Number(formData.get("sort") ?? 0);

  if (!title) return;

  if (id > 0) {
    await prisma.offer.update({
      where: { id },
      data: { title, description, badge, priceCents, active, sort },
    });
  } else {
    await prisma.offer.create({
      data: { title, description, badge, priceCents, active: true, sort },
    });
  }
  invalidateSite();
}

export async function deleteOffer(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.offer.delete({ where: { id } });
  invalidateSite();
}

/* ── Commandes Click & Collect (Order) ───────────────────────── */
export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  if (!id || !["NEW", "PREPARING", "READY", "COMPLETED", "CANCELLED"].includes(status)) return;

  await prisma.order.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin");
}

export async function deleteOrder(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin");
}

