"use client";

import { useState } from "react";

export default function ShareButtons() {
  const [copied, setCopied] = useState(false);

  const shareText =
    "I just registered for Clarity + Consistency: Simple Systems for Startup Growth & Social Media by Axelus × Boratu. Join me!";

  const url = typeof window !== "undefined" ? window.location.origin + "/event" : "https://events.axelusglobal.com/event";

  async function shareNative() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Axelus × Boratu Workshop", text: shareText, url });
      } catch {
        // ignore abort
      }
    } else {
      copy();
    }
  }

  function copy() {
    navigator.clipboard?.writeText('${shareText}\n${url}');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Instagram: there’s no official web share intent for composing a post with text.
  // Best UX: copy the caption and open Instagram, so user can paste.
  function shareInstagram() {
    copy();
    // open Instagram site/app; user pastes the copied text there
    window.open("https://www.instagram.com/", "_blank");
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={shareNative} className="button-primary">Share</button>
      <button type="button" onClick={shareInstagram} className="button-primary !bg-pink-600">Share on Instagram</button>
      <button type="button" onClick={copy} className="button-primary !bg-gray-600">
        {copied ? "Copied!" : "Copy Message"}
      </button>
    </div>
  );
}