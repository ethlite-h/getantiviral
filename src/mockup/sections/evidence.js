// 09 — Evidence: the literature, pinned to a ruled lab wall.
// Four paper sheets, each one study: a big figure, a small hairline instrument
// that draws itself on entry, the verified finding, and the source. Tap a
// sheet and it turns over to the caveat: what was measured, and what wasn't.
import '../styles/evidence.css'
import { ScrollTrigger, prefersReducedMotion } from '../lib/scroll.js'

// Figures, caveats and citations are the checked entries from research/evidence-verified.json;
// the frames are the spec's, verbatim.
const STUDIES = [
  {
    n: 1, id: 'allcott-2020', kind: 'Randomized trial', glyph: 'weeks',
    fig: [{ t: '4', big: true }, { t: 'weeks' }],
    finding: 'In a randomized trial, a four-week Facebook deactivation improved subjective well-being and reduced polarization; people also knew a little less news.',
    frame: 'They felt better, argued less, and knew slightly less. Antiviral is built for the "and": keep the calm, keep the news.',
    plain: 'Plainly: after four weeks off Facebook, people said they felt a little better, held less polarized views, and knew a little less news than those who kept using it.',
    measured: '4-week Facebook deactivation (RCT, n=1,661 in impact sample): +0.09 SD well-being, -0.16 SD issue polarization, -0.19 SD news knowledge, ~60 min/day freed',
    caveat: 'US adults recruited on Facebook who agreed to deactivate; effects small in SD terms.',
    short: 'Allcott, Braghieri, Eichmeyer & Gentzkow, AER 2020',
    citation: 'Allcott, Braghieri, Eichmeyer & Gentzkow, "The Welfare Effects of Social Media," American Economic Review 110(3), 2020.',
    url: 'https://www.aeaweb.org/articles?id=10.1257/aer.20190658',
  },
  {
    n: 2, id: 'hunt-2018', kind: 'Small trial', glyph: 'halfhour',
    fig: [{ t: '30', big: true, count: true }, { t: 'min a day' }],
    sub: 'for three weeks',
    finding: 'In a small three-week trial at Penn, students randomly assigned to cap three social apps at about ten minutes each a day reported feeling less lonely than peers who used them as usual, and those who started out depressed reported feeling less so.',
    plain: 'Plainly: 143 students capped three social apps at ten minutes each a day for three weeks and reported feeling less lonely than classmates who used them as usual.',
    measured: 'n=143 Penn undergrads; 10 min/platform/day on 3 platforms for 3 weeks; less loneliness; less depression among those who started out depressed',
    caveat: '143 students, one university, self-report.',
    short: 'Hunt, Marx, Lipson & Young, 2018',
    citation: 'Hunt, Marx, Lipson & Young, "No More FOMO: Limiting Social Media Decreases Loneliness and Depression," Journal of Social and Clinical Psychology 37(10), 2018.',
    url: 'https://guilfordjournals.com/doi/10.1521/jscp.2018.37.10.751',
  },
  {
    n: 3, id: 'reuters-2025-avoidance', kind: 'Survey, 48 countries', glyph: 'ten',
    fig: [{ t: '4', big: true }, { t: 'in' }, { t: '10', big: true }],
    finding: 'Four in ten people across 48 countries told the Reuters Institute in 2025 that they sometimes or often avoid the news, up from 29% in 2017.',
    frame: 'News fatigue is real; a finite issue is the remedy, not abstinence.',
    plain: 'Plainly: an online survey asked people in 48 countries whether they avoid the news, and four in ten said sometimes or often; it measured what people say they do, not what they do.',
    measured: '40% sometimes or often avoid the news (2025, joint highest recorded); 29% in 2017',
    caveat: "Online panels of internet users; 'avoid' is self-described and includes occasional avoidance.",
    short: 'Reuters Institute, Digital News Report 2025',
    citation: 'Reuters Institute for the Study of Journalism, Digital News Report 2025 (executive summary).',
    url: 'https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2025/dnr-executive-summary',
  },
  {
    n: 4, id: 'datareportal-2025', kind: 'Self-report survey', glyph: 'dial',
    fig: [{ t: '2', big: true }, { t: 'h', tight: true }, { t: '21', big: true }, { t: 'm', tight: true }],
    sub: 'about 36 days a year',
    finding: 'By their own estimate, internet users average about two hours twenty minutes a day on social media.',
    frame: 'A year of that is about 36 days.',
    plain: 'Plainly: people were asked how long they spend on social media on a typical day, and the average answer was about two hours twenty minutes; nobody\'s phone was measured.',
    measured: '2 h 21 min per day on social media, typical internet user (self-reported, GWI)',
    caveat: "Self-reported 'typical day' hours; internet users aged 16–64.",
    short: 'DataReportal, Digital 2025 Global Overview',
    citation: 'DataReportal (Kepios) with We Are Social and Meltwater, Digital 2025 Global Overview Report; time data from GWI.',
    url: 'https://datareportal.com/reports/digital-2025-global-overview-report',
  },
]

