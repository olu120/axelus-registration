// src/app/register/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import EventHeader from "./EventHeader";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <section className="min-h-[70vh] accent-bg p-4 md:py-10">
      <div className="max-w-4xl mx-auto space-y-6 card">
        {/* Server-rendered header (live from DB) */}
        <EventHeader />
        {/* Client form (handles submit) */}
        <RegisterForm />
      </div>
    </section>
  );
}