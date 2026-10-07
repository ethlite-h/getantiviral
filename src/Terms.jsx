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
          Last updated: September 17, 2026
        </p>

        {/* INTRO */}
        <Section>
          <P>
            These terms cover your use of Antiviral, an app published by Studio Ikigai. By downloading or using Antiviral, you agree to them. We've tried to keep them in plain English, the same way we wrote the privacy policy.
          </P>
          <P>
            Antiviral has no account system. There is nothing to sign up for and nothing to log in to. These terms apply to whoever is using the app on the device it's installed on.
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

        {/* SUBSCRIPTIONS & BILLING */}
        <Section title="Subscriptions & billing">
          <P>
            The Feed, the Shortlist, and the Sunday Edition are free, forever. The daily Edition is for subscribers.
          </P>
          <P>
            Antiviral is offered as an auto-renewing subscription at $5 per month or $50 per year. Prices are in US dollars and may differ by country. The price you'll pay is always shown in the App Store before you confirm.
          </P>
          <P>
            All purchases are made through Apple's App Store and charged to your Apple account. A subscription renews automatically at the end of each period unless you cancel at least 24 hours before it ends. You can manage or cancel it at any time in your device's Settings under Subscriptions. Cancelling stops future charges; you keep access until the end of the period you've already paid for.
          </P>
          <P>
            Because Apple handles billing, Apple also handles refunds. Refund requests go through Apple at reportaproblem.apple.com and are decided under Apple's policies; we can't issue refunds ourselves. If we change a subscription price, Apple will notify you in advance, and the new price only takes effect at your next renewal after you've agreed to it.
          </P>
        </Section>

        {/* ACCEPTABLE USE */}
        <Section title="Acceptable use">
          <P>
            Antiviral is for personal, non-commercial use. You get a license to use the app on Apple devices you own or control, under the App Store terms. The app and everything we made in it, including its name, design, and code, belong to Studio Ikigai. The content you read and watch belongs to whoever made it.
          </P>
          <P>
            You're welcome to bring any sources you like. Antiviral fetches content from those sources on your behalf, and you're responsible for having the right to access it. Please don't use Antiviral to:
          </P>
          <Ul>
            <Li>Circumvent YouTube's or any other source's terms, or download and redistribute content you don't have the rights to</Li>
            <Li>Reverse engineer, decompile, or copy the app, or build a competing product from it</Li>
            <Li>Overload, probe, or interfere with the sources Antiviral reads from</Li>
            <Li>Break any law, or use the app in a way that harms others</Li>
          </Ul>
          <P>
            We may stop providing Antiviral, or any part of it, to anyone who violates these terms.
          </P>
        </Section>

        {/* DISCLAIMERS & LIABILITY */}
        <Section title="Disclaimers & liability">
          <P>
            Antiviral is provided "as is" and "as available," without warranties of any kind, express or implied, including any warranty of merchantability, fitness for a particular purpose, or non-infringement. We don't promise the app will be error-free, uninterrupted, or that it will suit your needs. Some places don't allow certain warranty disclaimers, so parts of this may not apply to you.
          </P>
          <P>
            The Edition and the Shortlist are curated by software, including on-device AI, from sources you chose. We don't create or verify that content, and we aren't responsible for what it says. When a source goes offline, changes its format, or removes something, that content may disappear from Antiviral too.
          </P>
          <P>
            To the fullest extent the law allows, Studio Ikigai won't be liable for any indirect, incidental, special, consequential, or punitive damages, or for lost data or lost profits, arising from your use of Antiviral. Our total liability to you for any claim related to the app is limited to the amount you paid us for it in the twelve months before the claim arose, or $50, whichever is greater. Nothing here limits liability that can't be limited by law.
          </P>
          <P>
            Apple isn't a party to these terms and has no obligation to support or maintain Antiviral. If the app fails to conform to a warranty, you may notify Apple for a refund of the purchase price, and beyond that Apple has no warranty obligation for it.
          </P>
        </Section>

        {/* GOVERNING LAW */}
        <Section title="Governing law">
          <P>
            These terms are governed by the laws of the State of California and the United States, without regard to conflict-of-law rules. Studio Ikigai is based in San Diego, California.
          </P>
          <P>
            If something goes wrong, write to us first. Most issues are fixable with an email, and we'd rather solve it than litigate it. Any dispute that can't be resolved that way will be brought exclusively in the state or federal courts located in San Diego County, California, and you agree to the jurisdiction of those courts. If you live in the European Union or the United Kingdom, nothing here takes away protections you have under the mandatory consumer laws of your country.
          </P>
          <P>
            If any part of these terms turns out to be unenforceable, the rest still applies. These terms, together with the privacy policy, are the whole agreement between you and Studio Ikigai about Antiviral.
          </P>
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