/* ---------- the instruments: hairline drawings, aria-hidden, drawn on entry ---------- */
const svg = (cls, vb, inner) => `<svg class="evidence__glyph evidence__glyph--${cls}" viewBox="${vb}" aria-hidden="true" focusable="false">${inner}</svg>`

// 4 weeks: 28 day-cells, filled in order
const glyphWeeks = () => {
  let s = ''
  for (let i = 0; i < 28; i++) {
    const c = i % 7, r = Math.floor(i / 7)
    s += `<rect class="evidence__cell" style="--i:${i}" x="${c * 16 + 0.5}" y="${r * 16 + 0.5}" width="12" height="12" rx="1.5"/>`
  }
  return svg('weeks', '0 0 108 60', s)
}

// 4 in 10: ten pips, four of them filled
const glyphTen = (of = 10, on = 4) => {
  let s = ''
  for (let i = 0; i < of; i++) {
    s += `<circle class="evidence__pip${i < on ? ' is-on' : ''}" style="--i:${i}" cx="${9 + i * 22}" cy="9" r="7"/>`
  }
  return svg('ten', `0 0 ${of * 22 - 4} 18`, s)
}

// 2h 21m: a 24-hour dial with the day's social-media wedge; 30 min: half of a 60-minute face
const glyphDial = (minutes = 141, total = 1440, ticks = 24) => {
  const R = 26, cx = 32, cy = 32
  const a = (minutes / total) * Math.PI * 2
  const x = (cx + R * Math.sin(a)).toFixed(2), y = (cy - R * Math.cos(a)).toFixed(2)
  const len = (R * a).toFixed(2)
  let marks = ''
  for (let i = 0; i < ticks; i++) {
    const t = (i / ticks) * Math.PI * 2
    const major = i % (ticks / 4) === 0
    const r1 = R + 3, r2 = R + (major ? 6 : 4.5)
    marks += `<line class="evidence__tick${major ? ' is-major' : ''}" x1="${(cx + r1 * Math.sin(t)).toFixed(2)}" y1="${(cy - r1 * Math.cos(t)).toFixed(2)}" x2="${(cx + r2 * Math.sin(t)).toFixed(2)}" y2="${(cy - r2 * Math.cos(t)).toFixed(2)}"/>`
  }
  return svg('dial', '0 0 64 64', `
    <circle class="evidence__ring" cx="${cx}" cy="${cy}" r="${R}"/>
    ${marks}
    <path class="evidence__wedge" d="M${cx} ${cy} L${cx} ${cy - R} A${R} ${R} 0 0 1 ${x} ${y} Z"/>
    <path class="evidence__arc" style="--len:${len}" d="M${cx} ${cy - R} A${R} ${R} 0 0 1 ${x} ${y}"/>
    <circle class="evidence__pin" cx="${cx}" cy="${cy}" r="1.4"/>`)
}

const GLYPHS = { weeks: glyphWeeks, ten: glyphTen, dial: glyphDial, halfhour: () => glyphDial(30, 60, 12) }

// A counted figure sits over a hidden copy of its final value, so the unit never shifts while it counts.
const figure = (parts, { live = true } = {}) => parts.map((p) => {
  if (p.big) {
    return p.count && live
      ? `<span class="evidence__num evidence__num--count"><span class="evidence__sizer" aria-hidden="true">${p.t}</span><span data-count="${p.t}" data-count-decimals="0">0</span></span>`
      : `<span class="evidence__num">${p.t}</span>`
  }
  return `<span class="evidence__unit${p.tight ? ' evidence__unit--tight' : ''}">${p.t}</span>`
}).join('')

