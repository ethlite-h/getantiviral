# getantiviral.app — Currency Audit & Update Plan

**Date:** 2026-06-29 · **Auditor:** Claude Code (multi-agent verified audit) · **Repo:** `web/getantiviral` (separate git repo from the iOS app)
**Audited HEAD:** `main` @ `1407566` (*"Reposition site to locked product direction (Edition, honest privacy, waitlist)"*)

## What this is

A read-only audit of the marketing site against **Antiviral's current product direction** (Edition/Frontier, conversational curation, the shipped correction loop, honest cloud-forward privacy, Fall-2026/iOS-27 launch). 6 parallel finders (messaging, privacy-honesty, Concierge accuracy, SEO, code/serverless, a11y) each produced findings that were then **adversarially verified** one-by-one against the rubric and the cited code: **58 raw → 57 confirmed, 1 refuted.** This document is the plan; **nothing here has been changed yet.**

The site is **not stale on the big picture** — it's already repositioned to Edition / honest privacy / waitlist. The issues are (a) a real **honesty/accuracy defect in the privacy copy**, (b) **missing flagship content**, (c) **launch/legal gaps**, and (d) ordinary web hygiene.

> **The headline finding:** 6 of the 8 high-severity findings are the *same* issue — the site tells users **iCloud sync is "optional" and that a "device-local-only mode" exists** (`src/Privacy.jsx:143-149` **and** `api/ask.js:14`), which contradicts the locked **always-on CloudKit** architecture. This is in the published privacy page that **Google's OAuth reviewer will read**, and it's the one thing on a privacy-first brand that must be right. **Fix gated on Helen confirming actual shipping sync behavior (D1).**

---

## ⚑ Decisions only Helen can make (resolve these first — they gate the copy)

23 findings depend on a product/pricing/privacy fact I can't confirm. They collapse to **8 decisions**:

| # | Decision | Gates | Default if unsure |
|---|----------|-------|-------------------|
| **D1** | **Actual shipping sync behavior** — is it always-on CloudKit with **no** device-local-only mode? (Memory note `antiviral-privacy-cloudkit-reality` records this as a locked 2026-06-25 decision.) | P0-1 (the big rewrite) | Assume always-on; rewrite to match |
| **D2** | Which iCloud encryption tier the CloudKit container actually uses (is E2E/ADP guaranteed, or opt-in?) | P1-3 (ADP claim) | Condition the claim on ADP being enabled |
| **D3** | Public phrasing for the embedder ("Apple on-device embeddings" vs naming NLContextualEmbedding) | P1-4 | "Apple's on-device text embeddings" |
| **D4** | Is the **"public pricing ledger"** real & reachable? Is Founding Reader **price-locked-for-life** a committed promise? Should **pricing appear on the landing page** pre-launch? | P1-7, P1-12 | Soften unverifiable claims; add only the free/paid split line |
| **D5** | Surface the **correction loop / "Ask the Editor"** on the marketing site pre-launch? | P1-9 | Yes — it's on-brand (on-device, transparent, zero-PCC) |
| **D6** | Is **Bluesky** (and Brave web search) named publicly? | P1-13 | Make all 3 surfaces consistent either way |
| **D7** | Is **macOS** part of the public launch story? (Concierge says "with a Mac version"; landing is iPhone-only.) | P3-27 | Drop the Mac mention from the Concierge until marketed |
| **D8** | Is **Google OAuth verification on the launch path?** (gates the Terms page + Limited-Use clause timing) | P1-8, P1-11 | Yes — build Terms + Limited-Use clause now |

---

## P0 — Publish blockers (correctness / honesty / cost)

