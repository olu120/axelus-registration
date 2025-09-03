// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { registrationSchema } from "@/app/lib/validation";
import { resend, EMAIL_FROM, renderReceiptHTML } from "@/app/lib/email";

// Optional: ensure this route always runs dynamically (avoids edge cache issues)
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  console.log("[/api/register] hit");
  try {
    const body = await req.json();
    const data = registrationSchema.parse(body);

    // Make sure the default event exists (in case seed wasn't run)
    const event = await prisma.event.upsert({
      where: { id: "default-event" },
      update: {},
      create: {
        id: "default-event",
        title:
          "Clarity + Consistency: Simple Systems for Startup Growth & Social Media",
        description:
          "Join Axelus × Boratu Digital for a free 75-minute workshop. Simple systems + social media consistency + a 2-step plan.",
        // 14 Oct 2025, 8:00 PM EAT = 17:00 UTC
        date: new Date("2025-10-14T17:00:00.000Z"),
        location: "Online (link will be shared after registration)",
      },
    });

    // One response per email: upsert by email
    const reg = await prisma.registration.upsert({
      where: { email: data.email },
      update: {
        fullName: data.fullName,
        whatsapp: data.whatsapp,
        businessName: data.businessName || null,
        instagram: data.instagram || null,
        stage: data.stage,
        challenge: data.challenge,
        heardFrom: data.heardFrom,
        eventId: event.id,
      },
      create: {
        fullName: data.fullName,
        email: data.email,
        whatsapp: data.whatsapp,
        businessName: data.businessName || null,
        instagram: data.instagram || null,
        stage: data.stage,
        challenge: data.challenge,
        heardFrom: data.heardFrom,
        eventId: event.id,
      },
    });

    // Send a receipt only if a key is set (optional during dev)
    if (process.env.RESEND_API_KEY) {
      const dateStr = new Intl.DateTimeFormat("en-GB", {
        dateStyle: "full",
        timeZone: "Africa/Nairobi",
      }).format(event.date);
      const timeStr = new Intl.DateTimeFormat("en-GB", {
        timeStyle: "short",
        timeZone: "Africa/Nairobi",
      }).format(event.date);

      const html = renderReceiptHTML({
        fullName: reg.fullName,
        eventTitle: event.title,
        dateStr,
        timeStr,
      });

      await resend.emails.send({
        from: EMAIL_FROM,
        to: reg.email,
        subject: `You're in: ${event.title}`,
        html,
      });
    }

    return NextResponse.json({ ok: true, id: reg.id });
  } catch (err: any) {
    console.error("API error:", err);
    const message =
      err?.issues?.[0]?.message || err?.message || "Invalid request";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
