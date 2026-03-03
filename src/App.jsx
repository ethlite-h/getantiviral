import { useState, useEffect, useRef } from "react";

const PERSONAL_FEATURES = [
  "Import your YouTube subscriptions, podcasts, and blogs",
  "AI builds a transparent topic list from what you actually watch",
  "Talk to your feed — \"go deeper on this,\" \"I'm done with that\"",
  "Feed reshapes itself around what you said, not what advertisers paid for",
  "Everything runs on your device. No servers. No accounts. No tracking.",
];

const FAMILY_FEATURES = [
  "Individual feeds for every family member",
  "Content sources chosen together, boundaries set by parents",
  "Kids talk to their own feed — they feel in control, because they are",
  "Parent dashboard shows what topics your kids are exploring",
  "No screen time charts — a window into what they're curious about",
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ children }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "6px 16px",
      borderRadius: "100px",
      fontSize: "12px",
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      border: "1px solid rgba(255,255,255,0.15)",
      color: "rgba(255,255,255,0.6)",
    }}>
      {children}
    </span>
  );
}

function FeatureItem({ text, index }) {
  return (
    <div style={{
      display: "flex",
      gap: "16px",
      alignItems: "flex-start",
      opacity: 0,
      animation: `fadeSlideIn 0.5s ease forwards ${0.1 + index * 0.08}s`,
    }}>
      <div style={{
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#4AE68A",
        marginTop: "9px",
        flexShrink: 0,
      }} />
      <p style={{
        margin: 0,
        fontSize: "17px",
        lineHeight: 1.65,
        color: "rgba(255,255,255,0.75)",
        fontFamily: "'Source Serif 4', Georgia, serif",
      }}>
        {text}
      </p>
    </div>
  );
}

