// Waitlist signup endpoint.
//
// Storage: Vercel KV (Upstash Redis). Provision once with `vercel kv` (or link a
// KV store in the Vercel dashboard) so KV_REST_API_URL / KV_REST_API_TOKEN are set.
// To use an email provider instead (ConvertKit, Buttondown, Resend, a Google Form),
// swap the `kv.sadd(...)` block for a fetch to that provider — the validation above
// stays the same.

import { kv } from "@vercel/kv";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body || {};

  if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim()) || email.length > 254) {
    return res.status(400).json({ error: "A valid email is required." });
  }

  const normalized = email.trim().toLowerCase();

  try {
    // Store as a set so duplicate signups are idempotent.
    await kv.sadd("waitlist:emails", normalized);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Waitlist storage error:", err.message);
    // Storage not provisioned or unreachable — fail honestly rather than drop the signup silently.
    return res.status(503).json({ error: "We couldn't reach the list. Please email info@studioikigai.ai to be added." });
  }
}
