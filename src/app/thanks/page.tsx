// src/app/thanks/page.tsx
import { prisma } from "@/app/lib/prisma";

function formatInEAT(date: Date) {
  const dateStr = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeZone: "Africa/Nairobi",
  }).format(date);
  const timeStr = new Intl.DateTimeFormat("en-GB", {
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  }).format(date);
  return { dateStr, timeStr };
}

export default async function ThanksPage() {
  // fetch the default event (seeded or upserted by the API)
  const event =
    (await prisma.event.findUnique({ where: { id: "default-event" } })) ??
    null;

  const { dateStr, timeStr } = event
    ? formatInEAT(event.date)
    : { dateStr: "Tuesday, 14 October 2025", timeStr: "8:00 PM EAT" };

  return (
    <section className="min-h-[60vh] grid place-items-center bg-[color:var(--brand-accent)]/40 p-6">
      <article className="w-full max-w-2xl card">
        <h1 className="text-3xl text-center md:text-4xl font-heading text-primary">
          You’re registered! 🎉
        </h1>

        <div className="mt-4 space-y-3 text-center">
          <p>
            Thank you for signing up for{" "}
            <strong>
              {event?.title ??
                "Clarity + Consistency: Simple Systems for Startup Growth & Social Media"}
            </strong>
            .
          </p>

          <p>
            <strong>Date:</strong> {dateStr}
            <br />
            <strong>Time:</strong> {timeStr}
            <br />
            <strong>Location:</strong>{" "}
            {event?.location ?? "Online (link will be shared after registration)"}
          </p>

          <div className="rounded-xl p-4 bg-[color:var(--brand-accent)]/70">
            We’ll send you the workshop link + reminders via WhatsApp & Email.
          </div>

          <p className="text-xs italic text-gray-600">
            Don’t forget: comment “growth” on our IG posts to spread the word!
          </p>

          <p className="mt-1">— Team Axelus × Boratu Digital</p>
        </div>

        {/* CTA row */}
        <div className="flex flex-col items-center justify-center gap-3 mt-6 sm:flex-row">
          {/* secondary button (border style) */}
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-medium border border-gray-300 text-[color:var(--brand-black)] hover:bg-gray-50"
          >
            Share on Instagram
          </a>

          <a
            href="/event"
            className="button-primary"
          >
            Back to Event Details
          </a>
        </div>
      </article>
    </section>
  );
}