export default function AntiviralLanding() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{
      background: "#0A0A0A",
      color: "#fff",
      minHeight: "100vh",
      fontFamily: "'Source Serif 4', Georgia, serif",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeSlideIn {
          to { opacity: 1; transform: translateY(0); }
          from { opacity: 0; transform: translateY(16px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        ::selection {
          background: #4AE68A;
          color: #0A0A0A;
        }

        .hero-line {
          display: block;
          opacity: 0;
          animation: fadeSlideIn 0.7s ease forwards;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          border-radius: 100px;
          font-size: 16px;
          font-weight: 600;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.02em;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .cta-primary {
          background: #4AE68A;
          color: #0A0A0A;
        }
        .cta-primary:hover {
          background: #5FF59D;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(74, 230, 138, 0.25);
        }

        .cta-secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .cta-secondary:hover {
          border-color: rgba(255,255,255,0.5);
          transform: translateY(-2px);
        }

        .section-divider {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          margin: 0 auto;
        }

        .quote-mark {
          font-size: 120px;
          line-height: 0.6;
          color: rgba(74, 230, 138, 0.15);
          font-family: Georgia, serif;
          position: absolute;
          top: -10px;
          left: -8px;
          user-select: none;
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: scrollY > 50 ? "rgba(10,10,10,0.9)" : "transparent",
        backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "18px",
          fontWeight: 500,
          letterSpacing: "0.05em",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <span style={{ color: "#4AE68A" }}>⊘</span> antiviral
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <a href="#personal" className="cta-btn cta-secondary" style={{ padding: "10px 24px", fontSize: "13px" }}>Personal</a>
          <a href="#family" className="cta-btn cta-secondary" style={{ padding: "10px 24px", fontSize: "13px" }}>Family</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "140px 40px 100px",
        maxWidth: "900px",
        margin: "0 auto",
        position: "relative",
      }}>
        {/* Subtle background glow */}
        <div style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(74,230,138,0.04) 0%, transparent 70%)",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }} />

        <div style={{ marginBottom: "40px" }}>
          <Pill>Free — no catch</Pill>
        </div>

        <h1 style={{
          fontSize: "clamp(42px, 7vw, 76px)",
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: "-0.025em",
          marginBottom: "36px",
        }}>
          <span className="hero-line" style={{ animationDelay: "0.1s" }}>Your feed,</span>
          <span className="hero-line" style={{ animationDelay: "0.3s", color: "#4AE68A" }}>finally yours.</span>
        </h1>

        <p style={{
          fontSize: "clamp(18px, 2.5vw, 22px)",
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.55)",
          maxWidth: "600px",
          marginBottom: "48px",
          opacity: 0,
          animation: "fadeSlideIn 0.7s ease forwards 0.6s",
        }}>
          An AI that runs on your phone, shapes your feed around what you actually care about, and answers to nobody but you.
        </p>

        <div style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          opacity: 0,
          animation: "fadeSlideIn 0.7s ease forwards 0.9s",
        }}>
          <a href="#personal" className="cta-btn cta-primary">
            Get Antiviral
            <span style={{ fontSize: "18px" }}>↓</span>
          </a>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section style={{
        padding: "120px 40px",
        maxWidth: "760px",
        margin: "0 auto",
      }}>
        <FadeIn>
          <div style={{ position: "relative", paddingLeft: "36px" }}>
            <span className="quote-mark">"</span>
            <p style={{
              fontSize: "clamp(24px, 3.5vw, 34px)",
              lineHeight: 1.55,
              fontWeight: 300,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.85)",
            }}>
              You know that feeling when YouTube nails it? That one perfect video, buried under seventeen things you didn't ask for?
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p style={{
            fontSize: "20px",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.5)",
            marginTop: "48px",
          }}>
            Antiviral is a feed that's <em style={{ color: "rgba(255,255,255,0.85)", fontStyle: "italic" }}>only</em> that feeling.
          </p>
        </FadeIn>
      </section>

      <div className="section-divider" />

      {/* PERSONAL EDITION */}
      <section id="personal" style={{
        padding: "120px 40px",
        maxWidth: "900px",
        margin: "0 auto",
      }}>
        <FadeIn>
          <div style={{ marginBottom: "16px" }}>
            <Pill>Personal Edition</Pill>
          </div>
          <h2 style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "20px",
          }}>
            Talk to your feed.<br />
            <span style={{ color: "rgba(255,255,255,0.35)" }}>It actually listens.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p style={{
            fontSize: "19px",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.55)",
            maxWidth: "620px",
            marginBottom: "56px",
          }}>
            Bring your subscriptions. The app builds a topic list from what you actually watch. Then you have a conversation with it — and the feed becomes yours.
          </p>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "40px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            {PERSONAL_FEATURES.map((f, i) => (
              <FeatureItem key={i} text={f} index={i} />
            ))}
          </div>
        </FadeIn>

        {/* Conversation demo */}
        <FadeIn delay={0.3}>
          <div style={{
            marginTop: "64px",
            padding: "32px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            fontFamily: "'DM Mono', monospace",
            fontSize: "14px",
            lineHeight: 1.8,
          }}>
            <div style={{ color: "rgba(255,255,255,0.35)", marginBottom: "20px", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              How it feels
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <span style={{ color: "#4AE68A" }}>you →</span>
                <span style={{ color: "rgba(255,255,255,0.8)", marginLeft: "8px" }}>go deeper on pottery</span>
              </div>
              <div>
                <span style={{ color: "rgba(255,255,255,0.35)" }}>antiviral →</span>
                <span style={{ color: "rgba(255,255,255,0.55)", marginLeft: "8px" }}>Found a 3-part series on Japanese wheel throwing from a channel you're already subscribed to. Also promoting pottery from surface to moderate depth — I'll start including longer-form and more technical content.</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px" }}>
                <span style={{ color: "#4AE68A" }}>you →</span>
                <span style={{ color: "rgba(255,255,255,0.8)", marginLeft: "8px" }}>I'm done with politics</span>
              </div>
              <div>
                <span style={{ color: "rgba(255,255,255,0.35)" }}>antiviral →</span>
                <span style={{ color: "rgba(255,255,255,0.55)", marginLeft: "8px" }}>Done. Politics is dismissed. Your feed won't include political content anymore.</span>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.35}>
          <div style={{
            marginTop: "56px",
            padding: "32px 40px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(74,230,138,0.08), rgba(74,230,138,0.02))",
            border: "1px solid rgba(74,230,138,0.15)",
            textAlign: "center",
          }}>
            <p style={{
              fontSize: "28px",
              fontWeight: 600,
              marginBottom: "8px",
              letterSpacing: "-0.01em",
            }}>
              Free. Completely free.
            </p>
            <p style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.45)",
            }}>
              No trial. No ads. No account. Your attention shouldn't be a product.
            </p>
          </div>
        </FadeIn>
      </section>

      <div className="section-divider" />

      {/* NEVER CALLS HOME */}
      <section style={{
        padding: "120px 40px",
        maxWidth: "760px",
        margin: "0 auto",
        textAlign: "center",
      }}>
        <FadeIn>
          <h2 style={{
            fontSize: "clamp(28px, 4.5vw, 44px)",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: "28px",
          }}>
            It never calls home.<br />
            <span style={{ color: "#4AE68A" }}>So it never betrays you.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p style={{
            fontSize: "18px",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.5)",
            maxWidth: "540px",
            margin: "0 auto",
          }}>
            Every bit of intelligence runs on your device. Your topics, your watch patterns, your conversations with the app — none of it ever leaves your phone. There's no server to breach because there's no server.
          </p>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "48px",
            marginTop: "56px",
            flexWrap: "wrap",
          }}>
            {[
              { label: "No account", icon: "⊘" },
              { label: "No tracking", icon: "⊘" },
              { label: "No servers", icon: "⊘" },
              { label: "No ads", icon: "⊘" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}>
                <span style={{ color: "#4AE68A", fontSize: "20px" }}>{item.icon}</span>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.05em",
                }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      <div className="section-divider" />

      {/* FAMILY EDITION */}
      <section id="family" style={{
        padding: "120px 40px",
        maxWidth: "900px",
        margin: "0 auto",
      }}>
        <FadeIn>
          <div style={{ marginBottom: "16px" }}>
            <Pill>Family Edition</Pill>
          </div>
          <h2 style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "20px",
          }}>
            See what your kids<br />
            <span style={{ color: "rgba(255,255,255,0.35)" }}>are curious about.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p style={{
            fontSize: "19px",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.55)",
            maxWidth: "620px",
            marginBottom: "24px",
          }}>
            You don't know what your kids' feed is teaching them. Neither do they. The algorithm decides, and it optimizes for one thing: keeping them watching. Not learning. Not growing. Watching.
          </p>
          <p style={{
            fontSize: "19px",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.55)",
            maxWidth: "620px",
            marginBottom: "56px",
          }}>
            Antiviral Family gives every person in your household their own feed, built from sources you choose together. You set the boundaries. They own the experience.
          </p>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "40px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            {FAMILY_FEATURES.map((f, i) => (
              <FeatureItem key={i} text={f} index={i} />
            ))}
          </div>
        </FadeIn>

        {/* Parent dashboard preview */}
        <FadeIn delay={0.3}>
          <div style={{
            marginTop: "64px",
            padding: "32px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "24px",
            }}>
              What parents see
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {[
                { topic: "Astronomy", trend: "↑ growing", weeks: "3 weeks", depth: "moderate", color: "#4AE68A" },
                { topic: "Minecraft", trend: "→ steady", weeks: "6 months", depth: "deep", color: "rgba(255,255,255,0.4)" },
                { topic: "Drawing", trend: "↑ new", weeks: "1 week", depth: "surface", color: "#4AE68A" },
                { topic: "Slime videos", trend: "↓ fading", weeks: "2 months", depth: "surface", color: "rgba(255,255,255,0.2)" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: item.color,
                    }} />
                    <span style={{
                      fontFamily: "'Source Serif 4', Georgia, serif",
                      fontSize: "17px",
                      color: "rgba(255,255,255,0.8)",
                    }}>
                      {item.topic}
                    </span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.35)",
                  }}>
                    <span>{item.weeks}</span>
                    <span style={{
                      padding: "3px 10px",
                      borderRadius: "100px",
                      background: "rgba(255,255,255,0.05)",
                      fontSize: "11px",
                    }}>
                      {item.depth}
                    </span>
                    <span style={{ color: item.color }}>{item.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            <p style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: "15px",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.3)",
              marginTop: "24px",
            }}>
              Not a screen time report. A map of a mind becoming itself.
            </p>
          </div>
        </FadeIn>
      </section>

      <div className="section-divider" />

      {/* CLOSING */}
      <section style={{
        padding: "140px 40px 160px",
        maxWidth: "760px",
        margin: "0 auto",
        textAlign: "center",
      }}>
        <FadeIn>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "13px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            marginBottom: "32px",
          }}>
            The thesis
          </p>
          <h2 style={{
            fontSize: "clamp(26px, 4vw, 40px)",
            fontWeight: 300,
            lineHeight: 1.4,
            letterSpacing: "-0.01em",
            color: "rgba(255,255,255,0.85)",
            marginBottom: "48px",
          }}>
            Every platform built a model of your interests<br />
            and <em>hid it from you</em>.<br />
            <span style={{ fontWeight: 700 }}>We hand it back.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#personal" className="cta-btn cta-primary">
              Get Antiviral — Free
            </a>
            <a href="#family" className="cta-btn cta-secondary">
              Explore Family Edition
            </a>
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "40px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "13px",
          color: "rgba(255,255,255,0.3)",
        }}>
          <span style={{ color: "#4AE68A" }}>⊘</span> antiviral — getantiviral.app
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "12px",
          color: "rgba(255,255,255,0.2)",
        }}>
          Your attention is not a product.
        </div>
      </footer>
    </div>
  );
}
