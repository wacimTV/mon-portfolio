import { NextResponse } from "next/server"
import { Resend } from "resend"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import { verifyTurnstile } from "@/lib/turnstile"
import { isBudget, isProjectType } from "@/lib/contact-options"

// 10 envois max par heure et par IP
const RATE_LIMIT = 10
const RATE_WINDOW_SECONDS = 60 * 60
// Un humain met plus de 3 secondes à remplir le formulaire
const MIN_FILL_TIME_MS = 3000

const MAX_LENGTHS = { name: 100, email: 254, subject: 200, message: 5000 }
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/

const escapeHtml = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

export async function POST(req: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Configuration email manquante." }, { status: 500 })
    }
    const body = await req.json()

    // 1. Honeypot : champ invisible pour les humains. S'il est rempli (ou si le formulaire
    //    est envoyé trop vite), c'est un robot. On renvoie un faux succès pour ne pas
    //    lui indiquer qu'il a été détecté.
    const filledTooFast =
      typeof body.startedAt === "number" && Date.now() - body.startedAt < MIN_FILL_TIME_MS
    if ((typeof body.website === "string" && body.website.trim() !== "") || filledTooFast) {
      return NextResponse.json({ success: true })
    }

    // 2. Limitation de débit par IP
    const ip = getClientIp(req)
    const { allowed } = await rateLimit(`contact:${ip}`, RATE_LIMIT, RATE_WINDOW_SECONDS)
    if (!allowed) {
      return NextResponse.json(
        { error: "Trop de messages envoyés. Merci de réessayer dans une heure ou de me contacter par téléphone." },
        { status: 429, headers: { "Retry-After": String(RATE_WINDOW_SECONDS) } },
      )
    }

    // 3. Cloudflare Turnstile (actif seulement si TURNSTILE_SECRET_KEY est défini)
    const captchaOk = await verifyTurnstile(String(body.turnstileToken ?? ""), ip)
    if (!captchaOk) {
      return NextResponse.json(
        { error: "La vérification anti-robot a échoué. Merci de réessayer." },
        { status: 400 },
      )
    }

    const { subject: rawSubject, message: rawMessage } = body
    const name = escapeHtml(body.name ?? "")
    const email = escapeHtml(body.email ?? "")
    const subject = escapeHtml(rawSubject ?? "")
    const message = escapeHtml(rawMessage ?? "")

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 })
    }

    if (
      String(body.name).length > MAX_LENGTHS.name ||
      String(body.email).length > MAX_LENGTHS.email ||
      String(rawSubject).length > MAX_LENGTHS.subject ||
      String(rawMessage).length > MAX_LENGTHS.message
    ) {
      return NextResponse.json({ error: "Un des champs est trop long." }, { status: 400 })
    }

    if (!EMAIL_RE.test(String(body.email))) {
      return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 })
    }

    // Menus déroulants : seules les valeurs de la liste autorisée sont acceptées
    if (!isProjectType(body.projectType)) {
      return NextResponse.json({ error: "Type de projet invalide." }, { status: 400 })
    }
    const rawBudget = body.budget ?? ""
    if (rawBudget !== "" && !isBudget(rawBudget)) {
      return NextResponse.json({ error: "Budget invalide." }, { status: 400 })
    }
    const projectType = escapeHtml(body.projectType)
    const budget = rawBudget === "" ? "Non précisé" : escapeHtml(rawBudget)

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["w.ammouche13@gmail.com"],
      subject: `[Portfolio] ${String(rawSubject).replace(/[\r\n]+/g, " ")}`,
      replyTo: String(body.email),
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px;">
          <h2 style="color: #111827; margin-bottom: 24px;">Nouveau message de ton portfolio</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 600; width: 100px;">Nom</td>
              <td style="padding: 8px 0; color: #111827;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Email</td>
              <td style="padding: 8px 0; color: #111827;">
                <a href="mailto:${email}" style="color: #6366f1;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Sujet</td>
              <td style="padding: 8px 0; color: #111827;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Projet</td>
              <td style="padding: 8px 0; color: #111827;">${projectType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Budget</td>
              <td style="padding: 8px 0; color: #111827;">${budget}</td>
            </tr>
          </table>
          
          <div style="margin-top: 24px; padding: 16px; background: #fff; border-radius: 8px; border: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-weight: 600; margin: 0 0 8px;">Message</p>
            <p style="color: #111827; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="margin-top: 24px; color: #9ca3af; font-size: 12px;">
            Répondre directement à cet email pour contacter ${name}.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "Échec de l'envoi du mail." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Contact API error:", err)
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 })
  }
}
