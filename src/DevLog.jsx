import { useEffect } from "react";

const ENTRIES = [
  {
    date: "July 14, 2026",
    title: "Testing the model like a scientist",
    body: [
      "Before trusting the on-device model with bigger jobs, I ran a real experiment on it. Pre-registered, even: the test corpus and the expected outcomes were committed to the repo before the first run, so I couldn't rationalize the results after the fact. Every output was judged blind in a little local UI I built for the occasion.",
      "The numbers: 330 of 330 generations came back, every one structurally valid, median latency 517ms. The genuinely interesting finding — asking the model to parse a request almost never trips its guardrails, but asking it to write a message about the results triggered refusals 44% of the time. The model understands fine; it's the talking that makes it nervous.",
      "Which is exactly why Antiviral splits those into two phases and never lets the model narrate unsupervised. It's satisfying when an experiment vindicates a design decision you made under fire four months earlier (see March 6).",
    ],
  },
  {
    date: "July 9–13, 2026",
    title: "“No politics today”",
    body: [
      "You can now tell Antiviral “no politics today” and it means exactly that: today. The mute expands to cover the whole category, holds until your local calendar day rolls over, then quietly expires. A mute with a fuse — not a permanent setting you'll forget you flipped and wonder six months later why your feed feels lobotomized.",
      "Underneath it, I landed the plumbing for open-vocabulary mutes — arbitrary constraints, not just known categories — as a dormant seam. There's a head-to-head planned between Apple's model and a small local model for interpreting them; when one wins, it switches on without re-plumbing anything.",
    ],
  },
  {
    date: "July 3–7, 2026",
    title: "Breaking up the god object",
    body: [
      "The curation engine had slowly become the classic god object: one actor that planned, scored, paginated, and assembled everything. This week I broke it up — but in the safe order. First, characterization tests that pin the engine's observable behavior exactly as it is. Then carve out one named collaborator at a time — the turn planner, the load-more scorer, the update assembly, the pagination bookkeeping — one extraction per commit, tests green after each.",
      "The engine's behavior didn't change at all. That was the whole point.",
    ],
  },
  {
    date: "June 24–26, 2026",
    title: "You can argue with the feed",
    body: [
      "The correction loop shipped. When something shows up that shouldn't, you say “this doesn't belong” — and instead of a mystery thumbs-down that vanishes into a black box, Antiviral mints a durable rule. Your rules live in a Standing Instructions list you can read, inspect, and delete. Related rules get consolidated so the list doesn't sprawl into a hundred variations of the same complaint. And the feed tells you what your rules are doing: “3 items hidden by your rules,” right there in the open.",
      "My favorite detail is a small honesty thing: if a rule only down-ranks something rather than removing it outright, the acknowledgment says you'll see “fewer” of it — not “gone.” The app doesn't get to overpromise, even in a confirmation message.",
    ],
  },
  {
    date: "June 23–24, 2026",
    title: "The relevance war",
    body: [
      "A search returning something is not the same as a search returning what you asked for. This week was about that gap. The worst offender: single-word matching, where a query about modeling aircraft would happily surface a video about threat modeling because one word overlapped. Matching is now coverage-aware — a result has to hit enough of the query to plausibly be about it.",
      "Also fixed: the same podcast episode syndicated under three different show names no longer shows up three times. And I ran a spike on a Wikipedia-style “which one did you mean?” disambiguation picker, and wrote down the honest verdict: no. Not every idea survives contact with a prototype, and the repo remembers the ones that didn't.",
    ],
  },
  {
    date: "June 21 – July 9, 2026",
    title: "The audit machine",
    body: [
      "I audited the entire codebase and turned every finding into a numbered plan — they run from 001 to 079 — with each one landing as its own commit. Three weeks of this, peaking at 44 commits in a single day.",
      "The haul: security fixes (ZIP imports now extract into a confined directory; user content redacted from logs), performance wins (caching taxonomy embeddings skips 809 embedding computations on every cold launch; one decorative animated border turned out to be pinning 21% idle CPU), and continuous integration, finally. My favorite commit from the stretch is a dead-code sweep: 666 deletions, 5 insertions. Deleting code you've verified is dead is one of the purest joys in this job.",
    ],
  },
  {
    date: "June 21, 2026",
    title: "A Mac-assed Mac app",
    body: [
      "Twenty-five commits in one day turning the macOS version from “SwiftUI app that happens to launch on a Mac” into something that behaves like it belongs there: a real menu bar, window state restoration, light mode, keyboard navigation, and ⌘Z that actually un-saves the thing you just saved.",
      "The commit I'll remember: I had put dismiss on ⌘D, and a review pass caught that ⌘D is bookmark by Mac convention — the exact opposite of dismissing something. It's ⌘⌫ now. Platform conventions exist because someone else already made your mistake.",
    ],
  },
  {
    date: "June 17–18, 2026",
    title: "Grounding the feed in the real world",
    body: [
      "Antiviral now grounds topics against Wikipedia and Wikidata — so it knows whether your “Mercury” is the planet, the element, or the singer, and stays silent when it isn't sure rather than guessing. That grounding spine also powers a line I decided to draw hard: encyclopedias, dictionaries, and lookup sites are reference. Reference is infrastructure you consult, not content that belongs in a feed — so it's excluded from feed candidacy entirely, at every layer.",
      "Also new: press and hold any card to ask “why this item?” and get the actual scoring breakdown. Getting press-and-hold to coexist with scrolling took five consecutive commits of fighting SwiftUI's gesture system — attempt, revert, revert again — before I gave up and wrote it in UIKit by hand. Sometimes the modern framework loses.",
    ],
  },
  {
    date: "May 29 – June 2, 2026",
    title: "Eight commits to get one gesture right",
    body: [
      "There's a stretch in the history where you can watch a single gesture get designed in public. Drag a card to react: first the reaction bar revealed on release, then continuously as you drag. Then the preview chip appeared at drag start instead of mid-drag. Then it floated near your finger. Then above your finger — because your finger is exactly on top of where the chip was.",
      "The final commit in the sequence deletes the confirmation step I had built earlier that same week. Arming the gesture and tapping is the confirmation.",
    ],
  },
  {
    date: "May 28–29, 2026",
    title: "To the car and the lock screen",
    body: [
      "Back at it — and straight to where audio actually gets listened to. CarPlay support, lock-screen artwork, scrubbing and playback-rate controls from the lock screen, and the proper spoken-audio session category so podcasts behave like podcasts.",
      "Fixed a crash where lock-screen artwork was being requested on a background queue, and pinned it with a regression test before moving on.",
    ],
  },
  {
    date: "April 14–17, 2026",
    title: "The hardening pass",
    body: [
      "Four days on the things no screenshot can show: Swift 6 strict-concurrency hygiene across the engine, hardening embedding deserialization against malformed data, capping unbounded fetches, bringing every tap target up to Apple's 44-point minimum.",
    ],
  },
  {
    date: "March 16–21, 2026",
    title: "A hand of cards, not a feed",
    body: [
      "The feature the whole app had been walking toward: Shortlist mode. Instead of an infinite scroll, Antiviral deals you a hand — a small, finite set of cards, dealt one by one with a stagger, each carrying a caption that says why it was included. Watch them, and the session ends. On purpose. There is no bottom of an infinite feed, so I built a top instead.",
      "The rest of the week was making the hand worth dealing: filtering items that don't actually match, penalizing weak matches instead of padding with them, backfilling from cache when results run thin. A small hand only works if every card earns its slot.",
    ],
  },
  {
    date: "March 13–14, 2026",
    title: "“Why am I seeing this?”",
    body: [
      "Three features in two days. Every card can now explain why it's in front of you — computed deterministically from the actual scoring signals, no model in the loop, so the explanation is the truth rather than a plausible story. Ask “what was that video about sourdough from last week?” and Antiviral searches your own watch history, on-device. Describe a creator in plain words and it finds the channel.",
      "One feature also got retired this week, honestly. “Go deeper” couldn't be done properly with the pipeline as it stood — so rather than fake depth, the command now answers like HAL 9000.",
    ],
  },
  {
    date: "March 12, 2026",
    title: "It runs on the Mac now",
    body: [
      "A macOS target landed, with a sidebar-and-inspector layout instead of a stretched phone UI — plus a Safari extension, so the page you're reading in Safari can be pushed straight into Antiviral as a source. The extension later learned to sniff out podcast feeds from webpages on its own.",
    ],
  },
  {
    date: "March 10–12, 2026",
    title: "More places to pull from",
    body: [
      "Reddit joined via public RSS. Bluesky joined properly: posts render natively — real layout, video, follow and unfollow from inside the app — not a webview wearing a trench coat.",
      "Four TestFlight builds shipped in 72 hours this stretch, the fastest cadence of the whole project.",
    ],
  },
  {
    date: "March 9–11, 2026",
    title: "Teaching a small model to be trustworthy",
    body: [
      "Apple's on-device model is small, and small models need guardrails you build yourself. This week was the mitigation pipeline: a token-budgeted snapshot of what's on screen so the model has real context, a validator that checks every output against eight rules, a confidence gate that decides whether to proceed, fall back to semantic search, or just ask you what you meant, and pronoun resolution — “play that one” — handled before the model ever sees the message.",
      "The part I'm proudest of, process-wise: all 81 phase-gate tests were written and committed before any of the implementation. Every phase had its pass/fail line drawn in advance. Also from this week: a generation counter on requests, so a slow stale answer can never overwrite a newer one.",
    ],
  },
  {
    date: "March 6–7, 2026",
    title: "The model was making things up",
    body: [
      "First real fight with the LLM. The curator message would confidently describe results it had never seen — “here are some great videos about X” attached to a feed that contained no such thing. The fix that stuck: split generation into two phases. Phase one plans the searches. Phase two writes the message — only after the real results are back, and only about them. The model never gets to describe content it hasn't seen. This constraint ends up mattering for the entire life of the project.",
      "The conversation bar also got promoted this week from a search field on one screen to the app's persistent spine — one bar, everywhere, aware of which screen you're on.",
    ],
  },
  {
    date: "March 5, 2026",
    title: "Less model, more code",
    body: [
      "Topic categorization started life as an LLM-plus-Wikipedia pipeline. Four days in, I replaced it with a static taxonomy: deterministic, instant, testable. This became the house rule for the whole project — use the model where it's genuinely good (understanding what you mean), and use plain code everywhere reliability matters. A surprising amount of building with AI is deciding where not to use it.",
    ],
  },
  {
    date: "March 2–5, 2026",
    title: "Bring your own subscriptions",
    body: [
      "Early architectural decision: don't live on the YouTube Data API. Daily content comes from YouTube's public RSS feeds instead — no quota anxiety, no standing credentials. To get your subscriptions in, you export a Google Takeout ZIP and hand the app the file: bring your own graph, rather than granting a permanent token. (A read-only, revocable OAuth import exists too, for the impatient.)",
    ],
  },
  {
    date: "March 1, 2026",
    title: "Day one: the whole loop",
    body: [
      "The first commit isn't a scaffold. It's the loop: type what you want, the on-device model plans searches, providers go fetch, ranked cards come back, playback works — with the interest graph and watch history persisting underneath, and 109 tests passing. By the end of the day the app also had multiple content providers, an audio subsystem, onboarding, settings, caching, and offline decay.",
      "Full disclosure about that velocity: I build Antiviral pair-programming with Claude, and day one is what that looks like. The taste, the decisions, and the mistakes in this log are mine; the typing speed is shared. It felt right that an app about honest AI curation should be honest about how it's made.",
    ],
  },
];

