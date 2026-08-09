import { useState, useEffect, useRef, useCallback } from "react";

const FEED_COLORS = [
  { r: 107, g: 158, b: 111 }, // muted green (primary)
  { r: 111, g: 138, b: 168 }, // muted blue
  { r: 158, g: 123, b: 107 }, // muted rust
  { r: 138, g: 111, b: 158 }, // muted purple
  { r: 158, g: 152, b: 107 }, // muted gold
  { r: 107, g: 158, b: 148 }, // muted teal
  { r: 158, g: 107, b: 134 }, // muted rose
  { r: 128, g: 148, b: 118 }, // sage
];

function FeedVisualization() {
  const canvasRef = useRef(null);
  const dataRef = useRef(null);
  const animRef = useRef(null);

  const init = useCallback((w, h) => {
    const lineCount = 8;
    const segments = 14;
    const centerY = h * 0.5;
    const homeYs = [];
    for (let i = 0; i < lineCount; i++) {
      homeYs.push(h * 0.12 + i * (h * 0.76 / (lineCount - 1)));
    }

    const lines = [];
    for (let i = 0; i < lineCount; i++) {
      const color = FEED_COLORS[i % FEED_COLORS.length];
      const yValues = new Array(segments).fill(homeYs[i]);

      // 1-2 connections: each jumps to another line's Y for 2 segments
      const numConn = 1 + Math.floor(Math.random() * 2);
      const used = new Set();
      for (let c = 0; c < numConn; c++) {
        let seg;
        do { seg = 2 + Math.floor(Math.random() * (segments - 5)); } while (used.has(seg));
        used.add(seg);
        used.add(seg + 1);
        let target = i;
        while (target === i) target = Math.floor(Math.random() * lineCount);
        yValues[seg] = homeYs[target];
        if (seg + 1 < segments - 1) yValues[seg + 1] = homeYs[target];
      }

      const points = yValues.map((y, j) => ({
        x: (w / (segments - 1)) * j,
        spreadY: y,
        convergedY: centerY,
      }));

      // Pulses that travel along the line
      const pulses = [];
      const numPulses = 2 + Math.floor(Math.random() * 3);
      for (let p = 0; p < numPulses; p++) {
        pulses.push({
          speed: 0.04 + Math.random() * 0.06,
          offset: Math.random(),
          radius: 4 + Math.random() * 4,
        });
      }

      lines.push({ points, color, opacity: 0.18 + Math.random() * 0.14, pulses });
    }
    return lines;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 2;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dataRef.current = init(rect.width, rect.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (time) => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const lines = dataRef.current;
      if (!lines) { if (!reduceMotion) animRef.current = requestAnimationFrame(draw); return; }

      // Convergence pulse: mostly spread, brief merge to single line
      const phase = ((time * 0.001) / 12) % 1;
      const raw = Math.sin(phase * Math.PI * 2);
      const converge = Math.pow(Math.max(0, raw), 4); // brief sharp pulse
      // smoothstep for clean ease
      const t = converge * converge * (3 - 2 * converge);

      for (const line of lines) {
        const { r, g, b } = line.color;
        const pts = line.points.map((p) => ({
          x: p.x,
          y: p.spreadY + (p.convergedY - p.spreadY) * t,
        }));

        // Draw the line
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 0; i < pts.length - 1; i++) {
          const cpx = (pts[i].x + pts[i + 1].x) / 2;
          const cpy = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, cpx, cpy);
        }
        ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${line.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Sample path into points for pulse positioning
        const sampled = [{ x: pts[0].x, y: pts[0].y }];
        let sx = pts[0].x, sy = pts[0].y;
        const stepsPerSeg = 8;
        for (let i = 0; i < pts.length - 1; i++) {
          const cx = pts[i].x, cy = pts[i].y;
          const ex = (pts[i].x + pts[i + 1].x) / 2;
          const ey = (pts[i].y + pts[i + 1].y) / 2;
          for (let s = 1; s <= stepsPerSeg; s++) {
            const st = s / stepsPerSeg;
            const mt = 1 - st;
            sampled.push({
              x: mt * mt * sx + 2 * mt * st * cx + st * st * ex,
              y: mt * mt * sy + 2 * mt * st * cy + st * st * ey,
            });
          }
          sx = ex; sy = ey;
        }
        sampled.push({ x: pts[pts.length - 1].x, y: pts[pts.length - 1].y });

        // Draw pulses traveling along the path
        for (const pulse of line.pulses) {
          const progress = ((time * 0.001 * pulse.speed + pulse.offset) % 1);
          const fi = progress * (sampled.length - 1);
          const idx = Math.floor(fi);
          const frac = fi - idx;
          const next = Math.min(idx + 1, sampled.length - 1);
          const px = sampled[idx].x + (sampled[next].x - sampled[idx].x) * frac;
          const py = sampled[idx].y + (sampled[next].y - sampled[idx].y) * frac;

          const grad = ctx.createRadialGradient(px, py, 0, px, py, pulse.radius);
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.7)`);
          grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.25)`);
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          ctx.fillStyle = grad;
          ctx.fillRect(px - pulse.radius, py - pulse.radius, pulse.radius * 2, pulse.radius * 2);
        }
      }

      if (!reduceMotion) animRef.current = requestAnimationFrame(draw);
    };
    // Reduced motion: paint a single static frame and skip the rAF loop.
    if (reduceMotion) draw(0);
    else animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

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

