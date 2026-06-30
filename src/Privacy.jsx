export default function Privacy() {
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
        <h1 style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 400,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          marginBottom: "16px",
        }}>
          Privacy
        </h1>

        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "13px",
          color: "rgba(255,255,255,0.55)",
          marginBottom: "64px",
        }}>
          Last updated: June 29, 2026
        </p>

        {/* INTRO */}
        <Section>
          <P>
            Antiviral is built on a simple principle: your data is yours. The intelligence that curates your feed runs on your iPhone, and we run no server that stores you. Once a day, to compose your Edition, Antiviral borrows Apple's Private Cloud Compute — Apple's infrastructure, not ours — which is built so that no one, including Apple and us, can see or keep what it processes.
          </P>
          <P>
            This isn't a legal document designed to obscure what we do. It's a plain-English explanation of exactly how Antiviral handles your information — including the few moments it does leave: syncing to your own iCloud, fetching the content you ask for, and the one daily call to Apple's Private Cloud Compute.
          </P>
        </Section>

        {/* WHAT STAYS ON YOUR DEVICE */}
        <Section title="What stays on your device">
          <P>Almost everything. The intelligence that understands you lives on your phone:</P>
          <Ul>
            <Li>Your interest graph — every topic, weight, and preference</Li>
            <Li>Your watch and reading history</Li>
            <Li>Your conversations with the app</Li>
            <Li>Your subscriptions and sources</Li>
            <Li>Your saved content and annotations</Li>
          </Ul>
          <P>
            The on-device intelligence runs on Apple Foundation Models and Apple's on-device text embeddings (part of the Natural Language framework) — both part of Apple Intelligence on your iPhone. Ranking, search, the Shortlist, and learning your taste all happen here, on your device. None of it is sent to a server we operate.
          </P>
        </Section>

        {/* THE ONE DAILY CLOUD CALL */}
        <Section title="The one daily cloud call (Apple Private Cloud Compute)">
          <P>
            Composing your Edition — reading across a whole day of pieces to find the genuine threads — is the one job too large for the on-device model. Once a day, Antiviral sends the day's items (titles and short descriptions) plus a compact summary of your preferences to Apple's Private Cloud Compute to write that issue.
          </P>
          <P>
            Private Cloud Compute is Apple's privacy-hardened cloud. It is designed so that your data isn't stored, isn't accessible to Apple or to Studio Ikigai, and is discarded the moment the request completes. We operate no server in this path — the request goes from your device to Apple, and the finished Edition comes back.
          </P>
          <P style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px" }}>
            If you're offline, over your daily allowance, or on an ineligible device, Antiviral assembles a simpler Edition entirely on-device instead. The daily ritual never depends on a connection you don't have.
          </P>
        </Section>

        {/* WHAT LEAVES YOUR DEVICE */}
        <Section title="What else leaves your device">
          <P>
            Antiviral fetches content from the internet. When you ask for something, the app sends search queries to find it. Here's exactly what goes where:
          </P>

          <SubSection title="Content fetching">
            <Ul>
              <Li><Mono>YouTube RSS feeds</Mono> — your subscribed channel IDs are used to fetch their public RSS feeds. No authentication required.</Li>
              <Li><Mono>Brave Search</Mono> — search queries are sent to Brave's API with an app-level API key. No user identifier or device ID is attached.</Li>
              <Li><Mono>iTunes Search</Mono> — podcast search terms are sent to Apple's public search API. No authentication.</Li>
              <Li><Mono>Reddit</Mono> — subreddit RSS feeds are fetched publicly. No authentication.</Li>
              <Li><Mono>RSS/Atom feeds</Mono> — any feeds you add are fetched directly. Standard web requests.</Li>
            </Ul>
          </SubSection>

          <SubSection title="Video playback">
            <P>
              Videos play in YouTube's own official embedded player, so creators are paid exactly as they normally would be. That embedded player can't sign you in, so inside Antiviral you see the logged-out experience — including ads. If you want your signed-in YouTube account or your Premium subscription, open the video in YouTube. Antiviral never strips ads or extracts streams.
            </P>
          </SubSection>

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

          <SubSection title="Bluesky (optional)">
            <P>
              If you connect a Bluesky account, your session credentials are stored in your device's Keychain. Antiviral fetches your timeline and follows list. You can disconnect at any time.
            </P>
          </SubSection>
        </Section>

        {/* ICLOUD SYNC */}
        <Section title="iCloud sync">
          <P>
            Antiviral keeps your sources, saves, annotations, interest graph, and preferences in sync across your devices through your own private iCloud account, using Apple's CloudKit. It's on by default — it's your iCloud, not a server we run, and we never see it. If you've enabled Apple's Advanced Data Protection, that sync is end-to-end encrypted.
          </P>
        </Section>

        {/* WHAT WE COLLECT */}
        <Section title="What Studio Ikigai collects">
          <P>Nothing.</P>
          <Ul>
            <Li>No analytics</Li>
            <Li>Crash reporting only through Apple's infrastructure, which strips all personally identifiable information before we see it</Li>
            <Li>No telemetry</Li>
            <Li>No Studio Ikigai account system</Li>
            <Li>No user identifiers</Li>
          </Ul>
          <P>
            We operate no server that receives your personal data from the app. We don't know who you are, what you watch, or how you use Antiviral. The one daily Edition call goes to Apple's Private Cloud Compute, not to us — and Apple is designed to keep nothing from it either.
          </P>
          <P style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px" }}>
            This website uses Vercel Analytics, which collects anonymous page view data (no cookies, no personal information). The app itself has zero analytics. If you use the “ask” box on this site, your typed question is sent to Anthropic to generate a reply — it isn't used to identify you and isn't linked to anything on your device.
          </P>
        </Section>

        {/* DATA RETENTION */}
        <Section title="Data retention">
          <P>All of your data lives on your device (and, through iCloud sync, in your own iCloud). You're always in control of it:</P>
          <Ul>
            <Li>Watch history and conversations are kept only as long as they're useful, and you can clear them at any time</Li>
            <Li>Interests you stop engaging with gradually fade over time</Li>
            <Li>Cached media (thumbnails, articles) is managed by a local cache with a size limit — oldest items are evicted first</Li>
            <Li>If you delete the app, everything local is gone. There's nothing on our end to delete, because we never had it.</Li>
          </Ul>
        </Section>

        {/* THIRD-PARTY SERVICES */}
        <Section title="Third-party services">
          <P>
            Antiviral sends search queries to Brave Search and fetches content from YouTube, Reddit, podcast directories, and RSS feeds, and uses Apple's Private Cloud Compute to compose your daily Edition. These services have their own privacy policies. Antiviral does not share any user profile, device identifier, or personal information with them — only the search queries needed to find content, and, for the Edition, the day's titles and a preference summary that Apple is built to discard.
          </P>
        </Section>

        {/* CONTACT */}
        <Section title="Questions">
          <P>
            If you have questions about how Antiviral handles your data, reach out at{" "}
            <a href="mailto:info@studioikigai.ai" style={{ textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.15)", textUnderlineOffset: "3px" }}>
              info@studioikigai.ai
            </a>.
          </P>
        </Section>

        <div style={{
          marginTop: "80px",
          paddingTop: "40px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          fontFamily: "'DM Mono', monospace",
          fontSize: "12px",
          color: "rgba(255,255,255,0.55)",
        }}>
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

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: "56px" }}>
      {title && (
        <h2 style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: "24px",
          fontWeight: 400,
          letterSpacing: "-0.01em",
          marginBottom: "20px",
        }}>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function SubSection({ title, children }) {
  return (
    <div style={{ marginTop: "24px", marginBottom: "24px" }}>
      <h3 style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "13px",
        fontWeight: 500,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.5)",
        marginBottom: "12px",
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function P({ children, style }) {
  return (
    <p style={{
      fontSize: "17px",
      lineHeight: 1.75,
      color: "rgba(255,255,255,0.6)",
      marginBottom: "16px",
      ...style,
    }}>
      {children}
    </p>
  );
}

function Ul({ children }) {
  return (
    <ul style={{
      listStyle: "none",
      padding: 0,
      marginBottom: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    }}>
      {children}
    </ul>
  );
}

function Li({ children }) {
  return (
    <li style={{
      fontSize: "17px",
      lineHeight: 1.65,
      color: "rgba(255,255,255,0.55)",
      paddingLeft: "20px",
      position: "relative",
    }}>
      <span style={{
        position: "absolute",
        left: 0,
        color: "rgba(107, 158, 111, 0.6)",
      }}>
        —
      </span>
      {children}
    </li>
  );
}

function Mono({ children }) {
  return (
    <span style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: "15px",
      color: "rgba(255,255,255,0.7)",
    }}>
      {children}
    </span>
  );
}
