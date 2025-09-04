-- CreateEnum
CREATE TYPE "public"."Stage" AS ENUM ('IDEA', 'Y1_2', 'Y3_PLUS');

-- CreateEnum
CREATE TYPE "public"."HeardFrom" AS ENUM ('INSTAGRAM', 'WHATSAPP', 'REFERRAL', 'OTHER');

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Registration" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "businessName" TEXT,
    "instagram" TEXT,
    "stage" "public"."Stage" NOT NULL,
    "challenge" TEXT NOT NULL,
    "heardFrom" "public"."HeardFrom" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Registration_email_key" ON "public"."Registration"("email");

-- AddForeignKey
ALTER TABLE "public"."Registration" ADD CONSTRAINT "Registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
