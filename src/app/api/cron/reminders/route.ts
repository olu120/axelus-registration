// src/app/api/cron/reminders/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { resend, EMAIL_FROM, renderReminderHTML } from "@/app/lib/email";

/**
 * Secure with Authorization: Bearer <CRON_SECRET>
 * Query param: ?type=week-before | day-before | day-of
 * Optional:   ?dry=1  → don't send emails, just return preview counts
 */
export async function GET(req: Request) {
  return handle(req);
}
export async function POST(req: Request) {
  return handle(req);
}

async function handle(req: Request) {
  // 1) Auth: Bearer token
  const auth = req.headers.get("authorization") || "";
  const expected = `Bearer ${process.env.CRON_SECRET || ""}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // 2) Parse type + dry-run flag
  const url = new URL(req.url);
  const type = (url.searchParams.get("type") || "").trim() as
    | "week-before" | "day-before" | "day-of";
  const dry = url.searchParams.get("dry") === "1";

  if (!type || !["week-before", "day-before", "day-of"].includes(type)) {
    return NextResponse.json({
      ok: false,
      error: "Missing or invalid 'type'. Use ?type=week-before|day-before|day-of",
    }, { status: 400 });
  }

  // 3) Fetch event + registrants
  const event = await prisma.event.upsert({
    where: { id: "default-event" },
    update: {},
    create: {
      id: "default-event",
      title: "Clarity + Consistency: Simple Systems for Startup Growth & Social Media",
      description:
        "Join Axelus × Boratu Digital for a free 75-minute workshop. Simple systems + social media consistency + a 2-step plan.",
      date: new Date("2025-10-14T17:00:00.000Z"), // 8:00 PM EAT
      location: "Online (link will be shared after registration)",
    },
  });

  const regs = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
  });

  // 4) Format date/time (EAT)
  const dateStr = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeZone: "Africa/Nairobi",
  }).format(event.date);

  const timeStr = new Intl.DateTimeFormat("en-GB", {
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  }).format(event.date);

  // 5) Compose subject line
  const subject =
    type === "week-before"
      ? `Heads-up: ${event.title} (next week)`
      : type === "day-before"
      ? `Reminder: ${event.title} (tomorrow)`
      : `Today: ${event.title}`;

  const joinUrl = event.link || null;

  // 6) Send (or dry-run)
  const results: { email: string; sent: boolean; error?: string }[] = [];

  // If no key, force dry-run to avoid throwing
  const canSend = !!process.env.RESEND_API_KEY && !dry;

  for (const r of regs) {
    try {
      if (canSend) {
        const html = renderReminderHTML({
          fullName: r.fullName,
          eventTitle: event.title,
          dateStr,
          timeStr,
          joinUrl,
          type,
        });

        await resend.emails.send({
          from: EMAIL_FROM,
          to: r.email,
          subject,
          html,
        });

        results.push({ email: r.email, sent: true });
      } else {
        results.push({ email: r.email, sent: false });
      }
    } catch (err: any) {
      results.push({ email: r.email, sent: false, error: err?.message || "send failed" });
    }
  }

  return NextResponse.json({
    ok: true,
    type,
    dryRun: !canSend,
    total: regs.length,
    attempted: results.length,
    sent: results.filter(x => x.sent).length,
    failed: results.filter(x => x.error).length,
    sample: results.slice(0, 5),
  });
}
