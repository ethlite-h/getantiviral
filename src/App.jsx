import { useState, useEffect, useRef, useCallback } from "react";

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
      if (!lines) { animRef.current = requestAnimationFrame(draw); return; }

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

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
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

function AnimatedLogo({ size = 28 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 2;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const streaks = [
      { color: [100, 230, 160], dotX: 0.15, yStart: 0.42, yMid: 0.55, yEnd: 0.48 },
      { color: [230, 110, 140], dotX: 0.50, yStart: 0.55, yMid: 0.45, yEnd: 0.52 },
      { color: [160, 140, 240], dotX: 0.85, yStart: 0.50, yMid: 0.52, yEnd: 0.45 },
    ];

    const draw = (time) => {
      ctx.clearRect(0, 0, size, size);
      const t = time * 0.001;

      for (const s of streaks) {
        const [r, g, b] = s.color;
        const wave = Math.sin(t * 0.8 + s.dotX * 6) * 0.04;
        const y0 = (s.yStart + wave) * size;
        const y1 = (s.yMid - wave * 0.7) * size;
        const y2 = (s.yEnd + wave * 0.5) * size;

        // Draw streak line
        ctx.beginPath();
        ctx.moveTo(-2, y0);
        ctx.quadraticCurveTo(size * 0.35, y1, size * 0.5, (y0 + y2) / 2 + wave * size * 2);
        ctx.quadraticCurveTo(size * 0.65, y2, size + 2, y2);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.35)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Second thinner parallel line for richness
        ctx.beginPath();
        ctx.moveTo(-2, y0 + 2);
        ctx.quadraticCurveTo(size * 0.35, y1 + 1.5, size * 0.5, (y0 + y2) / 2 + wave * size * 2 + 2);
        ctx.quadraticCurveTo(size * 0.65, y2 + 1.5, size + 2, y2 + 2);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.15)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Glowing dot
        const pulse = 0.6 + 0.4 * Math.sin(t * 1.5 + s.dotX * 10);
        const dx = s.dotX * size;
        const dy = s.dotX < 0.3 ? y0 : s.dotX > 0.7 ? y2 : (y0 + y2) / 2 + wave * size * 2;
        const dotR = 2.5 + pulse * 1.5;

        const grad = ctx.createRadialGradient(dx, dy, 0, dx, dy, dotR * 2);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.9 * pulse})`);
        grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${0.4 * pulse})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(dx - dotR * 2, dy - dotR * 2, dotR * 4, dotR * 4);
      }

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animRef.current);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: size + "px",
        height: size + "px",
        borderRadius: "6px",
        flexShrink: 0,
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
        background: "#6B9E6F",
        marginTop: "9px",
        flexShrink: 0,
      }} />
      <p style={{
        margin: 0,
        fontSize: "17px",
        lineHeight: 1.65,
        color: "rgba(255,255,255,0.75)",
        fontFamily: "'Karla', 'Helvetica Neue', sans-serif",
      }}>
        {text}
      </p>
    </div>
  );
}

const CONV_PLACEHOLDERS = [
  { text: "Ask me anything about Antiviral", weight: 0.283 },
  { text: "How is the feed built?", weight: 0.283 },
  { text: "Is this really free?", weight: 0.284 },
  { text: "Who made this app?", weight: 0.06 },
  { text: "How does the AI work?", weight: 0.06 },
  { text: "Tell me a secret", weight: 0.03 },
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
      setAnswer("That's a lot of questions — download the app for the full experience.");
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
            color: "rgba(255,255,255,0.4)",
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
        <div style={{
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
            &times;
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
          &uarr;
        </button>
      </form>
    </div>
    </>
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
      fontFamily: "'Karla', 'Helvetica Neue', sans-serif",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Karla:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

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

        @media (max-width: 768px) {
          .conv-bar-anchor {
            bottom: 64px !important;
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
          antiviral
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
        <FeedVisualization />

        <div style={{ marginBottom: "40px" }}>
          <Pill>Free — no catch</Pill>
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
          <a href="https://testflight.apple.com/join/sQH5sdCw" target="_blank" rel="noopener noreferrer" className="cta-btn cta-primary">
            Get Antiviral
            <span style={{ fontSize: "18px" }}>↗</span>
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
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: "clamp(24px, 3.5vw, 34px)",
              lineHeight: 1.55,
              fontWeight: 400,
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
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 400,
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
                <span style={{ color: "#6B9E6F" }}>you →</span>
                <span style={{ color: "rgba(255,255,255,0.8)", marginLeft: "8px" }}>go deeper on pottery</span>
              </div>
              <div>
                <span style={{ color: "rgba(255,255,255,0.35)" }}>antiviral →</span>
                <span style={{ color: "rgba(255,255,255,0.55)", marginLeft: "8px" }}>Diving deeper into pottery for you.</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px" }}>
                <span style={{ color: "#6B9E6F" }}>you →</span>
                <span style={{ color: "rgba(255,255,255,0.8)", marginLeft: "8px" }}>I'm done with politics</span>
              </div>
              <div>
                <span style={{ color: "rgba(255,255,255,0.35)" }}>antiviral →</span>
                <span style={{ color: "rgba(255,255,255,0.55)", marginLeft: "8px" }}>Got it — I'll stop showing politics content.</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px" }}>
                <span style={{ color: "#6B9E6F" }}>you →</span>
                <span style={{ color: "rgba(255,255,255,0.8)", marginLeft: "8px" }}>is my data private?</span>
              </div>
              <div>
                <span style={{ color: "rgba(255,255,255,0.35)" }}>antiviral →</span>
                <span style={{ color: "rgba(255,255,255,0.55)", marginLeft: "8px" }}>Everything runs on your device. Your interests, watch history, and conversations never leave your phone. There's no analytics, no tracking, no data collection.</span>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.35}>
          <div style={{
            marginTop: "56px",
            padding: "32px 40px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(94,140,97,0.1), rgba(94,140,97,0.03))",
            border: "1px solid rgba(94,140,97,0.2)",
            textAlign: "center",
          }}>
            <p style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: "28px",
              fontWeight: 400,
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
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(28px, 4.5vw, 44px)",
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: "28px",
          }}>
            It never calls home.<br />
            <span style={{ color: "#6B9E6F" }}>So it never betrays you.</span>
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
                <span style={{ color: "#6B9E6F", fontSize: "20px" }}>{item.icon}</span>
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
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 400,
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
                { topic: "Astronomy", trend: "↑ growing", weeks: "3 weeks", status: "active", color: "#6B9E6F" },
                { topic: "Minecraft", trend: "→ steady", weeks: "6 months", status: "active", color: "rgba(255,255,255,0.4)" },
                { topic: "Drawing", trend: "↑ new", weeks: "1 week", status: "growing", color: "#6B9E6F" },
                { topic: "Slime videos", trend: "↓ fading", weeks: "2 months", status: "fading", color: "rgba(255,255,255,0.2)" },
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
                      fontFamily: "'Karla', 'Helvetica Neue', sans-serif",
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
                      {item.status}
                    </span>
                    <span style={{ color: item.color }}>{item.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            <p style={{
              fontFamily: "'Karla', 'Helvetica Neue', sans-serif",
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
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(26px, 4vw, 40px)",
            fontWeight: 400,
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
            <a href="https://testflight.apple.com/join/sQH5sdCw" target="_blank" rel="noopener noreferrer" className="cta-btn cta-primary">
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
          fontFamily: "'DM Mono', monospace",
          fontSize: "12px",
          color: "rgba(255,255,255,0.2)",
        }}>
          <a href="https://studioikigai.ai" target="_blank" rel="noopener noreferrer" style={{
            color: "rgba(255,255,255,0.2)",
            textDecoration: "none",
          }}>
            from Studio Ikigai
          </a>
        </div>

        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "11px",
          color: "rgba(255,255,255,0.2)",
          opacity: 0.5,
        }}>
          Your feed. Your data. Your device.
        </div>
      </footer>

      <ConversationBar />
    </div>
  );
}
