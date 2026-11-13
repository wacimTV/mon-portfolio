import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

type Mail = { to: string; subject: string; text: string; html?: string; replyTo?: string };

let transporter: Transporter | null = null;

function getTransporter() {
  if (!process.env.SMTP_HOST) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
  }
  return transporter;
}

/** Envoie un email. Sans SMTP configuré, l'email est affiché dans la console (dev). Ne lève jamais d'erreur. */
export async function sendMail(mail: Mail): Promise<boolean> {
  if (!mail.to) return false;
  const t = getTransporter();
  if (!t) {
    console.info(`\n[email simulé] À: ${mail.to}\nSujet: ${mail.subject}\n${mail.text}\n`);
    return true;
  }
  try {
    await t.sendMail({
      from: process.env.MAIL_FROM ?? "La Grillade de Malpa <no-reply@localhost>",
      ...mail,
    });
    return true;
  } catch (e) {
    console.error("Erreur d'envoi d'email :", e);
    return false;
  }
}

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Gabarit HTML simple et lisible pour tous les clients mail. */
export function mailLayout(title: string, rows: [string, string][], intro = "") {
  const body = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0;font-weight:600">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1a1a1a">
<h1 style="font-size:20px;color:#b4380f">${escapeHtml(title)}</h1>
${intro ? `<p>${escapeHtml(intro)}</p>` : ""}
<table style="border-collapse:collapse">${body}</table>
<p style="margin-top:24px;color:#666;font-size:13px">La Grillade de Malpa · 1 Avenue de Valdonne, 13013 Marseille · 09 84 37 95 25</p>
</div>`;
}

export const restaurantEmail = () => process.env.RESTAURANT_EMAIL ?? "";

