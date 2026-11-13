"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSiteData } from "@/lib/data";
import { formatDateFr, formatTime, fromMin, futureSlots, parisNow, pickupSlotsForToday, slotsForDate } from "@/lib/hours";
import { clientKey, hitRate, isRateLimited } from "@/lib/rate-limit";
import { mailLayout, restaurantEmail, sendMail } from "@/lib/mail";
import { formatPrice } from "@/lib/site";

export type FormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
};

const reservationSchema = z.object({
  name: z.string().trim().min(2, "Veuillez indiquer votre nom complet.").max(80),
  phone: z
    .string()
    .trim()
    .min(8, "Veuillez indiquer un numéro de téléphone valide.")
    .max(25)
    .regex(/^[0-9+\s().-]{8,25}$/, "Format de téléphone invalide."),
  email: z.string().trim().email("Adresse email invalide.").max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Heure invalide."),
  guests: z.coerce.number().int().min(1, "Minimum 1 personne."),
  message: z.string().trim().max(600, "Message trop long (600 caractères max).").optional().default(""),
  consent: z.literal("on", { message: "Vous devez accepter la politique de confidentialité." }),
  website: z.string().optional().default(""), // Honeypot
});

export async function submitReservation(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot anti-bot
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { ok: true, message: "Votre demande a bien été enregistrée." };
  }

  const key = await clientKey("reservation");
  if (await isRateLimited(key, 5, 15 * 60 * 1000)) {
    return {
      ok: false,
      message: "Trop de demandes envoyées récemment. Veuillez patienter quelques minutes ou nous appeler au 09 84 37 95 25.",
    };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    guests: String(formData.get("guests") ?? ""),
    message: String(formData.get("message") ?? ""),
    consent: formData.get("consent") ? "on" : "",
    website: String(formData.get("website") ?? ""),
  };

  const parsed = reservationSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
      if (!errors[k]) errors[k] = issue.message;
    }
    return { ok: false, message: "Veuillez vérifier les champs signalés.", errors };
  }

  const { name, phone, email, date, time, guests, message } = parsed.data;
  const { settings, hours, closures } = await getSiteData();

  if (guests > settings.maxGuestsOnline) {
    return {
      ok: false,
      errors: {
        guests: `Maximum ${settings.maxGuestsOnline} personnes en ligne. Pour un plus grand groupe, appelez-nous au ${settings.phone}.`,
      },
    };
  }

  const now = parisNow();
  if (date < now.ymd) {
    return { ok: false, errors: { date: "Impossible de réserver à une date passée." } };
  }

  const closureDates = closures.map((c) => c.date);
  const allSlots = slotsForDate(hours, closureDates, date);
  if (allSlots.length === 0) {
    return { ok: false, errors: { date: "Le restaurant est fermé à cette date." } };
  }

  const validSlots = futureSlots(allSlots, date);
  const validTimeStrings = validSlots.map((m) => fromMin(m));
  if (!validTimeStrings.includes(time)) {
    return {
      ok: false,
      errors: {
        time: "Ce créneau n'est pas ou plus disponible (créneaux entre 11h00 et 00h30, 30 min avant fermeture).",
      },
    };
  }

  // Vérification de la capacité maximale sur ce créneau (PENDING + CONFIRMED)
  const existing = await prisma.reservation.aggregate({
    where: { date, time, status: { in: ["PENDING", "CONFIRMED"] } },
    _sum: { guests: true },
  });
  const alreadyBooked = existing._sum.guests ?? 0;
  if (alreadyBooked + guests > settings.slotCapacity) {
    const remaining = Math.max(0, settings.slotCapacity - alreadyBooked);
    return {
      ok: false,
      errors: {
        time:
          remaining > 0
            ? `Il ne reste que ${remaining} place(s) sur ce créneau. Choisissez un autre horaire ou appelez-nous au ${settings.phone}.`
            : `Ce créneau est complet. Choisissez un autre horaire ou appelez-nous au ${settings.phone}.`,
      },
    };
  }

  await hitRate(key);

  const created = await prisma.reservation.create({
    data: {
      name,
      phone,
      email,
      date,
      time,
      guests,
      message,
      status: "PENDING",
    },
  });

  const dateLabel = formatDateFr(date);
  const timeLabel = formatTime(time);

  // Email client
  await sendMail({
    to: email,
    subject: `Votre demande de réservation — ${settings.name}`,
    text: `Bonjour ${name},\n\nNous avons bien reçu votre demande de réservation à ${settings.name} :\n- Date : ${dateLabel}\n- Heure : ${timeLabel}\n- Couverts : ${guests} personne(s)\n${message ? `- Message : ${message}\n` : ""}\nStatut : En attente de confirmation.\nPour toute modification urgente : ${settings.phone}.\n\n${settings.name} — ${settings.street}, ${settings.postalCode} ${settings.city}`,
    html: mailLayout(
      `Demande de réservation enregistrée`,
      [
        ["Nom", name],
        ["Date", dateLabel],
        ["Heure", timeLabel],
        ["Personnes", `${guests}`],
        ["Téléphone", phone],
        ...(message ? ([["Message", message]] as [string, string][]) : []),
        ["Statut", "En attente de confirmation"],
      ],
      `Bonjour ${name}, nous avons bien reçu votre demande de réservation chez ${settings.name}.`,
    ),
  });

  // Email restaurant
  const restMail = restaurantEmail() || settings.email;
  if (restMail) {
    await sendMail({
      to: restMail,
      replyTo: email,
      subject: `[Réservation #${created.id}] ${name} — ${guests} pers. le ${date} à ${timeLabel}`,
      text: `Nouvelle réservation #${created.id}\nNom : ${name}\nTél : ${phone}\nEmail : ${email}\nDate : ${dateLabel}\nHeure : ${timeLabel}\nPersonnes : ${guests}\nMessage : ${message || "—"}`,
      html: mailLayout(`Nouvelle réservation #${created.id}`, [
        ["Nom", name],
        ["Téléphone", phone],
        ["Email", email],
        ["Date", dateLabel],
        ["Heure", timeLabel],
        ["Personnes", `${guests}`],
        ["Message", message || "—"],
      ]),
    });
  }

  return {
    ok: true,
    message: `Merci ${name} ! Votre demande pour ${guests} personne(s) le ${dateLabel} à ${timeLabel} est bien enregistrée. Un email récapitulatif vous a été envoyé.`,
  };
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Veuillez indiquer votre nom.").max(80),
  email: z.string().trim().email("Adresse email invalide.").max(120),
  phone: z
    .string()
    .trim()
    .max(25)
    .refine((v) => v === "" || /^[0-9+\s().-]{8,25}$/.test(v), "Format de téléphone invalide.")
    .optional()
    .default(""),
  message: z.string().trim().min(10, "Votre message doit contenir au moins 10 caractères.").max(1500),
  consent: z.literal("on", { message: "Vous devez accepter la politique de confidentialité." }),
  website: z.string().optional().default(""),
});

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { ok: true, message: "Votre message a bien été envoyé." };
  }

  const key = await clientKey("contact");
  if (await isRateLimited(key, 4, 15 * 60 * 1000)) {
    return {
      ok: false,
      message: "Trop de messages envoyés récemment. Veuillez patienter quelques minutes ou nous appeler au 09 84 37 95 25.",
    };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    message: String(formData.get("message") ?? ""),
    consent: formData.get("consent") ? "on" : "",
    website: String(formData.get("website") ?? ""),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
      if (!errors[k]) errors[k] = issue.message;
    }
    return { ok: false, message: "Veuillez vérifier les champs signalés.", errors };
  }

  const { name, email, phone, message } = parsed.data;
  await hitRate(key);

  const created = await prisma.contactMessage.create({
    data: { name, email, phone, message },
  });

  const { settings } = await getSiteData();
  const restMail = restaurantEmail() || settings.email;
  if (restMail) {
    await sendMail({
      to: restMail,
      replyTo: email,
      subject: `[Contact #${created.id}] ${name}`,
      text: `Nouveau message de ${name}\nEmail : ${email}\nTél : ${phone || "—"}\n\n${message}`,
      html: mailLayout(`Nouveau message de contact #${created.id}`, [
        ["Nom", name],
        ["Email", email],
        ["Téléphone", phone || "—"],
        ["Message", message],
      ]),
    });
  }

  return {
    ok: true,
    message: `Merci ${name}, votre message a bien été envoyé ! Nous vous répondrons dans les meilleurs délais.`,
  };
}

