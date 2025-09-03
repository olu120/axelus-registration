// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="px-4 py-10">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white border rounded-2xl border-gray-200/60">
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--brand-accent)]/80 via-white to-white" />
        <div className="relative p-8 md:p-12">
          <p className="text-xs tracking-wider text-gray-500 uppercase">Free Online Workshop</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-heading text-[color:var(--brand-black)]">
            Clarity + Consistency: Simple Systems for Startup Growth & Social Media
          </h1>

          <div className="mt-4 text-sm text-gray-700 md:text-base">
            <p><strong>Date:</strong> Tuesday, 14th October 2025</p>
            <p><strong>Time:</strong> 8:00 PM EAT</p>
            <p><strong>Location:</strong> Online (link after registration)</p>
          </div>

          <div className="flex flex-col gap-3 mt-6 sm:flex-row">
            <Link href="/register" className="w-full button-primary sm:w-auto">
              Register (free)
            </Link>
            <Link href="/event" className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-medium border border-gray-300 text-[color:var(--brand-black)] hover:bg-gray-50">
              See event details
            </Link>
          </div>
        </div>
      </section>

      {/* What you'll gain */}
      <section className="grid gap-4 mt-10 md:grid-cols-3">
        <div className="card">
          <h3 className="text-lg font-heading">Simple Growth Systems</h3>
          <p className="mt-2 text-sm text-gray-600">Keep your business on track with a lightweight structure.</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-heading">Social Media Consistency</h3>
          <p className="mt-2 text-sm text-gray-600">Stay visible without burnout using repeatable habits.</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-heading">2-Step Action Plan</h3>
          <p className="mt-2 text-sm text-gray-600">Walk away with a simple plan you can use immediately.</p>
        </div>
      </section>

      {/* Partner strip (subtle nod to Boratu) */}
      <section className="p-4 mt-12 bg-white border rounded-xl border-gray-200/60">
        <p className="text-sm text-gray-600">
          Hosted by <strong>Axelus</strong> × <strong>Boratu Digital</strong>. Comment <em>“growth”</em> on our IG posts to spread the word.
        </p>
      </section>
    </main>
  );
}
