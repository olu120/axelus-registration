import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 8:00 PM EAT (UTC+3) on Oct 14, 2025 = 17:00:00Z
  const eventDate = new Date("2025-10-14T17:00:00.000Z");

  await prisma.event.upsert({
    where: { id: "default-event" },
    update: {},
    create: {
      id: "default-event",
      title: "Clarity + Consistency: Simple Systems for Startup Growth & Social Media",
      description:
        "Join Axelus × Boratu Digital for a free 75-minute workshop. Simple systems + social media consistency + a 2-step plan.",
      date: eventDate,
      location: "Online (link will be shared after registration)",
    },
  });

  console.log("Seeded default event.");
}

main().finally(() => prisma.$disconnect());
