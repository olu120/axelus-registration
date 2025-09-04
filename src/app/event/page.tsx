export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getDefaultEvent } from "@/app/lib/event";

export default async function EventPage() {
  const event = await getDefaultEvent();

  const dateStr = event
    ? new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeZone: "Africa/Nairobi" }).format(event.date)
    : "";
  const timeStr = event
    ? new Intl.DateTimeFormat("en-GB", { timeStyle: "short", timeZone: "Africa/Nairobi" }).format(event.date)
    : "";

  return (
    <section className="min-h-[60vh] accent-bg p-4 md:py-10">
      <div className="max-w-3xl mx-auto card space-y-4">
        <h1 className="text-2xl font-heading">{event?.title ?? "Event"}</h1>
        {event && (
          <>
            <p className="text-gray-700">
              <strong>Date:</strong> {dateStr}<br />
              <strong>Time:</strong> {timeStr} EAT<br />
              <strong>Location:</strong> {event.location}
            </p>
            {event.description && (
              <p className="text-gray-700">{event.description}</p>
            )}
            {event.link && (
              <p>
                <a href={event.link} target="_blank" className="text-primary underline break-words">Join link</a>
              </p>
            )}
          </>
        )}

        <div className="pt-2">
          <a href="/register" className="button-primary">Register Free</a>
        </div>
      </div>
    </section>
  );
}