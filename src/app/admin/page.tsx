export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const hdrs = await headers();
  const updated = new URL(
    `http://x${hdrs.get("x-forwarded-host") || ""}${hdrs.get("x-invoke-path") || "/"}`
  ).searchParams.get("updated");

  const [event, regs] = await Promise.all([
    prisma.event.findUnique({ where: { id: "default-event" } }),
    prisma.registration.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  async function deleteRegistration(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    if (!id) return;
    await prisma.registration.delete({ where: { id } });
    redirect("/admin?updated=1");
  }

  return (
    <section className="max-w-6xl p-6 mx-auto space-y-6">
      {updated === "1" && (
        <div className="px-4 py-3 text-green-800 border border-green-200 rounded-xl bg-green-50">
          Saved successfully.
        </div>
      )}

      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">
            {event ? (
              <>
                <span className="font-medium">{event.title}</span>{" — "}
                {new Intl.DateTimeFormat("en-GB", {
                  dateStyle: "full",
                  timeStyle: "short",
                  timeZone: "Africa/Nairobi",
                }).format(event.date)}
              </>
            ) : (
              "No event seeded yet"
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/event" className="button-primary">Edit Event</Link>
          <a href="/api/admin/export" className="button-primary" title="Download CSV of all registrations">
            Export CSV
          </a>
        </div>
      </header>

      <div className="overflow-x-auto card">
        <table className="min-w-full text-sm align-top">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2 pr-3">Full name</th>
              <th className="py-2 pr-3">Email</th>
              <th className="py-2 pr-3">WhatsApp</th>
              <th className="py-2 pr-3">Business</th>
              <th className="py-2 pr-3">Instagram</th>
              <th className="py-2 pr-3">Stage</th>
              <th className="py-2 pr-3">Heard from</th>
              <th className="py-2 pr-3">Challenge</th>
              <th className="py-2 pr-3">Created</th>
              <th className="py-2 pr-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {regs.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="py-2 pr-3">{r.fullName}</td>
                <td className="py-2 pr-3">{r.email}</td>
                <td className="py-2 pr-3">{r.whatsapp}</td>
                <td className="py-2 pr-3">{r.businessName || <span className="text-gray-400">—</span>}</td>
                <td className="py-2 pr-3">{r.instagram || <span className="text-gray-400">—</span>}</td>
                <td className="py-2 pr-3">{r.stage}</td>
                <td className="py-2 pr-3">{r.heardFrom}</td>
                <td className="py-2 pr-3 max-w-[320px]">
                  <div className="whitespace-pre-wrap line-clamp-3">{r.challenge}</div>
                </td>
                <td className="py-2 pr-3">
                  {new Intl.DateTimeFormat("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Africa/Nairobi",
                  }).format(r.createdAt)}
                </td>
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/registrations/${r.id}`} className="underline text-primary">
                      Edit
                    </Link>
                    
                       <Link href={`/admin/registrations/${r.id}/delete`}
                             className="text-red-600 underline">
                       Delete
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {regs.length === 0 && (
              <tr>
                <td colSpan={10} className="py-6 text-center text-gray-500">
                  No registrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}