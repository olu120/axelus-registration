import { prisma } from "@/app/lib/prisma";

export async function getDefaultEvent() {
  return prisma.event.findUnique({ where: { id: "default-event" } });
}
