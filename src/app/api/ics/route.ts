// src/app/api/ics/route.ts
import { prisma } from "@/app/lib/prisma";

function toICSDate(d: Date) {
  // Format: YYYYMMDDTHHMMSSZ (UTC)
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = d.getUTCFullYear();
  const m = pad(d.getUTCMonth() + 1);
  const day = pad(d.getUTCDate());
  const hh = pad(d.getUTCHours());
  const mm = pad(d.getUTCMinutes());
  const ss = pad(d.getUTCSeconds());
  return `${y}${m}${day}T${hh}${mm}${ss}Z`;
}

export async function GET() {
  const event = await prisma.event.findUnique({ where: { id: "default-event" } });
  if (!event) {
    return new Response("No event", { status: 404 });
  }

  const start = new Date(event.date);
  const end = new Date(start.getTime() + 75 * 60 * 1000); // 75 minutes
  const uid = `axelus-${start.getTime()}@axelusglobal.com`;

  const site = process.env.APP_BASE_URL || "https://events.axelusglobal.com";
  const join = event.link ?? site + "/event";

  // Basic ICS (UTC times for maximum compatibility)
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Axelus x Boratu//Workshop//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    'UID:${uid}',
    'DTSTAMP:${toICSDate(new Date())}',
    'DTSTART:${toICSDate(start)}',
    'DTEND:${toICSDate(end)}',
    'SUMMARY:${escapeICS(event.title)}',
    `DESCRIPTION:${escapeICS((event.description || "") + (join ? '\\nJoin: ${join}' : ""))}`,
    'LOCATION:${escapeICS(event.location || "Online")}',
    'URL:${escapeICS(join)}',
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": 'attachment; filename="axelus-workshop.ics"',
      "cache-control": "no-store",
    },
  });
}

function escapeICS(v: string) {
  // Escape commas, semicolons, and newlines as per RFC5545
  return v
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}