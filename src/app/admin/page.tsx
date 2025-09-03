// src/app/admin/page.tsx
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";

function fmt(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  }).format(date);
}

export default async function AdminPage() {
  const [event, regs] = await Promise.all([
    prisma.event.findUnique({ where: { id: "default-event" } }),
    prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <main className="px-4 py-8 space-y-8">
      <section className="card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-heading text-ink">Admin — Registrations</h1>
            <p className="text-sm text-gray-600">
              {event?.title ?? "Clarity + Consistency Workshop"}
            </p>
            <p className="text-xs text-gray-500">
              {event?.location ?? "Online"} • {event ? new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeZone: "Africa/Nairobi" }).format(event.date) : "14 Oct 2025"}
            </p>
          </div>

          <div className="flex gap-3">
  <a
    href="/api/admin/export"
    className="inline-flex items-center justify-center px-4 py-2 font-medium border border-gray-300 rounded-2xl hover:bg-gray-50"
  >
    Download CSV
  </a>
</div>

        </div>
      </section>

      <section className="overflow-x-auto card">
        <table className="min-w-full text-sm">
          <thead className="text-left text-gray-600">
            <tr>
              <th className="py-2 pr-4">When</th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">WhatsApp</th>
              <th className="py-2 pr-4">Business</th>
              <th className="py-2 pr-4">Instagram</th>
              <th className="py-2 pr-4">Stage</th>
              <th className="py-2 pr-4">Heard From</th>
              <th className="py-2 pr-4">Challenge</th>
            </tr>
          </thead>
          <tbody>
            {regs.map((r) => (
              <tr key={r.id} className="align-top border-t border-gray-100">
                <td className="py-2 pr-4 whitespace-nowrap">{fmt(r.createdAt)}</td>
                <td className="py-2 pr-4">{r.fullName}</td>
                <td className="py-2 pr-4">{r.email}</td>
                <td className="py-2 pr-4">{r.whatsapp}</td>
                <td className="py-2 pr-4">{r.businessName || "—"}</td>
                <td className="py-2 pr-4">{r.instagram || "—"}</td>
                <td className="py-2 pr-4">{r.stage}</td>
                <td className="py-2 pr-4">{r.heardFrom}</td>
                <td className="py-2 pr-4 max-w-[28rem]">{r.challenge}</td>
              </tr>
            ))}
            {regs.length === 0 && (
              <tr>
                <td className="py-6 text-gray-500" colSpan={9}>
                  No registrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
