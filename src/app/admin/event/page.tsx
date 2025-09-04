export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";

function parseDateTimeLocal(v: string | null): Date | null {
  if (!v) return null;
  // value like "2025-10-14T20:00" (local) → Date object
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

export default async function EventEditor() {
  const event = await prisma.event.findUnique({ where: { id: "default-event" } });

  async function save(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "");
    const description = String(formData.get("description") || "");
    const location = String(formData.get("location") || "");
    const link = String(formData.get("link") || "");
    const dateRaw = String(formData.get("date") || "");
    const date = parseDateTimeLocal(dateRaw) ?? new Date();

    await prisma.event.upsert({
      where: { id: "default-event" },
      update: { title, description, location, link, date },
      create: { id: "default-event", title, description, location, link, date },
    });

    redirect("/admin?updated=1");
  }

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

        <div>
          <label className="label">Date &amp; Time (local)</label>
          <input
            type="datetime-local"
            name="date"
            className="input"
            defaultValue={event ? new Date(event.date).toISOString().slice(0, 16) : ""}
          />
          <p className="help">We’ll format to EAT on the site and emails.</p>
        </div>

        <div className="flex items-center gap-2">
          <a href="/admin" className="button-primary !bg-gray-600">Back</a>
          <button className="button-primary">Save</button>
        </div>
      </form>
    </section>
  );
}
