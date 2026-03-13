# Antiviral — Website Hero Copy Rotation (Revised)

**Studio Ikigai — March 2026**

*Revised for consistency with the Metadata Honesty Audit. Every claim in every hero block is deliverable from RSS metadata + SwiftData (watch history, interest graph, completion ratios, conversation log). No block promises depth assessment, content analysis, fact-checking, or curriculum sequencing.*

These are interchangeable hero blocks for myantiviral.ai (and getantiviral.app). Each communicates a different facet of what makes Antiviral fundamentally different from a search bar, aggregator, or algorithmic feed. The site rotates between them on each visit or on a timed interval.

Tone: darkly funny, specific, wry. Not moral panic. Not "algorithms bad." Assumes the reader is smart. The reader should laugh and then think "wait, that actually happened to me."

---

## The Collection

### 1. The Pizza Pipeline (default — show most often)

> You searched for a good pizza place. Three videos later you're watching a guy explain why the moon landing was staged.
>
> The algorithm didn't break. That's how it works.
>
> Antiviral is a feed that does what you actually asked for.

*What it communicates: The algorithm is working as designed — for someone else's benefit. Antiviral responds to what you said.*

*Audit check: ✅ Fully deliverable. "Does what you asked for" = intent parsing into search queries against subscriptions.*

---

### 2. The Memory

> You watched something last month. It was about buildings — not architecture exactly, but how spaces shape the way people feel. You can't remember the title. You can't remember the channel. YouTube certainly doesn't remember.
>
> Antiviral remembers.

*What it communicates: The app has memory. It knows your history. It can find things you forgot.*

*Audit check: ✅ Fully deliverable. WatchHistoryTool queries SwiftData. Embedding fallback matches vague descriptions ("buildings and feelings") against cached content embeddings by cosine similarity.*

---

### 3. The Conversation

> You've never been able to say "I'm done with that" to a search bar. Or "more from this creator." Or "surprise me with something I haven't thought about in a while."
>
> Antiviral is a feed you talk to. And it actually listens.

*What it communicates: Natural language interaction, not keywords. The feed responds to conversational instructions.*

*Audit check: ✅ All three examples are fully deliverable. "I'm done with that" = topic dismissal (weight → 0). "More from this creator" = filter by creator in subscription feeds. "Surprise me with something I haven't thought about in a while" = query dormant-but-not-dismissed topics via interest graph decay model.*

*Changed from original: Removed "go deeper on this" (RED — not deliverable from metadata). Replaced with "more from this creator" and "I'm done with that," both fully deliverable.*

---

### 4. The Honesty

> YouTube will never tell you "you've been in a rabbit hole for two hours." It will never say "you're only watching one kind of thing." It will never suggest you stop.
>
> Antiviral will.

*What it communicates: The app is honest and self-aware. It reflects your patterns back to you instead of exploiting them.*

*Audit check: ✅ Fully deliverable. Session duration is tracked in SwiftData. Topic diversity is computed from interest graph weights. The suggestion chips can surface these observations proactively.*

---

### 5. The Mirror

> What if your feed could tell you what you've been circling lately? Not what the algorithm thinks you want — what you've actually watched, how often you came back to it, and what you quietly stopped caring about.
>
> Antiviral is a map of your own curiosity.

*What it communicates: Self-knowledge. The interest graph as a reflective tool, not a manipulation engine.*

*Audit check: ✅ Fully deliverable. "What you've actually watched" = watch history. "How often you came back" = engagement count per topic. "What you quietly stopped caring about" = declining sentiment / weight decay in interest graph.*

*Changed from original: "how deeply you went" → "how often you came back to it." The system tracks engagement frequency, not intellectual depth.*

---

### 6. The Mix

> A YouTube video about pottery. A podcast episode about the philosophy of craft. A blog post about a ceramicist in Kyoto. From three different sources, in one feed, ranked by what you asked for.
>
> No platform does this. Antiviral does.

*What it communicates: Multi-source aggregation. Videos, podcasts, and articles together — not siloed by platform.*

*Audit check: ✅ Fully deliverable. Multi-provider search + embedding-based relevance scoring against user's conversational intent.*

*Changed from original: "ranked by what matters to you right now" → "ranked by what you asked for." The original phrasing implies the system knows what matters to you independent of what you said. The system ranks by conversational intent, not inferred importance.*

---

### 7. The Compound

> The first time you say "more on this," it's a search. The tenth time, it's a relationship. Antiviral remembers every conversation, every skip, every "I'm done with that." Your feed gets sharper the more you use it — not because it's watching you, but because you're teaching it.
>
> The feed learns because you talk to it. Not because it tracks you.

