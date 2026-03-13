# Antiviral — Website Copy: Discovery Update

**Studio Ikigai — March 2026**

*Addresses the #1 user concern from feedback: "I like the idea but I'm afraid I'll miss out on something."*

This concern is the most important one to address on the website because it's the reason someone who *wants* Antiviral talks themselves out of trying it. Every other message on the site says "escape the algorithm." This section says "and you won't lose anything when you do."

All claims are audit-compliant — deliverable from RSS metadata + SwiftData.

---

## Part 1: New Hero Blocks for the Rotation

Add these to `website-hero-copy-final.md`. They should appear in **medium-high frequency** because they address the primary objection.

### 14. The Buried Feed

> You follow 150 YouTube channels. YouTube shows you content from maybe 20 of them. The rest? Buried. The algorithm decided they weren't engaging enough to show you.
>
> Antiviral searches all of them. Every channel. Every episode. Every post. Ranked by what you asked for, not by what gets the most clicks.
>
> You're not giving up discovery. You're discovering what was already yours.

*What it communicates: The algorithm hides most of your own subscriptions from you. Antiviral doesn't. Your existing library is richer than you think.*

*Audit check: ✅ Fully deliverable. Provider search queries all subscribed RSS feeds, not a subset. Embedding-based relevance ranking against conversational intent.*

---

### 15. The 90%

> Your subscriptions published 200 videos this week. YouTube showed you 15 of them. What about the other 185?
>
> They weren't buried because they were bad. They were buried because the algorithm thought something else would keep you watching longer.
>
> Antiviral doesn't hide your own feed from you. It searches everything you follow and shows what actually matches what you asked for.

*What it communicates: Same core message as #14 but with a specific, startling ratio. "200 videos, YouTube showed you 15" is a number people can feel.*

*Audit check: ✅ Fully deliverable. RSS feeds return all recent items from subscribed channels. The system searches the full pool.*

---

### 16. The Intersection

> You've been watching pottery videos. You've also been reading about Japanese culture. You never thought to search for Japanese pottery specifically.
>
> Antiviral noticed the overlap. It found a video about a ceramicist in Kyoto from a channel you already follow. You didn't ask for it. But it was already in your library, waiting.
>
> Discovery doesn't require surveillance. It just requires paying attention to what you've already told it.

*What it communicates: The interest graph finds connections between topics the user hasn't explicitly linked. Serendipity from your own data.*

*Audit check: ✅ Fully deliverable. Embedding vectors for interest graph nodes can be compared for proximity. Content from subscriptions is matched against the combined vector space of the user's active topics.*

---

### 17. The Dormant Shelf

> Remember when you were into woodworking? That was six months ago. You moved on. But three of your channels just posted new woodworking content.
>
> YouTube forgot. Antiviral didn't.
>
> Your old interests aren't gone. They're archived. And when something new shows up that matches, the app can let you know.

*What it communicates: Temporal memory preserves past interests. The algorithm is amnesiac; Antiviral isn't.*

*Audit check: ✅ Fully deliverable. Interest graph archives dormant topics (weight decayed but not deleted). RSS content from subscriptions is matched against all active and dormant nodes. Proactive suggestion chips can surface dormant-topic matches.*

---

### 18. The Book Club

> Your YouTube subscriptions are your library. But who's finding the stuff you'd never think to search for?
>
> Add a subreddit. r/pottery. r/stoicism. r/astrophotography. A community of people who share what they find across the entire internet — videos, articles, podcasts, discussions — all showing up in your feed alongside your own subscriptions.
>
> It's like joining a book club. You bring your taste. They bring the surprises.

*What it communicates: Reddit as the free-tier discovery layer. Community-curated content as the antidote to algorithmic discovery. No API key, no account, no surveillance.*

*Audit check: ✅ Fully deliverable. Reddit RSS feeds are public, no API required. Subreddit content parsed and displayed alongside other providers.*

---

## Part 2: Landing Page Section — "But Will I Miss Out?"

Add this as a new section on the landing page, positioned **after** "How It Works" and **before** the Family/Privacy section. It directly addresses the objection that the hero blocks above start to defuse.

### Section Header

**You're already missing out.**

### Body Copy

```
YouTube shows you content from a fraction of the channels you follow.
The rest gets buried — not because it's bad, but because the algorithm
decided something else would keep you scrolling longer.

Antiviral searches everything you follow. Every channel. Every podcast.
Every blog. When you ask for something, it looks through your entire
library — not the 10% the algorithm picked for you.

And it finds connections you haven't made yet.
```

### Three Discovery Panels (visual, side by side)

**Panel 1: Your Hidden Library**

```
You follow 150 channels. You see content from maybe 20.

Antiviral searches all of them — and ranks by what you
asked for, not what gets the most clicks.
```

**Panel 2: Connections You Haven't Made**

```
You've been watching pottery. You've been reading about Japan.
Antiviral finds a video about a ceramicist in Kyoto that's been
sitting in your subscriptions for a week.

Your interests have intersections. The algorithm ignores them.
Antiviral doesn't.
```

