// src/app/api/admin/export/route.ts
export const dynamic = "force-dynamic"; // ensure fresh data

import { prisma } from "@/app/lib/prisma";

// Convert registrations → CSV string
function toCSV(rows: Record<string, any>[]) {
  if (!rows.length)
    return "fullName,email,whatsapp,businessName,instagram,stage,heardFrom,challenge,createdAt\n";

  const headers = Object.keys(rows[0]);
  const esc = (v: any) => {
    const str = v ?? "";
    const s = typeof str === "string" ? str : String(str);
    const needs = /[",\n]/.test(s);
    const cleaned = s.replace(/"/g, '""');
    return needs ? `"${cleaned}"` : cleaned;
  };

  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => esc(r[h])).join(",")),
  ];
  return lines.join("\n");
}

export async function GET() {
  const regs = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      fullName: true,
      email: true,
      whatsapp: true,
      businessName: true,
      instagram: true,
      stage: true,
      heardFrom: true,
      challenge: true,
      createdAt: true,
    },
  });

  const rows = regs.map((r) => ({
    ...r,
    createdAt: new Date(r.createdAt).toISOString(),
  }));

  const csv = toCSV(rows);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="registrations.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