*What it communicates: Compounding intelligence through dialogue, not surveillance. The more you talk, the better it gets.*

*Audit check: ✅ Fully deliverable. Interest graph weights update on every interaction. Skip signals decay topic weights. Explicit instructions ("I'm done") modify graph immediately. Each turn's ContextSnapshot carries the accumulated state.*

*Changed from original: "go deeper" → "more on this." "More like this" → "I'm done with that." All examples now reference deliverable operations.*

---

### 8. The Privacy

> Your YouTube history lives on Google's servers. Your podcast data goes to Apple. Your reading habits go to whoever runs the blog. Every platform builds a profile of you that you've never seen and can't delete.
>
> Antiviral keeps everything on your device. There's no server. There's no profile. There's nothing to delete because nothing ever left.

*What it communicates: On-device privacy as architecture, not policy.*

*Audit check: ✅ Fully deliverable. All data in SwiftData on-device. No server, no analytics SDK, no tracking.*

---

### 9. The Refusal

> YouTube's algorithm never says "I don't have anything good for that." It always shows you something — even when it's garbage dressed up with a good thumbnail.
>
> Antiviral will tell you: "I couldn't find a match in your subscriptions. Want to add a source?"
>
> Honest software. Imagine.

*What it communicates: The app tells the truth. It doesn't fill the feed with garbage to avoid looking empty.*

*Audit check: ✅ Fully deliverable. ResultMessageBuilder returns honest no-match responses. Source suggestion is a defined flow in the spec.*

---

### 10. The Time Machine

> "What was I into last October?"
>
> No search bar on earth can answer that. Antiviral can — because it's been tracking what you watched, when you watched it, and what you kept coming back to.
>
> Your feed has a memory. And it's yours to explore.

*What it communicates: Temporal queries. The ability to look back at your own content history through natural language.*

*Audit check: ✅ Fully deliverable. Interest graph stores WeightSnapshot history with daily samples. WatchHistory has timestamps and completion ratios. The LLM calls these tools and composes a summary.*

*Changed from original: "tracking what you watched and how deeply" → "tracking what you watched, when you watched it, and what you kept coming back to." Removes depth claim. Replaces with observable engagement signals: timestamps and return frequency.*

---

### 11. The Teacher

> A fifth-grade science teacher types: "water cycle videos from National Geographic and SciShow Kids."
>
> The feed builds itself. No playlist. No Sunday-night curation session. No algorithm. Just a sentence and a feed that does what it's told.
>
> Antiviral for classrooms. Coming fall 2026.

*What it communicates: Education use case. Natural-language curation for teachers. Targets Segment D.*

*Audit check: ✅ Fully deliverable. Topic keyword search + source filtering by creator name against subscription list.*

*Changed from original: Removed "age-appropriate" from the teacher's query. The system infers age-appropriateness from titles and descriptions (YELLOW in audit), but it's a heuristic, not a guarantee. The teacher example is stronger when it shows source-specific curation ("from National Geographic and SciShow Kids") — the teacher is choosing trusted sources, and the system curates within them. That's the honest model: the teacher sets the library, the app searches it.*

---

### 12. The Parent

> "Documentaries about anything. Nothing with jump scares. Science and nature only on school nights."
>
> That's not a settings panel. That's a sentence. Antiviral translates it into content policies and curates your kid's feed from sources you trust — not from an algorithm's engagement metrics.
>
> Content rules in your own words.

*What it communicates: Family tier. Natural-language parental controls. Targets Segment B.*

*Audit check: ✅ with caveat. The LLM translates natural language policies into system prompt modifiers that filter content by title, description, and source metadata. "Nothing with jump scares" is enforced by keyword and description inference — the system can't watch the video. This is the same limitation every content filter has, and the onboarding should note that no filter is 100%. The copy itself is honest: "translates it into content policies" accurately describes the mechanism.*

*Changed from original: "Antiviral understands it, enforces it" → "Antiviral translates it into content policies and curates your kid's feed from sources you trust." "Understands and enforces" implies content-level comprehension. "Translates into content policies and curates from trusted sources" accurately describes the two things the system does: NL → policy rules, and search within parent-curated subscription list.*

---

### 13. The Librarian

> You don't walk into a library and hand the librarian a keyword. You say "I'm in the mood for something about that architect — the one who thought buildings could make people kinder."
>
> The librarian checks what you've been reading. They search the shelves you've already picked. They pull a few things that match.
>
> That's Antiviral. A librarian for your YouTube, podcasts, and blogs. Running entirely on your phone.

