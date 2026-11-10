// Limitation de débit pour le formulaire de contact.
// - Si UPSTASH_REDIS_REST_URL et UPSTASH_REDIS_REST_TOKEN sont définis : compteur partagé
//   dans Redis (fiable sur Vercel, toutes instances confondues).
// - Sinon : repli en mémoire (par instance serverless, protège quand même contre les rafales).

const memory = new Map<string, { count: number; resetAt: number }>()

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; remaining: number }> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (url && token) {
    try {
      const res = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify([
          ["INCR", key],
          ["EXPIRE", key, String(windowSeconds), "NX"],
        ]),
        cache: "no-store",
      })
      if (res.ok) {
        const [incr] = (await res.json()) as [{ result: number }]
        const count = Number(incr?.result ?? 0)
        return { allowed: count <= limit, remaining: Math.max(0, limit - count) }
      }
      console.error("Rate limit Upstash: statut", res.status)
    } catch (err) {
      console.error("Rate limit Upstash: erreur", err)
    }
    // En cas de panne Redis, on retombe sur le compteur en mémoire.
  }

  const now = Date.now()
  if (memory.size > 5000) {
    for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k)
  }
  const entry = memory.get(key)
  if (!entry || entry.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
    return { allowed: true, remaining: limit - 1 }
  }
  entry.count++
  return { allowed: entry.count <= limit, remaining: Math.max(0, limit - entry.count) }
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0].trim()
  return req.headers.get("x-real-ip") ?? "unknown"
}
