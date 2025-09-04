export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getDefaultEvent } from "@/app/lib/event";
import Image from "next/image";

export default async function HomePage() {
  const event = await getDefaultEvent();

  const dateStr = event
    ? new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeZone: "Africa/Nairobi" }).format(event.date)
    : "";
  const timeStr = event
    ? new Intl.DateTimeFormat("en-GB", { timeStyle: "short", timeZone: "Africa/Nairobi" }).format(event.date)
    : "";

  return (
    <main className="accent-bg">
      <section className="grid items-center max-w-5xl gap-8 px-4 py-10 mx-auto md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-heading text-ink">
            {event?.title ?? "Upcoming Workshop"}
          </h1>
          {event && (
            <p className="text-gray-700">
              Date: {dateStr} • Time: {timeStr} EAT • Location: {event.location}
            </p>
          )}
          <div className="flex gap-2">
            <a href="/register" className="button-primary">Register Free</a>
            <a href="/event" className="button-primary !bg-gray-700">Event Details</a>
          </div>
        </div>

        {/* Brand lockup / hero (optional) */}
        <div className="flex justify-center">
          <Image
            src="/Axelus X Boratu.jpg" // adjust to your asset path
            alt="Axelus × Boratu"
            width={520}
            height={320}
            className="shadow-sm rounded-2xl"
          />
        </div>
      </section>
    </main>
  );
}