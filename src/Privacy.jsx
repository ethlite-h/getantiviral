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
          Last updated: March 17, 2026
        </p>

        {/* INTRO */}
        <Section>
          <P>
            Antiviral is built on a simple principle: your data is yours. The AI that curates your feed runs entirely on your iPhone. There is no Studio Ikigai server. We never see your interests, your watch history, your conversations with the app, or anything else you do inside it.
          </P>
          <P>
            This isn't a legal document designed to obscure what we do. It's a plain-English explanation of exactly how Antiviral handles your information.
          </P>
        </Section>

        {/* WHAT STAYS ON YOUR DEVICE */}
        <Section title="What stays on your device">
          <P>Everything the AI uses to understand you stays on your phone:</P>
          <Ul>
            <Li>Your interest graph — every topic, weight, and preference</Li>
            <Li>Your watch history (automatically deleted after 90 days)</Li>
            <Li>Your conversations with the app (automatically deleted after 90 days)</Li>
            <Li>Your subscriptions and sources</Li>
            <Li>Your saved content and annotations</Li>
          </Ul>
          <P>
            The AI runs on Apple Foundation Models and an on-device sentence transformer — both part of Apple Intelligence on your iPhone. Your data never leaves your phone to be processed. There is no cloud AI.
          </P>
        </Section>

        {/* WHAT LEAVES YOUR DEVICE */}
        <Section title="What leaves your device">
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

          <SubSection title="YouTube import (optional)">
            <P>
              If you choose to import your YouTube subscriptions, Antiviral uses Google OAuth to read your subscription list and liked video categories. The access is read-only. Your OAuth token is stored in your device's Keychain — encrypted, device-only, never backed up to iCloud. When you sign out, the token is revoked at Google and deleted from your device.
            </P>
          </SubSection>

          <SubSection title="Bluesky (optional)">
            <P>
              If you connect a Bluesky account, your session credentials are stored in your device's Keychain. Antiviral fetches your timeline and follows list. You can disconnect at any time.
            </P>
          </SubSection>
        </Section>

        {/* WHAT WE COLLECT */}
        <Section title="What Studio Ikigai collects">
          <P>Nothing.</P>
          <Ul>
            <Li>No analytics</Li>
            <Li>Crash reporting only through Apple's infrastructure, which strips all personally identifiable information before we see it</Li>
            <Li>No telemetry</Li>
            <Li>No account system</Li>
            <Li>No user identifiers</Li>
          </Ul>
          <P>
            We have no server infrastructure that receives data from the app. We don't know who you are, what you watch, or how you use Antiviral. We can't — the app doesn't send us anything.
          </P>
          <P style={{ color: "rgba(255,255,255,0.35)", fontSize: "15px" }}>
            This website uses Vercel Analytics, which collects anonymous page view data (no cookies, no personal information). The app itself has zero analytics.
          </P>
        </Section>

        {/* DATA RETENTION */}
        <Section title="Data retention">
          <P>All data lives on your device and follows these rules:</P>
          <Ul>
            <Li>Conversations and watch history are automatically deleted after 90 days</Li>
            <Li>Interests that you stop engaging with gradually fade over 30+ days</Li>
            <Li>Cached media (thumbnails, articles) is managed by a local cache with a size limit — oldest items are evicted first</Li>
            <Li>If you delete the app, everything is gone. There's nothing on our end to delete because we never had it.</Li>
          </Ul>
        </Section>

        {/* CHILDREN */}
        <Section title="Children">
          <P>
            Antiviral's Family Edition includes parental controls where parents set content boundaries for managed profiles. The AI enforces these boundaries on-device. No child data is collected or transmitted — the same on-device privacy applies to every profile.
          </P>
        </Section>

        {/* THIRD-PARTY SERVICES */}
        <Section title="Third-party services">
          <P>
            Antiviral sends search queries to Brave Search and fetches content from YouTube, Reddit, podcast directories, and RSS feeds. These services have their own privacy policies. Antiviral does not share any user profile, device identifier, or personal information with them — only the search queries needed to find content.
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
