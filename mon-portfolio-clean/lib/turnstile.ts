// Vérification côté serveur du jeton Cloudflare Turnstile.
// Si TURNSTILE_SECRET_KEY n'est pas défini, la vérification est désactivée
// (permet de déployer avant d'avoir créé les clés).

export function turnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY)
}

export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false

  const form = new URLSearchParams({ secret, response: token })
  if (ip && ip !== "unknown") form.set("remoteip", ip)

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      cache: "no-store",
    })
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] }
    if (!data.success) console.warn("Turnstile refusé:", data["error-codes"])
    return Boolean(data.success)
  } catch (err) {
    console.error("Turnstile: erreur de vérification", err)
    return false
  }
}
