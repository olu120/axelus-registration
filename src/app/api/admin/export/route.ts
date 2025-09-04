// src/app/api/admin/export/route.ts
export const dynamic = "force-dynamic";

import { prisma } from "@/app/lib/prisma";

type CsvRow = {
  fullName: string;
  email: string;
  whatsapp: string;
  businessName: string | null;
  instagram: string | null;
  stage: string;
  heardFrom: string;
  challenge: string;
  createdAt: string; // ISO
};

const HEADERS = [
  "id",
  "fullName",
  "email",
  "whatsapp",
  "businessName",
  "instagram",
  "stage",
  "heardFrom",
  "challenge",
  "createdAt",
] as const;

function escapeCsvValue(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  const needsQuotes = /[",\n]/.test(s);
  const cleaned = s.replace(/"/g, '""');
  return needsQuotes ? `"${cleaned}"` : cleaned;
}

function toCSV(rows: CsvRow[]): string {
  const headerLine = HEADERS.join(",");
  const dataLines = rows.map((r) =>
    HEADERS.map((h) => escapeCsvValue(r[h])).join(","),
  );
  return [headerLine, ...dataLines].join("\n");
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

  const rows: CsvRow[] = regs.map((r) => ({
    ...r,
    createdAt: new Date(r.createdAt).toISOString(),
  }));

  const csv = toCSV(rows);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="registrations.csv"',
      "Cache-Control": "no-store",
    },
  });
}
