export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";

/** Convert YYYY-MM-DD (EAT) + HH:mm (EAT) → UTC Date */
function eatToUtc(dateStr: string, timeStr: string) {
  // EAT is UTC+3, no DST. Store as UTC by subtracting 3 hours.
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  const utcMs = Date.UTC(y, m - 1, d, hh - 3, mm, 0);
  return new Date(utcMs);
}

/** Convert a UTC Date to EAT parts for inputs */
function utcToEatParts(utc: Date) {
  const eat = new Date(utc.getTime() + 3 * 60 * 60 * 1000); // add 3h
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = eat.getUTCFullYear();
  const mm = pad(eat.getUTCMonth() + 1);
  const dd = pad(eat.getUTCDate());
  const hh = pad(eat.getUTCHours());
  const min = pad(eat.getUTCMinutes());
  return {
    date: `${yyyy}-${mm}-${dd}`, // for <input type="date">
    time: `${hh}:${min}`,        // for <input type="time">
  };
}

export default async function EventEditor() {
  const event = await prisma.event.findUnique({ where: { id: "default-event" } });

  async function save(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "");
    const description = String(formData.get("description") || "");
    const location = String(formData.get("location") || "");
    const link = String(formData.get("link") || "");
    const dateStr = String(formData.get("date") || ""); // EAT date: YYYY-MM-DD
    const timeStr = String(formData.get("time") || ""); // EAT time: HH:mm

    if (!dateStr || !timeStr) {
      throw new Error("Date and time are required.");
    }

    const whenUtc = eatToUtc(dateStr, timeStr);

    await prisma.event.upsert({
      where: { id: "default-event" },
      update: { title, description, location, link: link || null, date: whenUtc },
      create: { id: "default-event", title, description, location, link: link || null, date: whenUtc },
    });

    redirect("/admin?updated=1");
  }

  // Default values (show EAT wall time in inputs)
  const defaults = event ? utcToEatParts(new Date(event.date)) : null;

  return (
    <section className="max-w-3xl p-6 mx-auto space-y-4 card">
      <h1 className="text-2xl font-heading">Edit Event</h1>

      <form action={save} className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input name="title" className="input" defaultValue={event?.title || ""} required />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea name="description" className="input min-h-[120px]" defaultValue={event?.description || ""} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Location</label>
            <input name="location" className="input" defaultValue={event?.location || ""} />
          </div>
          <div>
            <label className="label">Join Link</label>
            <input name="link" className="input" defaultValue={event?.link || ""} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Date (EAT)</label>
            <input
              type="date"
              name="date"
              className="input"
              defaultValue={defaults?.date || ""}
              required
            />
          </div>
          <div>
            <label className="label">Time (EAT)</label>
            <input
              type="time"
              name="time"
              className="input"
              defaultValue={defaults?.time || ""}
              required
            />
          </div>
        </div>
        <p className="help">Times are saved as UTC and displayed as EAT across the site & emails.</p>

        <div className="flex items-center gap-2">
          <a href="/admin" className="button-primary !bg-gray-600">Back</a>
          <button className="button-primary">Save</button>
        </div>
      </form>
    </section>
  );
}
