export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/app/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function DeleteRegistrationConfirm({
  params,
}: { params: { id: string } }) {
  const reg = await prisma.registration.findUnique({ where: { id: params.id } });
  if (!reg) notFound();

  async function doDelete(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    if (!id) return;
    await prisma.registration.delete({ where: { id } });
    redirect("/admin?updated=1");
  }

  return (
    <section className="max-w-xl p-6 mx-auto space-y-4 card">
      <h1 className="text-2xl font-heading">Delete Registration</h1>
      <p className="text-gray-700">
        Are you sure you want to delete the registration for{" "}
        <strong>{reg.fullName}</strong> ({reg.email})?
      </p>

      <form action={doDelete} className="flex items-center gap-2">
        <input type="hidden" name="id" value={reg.id} />
        <a href="/admin" className="button-primary !bg-gray-600">Cancel</a>
        <button type="submit" className="button-primary !bg-red-600">Delete</button>
      </form>
    </section>
  );
}