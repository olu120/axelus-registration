// src/app/thanks/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDefaultEvent } from "@/app/lib/event";
import ShareButtons from "./share-buttons";

function gcalDatesParam(start: Date, durationMin = 75) {
  const end = new Date(start.getTime() + durationMin * 60_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return `${fmt(start)}/${fmt(end)}`;
}

export default async function ThanksPage() {
  // Some Next.js setups want await here (TS/typing differences between versions)
  const cookieStore = await cookies();
  const ck = cookieStore.get("just_registered");
  if (!ck) redirect("/register");

  const event = await getDefaultEvent();

  const dateStr = event
    ? new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeZone: "Africa/Nairobi" }).format(event.date)
    : "";
  const timeStr = event
    ? new Intl.DateTimeFormat("en-GB", { timeStyle: "short", timeZone: "Africa/Nairobi" }).format(event.date)
    : "";

  // Safely build Google Calendar link only when we have an event
  const gcalUrl =
    event
      ? `https://calendar.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent(event.title)}` +
        `&dates=${gcalDatesParam(new Date(event.date))}` +
        `&details=${encodeURIComponent(event.description || "")}` +
        `&location=${encodeURIComponent(event.location || "Online")}`
      : null;

  return (
    <section className="min-h-[60vh] accent-bg p-4 md:py-10">
      <div className="max-w-2xl mx-auto space-y-4 card">
        <h1 className="text-2xl font-heading">You’re registered! 🎉</h1>

        {event && (
          <>
            <p>
              <strong>{event.title}</strong>
              <br />
              Date: {dateStr} • Time: {timeStr} EAT
              <br />
              Location: {event.location}
            </p>

            {event.link ? (
              <p>
                Join link:{" "}
                <a
                  href={event.link}
                  className="underline break-words text-primary"
                  target="_blank"
                >
                  {event.link}
                </a>
              </p>
            ) : (
              <p className="text-gray-600">
                We’ll email you the join link closer to the session.
              </p>
            )}
          </>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <a href="/event" className="button-primary !bg-gray-700">
            Back to Event Details
          </a>
          <ShareButtons />

          {/* ICS download */}
          <a
            href="/api/ics"
            className="button-primary !bg-amber-500"
            title="Add to Calendar"
          >
            Add to Calendar (.ics)
          </a>

          {/* Google Calendar */}
          {gcalUrl && (
            <a
              href={gcalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button-primary !bg-green-600"
              title="Add to Google Calendar"
            >
              Add to Google Calendar
            </a>
          )}
        </div>

        <p className="text-sm text-gray-500">
          Check your email for a confirmation. See you there!
        </p>
      </div>
    </section>
  );
}
