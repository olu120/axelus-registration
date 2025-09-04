// src/app/lib/email.ts
import { Resend } from "resend";

// ---- Config / helpers -------------------------------------------------------

export const EMAIL_FROM =
  process.env.EMAIL_FROM || "Axelus × Boratu <no-reply@axelusglobal.com>";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

/** Thin wrapper so routes can just call sendEmail(...) */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const client = getResend();
  if (!client) return; // no-op if key not set (dev/build-safe)
  await client.emails.send({
    from: EMAIL_FROM,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
}

const SITE = process.env.APP_BASE_URL || "https://events.axelusglobal.com";
const ICS_URL = `${SITE}/api/ics`;
const AXELUS_URL =
  process.env.NEXT_PUBLIC_AXELUS_URL || "https://instagram.com/axelusglobal";
const BORATU_URL =
  process.env.NEXT_PUBLIC_BORATU_URL || "https://instagram.com/boratudigital";

// ---- Brand tokens -----------------------------------------------------------

const BRAND = {
  primary: "#008080", // Axelus teal
  accent: "#EDBE2E", // Boratu gold
  ink: "#111827", // gray-900
  subtle: "#6B7280", // gray-500
  bg: "#F9FAFB", // gray-50
  card: "#FFFFFF", // white
  border: "#E5E7EB", // gray-200
};

// ---- Types ------------------------------------------------------------------

type ReceiptArgs = {
  fullName: string;
  eventTitle: string;
  dateStr: string;
  timeStr: string;
  joinUrl?: string | null;
};

type ReminderArgs = ReceiptArgs & {
  type: "week-before" | "day-before" | "day-of";
};

// ---- Templates --------------------------------------------------------------

export function renderReceiptHTML({
  fullName,
  eventTitle,
  dateStr,
  timeStr,
  joinUrl,
}: ReceiptArgs) {
  const joinBlock = joinUrl
    ? `
      <tr>
        <td style="padding: 0 24px 12px;">
          <a href="${joinUrl}" target="_blank"
             style="display:inline-block; background:${BRAND.primary}; color:#fff; text-decoration:none; padding:12px 20px; border-radius:12px; font-weight:600">
            Join the Workshop
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 24px; font-size:12px; color:${BRAND.subtle}">
          Having trouble? Copy & paste this link: <br />
          <span style="word-break:break-all">${escapeHtml(joinUrl)}</span>
        </td>
      </tr>`
    : `
      <tr>
        <td style="padding: 0 24px; font-size:14px; color:${BRAND.subtle}">
          Your join link will be shared via email/WhatsApp closer to the session.
        </td>
      </tr>`;

  // Add to Calendar button (ICS)
  const icsBlock = `
    <tr>
      <td style="padding: 0 24px 16px;">
        <a href="${ICS_URL}" target="_blank"
           style="display:inline-block; background:${BRAND.accent}; color:${BRAND.ink}; text-decoration:none; padding:12px 20px; border-radius:12px; font-weight:700">
          Add to Calendar (.ics)
        </a>
      </td>
    </tr>`;

  return `
  <!doctype html>
  <html>
  <head>
    <meta charSet="utf-8" />
    <meta name="color-scheme" content="light only" />
    <meta name="viewport" content="width=device-width" />
    <title>You're in: ${escapeHtml(eventTitle)}</title>
  </head>
  <body style="margin:0; padding:0; background:${BRAND.bg}; font-family:Inter, system-ui, -apple-system, Arial, sans-serif; color:${BRAND.ink}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg}; padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:${BRAND.card}; border:1px solid ${BRAND.border}; border-radius:16px; overflow:hidden">
            <!-- Header bar -->
            <tr>
              <td style="background:${BRAND.primary}; padding:16px 24px; color:#fff; font-weight:700; font-size:16px;">
                Axelus × <span style="color:${BRAND.accent}">Boratu</span>
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td style="padding:24px 24px 8px;">
                <div style="font-size:20px; font-weight:700;">You're registered, ${escapeHtml(fullName)} 🎉</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 12px; color:${BRAND.subtle}">
                Thanks for signing up for:
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 16px;">
                <div style="font-size:18px; font-weight:600;">${escapeHtml(eventTitle)}</div>
              </td>
            </tr>

            <!-- Details -->
            <tr>
              <td style="padding:0 24px 16px; color:${BRAND.ink};">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr><td style="padding:0 0 6px;"><strong>Date:</strong> ${escapeHtml(dateStr)}</td></tr>
                  <tr><td style="padding:0 0 6px;"><strong>Time:</strong> ${escapeHtml(timeStr)} EAT</td></tr>
                </table>
              </td>
            </tr>

            ${joinBlock}
            ${icsBlock}

            <!-- Divider -->
            <tr><td style="padding:16px 24px;">
              <div style="height:1px; background:${BRAND.border};"></div>
            </td></tr>

            <!-- Social nudge -->
            <tr>
              <td style="padding:0 24px 8px; color:${BRAND.subtle};">
                Help spread the word: comment “growth” on our Instagram posts!
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 24px;">
                <a href="${AXELUS_URL}" target="_blank"
                   style="display:inline-block; color:${BRAND.primary}; font-weight:600; text-decoration:none">
                  Follow Axelus on Instagram →
                </a>
                <span style="display:inline-block; width:12px;"></span>
                <a href="${BORATU_URL}" target="_blank"
                   style="display:inline-block; color:${BRAND.primary}; font-weight:600; text-decoration:none">
                  Follow Boratu on Instagram →
                </a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:${BRAND.bg}; padding:16px 24px; color:${BRAND.subtle}; font-size:12px;">
                © ${new Date().getFullYear()} Axelus × Boratu · You’re receiving this because you registered for our workshop.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

export function renderReminderHTML({
  fullName,
  eventTitle,
  dateStr,
  timeStr,
  joinUrl,
  type,
}: ReminderArgs) {
  const headline =
    type === "week-before"
      ? "Heads-up for next week"
      : type === "day-before"
      ? "Reminder for tomorrow"
      : "Today’s the day!";

  const joinBlock = joinUrl
    ? `
      <tr>
        <td style="padding: 0 24px 12px;">
          <a href="${joinUrl}" target="_blank"
             style="display:inline-block; background:${BRAND.primary}; color:#fff; text-decoration:none; padding:12px 20px; border-radius:12px; font-weight:600">
            Join the Workshop
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 24px; font-size:12px; color:${BRAND.subtle}">
          Having trouble? Copy & paste this link: <br />
          <span style="word-break:break-all">${escapeHtml(joinUrl)}</span>
        </td>
      </tr>`
    : `
      <tr>
        <td style="padding: 0 24px; font-size:14px; color:${BRAND.subtle}">
          Your join link will be sent before the session.
        </td>
      </tr>`;

  const icsBlock = `
    <tr>
      <td style="padding: 0 24px 16px;">
        <a href="${ICS_URL}" target="_blank"
           style="display:inline-block; background:${BRAND.accent}; color:${BRAND.ink}; text-decoration:none; padding:12px 20px; border-radius:12px; font-weight:700">
          Add to Calendar (.ics)
        </a>
      </td>
    </tr>`;

  return `
  <!doctype html>
  <html>
  <head>
    <meta charSet="utf-8" />
    <meta name="color-scheme" content="light only" />
    <meta name="viewport" content="width=device-width" />
    <title>${escapeHtml(headline)}: ${escapeHtml(eventTitle)}</title>
  </head>
  <body style="margin:0; padding:0; background:${BRAND.bg}; font-family:Inter, system-ui, -apple-system, Arial, sans-serif; color:${BRAND.ink}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg}; padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:${BRAND.card}; border:1px solid ${BRAND.border}; border-radius:16px; overflow:hidden">
            <tr>
              <td style="background:${BRAND.primary}; padding:16px 24px; color:#fff; font-weight:700; font-size:16px;">
                ${escapeHtml(headline)}
              </td>
            </tr>

            <tr>
              <td style="padding:20px 24px 8px;">
                <div style="font-size:18px; font-weight:700;">${escapeHtml(eventTitle)}</div>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 16px; color:${BRAND.ink};">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr><td style="padding:0 0 6px;"><strong>Date:</strong> ${escapeHtml(dateStr)}</td></tr>
                  <tr><td style="padding:0 0 6px;"><strong>Time:</strong> ${escapeHtml(timeStr)} EAT</td></tr>
                </table>
              </td>
            </tr>

            ${joinBlock}
            ${icsBlock}

            <tr><td style="padding:16px 24px;">
              <div style="height:1px; background:${BRAND.border};"></div>
            </td></tr>

            <tr>
              <td style="padding:0 24px 16px; color:${BRAND.subtle}">
                We’ll see you soon. Questions? Reply to this email.
              </td>
            </tr>

            <tr>
              <td style="background:${BRAND.bg}; padding:16px 24px; color:${BRAND.subtle}; font-size:12px;">
                © ${new Date().getFullYear()} Axelus × Boratu
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

// ---- Utils ------------------------------------------------------------------

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}