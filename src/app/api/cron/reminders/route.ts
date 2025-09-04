// src/app/api/cron/reminders/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { sendEmail, renderReminderHTML } from "@/app/lib/email";

type ReminderType = "week-before" | "day-before" | "day-of" | "auto";

function msg(err: unknown) {
  return err instanceof Error ? err.message : "send failed";
}

function startOfDayInTZ(date: Date, timeZone: string) {
  // Convert to the given TZ and zero out time
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [day, month, year] = fmt.formatToParts(date).reduce<string[]>((acc, p) => {
    if (p.type === "day") acc[0] = p.value;
    else if (p.type === "month") acc[1] = p.value;
    else if (p.type === "year") acc[2] = p.value;
    return acc;
  }, ["", "", ""]);
  return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
}

function diffDaysInTZ(a: Date, b: Date, timeZone: string) {
  const A = startOfDayInTZ(a, timeZone).getTime();
  const B = startOfDayInTZ(b, timeZone).getTime();
  const diffMs = (B - A);
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export async function GET(req: Request) {
  return handle(req);
}
export async function POST(req: Request) {
  return handle(req);
}

async function handle(req: Request) {
  // Auth via Bearer <CRON_SECRET>
  const auth = req.headers.get("authorization") || "";
  const expected = `Bearer ${process.env.CRON_SECRET || ""}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const typeParam = (url.searchParams.get("type") || "auto").trim() as ReminderType;
  const dry = url.searchParams.get("dry") === "1";

  const event = await prisma.event.upsert({
    where: { id: "default-event" },
    update: {},
    create: {
      id: "default-event",
      title:
        "Clarity + Consistency: Simple Systems for Startup Growth & Social Media",
      description:
        "Join Axelus × Boratu Digital for a free 75-minute workshop. Simple systems + social media consistency + a 2-step plan.",
      date: new Date("2025-10-14T17:00:00.000Z"), // 8:00 PM EAT
      location: "Online (link will be shared after registration)",
    },
  });

  // Resolve type automatically based on EAT day difference
  let resolvedType: Exclude<ReminderType, "auto"> | null = null;
  if (typeParam === "auto") {
    const now = new Date();
    const days = diffDaysInTZ(now, event.date, "Africa/Nairobi");
    if (days === 7) resolvedType = "week-before";
    else if (days === 1) resolvedType = "day-before";
    else if (days === 0) resolvedType = "day-of";
    else resolvedType = null; // not a send day
  } else {
    resolvedType = typeParam as Exclude<ReminderType, "auto">;
  }

  if (!resolvedType) {
    return NextResponse.json({
      ok: true,
      type: "auto",
      skipped: true,
      reason: "Not a scheduled reminder day",
    });
  }

  // Fetch registrants
  const regs = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Format event time in EAT
  const dateStr = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeZone: "Africa/Nairobi",
  }).format(event.date);
  const timeStr = new Intl.DateTimeFormat("en-GB", {
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  }).format(event.date);

  // Subject per reminder type
  const subject =
    resolvedType === "week-before"
      ? `Heads-up: ${event.title} (next week)`
      : resolvedType === "day-before"
      ? `Reminder: ${event.title} (tomorrow)`
      : `Today: ${event.title}`;

  const joinUrl = event.link || null;

  // Decide whether to actually send
  const canSend = !!process.env.RESEND_API_KEY && !dry;

  const results: Array<{ email: string; sent: boolean; error?: string }> = [];

  for (const r of regs) {
    try {
      if (canSend) {
        const html = renderReminderHTML({
          fullName: r.fullName,
          eventTitle: event.title,
          dateStr,
          timeStr,
          joinUrl,
          type: resolvedType,
        });

        await sendEmail({
          to: r.email,
          subject,
          html,
        });

        results.push({ email: r.email, sent: true });
      } else {
        results.push({ email: r.email, sent: false });
      }
    } catch (e: unknown) {
      results.push({ email: r.email, sent: false, error: msg(e) });
    }
  }

  return NextResponse.json({
    ok: true,
    type: resolvedType,
    dryRun: !canSend,
    total: regs.length,
    attempted: results.length,
    sent: results.filter((x) => x.sent).length,
    failed: results.filter((x) => x.error).length,
    sample: results.slice(0, 5),
  });
}
