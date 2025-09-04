// src/app/register/RegisterForm.tsx
"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData(e.currentTarget);
      const get = (k: string) => (fd.get(k) ?? "") as string;

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: get("fullName"),
          email: get("email"),
          whatsapp: get("whatsapp"),
          businessName: get("businessName"),
          instagram: get("instagram"),
          stage: get("stage"),
          challenge: get("challenge"),
          heardFrom: get("heardFrom"),
        }),
      });

      const ct = res.headers.get("content-type") || "";
      const payload = ct.includes("application/json")
        ? await res.json()
        : { ok: false, error: await res.text() };

      if (!res.ok || payload?.ok === false) {
        throw new Error(payload?.error || 'HTTP ${res.status}');
      }

      window.location.href = "/thanks";
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {/* Name + Email */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="fullName">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input id="fullName" name="fullName" required className="input" type="text" placeholder="Your full name" />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input id="email" name="email" required className="input" type="email" placeholder="you@example.com" />
        </div>
      </div>

      {/* WhatsApp + Business Name */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="whatsapp">
            WhatsApp Number <span className="text-red-500">*</span>
          </label>
          <input id="whatsapp" name="whatsapp" required className="input" type="tel" placeholder="+256…" />
          <p className="help">We’ll send reminders here.</p>
        </div>
        <div>
          <label className="label" htmlFor="businessName">
            Business Name <span className="text-xs text-gray-400">(optional)</span>
          </label>
          <input id="businessName" name="businessName" className="input" type="text" />
        </div>
      </div>

      {/* Instagram */}
      <div>
        <label className="label" htmlFor="instagram">
          Instagram Handle <span className="text-xs text-gray-400">(optional)</span>
        </label>
        <input id="instagram" name="instagram" className="input" type="text" placeholder="@yourhandle" />
      </div>

      {/* Stage of Business */}
      <fieldset>
        <legend className="label">
          Stage of Your Business <span className="text-red-500">*</span>
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="stage" value="IDEA" required /> Idea stage
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="stage" value="Y1_2" /> 1–2 years in business
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="stage" value="Y3_PLUS" /> 3+ years in business
          </label>
        </div>
      </fieldset>

      {/* Main Challenge */}
      <div>
        <label className="label" htmlFor="challenge">
          Main Challenge You Face Right Now <span className="text-red-500">*</span>
        </label>
        <textarea id="challenge" name="challenge" required className="input min-h-[120px]" />
      </div>

      {/* How Did You Hear */}
      <fieldset>
        <legend className="label">
          How Did You Hear About This Workshop? <span className="text-red-500">*</span>
        </legend>
        <div className="grid gap-3 sm:grid-cols-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="heardFrom" value="INSTAGRAM" required /> Instagram
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="heardFrom" value="WHATSAPP" /> WhatsApp
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="heardFrom" value="REFERRAL" /> Friend referral
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="heardFrom" value="OTHER" /> Other
          </label>
        </div>
      </fieldset>

      {/* Actions */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={loading} className="button-primary">
        {loading ? "Submitting…" : "Register"}
      </button>
      <p className="text-xs text-gray-500">
        By registering you agree to receive reminders via email & WhatsApp.
      </p>
    </form>
  );
}