### P0-1 · Privacy copy claims "optional" sync + a "device-local-only mode" — contradicts always-on CloudKit ⚑D1
**Findings:** PRIV-1, PRIV-2, CONC-SYNC-1, PRIV-SYNC-1, ASK-2 (6 high-sev hits) · **Severity: HIGH** · **Effort: S**
**Where:** `src/Privacy.jsx:143-149` (also `:172`, `:177`) — section titled *"iCloud sync (optional)"*, body *"Sync is optional… a device-local-only mode does exactly that."* **AND** `api/ask.js:14` — *"Optional iCloud sync… There is also a device-local-only mode."*
**Problem:** Per the locked decision, sync is **always-on** CloudKit mirroring to the user's private iCloud; there is **no** local-only mode and sync is not an opt-in toggle. The copy understates default egress and promises a mode that doesn't ship — a brand-defining honesty defect, in the document OAuth review reads, and repeated live by the Concierge bot.
**Fix (both surfaces, kept identical):** Rewrite to: *"Antiviral keeps your sources, saves, annotations, interest graph, and preferences in sync across your devices through your own private iCloud (Apple CloudKit). It's on by default — it's your iCloud account, not a server Studio Ikigai runs, and we never see it."* Delete the "optional" framing and the "device-local-only mode" sentence. In `api/ask.js`, also add a RESPONSE RULE so the Concierge never offers a way to "turn sync off." Update `Privacy.jsx:172/177` (post-deletion data handling) to match.
**Blocked on D1** — confirm the architecture before publishing legal copy.

### P0-2 · `/api/ask` has no server-side rate limit — open POST burns Anthropic tokens
**Findings:** ASK-1 (+ WL-1 for the waitlist) · **Severity: HIGH** · **Effort: M** · *no decision needed*
**Where:** `api/ask.js:44-73` — guarded **only** by client-side cooldown/cap in `src/App.jsx:369-370, 426-433`. Anyone can `curl` the endpoint in a loop.
**Fix:** Add a per-IP rate limit using **`@vercel/kv` (already a dependency)** — no new package:
```js
const ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || 'unknown';
const bucket = Math.floor(Date.now() / 60000);
const key = `ask:rl:${ip}:${bucket}`;
const n = await kv.incr(key);
if (n === 1) await kv.expire(key, 60);
if (n > 8) return res.status(429).json({ error: 'Slow down a moment.' });
```
Add a small daily global ceiling key as a backstop. Apply the same helper to `/api/waitlist` (e.g. 5/min/IP). Keep the client-side limits as a courtesy layer. *(Alternative: Vercel WAF rate-limit rule on `/api/ask`.)*

---

## P1 — Pre-launch: accuracy, flagship content, legal

### Accuracy / honesty refinements
- **P1-3 · ADP claim is unconditional** (PRIV-3, M, ⚑D2) — `Privacy.jsx:145` (+`ask.js:14`): "end-to-end encrypted under Advanced Data Protection." ADP is **opt-in**. Condition it: *"If you've enabled Apple's Advanced Data Protection, that sync is end-to-end encrypted; either way it's your iCloud, not a server we run."*
- **P1-4 · "sentence transformer" mischaracterizes the embedder** (EMB-1, PRIV-5, M, ⚑D3) — `api/ask.js:13` + `Privacy.jsx:90`: replace "an on-device sentence transformer" → "Apple's on-device text embeddings (NLContextualEmbedding)" or plainer "on-device embeddings from Apple's Natural Language framework."
- **P1-5 · Local-first framing understates egress** (PRIV-4-low, S, ⚑) — `Privacy.jsx:75,80-81` "the one moment it leaves your phone" / `ask.js:13` "Everything else stays on your phone." Brushes the **"never claim nothing leaves your phone"** rule. Reword to acknowledge the egress paths: continuous private-iCloud sync, outbound provider search queries, and the one daily PCC Edition call.
- **P1-6 · Privacy page doesn't disclose Concierge → Anthropic** (PRIV-4-messaging, S) — the website chat sends typed questions to **Anthropic** (`api/ask.js`), undisclosed. Add one line to `Privacy.jsx:165-167`/Third-party services: questions typed into the website Concierge are sent to Anthropic to generate a reply and aren't used to identify you.
- **P1-7 · Unverifiable pricing claims** (PRICE-LEDGER-1, NARR-4, S, ⚑D4) — `api/ask.js:16` "published openly on a public ledger" + "price-locked for life." Confirm-and-link or soften both.