**Panel 3: Interests Don't Expire**

```
Remember when you were into astrophotography? Your channels are
still posting about it. Antiviral remembers what you used to
care about — and when something new matches, it lets you know.

"Surprise me" means: show me something from a corner of my
library I haven't visited in a while.
```

---

## Part 3: Updated Conversation Examples

The conversation demo on the website (the `you →` / `antiviral →` exchange) should include at least one discovery-focused interaction. Replace or add alongside the existing examples.

### Discovery Example (add as 4th or 5th in the demo sequence)

```
you → surprise me

antiviral → You haven't watched anything about
astrophotography in two months, but one of your
channels just posted a timelapse from the Atacama
Desert. Also found a pottery video from a Japanese
channel you rarely watch — it connects two things
you've been into lately. Want to see either?
```

*Why this works: It shows four capabilities in one exchange — dormant topic resurfacing, new content detection, cross-topic intersection, and choice-based presentation. The user sees that "surprise me" produces something specific and personal, not random. And everything came from their own subscriptions.*

### Reddit Example (add to show community discovery)

```
you → I keep seeing the same pottery channels. 
      show me what I'm missing

antiviral → You could add r/pottery — it's a 
community that shares videos, articles, and 
tutorials from across the internet. I'll mix 
their finds into your feed alongside your own 
subscriptions. Want to add it?
```

*Why this works: It shows the user how to expand their discovery surface without an algorithm. The app suggests a specific, named community. The user decides.*

---

## Part 4: FAQ Addition

Add to the FAQ / Objection Handling section of the copy doc:

### "Won't my feed become an echo chamber?"

```
The opposite. YouTube's algorithm shows you a narrow slice of what
you follow, optimized for engagement. Antiviral searches everything
you follow — every channel, every podcast, every blog — and finds
things the algorithm buried.

It also notices connections between your interests that you might
not have made yourself. If you're into both pottery and Japanese
culture, Antiviral will find the ceramicist in Kyoto that's been
sitting in your subscriptions for a week.

And when you say "surprise me," it knows what you used to care
about — topics you haven't visited in months — and resurfaces
them when something new matches.

You're not narrowing your world. You're finally seeing all of it.
```

### "How do I discover new things if I only see my subscriptions?"

```
Three ways:

First, your subscriptions produce far more content than any algorithm
shows you. Most people follow 50-200 channels. YouTube shows them
content from maybe 20. Antiviral searches all of them.

Second, add a subreddit. Communities like r/pottery or r/stoicism
surface the best content from across the entire internet — videos,
articles, podcasts — curated by people who care about the topic,
not by an engagement algorithm. It's free, and it shows up in your
feed alongside everything else.

Third, your interest graph finds intersections. When two of your
topics overlap, the app surfaces content that connects them — even
if you never thought to search for that combination.
```

---

## Part 5: Tagline Candidates

If the discovery concern is strong enough that it should be addressed at the tagline level, here are options that could work as secondary taglines or as section headers:

- **"You're already missing out. Your algorithm is hiding your own feed from you."**
- **"Antiviral doesn't show you less. It shows you what was already yours."**
- **"Your subscriptions are bigger than your algorithm thinks."**
- **"Discovery doesn't require surveillance. It just requires paying attention."**
- **"Everything you follow. Not just the 10% the algorithm picked."**

The strongest of these for the landing page is: **"You're already missing out."** It's counterintuitive — the user expects Antiviral to mean *less* content, and this reframes it as *more*. The algorithm is the thing hiding content from them, not Antiviral.

---

## Implementation Notes

**Where each piece goes:**

| Content | Location |
|---|---|
| Hero blocks #14-18 | Add to `website-hero-copy-final.md` rotation |
| "But Will I Miss Out?" section | New landing page section (myantiviral.ai) |
| Discovery conversation examples | Website conversation demo component |
| FAQ additions | antiviral-copy.md Objection Handling section |
| Tagline candidates | Landing page section header + possible A/B test |

**Hero rotation rebalancing:**

With the discovery blocks added, rebalance the rotation weights. The discovery blocks should appear at **medium-high frequency** — not as often as the default #1 (Pizza Pipeline) but more often than niche blocks like The Time Machine or The Mirror.

Updated high-frequency set:
- #1 Pizza Pipeline (default)
- #3 The Conversation
- **#14 The Buried Feed** (new — directly addresses the concern)
- #6 The Mix

Updated medium-frequency set:
- **#15 The 90%** (new)
- **#16 The Intersection** (new)
- #1f The Quiet Feed
- #8 The Privacy

**Audience-weighted additions:**

| Referral Source | Add to Rotation |
|---|---|
| Product Hunt / general tech | #14 (Buried Feed), #15 (The 90%) |
| Hacker News / dev communities | #14 (Buried Feed), #18 (Book Club) |
| Parenting forums | #17 (Dormant Shelf), #16 (Intersection) |
| Reddit communities | #18 (Book Club) — obviously |
| "The Curation Gap" essay | #14 (Buried Feed), #15 (The 90%) |

---

*Studio Ikigai · studioikigai.ai*