export default function DevLog() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Dev Log — Antiviral";
    return () => { document.title = prevTitle; };
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0A",
      color: "#fff",
      fontFamily: "'Karla', 'Helvetica Neue', sans-serif",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { color: rgba(255,255,255,0.5); outline: none; }
        a:hover { color: rgba(255,255,255,0.8); }
        a:focus-visible {
          outline: 2px solid #6B9E6F;
          outline-offset: 3px;
          border-radius: 2px;
        }
        @media (max-width: 768px) {
          nav, main { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>

      <nav style={{
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "760px",
        margin: "0 auto",
      }}>
        <a href="/" style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "18px",
          fontWeight: 500,
          letterSpacing: "0.05em",
          color: "#fff",
          textDecoration: "none",
        }}>
          antiviral
        </a>
      </nav>

      <main style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "80px 40px 160px",
      }}>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#6B9E6F",
          marginBottom: "20px",
        }}>
          Dev Log
        </p>

        <h1 style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 400,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          marginBottom: "24px",
        }}>
          Building Antiviral
        </h1>

        <p style={{
          fontSize: "17px",
          lineHeight: 1.75,
          color: "rgba(255,255,255,0.6)",
          marginBottom: "12px",
        }}>
          Antiviral replaces the algorithmic feed with something you can talk to. This is
          the story of building it — distilled from the real commit history, 429 commits
          between March and July 2026, told newest-first. I write the log; the app is
          built by me and Claude, pair-programming. The commits are co-authored, and so,
          in fairness, is the app.
        </p>

        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "13px",
          color: "rgba(255,255,255,0.55)",
        }}>
          March – July 2026 · newest first
        </p>

        {ENTRIES.map((entry, i) => (
          <article key={entry.date + entry.title} style={{
            marginTop: i === 0 ? "72px" : "56px",
            paddingTop: "48px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#6B9E6F",
              marginBottom: "12px",
            }}>
              {entry.date}
            </p>
            <h2 style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: "26px",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
              marginBottom: "18px",
            }}>
              {entry.title}
            </h2>
            {entry.body.map((para, j) => (
              <p key={j} style={{
                fontSize: "17px",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.6)",
                marginBottom: j === entry.body.length - 1 ? 0 : "16px",
              }}>
                {para}
              </p>
            ))}
          </article>
        ))}

        <div style={{
          marginTop: "80px",
          paddingTop: "40px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          fontFamily: "'DM Mono', monospace",
          fontSize: "12px",
          color: "rgba(255,255,255,0.55)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <a href="/" style={{
            color: "rgba(255,255,255,0.55)",
            textDecoration: "none",
          }}>
            ← getantiviral.app
          </a>
          <a href="https://studioikigai.ai" target="_blank" rel="noopener noreferrer" style={{
            color: "rgba(255,255,255,0.55)",
            textDecoration: "none",
          }}>
            from Studio Ikigai
          </a>
        </div>
      </main>
    </div>
  );
}
