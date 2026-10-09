export default function Support() {
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
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
        }}>
          <img src="/av-logo.png" alt="" width="32" height="28" style={{ display: "block" }} />
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
          Support
        </h1>

        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "13px",
          color: "rgba(255,255,255,0.35)",
          marginBottom: "64px",
        }}>
          Last updated: October 7, 2026
        </p>

        {/* INTRO */}
        <Section>
          <P>
            Antiviral is made by a small studio, and support is a person reading your email. This page covers what the app needs to run, how to reach us, and what to include so we can help quickly.
          </P>
        </Section>

        {/* CONTACT */}
        <Section title="Get in touch">
          <P>
            Email 
            <a href="mailto:info@studioikigai.ai" style={{ textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.15)", textUnderlineOffset: "3px" }}>info@studioikigai.ai</a>. A human replies, usually within a few days. There is no chat widget and no ticketing system — just the inbox.
          </P>
        </Section>

        {/* REQUIREMENTS */}
        <Section title="What Antiviral needs">
          <Ul>
            <Li>iOS 27, iPadOS 27, or macOS 27.</Li>
            <Li>A device that supports Apple Intelligence: iPhone 15 Pro or later, or an iPad or Mac with an M-series chip.</Li>
            <Li>Apple Intelligence turned on, in Settings ▸ Apple Intelligence &amp; Siri. The on-device model does the curation; without it the app still shows your followed sources, but planning and the editor are off.</Li>
          </Ul>
          <P>
            The daily Edition additionally uses Apple's Private Cloud Compute, so it is unavailable wherever Apple Intelligence is off or still downloading its model. The app says so on the Edition cover rather than showing an empty page.
          </P>
        </Section>

        {/* ACCOUNTS */}
        <Section title="Accounts and data">
          <P>
            There is no Antiviral account — nothing to sign up for, log in to, or delete. Everything the app learns lives on your device and in your own iCloud. Signing in to YouTube is optional and import-only: it reads your subscriptions and likes so the feed can start from them, and never posts or plays on your behalf.
          </P>
          <P>
            How data is stored, synced, and removed is spelled out in the 
            <a href="/privacy" style={{ textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.15)", textUnderlineOffset: "3px" }}>privacy policy</a>.
          </P>
        </Section>

        {/* WEB SEARCH */}
        <Section title="Web search">
          <P>
            Web search is optional and uses Kagi, with your own Kagi API key entered in Sources ▸ Manage Sources. Without a key the feed draws only on the sources you follow. We never bundle a search key in the app.
          </P>
        </Section>

        {/* REPORTING A PROBLEM */}
        <Section title="Reporting a problem">
          <P>
            The more of this you include, the faster we can reproduce it:
          </P>
          <Ul>
            <Li>Your device model and OS version.</Li>
            <Li>The build number, from Settings ▸ About in the app.</Li>
            <Li>What you did, and what you expected to happen instead.</Li>
            <Li>For a feed or Edition problem, the names of the sources involved.</Li>
          </Ul>
          <P>
            TestFlight testers can also shake the device to send a report with a screenshot attached.
          </P>
        </Section>

        {/* REPORTING CONTENT */}
        <Section title="Reporting content">
          <P>
            You can block a creator from any item in the feed; their work stops appearing everywhere in the app. If something appears that should not be there at all, email the item's link to{" "}
            <a href="mailto:info@studioikigai.ai" style={{ textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.15)", textUnderlineOffset: "3px" }}>info@studioikigai.ai</a> and we will look at it.
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
