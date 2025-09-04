// src/app/register/EventHeader.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getDefaultEvent } from "@/app/lib/event";

export default async function EventHeader() {
  const event = await getDefaultEvent();

  return (
    <header className="space-y-2">
      <h1 className="text-2xl md:text-3xl font-heading text-ink">
        {event?.title ?? "Upcoming Workshop"}
      </h1>

      {event && (
        <p className="text-sm text-gray-600">
          Join Axelus × Boratu Digital for a free 75-minute workshop:
          <span className="font-medium"> Simple Systems for Startup Growth & Social Media.</span>
          <br />
          <span className="text-xs md:text-sm">
            Date:{" "}
            {new Intl.DateTimeFormat("en-GB", {
              dateStyle: "full",
              timeZone: "Africa/Nairobi",
            }).format(event.date)}
            {" • "}
            Time:{" "}
            {new Intl.DateTimeFormat("en-GB", {
              timeStyle: "short",
              timeZone: "Africa/Nairobi",
            }).format(event.date)}{" "}
            EAT
            {" • "}
            Location: {event.location}
          </span>
        </p>
      )}
    </header>
  );
}