const tile = (s, i) => `
  <li class="evidence__tile" style="--i:${i}">
    <button type="button" class="evidence__flip" aria-pressed="false">
      <span class="evidence__card">
        <span class="evidence__face evidence__face--front">
          <span class="evidence__top">Fig. ${s.n} · ${s.kind}</span>
          <span class="evidence__fig">${figure(s.fig)}</span>
          ${s.sub ? `<span class="evidence__sub">${s.sub}</span>` : ''}
          ${GLYPHS[s.glyph]()}
          <span class="evidence__finding">${s.finding}<sup class="fn">${s.n}</sup></span>
          ${s.frame ? `<span class="evidence__frame">${s.frame}</span>` : ''}
          <span class="evidence__hint">Turn over <i aria-hidden="true">↺</i></span>
        </span>
        <span class="evidence__face evidence__face--back" aria-hidden="true">
          <span class="evidence__ghost evidence__fig" aria-hidden="true">${figure(s.fig, { live: false })}</span>
          <span class="evidence__top">Fig. ${s.n} · The fine print</span>
          <span class="evidence__kicker">Caveat</span>
          <span class="evidence__caveat">${s.caveat}</span>
          <span class="evidence__kicker evidence__kicker--2">Measured</span>
          <span class="evidence__plain">${s.plain}</span>
          <span class="evidence__measured">${s.measured}</span>
          <span class="evidence__hint">Turn back <i aria-hidden="true">↺</i></span>
        </span>
      </span>
    </button>
    <p class="evidence__src"><a href="${s.url}" target="_blank" rel="noopener"><span>${s.short}</span><i aria-hidden="true">↗</i></a></p>
  </li>`

const host = (url) => new URL(url).hostname.replace(/^www\./, '')

export const html = `
<section class="evidence section" id="evidence" data-page data-world-lock="paper" aria-labelledby="evidence-h">
  <div class="container">
    <header class="evidence__head">
      <p class="eyebrow" data-reveal>09 · The literature</p>
      <h2 id="evidence-h" class="evidence__h2">
        <span class="evidence__l" data-reveal="lines">None of this is a theory.</span>
        <span class="evidence__l" data-reveal="lines" data-reveal-delay="0.12"><em class="i accent">It's a finding.</em></span>
      </h2>
      <p class="lead measure evidence__lead" data-reveal data-reveal-delay="0.2">We didn't discover any of it. We just declined to build it. Every number below links to its paper.</p>
    </header>

    <ol class="evidence__tiles" role="list" data-reveal-group>
      ${STUDIES.map(tile).join('')}
    </ol>

    <p class="evidence__close" data-reveal="lines">You'll notice the studies don't say people are weak. <em class="i accent">They say the design works.</em> Those are different findings, and only one of them is being blamed on you.</p>

    <ol class="cite evidence__cite" aria-label="Sources">
      ${STUDIES.map((s) => `<li id="evidence-n${s.n}"><b>${s.n}</b><span>${s.citation} <a href="${s.url}" target="_blank" rel="noopener">${host(s.url)} ↗</a></span></li>`).join('')}
    </ol>
  </div>
</section>`

export function init(root) {
  const el = root.querySelector('#evidence')
  if (!el) return

  el.querySelectorAll('.evidence__tile').forEach((tile) => {
    const btn = tile.querySelector('.evidence__flip')
    const front = tile.querySelector('.evidence__face--front')
    const back = tile.querySelector('.evidence__face--back')

    const setFlipped = (on) => {
      btn.setAttribute('aria-pressed', on ? 'true' : 'false')
      tile.classList.toggle('is-flipped', on)
      front.setAttribute('aria-hidden', on ? 'true' : 'false')
      back.setAttribute('aria-hidden', on ? 'false' : 'true')
    }
    btn.addEventListener('click', () => setFlipped(btn.getAttribute('aria-pressed') !== 'true'))

    // the instrument draws itself once, when the sheet comes into view
    if (prefersReducedMotion) { tile.classList.add('is-in'); return }
    ScrollTrigger.create({ trigger: tile, start: 'top 82%', once: true, onEnter: () => tile.classList.add('is-in') })
  })
}
