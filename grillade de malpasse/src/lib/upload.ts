import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import sharp from "sharp";

const MAX_BYTES = 8 * 1024 * 1024; // 8 Mo max

export function getUploadDir() {
  return path.join(process.cwd(), "data", "uploads");
}

/**
 * Enregistre un fichier image envoyé depuis l'admin en le convertissant en WebP optimisé.
 * Retourne l'URL publique (ex. `/api/uploads/xxx.webp`) ou `""` si aucun fichier n'est fourni.
 */
export async function saveUploadedImage(file: File | null | undefined, maxWidth = 1400): Promise<string> {
  if (!file || typeof file === "string" || file.size === 0) return "";
  if (file.size > MAX_BYTES) {
    throw new Error("Fichier trop volumineux (maximum 8 Mo).");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Format non supporté (utilisez JPG, PNG, WebP ou AVIF).");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const webpBuffer = await sharp(buffer)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const dir = getUploadDir();
  await mkdir(dir, { recursive: true });

  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.webp`;
  await writeFile(path.join(dir, filename), webpBuffer);
  return `/api/uploads/${filename}`;
}
