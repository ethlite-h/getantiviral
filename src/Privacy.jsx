export default function Privacy() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0A",
      color: "#fff",
      fontFamily: "'Karla', 'Helvetica Neue', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Karla:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
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
          color: "rgba(255,255,255,0.35)",
          marginBottom: "64px",
        }}>
          Last updated: June 11, 2026
        </p>

        {/* INTRO */}
        <Section>
          <P>
            Antiviral is built on a simple principle: your data is yours. The intelligence that curates your feed runs on your iPhone, and we run no server that stores you. Once a day, to compose your Edition, Antiviral borrows Apple's Private Cloud Compute — Apple's infrastructure, not ours — which is built so that no one, including Apple and us, can see or keep what it processes.
          </P>
          <P>
            This isn't a legal document designed to obscure what we do. It's a plain-English explanation of exactly how Antiviral handles your information — including the one moment it leaves your phone.
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
            The on-device intelligence runs on Apple Foundation Models and an on-device sentence transformer — both part of Apple Intelligence on your iPhone. Ranking, search, the Shortlist, and learning your taste all happen here, on your device. None of it is sent to a server we operate.
          </P>
        </Section>

        {/* THE ONE DAILY CLOUD CALL */}
        <Section title="The one daily cloud call (Apple Private Cloud Compute)">
          <P>
            Composing your Edition — reading across a whole day of pieces to find the genuine threads — is the one job too large for the on-device model. Once a day, Antiviral sends the day's items (titles and short descriptions) plus a compact summary of your preferences to Apple's Private Cloud Compute to write that issue.
          </P>
          <P>
            Private Cloud Compute is Apple's privacy-hardened cloud. It is designed so that your data isn't stored, isn't accessible to Apple or to Studio Ikigai, and is discarded the moment the request completes. We operate no server in this path — the request goes from your device to Apple, and the finished Edition comes back. Everything else stays on your phone.
          </P>
          <P style={{ color: "rgba(255,255,255,0.35)", fontSize: "15px" }}>
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
              If you choose to import your YouTube subscriptions, Antiviral uses Google OAuth to read your subscription list and liked video categories. The access is read-only and one-way — nothing flows back to Google. Your OAuth token is stored in your device's Keychain, encrypted and device-only. When you sign out, the token is revoked at Google and deleted from your device.
            </P>
          </SubSection>

          <SubSection title="Bluesky (optional)">
            <P>
              If you connect a Bluesky account, your session credentials are stored in your device's Keychain. Antiviral fetches your timeline and follows list. You can disconnect at any time.
            </P>
          </SubSection>
        </Section>

        {/* ICLOUD SYNC */}
        <Section title="iCloud sync (optional)">
          <P>
            If you turn on sync, your sources, saves, annotations, interest graph, and preferences move between your own devices through your own iCloud account, using Apple's CloudKit. It's end-to-end encrypted under Apple's Advanced Data Protection — your iCloud, not a server we run. We never see it.
          </P>
          <P>
            Sync is optional. If you'd rather keep everything on a single device, a device-local-only mode does exactly that.
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
          <P style={{ color: "rgba(255,255,255,0.35)", fontSize: "15px" }}>
            This website uses Vercel Analytics, which collects anonymous page view data (no cookies, no personal information). The app itself has zero analytics.
          </P>
        </Section>

        {/* DATA RETENTION */}
        <Section title="Data retention">
          <P>All of your data lives on your device (and, if you enable sync, in your own iCloud). You're always in control of it:</P>
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
          color: "rgba(255,255,255,0.3)",
        }}>
          <a href="https://studioikigai.ai" target="_blank" rel="noopener noreferrer" style={{
            color: "rgba(255,255,255,0.3)",
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