const orderLineSchema = z.object({
  menuItemId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(30),
});

const orderSchema = z.object({
  name: z.string().trim().min(2, "Veuillez indiquer votre nom.").max(80),
  phone: z
    .string()
    .trim()
    .min(8, "Veuillez indiquer un numéro de téléphone valide.")
    .max(25)
    .regex(/^[0-9+\s().-]{8,25}$/, "Format de téléphone invalide."),
  email: z
    .string()
    .trim()
    .max(120)
    .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Adresse email invalide.")
    .optional()
    .default(""),
  slot: z.string().regex(/^\d{4}-\d{2}-\d{2}\|\d{2}:\d{2}$/, "Veuillez choisir un créneau de retrait."),
  note: z.string().trim().max(500, "Remarque trop longue (500 caractères max).").optional().default(""),
  itemsJson: z.string().min(2, "Votre panier est vide."),
  consent: z.literal("on", { message: "Vous devez accepter la politique de confidentialité." }),
  website: z.string().optional().default(""),
});

export type OrderFormState = FormState & { orderId?: number; pickupLabel?: string; totalCents?: number };

export async function submitOrder(_prev: OrderFormState, formData: FormData): Promise<OrderFormState> {
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { ok: true, message: "Votre commande a bien été enregistrée." };
  }

  const key = await clientKey("order");
  if (await isRateLimited(key, 5, 15 * 60 * 1000)) {
    return {
      ok: false,
      message: "Trop de commandes envoyées récemment. Veuillez patienter ou nous appeler au 09 84 37 95 25.",
    };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    slot: String(formData.get("slot") ?? ""),
    note: String(formData.get("note") ?? ""),
    itemsJson: String(formData.get("itemsJson") ?? ""),
    consent: formData.get("consent") ? "on" : "",
    website: String(formData.get("website") ?? ""),
  };

  const parsed = orderSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
      if (!errors[k]) errors[k] = issue.message;
    }
    return { ok: false, message: "Veuillez vérifier les champs signalés.", errors };
  }

  const { settings, hours, closures, categories } = await getSiteData();
  if (!settings.clickAndCollectEnabled) {
    return {
      ok: false,
      message: `La commande en ligne à emporter est momentanément indisponible. Appelez-nous au ${settings.phone}.`,
    };
  }

  let lines: { menuItemId: number; quantity: number }[] = [];
  try {
    lines = z.array(orderLineSchema).min(1).max(40).parse(JSON.parse(parsed.data.itemsJson));
  } catch {
    return { ok: false, message: "Votre panier est vide ou invalide." };
  }

  const [pickupDate, pickupTime] = parsed.data.slot.split("|");
  const validSlots = pickupSlotsForToday(
    hours,
    closures.map((c) => c.date),
  );
  const matchedSlot = validSlots.find((s) => s.serviceDate === pickupDate && s.time === pickupTime);
  if (!matchedSlot) {
    return {
      ok: false,
      errors: {
        slot: "Ce créneau de retrait n'est plus disponible (minimum 20 min de préparation). Veuillez en choisir un autre.",
      },
    };
  }

  const catalog = new Map(
    categories.flatMap((c) => c.items).map((it) => [it.id, it]),
  );

  const orderItems: { menuItemId: number; name: string; unitPriceCents: number; quantity: number }[] = [];
  let totalCents = 0;
  for (const line of lines) {
    const found = catalog.get(line.menuItemId);
    if (!found || !found.available) {
      return { ok: false, message: "Un des plats sélectionnés n'est plus disponible." };
    }
    orderItems.push({
      menuItemId: found.id,
      name: found.name,
      unitPriceCents: found.priceCents,
      quantity: line.quantity,
    });
    totalCents += found.priceCents * line.quantity;
  }

  await hitRate(key);

  const created = await prisma.order.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      pickupDate,
      pickupTime,
      note: parsed.data.note,
      totalCents,
      status: "NEW",
      items: {
        create: orderItems,
      },
    },
  });

  const summaryLines = orderItems
    .map((i) => `${i.quantity}x ${i.name} (${formatPrice(i.unitPriceCents * i.quantity)})`)
    .join("\n");

  const restMail = restaurantEmail() || settings.email;
  if (restMail) {
    await sendMail({
      to: restMail,
      replyTo: parsed.data.email || undefined,
      subject: `[Click & Collect #${created.id}] ${parsed.data.name} — Retrait ${formatTime(pickupTime)} (${formatPrice(totalCents)})`,
      text: `Nouvelle commande à emporter #${created.id}\nClient : ${parsed.data.name}\nTél : ${parsed.data.phone}\nRetrait : ${formatDateFr(pickupDate)} à ${formatTime(pickupTime)}\nTotal (paiement sur place) : ${formatPrice(totalCents)}\nRemarque : ${parsed.data.note || "—"}\n\nDétail :\n${summaryLines}`,
      html: mailLayout(`Nouvelle commande Click & Collect #${created.id}`, [
        ["Client", parsed.data.name],
        ["Téléphone", parsed.data.phone],
        ["Retrait", `${formatDateFr(pickupDate)} à ${formatTime(pickupTime)}`],
        ["Total (sur place)", formatPrice(totalCents)],
        ["Plats", summaryLines],
        ["Remarque", parsed.data.note || "—"],
      ]),
    });
  }

  if (parsed.data.email) {
    await sendMail({
      to: parsed.data.email,
      subject: `Votre commande à emporter #${created.id} — ${settings.name}`,
      text: `Bonjour ${parsed.data.name},\n\nVotre commande Click & Collect #${created.id} est bien enregistrée !\n- Retrait : ${formatDateFr(pickupDate)} à ${formatTime(pickupTime)}\n- Adresse : ${settings.street}, ${settings.postalCode} ${settings.city}\n- Total à régler sur place : ${formatPrice(totalCents)}\n\nDétail :\n${summaryLines}\n\nPour toute question : ${settings.phone}`,
      html: mailLayout(
        `Commande Click & Collect #${created.id} enregistrée`,
        [
          ["Retrait prévu", `${formatDateFr(pickupDate)} à ${formatTime(pickupTime)}`],
          ["Adresse", `${settings.street}, ${settings.postalCode} ${settings.city}`],
          ["Total (paiement sur place)", formatPrice(totalCents)],
          ["Détail", summaryLines],
        ],
        `Bonjour ${parsed.data.name}, nous préparons votre commande pour l'heure choisie.`,
      ),
    });
  }

  return {
    ok: true,
    orderId: created.id,
    pickupLabel: `${formatDateFr(pickupDate)} à ${formatTime(pickupTime)}`,
    totalCents,
    message: `Merci ${parsed.data.name} ! Votre commande #${created.id} (${formatPrice(totalCents)}, paiement sur place) est enregistrée pour un retrait à ${formatTime(pickupTime)}.`,
  };
}