*What it communicates: The core librarian metaphor. Intent-based curation from a trusted, personal source.*

*Audit check: ✅ Fully deliverable. "Checks what you've been reading" = WatchHistoryTool. "Searches the shelves you've already picked" = subscription-based provider search. "Pulls a few things that match" = embedding-based relevance ranking. The vague input ("the one who thought buildings could make people kinder") is matched via EmbeddingFallbackSearch against cached content embeddings.*

*Changed from original: "They know your taste. They pull three things from different sections." → "They check what you've been reading. They search the shelves you've already picked. They pull a few things that match." The original implied the librarian has subjective taste knowledge. The revised version describes what the system actually does: queries your history, searches your subscriptions, ranks by relevance. Same warmth, honest mechanics.*

---

### 1b. The Cooking Pipeline

> You wanted a 10-minute dinner recipe. YouTube gave you a 10-minute dinner recipe, then a carnivore diet documentary, then a guy yelling about seed oils, then a two-hour lecture on why the food pyramid was a government conspiracy.
>
> You just wanted pasta.
>
> Antiviral would have shown you pasta.

*Audit check: ✅ Fully deliverable. Topic-scoped search within subscriptions. No autoplay. No recommendation engine.*

---

### 1c. The Homework Spiral

> Your kid searched for "how do volcanoes work" for a science project. Twenty minutes later they were watching a video about supervolcano extinction events narrated by someone who also has opinions about the rapture.
>
> YouTube calls this "discovery." You might call it something else.
>
> Antiviral shows what you asked for. Nothing more. Nothing less.

*Audit check: ✅ Fully deliverable. Topic-scoped search + content policy layer for managed profiles. No autoplay, no recommendations.*

---

### 1d. The Autoplay Confession

> Be honest. You've opened YouTube to watch one specific video and closed the app forty minutes later having watched none of the things you intended and all of the things you didn't.
>
> That's not a lack of willpower. That's a billion-dollar recommendation engine working exactly as designed.
>
> Antiviral doesn't recommend. It curates what you asked for, from sources you chose, and then it stops.

*Audit check: ✅ Fully deliverable. Subscription-based curation. No autoplay. No recommendation engine. Feed ends when content ends.*

---

### 1e. The Three Clicks

> You're always three clicks from somewhere you didn't mean to go. A cooking video leads to a health documentary leads to a conspiracy theory leads to — well, you know how it ends.
>
> Antiviral doesn't have a next video. It has your feed, built from your words, and when you're done, it's done.

*Audit check: ✅ Fully deliverable. No autoplay. No "up next." Feed is finite and scoped to the user's query.*

---

### 1f. The Quiet Feed

> YouTube's feed has 47 things competing for your attention right now. Thumbnails designed to make you click. Titles engineered to make you anxious. An autoplay queue that never ends.
>
> Antiviral's feed has what you asked for. When you stop asking, it stops showing.
>
> A feed that respects silence. What a concept.

*Audit check: ✅ Fully deliverable. Feed is query-scoped. No algorithmic backfill. No autoplay.*

---

### 1g. The Search Bar

> You type "jazz albums for beginners" into YouTube. You get: a listicle with 4 million views, an ad for a music production course, a reaction video, and a 45-minute argument about whether Kenny G is jazz.
>
> You type the same thing into Antiviral. You get: jazz videos from channels you already follow, a podcast episode from a music show in your subscriptions, and a blog post from a newsletter you read.
>
> Same question. Very different answers.

*What it communicates: Same query, radically different results because Antiviral searches your library, not the entire platform.*

*Audit check: ✅ Fully deliverable. Multi-provider search scoped to user's subscriptions. Embedding-based relevance ranking.*

*Changed from original: "the three best jazz videos from channels you already trust" → "jazz videos from channels you already follow." "Best" implies quality assessment from metadata (not deliverable). "Channels you already follow" is literally what the subscription-based model does. Also removed "your favorite music critic" — the system doesn't track creator favoritism unless the user has explicitly high engagement.*

---

### 1h. The Rabbit Hole

> You searched for a great pizza place. Somehow you ended up watching a video about pizza-gate.
>
> That's not a bug. That's the algorithm doing its job. Outrage gets clicks. Clicks get ads. Ads get money. Your curiosity was the raw material.
>
> Antiviral doesn't have an algorithm. It has a conversation. You say what you want. It finds it. Nobody gets paid when you fall down a hole.

*Audit check: ✅ Fully deliverable. Conversational curation from subscriptions. No ad model. No engagement optimization.*

---

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

## Recommended Rotation

