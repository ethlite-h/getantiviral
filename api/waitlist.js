// Waitlist signup endpoint.
//
// Storage: a Resend audience. Each signup becomes a contact, so the list is
// exportable and a launch broadcast can go out from the Resend dashboard with
// unsubscribe handling already wired. Provisioned via the Vercel Marketplace
// (`vercel integration add resend/resend-email`), which sets RESEND_API_KEY;
// RESEND_AUDIENCE_ID is set alongside it and names the audience to write to.
//
// No mail is sent on signup — the on-page confirmation is the acknowledgement.
// Sending to subscribers would require a verified sending domain in Resend.

import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resend = new Resend(process.env.RESEND_API_KEY);

// Per-IP rate limit, best effort. Fluid Compute reuses instances, so this
// catches the repeat-submit case it is meant for, but it is per-instance and
// not a shared counter — a determined script spread across instances gets more
// than the nominal budget. Sized to stay bounded rather than to be exact.
const RATE_LIMIT = 5; // per minute per IP
const MAX_TRACKED_IPS = 10_000;
const hits = new Map(); // `${ip}:${minuteBucket}` -> count

function overRateLimit(ip) {
  const bucket = Math.floor(Date.now() / 60_000);
  const key = `${ip}:${bucket}`;
  const n = (hits.get(key) || 0) + 1;
  hits.set(key, n);

  // Drop keys from earlier buckets; they can never be read again.
  if (hits.size > MAX_TRACKED_IPS) {
    const prefix = `:${bucket}`;
    for (const k of hits.keys()) {
      if (!k.endsWith(prefix)) hits.delete(k);
    }
  }

  return n > RATE_LIMIT;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body || {};

  if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim()) || email.length > 254) {
    return res.status(400).json({ error: "A valid email is required." });
  }

  const normalized = email.trim().toLowerCase();

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0] || "unknown";
  if (overRateLimit(ip)) {
    return res.status(429).json({ error: "One moment — too many signups too fast." });
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    console.error("RESEND_AUDIENCE_ID is not set — cannot record signup.");
    return res.status(503).json({ error: "We couldn't reach the list. Please email info@studioikigai.ai to be added." });
  }

  try {
    // Resend upserts by email within an audience: a repeat signup returns the
    // existing contact id with no error, so duplicates need no special casing.
    const { error } = await resend.contacts.create({
      email: normalized,
      audienceId,
      unsubscribed: false,
    });

    if (error) {
      console.error("Waitlist storage error:", error.name, error.message);
      return res.status(503).json({ error: "We couldn't reach the list. Please email info@studioikigai.ai to be added." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Waitlist storage threw:", err.message);
    // Fail honestly rather than drop the signup silently.
    return res.status(503).json({ error: "We couldn't reach the list. Please email info@studioikigai.ai to be added." });
  }
}