// Email capture for the pre-launch waitlist. Posts to /api/waitlist.
function WaitlistForm({ id }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (state === "loading") return;
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setState("error");
      setMessage("That doesn't look like an email.");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setState("done");
        setMessage("You're on the list. We'll write when it's ready.");
      } else {
        setState("error");
        setMessage(data.error || "Something went wrong. Try again in a moment.");
      }
    } catch {
      setState("error");
      setMessage("Couldn't reach the list. Try again in a moment.");
    }
  };

  if (state === "done") {
    return (
      <p id={id} role="status" style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "15px",
        color: "#6B9E6F",
        padding: "8px 0",
      }}>
        {message}
      </p>
    );
  }

  return (
    <form id={id} onSubmit={submit} style={{ width: "100%", maxWidth: "440px" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "100px",
        padding: "5px 6px 5px 20px",
      }}>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }}
          placeholder="your@email.com"
          maxLength={254}
          aria-label="Email address"
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            color: "rgba(255,255,255,0.9)",
            fontSize: "16px",
            fontFamily: "'DM Mono', monospace",
            caretColor: "#6B9E6F",
            minWidth: 0,
          }}
        />
        <button type="submit" className="cta-btn cta-primary" disabled={state === "loading"} style={{
          padding: "12px 24px",
          fontSize: "14px",
          opacity: state === "loading" ? 0.6 : 1,
          whiteSpace: "nowrap",
        }}>
          {state === "loading" ? "…" : "Join the waitlist"}
        </button>
      </div>
      {state === "error" && (
        <p role="alert" style={{
          margin: "10px 4px 0",
          fontFamily: "'DM Mono', monospace",
          fontSize: "13px",
          color: "rgba(220,140,140,0.9)",
        }}>
          {message}
        </p>
      )}
    </form>
  );
}

const CONV_PLACEHOLDERS = [
  { text: "Ask me anything about Antiviral", weight: 0.30 },
  { text: "How does the daily Edition work?", weight: 0.24 },
  { text: "What does it cost?", weight: 0.18 },
  { text: "When does it launch?", weight: 0.12 },
  { text: "Is my data private?", weight: 0.10 },
  { text: "Who made this app?", weight: 0.06 },
];

function pickStartIndex() {
  const r = Math.random();
  let sum = 0;
  for (let i = 0; i < CONV_PLACEHOLDERS.length; i++) {
    sum += CONV_PLACEHOLDERS[i].weight;
    if (r < sum) return i;
  }
  return 0;
}

