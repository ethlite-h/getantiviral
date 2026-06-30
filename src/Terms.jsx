export default function Terms() {
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
          Terms of Service
        </h1>

        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "13px",
          color: "rgba(255,255,255,0.35)",
          marginBottom: "64px",
        }}>
          Last updated: June 29, 2026
        </p>

        {/* INTRO */}
        <Section>
          <P>
            These terms cover your use of Antiviral, an app published by Studio Ikigai. By downloading or using Antiviral, you agree to them. We've tried to keep them in plain English, the same way we wrote the privacy policy.
          </P>
          <P>
            Some sections below are marked as placeholders. They're being finalized with legal review before launch and will be completed here before Antiviral is generally available.
          </P>
        </Section>

        {/* YOUTUBE (Appendix A.3.3 — required by YouTube API policy) */}
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

        {/* SUBSCRIPTIONS & BILLING — PLACEHOLDER */}
        <Section title="Subscriptions & billing">
          <Placeholder>
            [PLACEHOLDER — founder/legal review: auto-renewing subscription terms, pricing, billing through the App Store, and refund policy to be finalized here before launch.]
          </Placeholder>
        </Section>

        {/* ACCEPTABLE USE — PLACEHOLDER */}
        <Section title="Acceptable use">
          <Placeholder>
            [PLACEHOLDER — founder/legal review: acceptable-use terms (permitted use, prohibited conduct, and account/access conditions) to be finalized here before launch.]
          </Placeholder>
        </Section>

        {/* DISCLAIMERS & LIABILITY — PLACEHOLDER */}
        <Section title="Disclaimers & liability">
          <Placeholder>
            [PLACEHOLDER — founder/legal review: warranty disclaimers and limitation of liability to be finalized here before launch.]
          </Placeholder>
        </Section>

        {/* GOVERNING LAW — PLACEHOLDER */}
        <Section title="Governing law">
          <Placeholder>
            [PLACEHOLDER — founder/legal review: governing law and dispute-resolution terms to be finalized here before launch.]
          </Placeholder>
        </Section>

        {/* CHANGES */}
        <Section title="Changes to these terms">
          <P>
            We may update these terms from time to time. When we do, we'll revise the "Last updated" date above. If a change is material, we'll do our best to give you reasonable notice. Continuing to use Antiviral after an update means you accept the revised terms.
          </P>
        </Section>

        {/* CONTACT */}
        <Section title="Contact">
          <P>
            If you have questions about these terms, reach out at{" "}
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

function Placeholder({ children }) {
  return (
    <p style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: "14px",
      lineHeight: 1.7,
      color: "rgba(214, 178, 122, 0.85)",
      background: "rgba(214, 178, 122, 0.06)",
      border: "1px dashed rgba(214, 178, 122, 0.35)",
      borderRadius: "6px",
      padding: "16px 18px",
      marginBottom: "16px",
    }}>
      {children}
    </p>
  );
}
