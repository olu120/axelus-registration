// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { registrationSchema } from "@/app/lib/validation";
import { sendEmail, renderReceiptHTML } from "@/app/lib/email";

export const dynamic = "force-dynamic";

function toMessage(err: unknown) {
  if (err && typeof err === "object" && "issues" in err) {
    // zod error style
    const z = err as { issues?: Array<{ message?: string }> };
    return z.issues?.[0]?.message ?? "Invalid request";
  }
  if (err instanceof Error) return err.message;
  return "Invalid request";
}

export async function POST(req: Request) {
  console.log("[/api/register] hit");
  try {
    const body = await req.json();
    const data = registrationSchema.parse(body);

    // Ensure default event exists
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

    // Upsert registration by email
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

    // Send confirmation email only if a key is configured (safe in build)
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

      await sendEmail({
        to: reg.email,
        subject: `You're in: ${event.title}`,
        html,
      });
    }

    return NextResponse.json({ ok: true, id: reg.id });
  } catch (err: unknown) {
    const message = toMessage(err);
    console.error("API error:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