function ConversationBar() {
  const [phase, setPhase] = useState("collapsed"); // collapsed | typing | loading | response
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(() => pickStartIndex());
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const inputRef = useRef(null);
  const barRef = useRef(null);

  const maxQuestions = 10;
  const cooldownMs = 3000;
  const placeholder = CONV_PLACEHOLDERS[placeholderIdx].text;

  // Rotate placeholder every 5 seconds when not loading/responding
  useEffect(() => {
    if (phase === "loading" || phase === "response") return;
    const timer = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % CONV_PLACEHOLDERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [phase]);

  // Click outside to collapse
  useEffect(() => {
    if (phase === "collapsed") return;
    const handleClick = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setPhase("collapsed");
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [phase]);

  // Escape to collapse
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && phase !== "collapsed") {
        setPhase("collapsed");
        setQuery("");
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [phase]);

  // Auto-focus when entering typing phase
  useEffect(() => {
    if (phase === "typing" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase]);

  const handlePillClick = () => {
    if (questionCount >= maxQuestions) return;
    setPhase("typing");
    setAnswer("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phase === "loading") return;
    const trimmed = query.trim() || placeholder;
    if (!trimmed) return;

    if (questionCount >= maxQuestions) {
      setAnswer("That's a lot of questions — join the waitlist and you'll have the whole app soon enough.");
      setPhase("response");
      return;
    }

    const now = Date.now();
    if (now - lastSubmitTime < cooldownMs) return;

    setLastSubmitTime(now);
    setPhase("loading");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = await res.json();
      if (data.answer) {
        setAnswer(data.answer);
        setQuestionCount((c) => c + 1);
      } else {
        setAnswer("I'm having trouble thinking right now.");
      }
    } catch {
      setAnswer("I'm having trouble thinking right now.");
    }
    setPhase("response");
  };

  const handleDismiss = () => {
    setPhase("collapsed");
    setQuery("");
    setAnswer("");
  };

  const barBase = {
    position: "fixed",
    bottom: "12px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 99,
    fontFamily: "'DM Mono', monospace",
  };

  if (phase === "collapsed") {
    return (
      <div ref={barRef} className="conv-bar-anchor" style={barBase}>
        <button
          onClick={handlePillClick}
          style={{
            background: "rgba(10,10,10,0.7)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(107,158,111,0.2)",
            borderRadius: "100px",
            padding: "12px 24px",
            color: "rgba(255,255,255,0.55)",
            fontSize: "13px",
            fontFamily: "'DM Mono', monospace",
            cursor: "pointer",
            maxWidth: "360px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            transition: "all 0.25s ease",
          }}
        >
          {placeholder}
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Translucent backdrop when response is visible */}
      {phase === "response" && answer && (
        <div
          onClick={handleDismiss}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: "-100px",
            zIndex: 98,
            background: "rgba(0,0,0,0.5)",
            animation: "convBarFadeIn 0.25s ease",
          }}
        />
      )}
      <div ref={barRef} className="conv-bar-anchor" style={{
        ...barBase,
        width: "min(520px, calc(100vw - 32px))",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: "8px",
      }}>
      {/* Response panel */}
      {phase === "response" && answer && (
        <div role="status" aria-live="polite" style={{
          background: "rgba(10,10,10,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(107,158,111,0.15)",
          borderRadius: "16px",
          padding: "20px",
          maxHeight: "40vh",
          overflowY: "auto",
          animation: "convBarSlideUp 0.3s ease",
          position: "relative",
        }}>
          <button
            onClick={handleDismiss}
            aria-label="Close answer"
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.3)",
              fontSize: "16px",
              cursor: "pointer",
              padding: "4px 8px",
              lineHeight: 1,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <p style={{
            margin: 0,
            fontSize: "15px",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.8)",
            fontFamily: "'Karla', 'Helvetica Neue', sans-serif",
            paddingRight: "24px",
          }}>
            {answer}
          </p>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} style={{
        display: "flex",
        alignItems: "center",
        background: "rgba(10,10,10,0.7)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(107,158,111,0.2)",
        borderRadius: "100px",
        padding: "4px 4px 4px 20px",
        ...(phase === "loading" ? { animation: "convBarPulse 1.5s ease infinite" } : {}),
      }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          maxLength={500}
          disabled={phase === "loading"}
          aria-label="Ask a question about Antiviral"
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            color: "rgba(255,255,255,0.85)",
            fontSize: "16px",
            fontFamily: "'DM Mono', monospace",
            caretColor: "#6B9E6F",
          }}
        />
        <button
          type="submit"
          disabled={phase === "loading"}
          aria-label="Send question"
          style={{
            background: "#6B9E6F",
            border: "none",
            borderRadius: "100px",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.2s ease",
            color: "#0A0A0A",
            fontSize: "16px",
            flexShrink: 0,
            opacity: phase === "loading" ? 0.5 : 1,
          }}
        >
          <span aria-hidden="true">&uarr;</span>
        </button>
      </form>
    </div>
    </>
  );
}