**High-frequency (show most often):**
- #1 The Pizza Pipeline — the new default, strongest first impression
- #3 The Conversation — shows the core interaction model
- #14 The Buried Feed — directly addresses the "will I miss out?" concern
- #6 The Mix — communicates multi-source, the structural differentiator

**Medium-frequency:**
- #15 The 90% — startling ratio drives the discovery message home
- #16 The Intersection — cross-topic serendipity from your own data
- #1f The Quiet Feed — emotional, resonates broadly
- #8 The Privacy — critical for tech-savvy audience
- #1g The Search Bar — concrete before/after comparison
- #1d The Autoplay Confession — self-recognition humor
- #4 The Honesty — differentiates on self-awareness

**Lower-frequency (reward repeat visitors with range):**
- #17 The Dormant Shelf — shows temporal memory
- #18 The Book Club — Reddit as community discovery layer
- #2 The Memory — shows temporal capability
- #5 The Mirror — shows self-reflection capability
- #10 The Time Machine — shows temporal queries
- #9 The Refusal — shows honesty-as-feature

**Audience-weighted by referral source:**

| Referral Source | Weight Toward |
|---|---|
| Product Hunt / general tech | #14 (Buried Feed), #15 (The 90%), #1 (Pizza Pipeline), #3 (Conversation) |
| Hacker News / dev communities | #14 (Buried Feed), #18 (Book Club), #8 (Privacy), #1h (Rabbit Hole) |
| Parenting forums / "The Parenting Gap" essay | #17 (Dormant Shelf), #16 (Intersection), #1c (Homework Spiral), #12 (Parent) |
| Reddit communities | #18 (Book Club), #14 (Buried Feed) |
| Education / "The Curation Gap" essay | #14 (Buried Feed), #15 (The 90%), #11 (Teacher), #4 (Honesty) |
| What Truth Remains Substack | #13 (Librarian), #5 (Mirror), #1h (Rabbit Hole) |
| Default (no referral) | Equal weight, leaning toward #1, #3, #14, #6 |

**Below the hero:** The rest of the landing page (How It Works panels, privacy callout, family section, waitlist CTA) remains static. Only the hero block rotates.

**A/B testing (post-launch):** Track which hero variant has the highest waitlist conversion rate. After 1,000+ visits, keep the top 5-6 performers and retire the rest.

---

## Audit Compliance Summary

| Hero | Audit Findings Addressed | Status |
|---|---|---|
| #1 Pizza Pipeline | N/A (new, clean) | ✅ Clean |
| #2 Memory | N/A (was clean) | ✅ Clean |
| #3 Conversation | Removed "go deeper" (Finding 1, RED) | ✅ Fixed |
| #4 Honesty | N/A (was clean) | ✅ Clean |
| #5 Mirror | Removed "how deeply you went" (Finding 1/7) | ✅ Fixed |
| #6 Mix | Reframed "ranked by" (Finding 9) | ✅ Fixed |
| #7 Compound | Removed "go deeper" (Finding 1, RED) | ✅ Fixed |
| #8 Privacy | N/A (was clean) | ✅ Clean |
| #9 Refusal | N/A (was clean) | ✅ Clean |
| #10 Time Machine | Removed "how deeply" (Finding 1/7) | ✅ Fixed |
| #11 Teacher | Removed "age-appropriate" (Finding 5, YELLOW) | ✅ Fixed |
| #12 Parent | Reframed "understands/enforces" (Finding 5/9) | ✅ Fixed |
| #13 Librarian | Reframed "know your taste" (Finding 10) | ✅ Fixed |
| 1b Cooking | N/A (new, clean) | ✅ Clean |
| 1c Homework | N/A (new, clean) | ✅ Clean |
| 1d Autoplay | N/A (new, clean) | ✅ Clean |
| 1e Three Clicks | N/A (new, clean) | ✅ Clean |
| 1f Quiet Feed | N/A (new, clean) | ✅ Clean |
| 1g Search Bar | Removed "best" and "favorite" (Finding 1/7) | ✅ Fixed |
| 1h Rabbit Hole | N/A (new, clean) | ✅ Clean |
| #14 Buried Feed | N/A (new, clean) | ✅ Clean |
| #15 The 90% | N/A (new, clean) | ✅ Clean |
| #16 Intersection | N/A (new, clean) | ✅ Clean |
| #17 Dormant Shelf | N/A (new, clean) | ✅ Clean |
| #18 Book Club | N/A (new, clean) | ✅ Clean |

Every hero block now promises only what the architecture can deliver from RSS metadata + SwiftData.

---

*Studio Ikigai · studioikigai.ai*
