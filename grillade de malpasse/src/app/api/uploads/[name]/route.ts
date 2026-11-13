import { readFile } from "node:fs/promises";
import path from "node:path";
import { getUploadDir } from "@/lib/upload";

export async function GET(
  _req: Request,
  context: { params: Promise<{ name: string }> },
) {
  const { name } = await context.params;
  if (!/^[a-zA-Z0-9._-]+\.(webp|jpg|jpeg|png|avif)$/i.test(name)) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(getUploadDir(), path.basename(name));
  try {
    const buf = await readFile(filePath);
    const ext = path.extname(name).toLowerCase();
    const mime =
      ext === ".webp"
        ? "image/webp"
        : ext === ".png"
          ? "image/png"
          : ext === ".avif"
            ? "image/avif"
            : "image/jpeg";

    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