const LOOP_STEPS = [
  {
    label: "Feed",
    body: "Honest curation of the sources you already follow. Talk to it — “less crypto, more long-form interviews” — and the feed rebuilds around what you actually care about, not what keeps you scrolling.",
  },
  {
    label: "Shortlist",
    body: "A finite hand of cards for when you want a little more in the moment. Still an end, not a hole.",
  },
  {
    label: "Edition",
    body: "One issue a day, composed from your sources, with a genuine last page. Read it, reach the end, and you're done.",
  },
];

const PRICING_TIERS = [
  {
    label: "Free",
    body: "the Feed, the Shortlist, and a Sunday Edition every week, free forever.",
  },
  {
    label: "Antiviral",
    body: "$5/month or $50/year. The daily Edition, every day.",
  },
  {
    label: "Founding Reader",
    body: "$199, once. Yours for good.",
  },
];

export default function AntiviralLanding() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const s = window.scrollY > 50;
      setScrolled((p) => (p === s ? p : s));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{
      background: "#0A0A0A",
      color: "#fff",
      minHeight: "100vh",
      fontFamily: "'Karla', 'Helvetica Neue', sans-serif",
      overflowX: "hidden",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeSlideIn {
          to { opacity: 1; transform: translateY(0); }
          from { opacity: 0; transform: translateY(16px); }
        }

        ::selection {
          background: #6B9E6F;
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
          background: #6B9E6F;
          color: #0A0A0A;
        }
        .cta-primary:hover {
          background: #7DB882;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(94, 140, 97, 0.3);
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
          color: rgba(107, 158, 111, 0.2);
          font-family: Georgia, serif;
          position: absolute;
          top: -10px;
          left: -8px;
          user-select: none;
        }

        a, button, input, textarea { outline: none; }
        a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible {
          outline: 2px solid #6B9E6F;
          outline-offset: 3px;
          border-radius: 4px;
        }
        .cta-btn:focus-visible {
          outline: 2px solid #6B9E6F;
          outline-offset: 4px;
        }

        @media (max-width: 768px) {
          .conv-bar-anchor {
            bottom: 64px !important;
          }
          nav {
            padding: 16px 20px !important;
          }
          section {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          section.hero {
            padding-top: 100px !important;
            padding-bottom: 60px !important;
          }
        }
        @media (max-width: 400px) {
          nav .cta-btn {
            padding: 8px 14px !important;
            font-size: 12px !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        @keyframes convBarPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        @keyframes convBarSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes convBarFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
        background: scrolled ? "rgba(10,10,10,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
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
          antiviral
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <a href="#waitlist" className="cta-btn cta-secondary" style={{ padding: "10px 24px", fontSize: "13px" }}>Join the waitlist</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "140px 40px 100px",
        maxWidth: "900px",
        margin: "0 auto",
        position: "relative",
      }}>
        <FeedVisualization />

        <div style={{ marginBottom: "40px" }}>
          <Pill>Fall 2026 · Built for iOS 27</Pill>
        </div>

        <h1 style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: "clamp(42px, 7vw, 76px)",
          fontWeight: 400,
          lineHeight: 1.05,
          letterSpacing: "-0.025em",
          marginBottom: "36px",
        }}>
          <span className="hero-line" style={{ animationDelay: "0.1s" }}>Your feed,</span>
          <span className="hero-line" style={{ animationDelay: "0.3s", color: "#6B9E6F" }}>finally yours.</span>
        </h1>

        <p style={{
          fontSize: "clamp(18px, 2.5vw, 22px)",
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.55)",
          maxWidth: "620px",
          marginBottom: "48px",
          opacity: 0,
          animation: "fadeSlideIn 0.7s ease forwards 0.6s",
        }}>
          One honest daily edition from the YouTube channels, podcasts, and blogs you already follow — with a real last page. It runs on your device, works for you instead of an advertiser, and shows you why it chose every piece.
        </p>

        <div style={{
          opacity: 0,
          animation: "fadeSlideIn 0.7s ease forwards 0.9s",
        }}>
          <WaitlistForm />
        </div>
      </section>

      {/* THE PROBLEM — cessation hook (the kept paragraph) */}
      <section style={{
        padding: "120px 40px",
        maxWidth: "760px",
        margin: "0 auto",
      }}>
        <FadeIn>
          <div style={{ position: "relative", paddingLeft: "36px" }}>
            <span className="quote-mark">"</span>
            <p style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: "clamp(24px, 3.5vw, 34px)",
              lineHeight: 1.55,
              fontWeight: 400,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.85)",
            }}>
              You searched for a good pizza place. Three videos later you're watching a guy explain why the moon landing was staged. The algorithm didn't break. That's how it works.
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
            The feed is infinite. Your attention isn't. Antiviral is built for the thing that's actually worth something.
          </p>
        </FadeIn>
      </section>

      <div className="section-divider" />

      {/* THE EDITION — the answer */}
      <section style={{
        padding: "120px 40px",
        maxWidth: "900px",
        margin: "0 auto",
      }}>
        <FadeIn>
          <div style={{ marginBottom: "16px" }}>
            <Pill>The Edition</Pill>
          </div>
          <h2 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "20px",
          }}>
            One edition a day.<br />
            <span style={{ color: "rgba(255,255,255,0.35)" }}>Then you're done.</span>
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
            Antiviral turns the sources you already follow into a single honest issue — an editor's note, a few sections that actually hang together, and a genuine last page. No infinite scroll. No algorithm angling to keep you. You read it, you reach the end, and you get on with your day.
          </p>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}>
            {LOOP_STEPS.map((step, i) => (
              <div key={i} style={{
                padding: "32px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <p style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#6B9E6F",
                  marginBottom: "16px",
                }}>
                  {`0${i + 1} · ${step.label}`}
                </p>
                <p style={{
                  fontSize: "16px",
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.6)",
                }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      <div className="section-divider" />

      {/* ASK THE EDITOR — correction loop */}
      <section style={{
        padding: "120px 40px",
        maxWidth: "900px",
        margin: "0 auto",
      }}>
        <FadeIn>
          <div style={{ marginBottom: "16px" }}>
            <Pill>Ask the Editor</Pill>
          </div>
          <h2 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "20px",
          }}>
            Don’t like what you see?<br />
            <span style={{ color: "#6B9E6F" }}>Tell it.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p style={{
            fontSize: "19px",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.55)",
            maxWidth: "620px",
          }}>
            See something that doesn’t belong? Tell Antiviral “this doesn’t belong here” and it writes a rule — one you can read, and change — that re-ranks your feed from then on. It runs on your device, and you can see every rule it’s keeping. Every platform built a model of your taste and hid it. This one you edit.
          </p>
        </FadeIn>
      </section>

      <div className="section-divider" />

      {/* TRUST ARCHITECTURE */}
      <section style={{
        padding: "120px 40px",
        maxWidth: "760px",
        margin: "0 auto",
        textAlign: "center",
      }}>
        <FadeIn>
          <h2 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(28px, 4.5vw, 44px)",
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: "28px",
          }}>
            On your device. Working for you.<br />
            <span style={{ color: "#6B9E6F" }}>Showing its reasoning.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p style={{
            fontSize: "18px",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.5)",
            maxWidth: "560px",
            margin: "0 auto",
          }}>
            The curation runs on your phone — no ad profile, nothing sold, no server we operate that stores you. Once a day, to compose your edition, it borrows Apple's Private Cloud Compute, which is built so that no one — including Apple and us — can keep or see what it processes. And you can tap anything to see exactly why it's there.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            marginTop: "56px",
            flexWrap: "wrap",
          }}>
            {[
              "No ads",
              "No tracking",
              "On-device AI",
              "Edition on Apple PCC",
            ].map((label, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                <span style={{ color: "#6B9E6F", fontSize: "18px" }}>—</span>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.05em",
                }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      <div className="section-divider" />

      {/* PRICING */}
      <section style={{
        padding: "120px 40px",
        maxWidth: "900px",
        margin: "0 auto",
      }}>
        <FadeIn>
          <div style={{ marginBottom: "16px" }}>
            <Pill>Pricing</Pill>
          </div>
          <h2 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "56px",
          }}>
            Pay for the product.<br />
            <span style={{ color: "#6B9E6F" }}>Never with your attention.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}>
            {PRICING_TIERS.map((tier, i) => (
              <div key={i} style={{
                padding: "32px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <p style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#6B9E6F",
                  marginBottom: "16px",
                }}>
                  {tier.label}
                </p>
                <p style={{
                  fontSize: "16px",
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.6)",
                }}>
                  {tier.body}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      <div className="section-divider" />

      {/* CLOSING */}
      <section id="waitlist" style={{
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
            color: "rgba(255,255,255,0.55)",
            marginBottom: "32px",
          }}>
            The thesis
          </p>
          <h2 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(26px, 4vw, 40px)",
            fontWeight: 400,
            lineHeight: 1.4,
            letterSpacing: "-0.01em",
            color: "rgba(255,255,255,0.85)",
            marginBottom: "40px",
          }}>
            Every platform built a model of your interests<br />
            and <em>hid it from you</em>.<br />
            <span style={{ fontWeight: 700 }}>We hand it back.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p style={{
            fontSize: "16px",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.45)",
            marginBottom: "32px",
          }}>
            Coming Fall 2026 for iPhone and Mac, day-and-date with iOS 27. Requires an iPhone 15 Pro or newer, or a Mac with Apple silicon — with Apple Intelligence.
          </p>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WaitlistForm />
          </div>
        </FadeIn>

        <ConversationBar />
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "36px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "1000px",
        margin: "0 auto",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          fontFamily: "'DM Mono', monospace",
          fontSize: "11px",
          color: "rgba(255,255,255,0.55)",
        }}>
          <span>Finite by design.</span>
          <a href="/privacy" style={{
            color: "rgba(255,255,255,0.55)",
            textDecoration: "none",
          }}>
            Privacy
          </a>
          <a href="/terms" style={{
            color: "rgba(255,255,255,0.55)",
            textDecoration: "none",
          }}>
            Terms
          </a>
          <a href="/devlog" style={{
            color: "rgba(255,255,255,0.55)",
            textDecoration: "none",
          }}>
            Dev Log
          </a>
        </div>

        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "12px",
          color: "rgba(255,255,255,0.4)",
        }}>
          <a href="https://studioikigai.ai" target="_blank" rel="noopener noreferrer" style={{
            color: "rgba(255,255,255,0.4)",
            textDecoration: "none",
          }}>
            from Studio Ikigai
          </a>
        </div>
      </footer>
    </div>
  );
}
