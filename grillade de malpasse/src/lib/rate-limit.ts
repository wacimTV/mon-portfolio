import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

/** IP du client, hachée (RGPD : on ne stocke jamais l'IP en clair). */
export async function clientKey(scope: string) {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const salt = process.env.SESSION_SECRET ?? "salt";
  return `${scope}:${createHash("sha256").update(`${ip}|${salt}`).digest("hex").slice(0, 32)}`;
}

/** Vrai si la limite est dépassée (max événements sur la fenêtre). */
export async function isRateLimited(key: string, max: number, windowMs: number) {
  const since = new Date(Date.now() - windowMs);
  const count = await prisma.rateEvent.count({ where: { key, createdAt: { gte: since } } });
  return count >= max;
}

export async function hitRate(key: string) {
  await prisma.rateEvent.create({ data: { key } });
  // Nettoyage opportuniste des entrées de plus de 24 h
  if (Math.random() < 0.05) {
    await prisma.rateEvent.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 86_400_000) } } });
  }
}

export async function clearRate(key: string) {
  await prisma.rateEvent.deleteMany({ where: { key } });
}

