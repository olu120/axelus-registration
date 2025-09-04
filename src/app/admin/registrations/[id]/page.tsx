export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/app/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Stage, HeardFrom } from "@prisma/client";

export default async function EditRegistrationPage({
  params,
}: { params: { id: string } }) {
  const reg = await prisma.registration.findUnique({
    where: { id: params.id },
  });
  if (!reg) notFound();

  // Server Action: don't capture reg here; read id from the form
  async function save(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    if (!id) return;

    const fullName = String(formData.get("fullName") || "");
    const email = String(formData.get("email") || "");
    const whatsapp = String(formData.get("whatsapp") || "");
    const businessName = String(formData.get("businessName") || "");
    const instagram = String(formData.get("instagram") || "");
    // Cast to Prisma enums
    const stage = String(formData.get("stage") || "") as Stage;
const heardFrom = String(formData.get("heardFrom") || "") as HeardFrom;
    const challenge = String(formData.get("challenge") || "");

    await prisma.registration.update({
      where: { id },
      data: {
        fullName,
        email,
        whatsapp,
        businessName: businessName || null,
        instagram: instagram || null,
        stage,       // Prisma enum value
        heardFrom,   // Prisma enum value
        challenge,
      },
    });

    redirect("/admin?updated=1");
  }

  return (
    <section className="max-w-3xl p-6 mx-auto space-y-4 card">
      <h1 className="text-2xl font-heading">Edit Registration</h1>

      <form action={save} className="space-y-4">
        {/* ensure we submit the id, so the action doesn't rely on outer reg */}
        <input type="hidden" name="id" value={reg.id} />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Full Name</label>
            <input name="fullName" className="input" defaultValue={reg.fullName} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" className="input" defaultValue={reg.email} required />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">WhatsApp</label>
            <input name="whatsapp" className="input" defaultValue={reg.whatsapp} required />
          </div>
          <div>
            <label className="label">Business Name</label>
            <input name="businessName" className="input" defaultValue={reg.businessName ?? ""} />
          </div>
        </div>

        <div>
          <label className="label">Instagram</label>
          <input name="instagram" className="input" defaultValue={reg.instagram ?? ""} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Stage</label>
            <select name="stage" className="input" defaultValue={reg.stage}>
              <option value="IDEA">Idea stage</option>
              <option value="Y1_2">1–2 years in business</option>
              <option value="Y3_PLUS">3+ years in business</option>
            </select>
          </div>
          <div>
            <label className="label">Heard From</label>
            <select name="heardFrom" className="input" defaultValue={reg.heardFrom}>
              <option value="INSTAGRAM">Instagram</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="REFERRAL">Friend referral</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Challenge</label>
          <textarea name="challenge" className="input min-h-[120px]" defaultValue={reg.challenge} />
        </div>

        <div className="flex items-center gap-2">
          <a href="/admin" className="button-primary !bg-gray-600">Back</a>
          <button className="button-primary">Save</button>
        </div>
      </form>
    </section>
  );
}