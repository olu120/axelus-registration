// src/lib/email.ts
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY || "");
export const EMAIL_FROM = process.env.EMAIL_FROM || "Axelus <no-reply@example.com>";

export function renderReceiptHTML(opts: {
  fullName: string;
  eventTitle: string;
  dateStr: string;
  timeStr: string;
}) {
  const { fullName, eventTitle, dateStr, timeStr } = opts;
  return `
    <div style="font-family:Inter,system-ui,sans-serif;line-height:1.6">
      <h2>You're registered! 🎉</h2>
      <p>Hi ${fullName},</p>
      <p>Thank you for signing up for <strong>${eventTitle}</strong>.</p>
      <p><strong>Date:</strong> ${dateStr}<br/><strong>Time:</strong> ${timeStr}</p>
      <p>We'll send you the workshop link & reminders via WhatsApp and Email.</p>
      <p>Don’t forget: comment <strong>“growth”</strong> on our IG posts to spread the word!</p>
      <p>— Team Axelus × Boratu Digital</p>
    </div>
  `;
}

// Add under your existing exports in src/lib/email.ts

export function renderReminderHTML(opts: {
  fullName: string;
  eventTitle: string;
  dateStr: string;
  timeStr: string;
  joinUrl?: string | null;
  type: "week-before" | "day-before" | "day-of";
}) {
  const { fullName, eventTitle, dateStr, timeStr, joinUrl, type } = opts;

  const intro =
    type === "week-before"
      ? "Just a quick heads-up — you're on the list for our workshop next week."
      : type === "day-before"
      ? "Your workshop is tomorrow — we can't wait to see you!"
      : "Today’s the day!";

  const cta =
    joinUrl
      ? `<p><a href="${joinUrl}" style="display:inline-block;padding:10px 16px;border-radius:10px;background:#008080;color:#fff;text-decoration:none;">Join the workshop</a></p>`
      : `<p>We’ll send you the join link shortly before the session.</p>`;

  return `
  <div style="font-family:Inter,system-ui,sans-serif;line-height:1.6">
    <p>Hi ${fullName},</p>
    <p>${intro}</p>
    <p><strong>${eventTitle}</strong><br/>
       <strong>Date:</strong> ${dateStr}<br/>
       <strong>Time:</strong> ${timeStr}</p>
    ${cta}
    <p>Tip: comment <strong>“growth”</strong> on our IG posts to spread the word!</p>
    <p>— Team Axelus × Boratu Digital</p>
  </div>`;
}