### Missing flagship content
- **P1-9 · "Ask the Editor" correction loop is absent site-wide** (NARR-1, CORR-1, PRIV-10, M, ⚑D5) — shipped Milestone-A flagship, mentioned **nowhere** (not landing, not Privacy, not the Concierge's PRODUCT FACTS). Add a landing block (natural home: between "The Edition" and "Trust Architecture", `App.jsx:980-984`, or the reasoning section `:1000-1015`): *"Disagree? Tell it 'this doesn't belong here' and it writes a rule you can read and change — on your device. You're the editor."* Add a matching PRODUCT FACT to `api/ask.js` so the Concierge can answer it. Ties directly to the existing thesis "we hand it back" (`App.jsx:1080-1082`).
- **P1-10 · Conversational curation never explained** (NARR-2, M) — mechanic (a) of the product (talk to it → feed rebuilds) is absent from landing copy, and the only "conversation" UI is the marketing FAQ bot, which a visitor may mistake for the product. Add copy (upgrade the "Feed" card `App.jsx:634` or a short section): *"Tell it 'less crypto, more long-form interviews' and the feed rebuilds."* Label the marketing ConversationBar (e.g. "Ask about Antiviral") so it reads as a site assistant, not the app.

### Launch / legal & cross-surface consistency
- **P1-8 · YouTube OAuth Limited-Use affirmation missing** (PRIV-7, S, ⚑D8) — `Privacy.jsx:129-133` lacks the **Google API Services User Data Policy / Limited Use** sentence Google's verification requires. Add: *"Antiviral's use of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements. The youtube.readonly data is used only on your device to seed your sources and is never sold, transferred, or used for advertising."* (Directly unblocks the OAuth-verification thread.)
- **P1-11 · No Terms of Service page** (TOS-1, LEGAL-1, PRIV-6, M, ⚑D8) — footer + routing link **only** Privacy (`App.jsx:1140-1145`, `src/main.jsx:11`, `vercel.json:3`). Add `src/Terms.jsx`, route it (`path === "/terms" ? <Terms/> : …`), add a `vercel.json` rewrite, and a footer link next to Privacy. Needed for App Store + OAuth. Content (subscription/auto-renew terms, refunds, acceptable use, governing law) needs founder/legal input.
- **P1-12 · Landing shows no price; Concierge quotes detailed pricing** (PRICE-GAP-1, NARR-3, M, ⚑D4) — at minimum add a one-line free/paid disclosure near the hero/closing (*"Feed and Shortlist plus a free Sunday Edition forever; the daily Edition is a subscription"*) so the public page matches the Concierge and the honesty brand.
- **P1-13 · Bluesky disclosed in Privacy but omitted from Concierge/landing** (SRC-BLUESKY-1, NARR-5, PRIV-8, S, ⚑D6) — `Privacy.jsx:135-139,184` names Bluesky; `api/ask.js:18` source list omits it (and Brave). Make all surfaces consistent: either add Bluesky/Brave to the Concierge + egress list, or remove the Bluesky subsection from Privacy until it's part of the public story.

---

## P2 — SEO / web hygiene & accessibility

**SEO / perf**
- **P2-14 · No `og:image`/`twitter:image`** (SEO-1, M) — `index.html:10-18` declares `twitter:card=summary_large_image` but ships **no share image** → blank social cards. Add a 1200×630 card to `public/og-image.png` (repurpose the repo's `icon.png`, see P3-33) + `og:image`, `og:image:width/height`, `twitter:image` (absolute URLs).
- **P2-15 · `/privacy` serves the homepage's meta + a canonical pointing to `/`** (SEO-2, M) — give `/privacy` its own `<head>` (static `public/privacy.html` or a self-referencing canonical) so it isn't collapsed into the homepage by crawlers.
- **P2-16 · Scroll listener re-renders the whole landing every frame** (PERF-1, S) — `App.jsx:649-653` stores raw `scrollY`. Store a boolean and only setState on the crossing: `setScrolled(p => p === s ? p : s)`. (Compounds with the canvas rAF.)
- **P2-17 · Fonts via `@import` in a React-injected `<style>`** (FONT-1, S) — `App.jsx:663-664` (+`Privacy.jsx:10`): render-blocking, late-discovered. Move to `<link rel="stylesheet" …&display=swap>` in `index.html <head>` (after the existing preconnects); delete the `@import`.

**Accessibility**
- **P2-18 · Low-opacity text fails WCAG AA** (A11Y-1, M) — raise to ≥`rgba(255,255,255,0.6)` for normal, 0.65–0.7 for small/secondary: footer link & "Finite by design." (`App.jsx:1137/1141`), "from Studio Ikigai" (`:1121`, `Privacy.jsx:207`), "The thesis" eyebrow (`:1066`), collapsed conv-bar placeholder (`:484`), "Last updated"/secondary notes (`Privacy.jsx:66/102/165`).
- **P2-19 · Icon-only buttons have no accessible name** (A11Y-2, S) — `App.jsx:541` close "×" → `aria-label="Close answer"`; `:604` submit "↑" → `aria-label="Send question"`; `aria-hidden="true"` on the glyph spans.
- **P2-20 · Concierge input unlabeled + answer not announced** (A11Y-3, M) — `App.jsx:584` add `aria-label`; `:528` answer panel `role="status" aria-live="polite"`.
- **P2-21 · Waitlist success/error not announced** (A11Y-4, S) — `App.jsx:326` error → `role="alert"`; `:274` success → `role="status"`; wire `aria-invalid`/`aria-describedby` on the input.
- **P2-22 · `prefers-reduced-motion` doesn't stop the hero canvas** (A11Y-5, ANIM-1, S) — `App.jsx:69-170`: read `matchMedia('(prefers-reduced-motion: reduce)')`, render one static frame and skip the rAF loop when set (and pause off-screen via the existing IntersectionObserver). The CSS guard at `:771-777` doesn't touch the canvas.

---

## P3 — Polish (low)

- **P3-23** Decorative canvas not hidden from AT (A11Y-6) — `App.jsx:173` add `aria-hidden="true"`.
- **P3-24** Fixed ConversationBar may overlap the closing CTA/footer on ~375×667 (RESP-1) — verify; ensure the footer Privacy link is never covered (OAuth needs it reachable).
- **P3-25** Concierge question-cap is a silent dead-end (UX-1) — `App.jsx:414-418`: relabel the collapsed pill to point at the waitlist instead of a no-op.
- **P3-26** "One private daily call" trust chip reads as the app's *total* network activity (PRIV-9) — `App.jsx:1029`: reword to "Edition built on Apple PCC."
- **P3-27** macOS inconsistency (NARR-6, ⚑D7) — `api/ask.js:10` "with a Mac version" vs iPhone-only landing. Reconcile.
- **P3-28** `og:url` missing trailing slash vs canonical (SEO-4) — `index.html:9`.
- **P3-29** No JSON-LD structured data (SEO-5) — add Organization + SoftwareApplication (iOS 27, Fall 2026) to the head.
- **P3-30** `sitemap.xml` lacks `<lastmod>` & will omit `/terms` (SEO-6) — `public/sitemap.xml`.
- **P3-31** No `apple-touch-icon`/PNG favicon fallback (SEO-7) — add `public/apple-touch-icon.png` (180×180).
- **P3-32** `@anthropic-ai/sdk` pinned `^0.39.0` (badly stale) (DEP-1) — `package.json:12`: bump to latest + smoke-test `/api/ask`; review `@vercel/kv ^3.0.0` too.
- **P3-33** 1.2 MB `icon.png` at repo root, unreferenced & not served (SEO-3, ASSET-1) — either delete it or optimize + move to `public/` as the P2-14 share image / touch icon.

---

## Refuted (recorded so it isn't re-audited)

- **MODEL-1** — *"Concierge uses `claude-sonnet-4-6`, a previous-gen model."* **Refuted:** `api/ask.js:61` uses a valid, current, Active model and the textbook-correct tier for a 300-token marketing concierge. No action.

## Suggested execution order

1. **Resolve D1–D8** (especially D1). 2. **P0-1 + P0-2** (honesty + cost — true blockers). 3. **P1 accuracy cluster** (P1-3→P1-8) — cheap, mostly copy, all on the OAuth/privacy critical path. 4. **P1 flagship content** (P1-9, P1-10) + **P1-11 Terms** if OAuth is on-path. 5. **P2** SEO/a11y batch. 6. **P3** polish.

## How to verify after changes
- `npm run dev` (Vite) and read every changed surface; `npm run build` must pass. The Concierge change is testable by POSTing to `/api/ask` locally (needs `ANTHROPIC_API_KEY`); the rate-limit change needs `KV_REST_API_*`.
- Cross-check that **`Privacy.jsx`, `api/ask.js`, and the landing copy agree** on sync, pricing, sources, and the embedder after edits — the audit's recurring theme is the three surfaces drifting apart.

---

# Appendix A — Google OAuth verification readiness

> Added 2026-06-29 from a verified requirements sweep (multi-source, official Google/YouTube docs). This is the
> authoritative readiness map for removing the "unverified app" screen on the sensitive `youtube.readonly` scope
> (YouTube subscription import). **It supersedes the looser framing in finding P1-8.**

## A.0 The corrected bar (what's actually required, with sources)

- **`youtube.readonly` is SENSITIVE, not restricted** → full OAuth app verification is required for public launch, but **no** restricted-scope CASA security assessment / pen-test. ([scopes](https://support.google.com/cloud/answer/13463073))
- **Limited Use affirmation** — *not* strictly mandated by the generic sensitive-scope OAuth rule, **but the YouTube API Services Developer Policies separately require** publishing a Limited Use affirmation. Net: **required** (via YouTube policy). ([User Data Policy](https://developers.google.com/terms/api-services-user-data-policy))
- **Terms of Service page** — **optional** for OAuth verification itself, **but** YouTube Developer Policies require you to **link YouTube's ToS and state users are bound by it**, which needs a terms page (App Store needs one too). So: effectively required, just not by OAuth. ([sensitive-scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification))
- **Demo video — REQUIRED.** Unlisted YouTube video showing the full OAuth grant flow + each scope's data use, in English, OAuth client ID visible. No website work satisfies this.
- **Separate YouTube API audit — NOT triggered** (own-subscription reads are ~1 quota unit, far under the 10k/day default). ([quota & audits](https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits))
- **Policy must be accurate** — an inaccurate privacy policy blocks verification. *(This is the one item plan 058 + D-e resolves — the iCloud-sync claim.)*

## A.1 Site-side checklist (small; the only part editable in this repo)

| # | Requirement | Where | Status |
|---|-------------|-------|--------|
| 1 | Public homepage on the verified domain, describes the app, links the privacy policy | `index.html`, `App.jsx:1140` | ✅ met |
| 2 | Privacy policy is HTML on the **same domain**, linked from homepage + consent screen | `/privacy` | ✅ met (consent-screen link = Console) |
| 3 | Discloses `youtube.readonly` data: what/how-used/stored, **revocation on sign-out** | `Privacy.jsx:129-133` | ✅ met |
| 4 | Minimal scope (only `youtube.readonly`) | app | ✅ met |
| 5 | **Limited Use affirmation** (YouTube Dev Policies) | `Privacy.jsx` (add) | ❌ **add — copy A.3.1** |
| 6 | **Reference + link the Google Privacy Policy** | `Privacy.jsx` (add) | ❌ **add — copy A.3.2** |
| 7 | Name **"YouTube API Services"** explicitly (not just "Google OAuth"); add Google-Account revocation link | `Privacy.jsx:129-133` | ⚠️ **tighten — copy A.3.2** |
| 8 | **Terms page** linking **YouTube ToS** + "you agree to be bound" statement | new `/terms` (P1-11) | ❌ **add — copy A.3.3** |
| 9 | Privacy policy **accurate** (sync) | `Privacy.jsx:143-149` | ⏳ **plan 058 / D-e** |

## A.2 Process / Console-side checklist (the real gate — zero website overlap)

- [ ] **Demo video** — unlisted YouTube, full OAuth grant flow + data-use, English, OAuth client ID visible.
- [ ] **Scope justification** on the Data Access page ("why narrower scopes won't work, with specifics").
- [ ] **Domain verification** of `getantiviral.app` in **Google Search Console**, under the **same Google account** as the GCP project; list it in **Authorized domains**.
- [ ] **Consent screen**: app name (no "YouTube"/"Google"), user-support email, developer-contact email, optional logo (square 120×120, ≤1 MB, **no** Google/YouTube marks), privacy-policy URL.
- [ ] **Name parity** — consent-screen app name matches the homepage ("Antiviral").
- [ ] **Publish to "In production"** (User type External) + **submit** via the Verification Center.
- [ ] **Accept** the YouTube API Services ToS + Developer Policies for the project.
- [ ] **App-side (iOS, not this repo):** display **YouTube Brand Features** / make YouTube the clear source of YouTube content, and never overlay/obscure the embedded player's attribution. (Tracked as a YouTube-policy obligation; see CLAUDE.md "YouTube embed TOS".)

## A.3 Ready-to-paste copy (matches the existing `Privacy.jsx` / `Terms.jsx` helpers)

### A.3.1 — Limited Use affirmation
Add as a new `<SubSection>` inside the **"What else leaves your device"** `<Section>` (after the YouTube import block, `Privacy.jsx:133`):

```jsx
<SubSection title="Google API Limited Use">
  <P>
    Antiviral's use and transfer of information received from Google APIs to any
    other app adheres to the{" "}
    <a href="https://developers.google.com/terms/api-services-user-data-policy"
       target="_blank" rel="noopener noreferrer"
       style={{ textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.15)", textUnderlineOffset: "3px" }}>
      Google API Services User Data Policy
    </a>, including the Limited Use requirements. Your YouTube subscription data is
    used only on your device to seed your sources — it is never sold, transferred,
    or used for advertising, and never reaches a server we operate.
  </P>
</SubSection>
```

### A.3.2 — Replace the existing "YouTube import" subsection (names YouTube API Services, links the Google Privacy Policy, adds Google-Account revocation)
Replace `Privacy.jsx:129-133` with:

```jsx
<SubSection title="YouTube import (optional)">
  <P>
    If you choose to import your YouTube subscriptions, Antiviral uses YouTube API
    Services (via Google OAuth) to read your subscription list and liked-video
    categories. The access is read-only and one-way — nothing flows back to Google,
    and the data is used only on your device to seed your content sources. Your OAuth
    token is stored in your device's Keychain, encrypted and device-only. When you
    sign out, the token is revoked at Google and deleted from your device, and you can
    revoke Antiviral's access at any time from your{" "}
    <a href="https://myaccount.google.com/permissions"
       target="_blank" rel="noopener noreferrer"
       style={{ textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.15)", textUnderlineOffset: "3px" }}>
      Google Account permissions
    </a>. Antiviral's use of YouTube API Services is also governed by the{" "}
    <a href="https://policies.google.com/privacy"
       target="_blank" rel="noopener noreferrer"
       style={{ textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.15)", textUnderlineOffset: "3px" }}>
      Google Privacy Policy
    </a>.
  </P>
</SubSection>
```

### A.3.3 — YouTube section for the new `/terms` page (`src/Terms.jsx`)
The YouTube-required clause for the Terms page (mirror `Privacy.jsx`'s `Section`/`P` helpers + the `/privacy` route pattern in `main.jsx` and the `vercel.json` rewrite). **This is the only ToS section dictated by policy — the rest (subscription/auto-renew, refunds, acceptable use, disclaimer, governing law, contact) needs founder/legal input.**

```jsx
<Section title="YouTube">
  <P>
    Antiviral uses YouTube API Services to import and display content from YouTube.
    By using Antiviral, you agree to be bound by the{" "}
    <a href="https://www.youtube.com/t/terms"
       target="_blank" rel="noopener noreferrer"
       style={{ textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.15)", textUnderlineOffset: "3px" }}>
      YouTube Terms of Service
    </a>. Your use of information Antiviral obtains through YouTube API Services is also
    governed by the{" "}
    <a href="https://policies.google.com/privacy"
       target="_blank" rel="noopener noreferrer"
       style={{ textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.15)", textUnderlineOffset: "3px" }}>
      Google Privacy Policy
    </a>.
  </P>
</Section>
```

Wiring for the new page (same shape as `/privacy`): add `import Terms from "./Terms.jsx"` + `path === "/terms" ? <Terms /> : …` in `src/main.jsx`; add `{ "source": "/terms", "destination": "/index.html" }` to `vercel.json` rewrites; add a "Terms" link beside "Privacy" in the `App.jsx` footer (`:1140`); add `/terms` to `public/sitemap.xml`.

## A.4 Bottom line

Plan 058 resolves **row 9 only** (policy accuracy). Site-ready also needs **rows 5–8** (≈ half a day of copy + a `/terms` page — copy provided above). **Passing** verification then depends entirely on **A.2** (especially the demo video). No website edit substitutes for the A.2 process package.
