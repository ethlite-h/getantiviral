// 03 — The machine, exploded. Three blueprint plates, each drawn on scroll by a
// single pen, each then doing the one thing it was built to do: the lever pulls
// and springs back, the balance tips toward the flame, the belt never stops.
import '../styles/machine.css'
import { gsap, ScrollTrigger, isMobile, prefersReducedMotion } from '../lib/scroll.js'

/* ---------------------------------------------------------------- copy */
const PARTS = [
  {
    id: 'lever', no: '01', title: 'The lever', fig: 'Fig. 1 · The lever',
    copy: 'Pull to refresh. Sometimes you get something great, sometimes nothing, and the not-knowing is the point. A psychologist worked this out on pigeons in the 1950s.<sup class="fn">1</sup> The feed made it vertical.',
    notes: [
      [1, 'Variable-ratio reinforcement (B. F. Skinner): rewards that arrive unpredictably produce the steadiest behavior and are the hardest to extinguish. Tristan Harris named the phone’s version: a slot machine in your pocket.'],
    ],
  },
  {
    id: 'balance', no: '02', title: 'The thumb on the scale', fig: 'Fig. 2 · The balance',
    copy: 'The ranking model learns that what makes you angry keeps you longer, so anger gets a boost.<sup class="fn">2,3</sup> Nobody typed “reward outrage” into a config file. They typed “maximize watch time,” and outrage is what that compiles to.',
    notes: [
      [2, 'Brady and colleagues, 2017: in tweets about gun control, same-sex marriage, and climate change, each moral-emotional word in a post raised its spread by about 20%.'],
      [3, 'Vosoughi, Roy and Aral, 2018: across a decade of fact-checked stories on Twitter, false news was about 70% more likely to be reshared than the truth. Humans did the forwarding, not bots.'],
    ],
  },
  {
    id: 'belt', no: '03', title: 'The refill', fig: 'Fig. 3 · The belt',
    copy: 'The page never ends, because an ending is where you’d leave, and leaving is the one thing it’s built to prevent. A magazine has a last page. A feed has “up next.”<sup class="fn">4</sup>',
    notes: [
      [4, 'Gloria Mark (UC Irvine), Attention Span, 2023: the average attention on a single screen fell from about two and a half minutes in 2004 to about 47 seconds.'],
    ],
  },
]

const CITES = [
  'B. F. Skinner, <i>Schedules of Reinforcement</i> (with C. B. Ferster), 1957; Tristan Harris, <a href="https://medium.com/thrive-global/how-technology-hijacks-peoples-minds-from-a-magician-and-google-s-design-ethicist-56d62ef5edf3" target="_blank" rel="noopener">“How Technology is Hijacking Your Mind,”</a> 2016.',
  'Brady, Wills, Jost, Tucker &amp; Van Bavel, <a href="https://www.pnas.org/doi/10.1073/pnas.1618923114" target="_blank" rel="noopener">“Emotion shapes the diffusion of moralized content in social networks,”</a> PNAS 114(28), 2017.',
  'Vosoughi, Roy &amp; Aral, <a href="https://www.science.org/doi/10.1126/science.aap9559" target="_blank" rel="noopener">“The spread of true and false news online,”</a> Science 359(6380), 2018.',
  'Gloria Mark (UC Irvine), <i>Attention Span</i>, 2023; figures from her <a href="https://www.universityofcalifornia.edu/news/cant-pay-attention-youre-not-alone" target="_blank" rel="noopener">field studies of information workers</a>.',
]

/* ------------------------------------------------------------ drawings */
// Ground hatching: the drafting convention for "this is the floor".
const hatch = (x0, x1, y, step = 14) => {
  let d = ''
  for (let x = x0; x <= x1; x += step) d += `M ${x} ${y} l -6 7 `
  return d.trim()
}

// Fig. 1: the reels. Five symbols, repeated so a spin has somewhere to go.
const STEP = 26
const PAYLINE = 162
const COPIES = 5
const SYMBOL = [
  (cx, y) => `<circle cx="${cx}" cy="${y}" r="6.5"/>`,
  (cx, y) => `<path d="M ${cx - 7} ${y + 6} L ${cx} ${y - 6.5} L ${cx + 7} ${y + 6} Z"/>`,
  (cx, y) => `<rect x="${cx - 6}" y="${y - 6}" width="12" height="12" rx="1"/>`,
  (cx, y) => `<path d="M ${cx} ${y - 7.5} L ${cx + 7.5} ${y} L ${cx} ${y + 7.5} L ${cx - 7.5} ${y} Z"/>`,
  (cx, y) => `<rect x="${cx - 10}" y="${y - 3.5}" width="20" height="7" rx="1"/>`,
]
const reelStrip = (cx) => {
  let s = ''
  for (let j = 0; j < COPIES * SYMBOL.length; j++) s += SYMBOL[j % SYMBOL.length](cx, j * STEP)
  return s
}
const REEL_X = [147.5, 185.5, 223.5]

const leverSVG = `
<svg class="machine__svg" viewBox="24 46 356 236" aria-hidden="true" focusable="false">
  <defs>
    <clipPath id="machine-w0"><rect x="129" y="137" width="37" height="50"/></clipPath>
    <clipPath id="machine-w1"><rect x="167" y="137" width="37" height="50"/></clipPath>
    <clipPath id="machine-w2"><rect x="205" y="137" width="37" height="50"/></clipPath>
  </defs>
  <g class="machine__ink">
    <line x1="48" y1="262" x2="352" y2="262"/>
    <path d="${hatch(62, 342, 262)}"/>
    <rect x="110" y="96" width="150" height="166" rx="6"/>
    <line x1="110" y1="118" x2="260" y2="118"/>
    <g class="machine__lamps" fill="currentColor" fill-opacity="0">
      <circle cx="155" cy="107" r="2.5"/><circle cx="170" cy="107" r="2.5"/><circle cx="185" cy="107" r="2.5"/><circle cx="200" cy="107" r="2.5"/><circle cx="215" cy="107" r="2.5"/>
    </g>
    <rect x="128" y="136" width="114" height="52" rx="2"/>
    <line x1="166" y1="136" x2="166" y2="188"/>
    <line x1="204" y1="136" x2="204" y2="188"/>
    <path d="M 146 212 v 10 q 0 8 8 8 h 62 q 8 0 8 -8 v -10"/>
    <path d="M 260 136 h 18 a 4 4 0 0 1 4 4 v 20 a 4 4 0 0 1 -4 4 h -18"/>
    <circle cx="284" cy="150" r="4.5"/>
    <g class="machine__arm">
      <line x1="284" y1="150" x2="301" y2="76"/>
      <circle cx="303" cy="66" r="10"/>
    </g>
  </g>
  <g class="machine__late">
    <line x1="121" y1="162" x2="249" y2="162" stroke-dasharray="2 4"/>
    <path d="M 114 158 l 6 4 l -6 4 z M 256 158 l -6 4 l 6 4 z" fill="currentColor" fill-opacity="0.6" stroke="none"/>
    <path d="M 314.4 69.6 A 86 86 0 0 1 369 136" stroke-dasharray="3 5"/>
    <path d="M 362 130 L 369 138.5 L 376 130"/>
    ${REEL_X.map((cx, i) => `<g clip-path="url(#machine-w${i})"><g class="machine__reel" data-reel="${i}">${reelStrip(cx)}</g></g>`).join('')}
    <text x="128" y="129">REELS</text>
    <text x="308" y="112">ARM</text>
    <text x="344" y="62">PULL</text>
  </g>
</svg>`

const balanceSVG = `
<svg class="machine__svg" viewBox="24 46 356 236" aria-hidden="true" focusable="false">
  <defs>
    <filter id="machine-blur" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="7"/></filter>
  </defs>
  <g class="machine__ink">
    <line x1="92" y1="262" x2="308" y2="262"/>
    <path d="${hatch(104, 300, 262)}"/>
    <path d="M 168 262 v -12 q 0 -6 6 -6 h 52 q 6 0 6 6 v 12"/>
    <line x1="200" y1="244" x2="200" y2="116"/>
    <path d="M 200 104 l -9 12 h 18 z"/>
    <circle cx="200" cy="104" r="3"/>
    <g class="machine__beam">
      <line x1="86" y1="104" x2="314" y2="104"/>
      <line x1="86" y1="99" x2="86" y2="109"/>
      <line x1="314" y1="99" x2="314" y2="109"/>
      <line x1="200" y1="104" x2="200" y2="84"/>
      <g class="machine__pan" data-origin="86 104">
        <path d="M 86 104 L 60 172 M 86 104 L 112 172"/>
        <path d="M 58 172 q 28 22 56 0"/>
        <rect x="75" y="165" width="22" height="16" rx="2"/>
        <path d="M 79 170 h 14 M 79 175 h 9"/>
      </g>
      <g class="machine__pan" data-origin="314 104">
        <path d="M 314 104 L 288 172 M 314 104 L 340 172"/>
        <path d="M 286 172 q 28 22 56 0"/>
        <rect x="303" y="165" width="22" height="16" rx="2"/>
        <path d="M 307 170 h 14 M 307 175 h 9"/>
        <circle class="machine__glow" data-nodraw data-late cx="314" cy="150" r="13" fill="var(--hot-orange)" fill-opacity="0.2" stroke="none" filter="url(#machine-blur)"/>
        <path class="machine__flame" d="M 307 165 C 300 154 305 146 310 137 C 311 144 314 146 316 149 C 319 145 319 141 318 136 C 325 145 327 156 321 165 Z"/>
        <path class="machine__flame machine__flame--in" d="M 311 165 C 308 158 311 154 314 150 C 316 155 318 158 317 165"/>
      </g>
    </g>
  </g>
  <g class="machine__late">
    <path d="M 187 81.5 A 26 26 0 0 1 213 81.5" stroke-dasharray="1 3"/>
    <line x1="200" y1="75" x2="200" y2="79"/>
    <line x1="66" y1="104" x2="334" y2="104" stroke-dasharray="2 5"/>
    <text x="340" y="108">LEVEL</text>
    <text x="314" y="228" text-anchor="middle">OUTRAGE</text>
  </g>
</svg>`

const stadium = (r) => `M 100 ${150 - r} L 300 ${150 - r} A ${r} ${r} 0 0 1 300 ${150 + r} L 100 ${150 + r} A ${r} ${r} 0 0 1 100 ${150 - r} Z`
const card = () => `<g class="machine__card"><rect x="-13" y="-20" width="26" height="18" rx="2"/><path d="M -8 -14 h 16 M -8 -9 h 10"/></g>`

const beltSVG = `
<svg class="machine__svg" viewBox="24 46 356 236" aria-hidden="true" focusable="false">
  <g class="machine__ink">
    <line x1="48" y1="262" x2="352" y2="262"/>
    <path d="${hatch(62, 342, 262)}"/>
    <circle cx="100" cy="150" r="40"/>
    <circle cx="300" cy="150" r="40"/>
    <circle cx="100" cy="150" r="4"/>
    <circle cx="300" cy="150" r="4"/>
    <g class="machine__drum" data-origin="100 150"><path d="M 100 116 v 7 M 100 184 v -7 M 66 150 h 7 M 134 150 h -7"/></g>
    <g class="machine__drum" data-origin="300 150"><path d="M 300 116 v 7 M 300 184 v -7 M 266 150 h 7 M 334 150 h -7"/></g>
    <path class="machine__belt" d="${stadium(50)}"/>
    <path d="${stadium(45)}"/>
  </g>
  <g class="machine__late">
    <line x1="44" y1="150" x2="356" y2="150" stroke-dasharray="12 4 2 4"/>
    <path d="M 100 190 V 262 M 300 190 V 262" stroke-dasharray="4 4"/>
    <path class="machine__cleats" d="${stadium(47.75)}" stroke-dasharray="2 8"/>
    ${card()}${card()}${card()}${card()}
    <text x="200" y="240" text-anchor="middle">UP NEXT</text>
  </g>
</svg>`

const SVGS = { lever: leverSVG, balance: balanceSVG, belt: beltSVG }

/* ---------------------------------------------------------------- html */
const part = (p, i) => `
      <li class="machine__part" data-part="${p.id}">
        <figure class="machine__plate" data-fig="${p.id}" aria-hidden="true">
          <div class="machine__plate-bar"><span>${p.fig}</span><span>Sheet ${i + 1} / ${PARTS.length}</span></div>
          ${SVGS[p.id]}
          <i class="machine__tick machine__tick--tl"></i><i class="machine__tick machine__tick--tr"></i><i class="machine__tick machine__tick--bl"></i><i class="machine__tick machine__tick--br"></i>
        </figure>
        <div class="machine__text" data-reveal-group>
          <h3 class="machine__part-h"><span class="machine__no">${p.no} ·</span> ${p.title}</h3>
          <p class="machine__p">${p.copy}</p>
          <ol class="machine__fns" role="list">${p.notes.map(([n, t]) => `<li><span class="machine__fn-n">${n}</span><span>${t}</span></li>`).join('')}</ol>
        </div>
      </li>`

export const html = `
<section class="machine section" id="machine" data-page data-world-lock="feed" aria-labelledby="machine-h">
  <div class="container">
    <header class="machine__head">
      <p class="eyebrow" data-reveal>03 · The machine, exploded</p>
      <h2 id="machine-h" class="machine__h2" data-reveal="lines">The machine has three moving parts. <em class="i accent">You aren’t one of them.</em></h2>
      <p class="lead measure machine__lead" data-reveal>Every infinite feed runs the same three mechanisms. They aren’t a conspiracy. They’re a job description.</p>
    </header>

    <ol class="machine__parts" role="list">${PARTS.map(part).join('')}
    </ol>

    <div class="machine__after">
      <p class="machine__dnote" data-reveal>Drawing note: no part of this assembly is labeled “you”.</p>
      <h3 class="machine__close" data-reveal="lines">The intelligence was never the problem. <em class="i accent">The employer was.</em></h3>
    </div>

    <ol class="cite machine__cite" role="list" data-reveal>
      ${CITES.map((c, i) => `<li><span class="machine__cite-n">${i + 1}</span><span>${c}</span></li>`).join('\n      ')}
    </ol>
  </div>
</section>`

/* --------------------------------------------------------------- the pen */
// Every stroke in the .machine__ink group is drawn with dasharray/dashoffset
// by one pen moving at a constant speed; the late group fades in at the end.
function preparePen(svg) {
  const ink = Array.from(svg.querySelectorAll('.machine__ink :is(path, line, circle, rect, polyline, ellipse):not([data-nodraw])'))
  const late = Array.from(svg.querySelectorAll('.machine__late, [data-late]'))
  const items = ink.map((el) => {
    const len = el.getTotalLength()
    el.style.strokeDasharray = `${len}`
    el.style.strokeDashoffset = `${len}`
    return { el, len }
  })
  return {
    finish() {
      items.forEach(({ el }) => { el.style.strokeDasharray = ''; el.style.strokeDashoffset = '' })
      late.forEach((l) => { l.style.opacity = '1' })
    },
    build(tl) {
      let t = 0
      items.forEach(({ el, len }) => {
        const d = Math.max(0.04, len / 480)
        tl.to(el, { strokeDashoffset: 0, duration: d, ease: 'none' }, t)
        t += d * 0.72
      })
      tl.to(late, { opacity: 1, duration: 0.45, ease: 'power1.out' }, Math.max(0, t - 0.1))
    },
  }
}

/* ------------------------------------------------------------------ rigs */
function leverRig(svg) {
  const arm = svg.querySelector('.machine__arm')
  const reels = Array.from(svg.querySelectorAll('.machine__reel'))
  const lamps = Array.from(svg.querySelectorAll('.machine__lamps circle'))
  const idx = [2, 4, 1] // which symbol sits on the payline, per reel
  const rest = (i) => PAYLINE - STEP * (15 + idx[i]) // copy 3 of 5, so a spin has room above and below
  gsap.set(arm, { svgOrigin: '284 150' })
  reels.forEach((r, i) => gsap.set(r, { y: rest(i) }))
  let busy = false
  const pull = () => {
    if (busy) return
    busy = true
    const pick = () => Math.floor(Math.random() * SYMBOL.length)
    const win = Math.random() < 0.3
    let target
    if (win) { const s = pick(); target = [s, s, s] }
    else { do { target = [pick(), pick(), pick()] } while (target[0] === target[1] && target[1] === target[2]) }
    const tl = gsap.timeline({ onComplete: () => { busy = false } })
    tl.to(arm, { rotation: 68, duration: 0.5, ease: 'power2.in' })
      .to(arm, { rotation: 0, duration: 1.3, ease: 'elastic.out(1, 0.4)' }, '+=0.06')
    reels.forEach((r, i) => {
      const dist = STEP * (10 + idx[i] - target[i])
      idx[i] = target[i]
      tl.to(r, { y: `+=${dist}`, duration: 1.4 + i * 0.4, ease: 'power3.out' }, 0.4)
    })
    tl.add(() => reels.forEach((r, i) => gsap.set(r, { y: rest(i) })), 2.65)
    if (win) tl.to(lamps, { fillOpacity: 0.9, duration: 0.16, yoyo: true, repeat: 5, stagger: 0.04, ease: 'none' }, 2.6)
  }
  return {
    enter: () => gsap.delayedCall(0.35, pull),
    replay: pull,
    setActive() {},
    static() {},
  }
}

function balanceRig(svg) {
  const beam = svg.querySelector('.machine__beam')
  const pans = Array.from(svg.querySelectorAll('.machine__pan'))
  const flames = Array.from(svg.querySelectorAll('.machine__flame'))
  const glow = svg.querySelector('.machine__glow')
  const TILT = 11
  gsap.set(beam, { svgOrigin: '200 104' })
  pans.forEach((p) => gsap.set(p, { svgOrigin: p.dataset.origin }))
  flames.forEach((f) => gsap.set(f, { svgOrigin: '314 165' }))
  const settle = (from) => {
    gsap.killTweensOf([beam, ...pans])
    const tl = gsap.timeline()
    if (from != null) tl.set(beam, { rotation: from }).set(pans, { rotation: -from })
    tl.to(beam, { rotation: TILT, duration: 2.8, ease: 'elastic.out(1, 0.32)' }, 0)
      .to(pans, { rotation: -TILT, duration: 2.8, ease: 'elastic.out(1, 0.32)' }, 0)
  }
  const nudge = () => {
    gsap.killTweensOf([beam, ...pans])
    const tl = gsap.timeline()
    tl.to(beam, { rotation: TILT - 8, duration: 0.35, ease: 'power2.out' }, 0)
      .to(pans, { rotation: -(TILT - 8), duration: 0.35, ease: 'power2.out' }, 0)
      .to(beam, { rotation: TILT, duration: 2.6, ease: 'elastic.out(1, 0.3)' }, 0.35)
      .to(pans, { rotation: -TILT, duration: 2.6, ease: 'elastic.out(1, 0.3)' }, 0.35)
  }
  const loops = [
    gsap.to(flames[0], { scaleY: 1.1, scaleX: 0.93, duration: 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut', paused: true }),
    gsap.to(flames[1], { scaleY: 0.86, scaleX: 1.1, duration: 0.37, yoyo: true, repeat: -1, ease: 'sine.inOut', paused: true }),
    gsap.to(glow, { fillOpacity: 0.34, duration: 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut', paused: true }),
  ]
  return {
    enter: () => settle(0),
    replay: nudge,
    setActive: (on) => loops.forEach((t) => (on ? t.play() : t.pause())),
    static: () => { gsap.set(beam, { rotation: TILT }); gsap.set(pans, { rotation: -TILT }) },
  }
}

function beltRig(svg) {
  const belt = svg.querySelector('.machine__belt')
  const cleats = svg.querySelector('.machine__cleats')
  const cards = Array.from(svg.querySelectorAll('.machine__card'))
  const drums = Array.from(svg.querySelectorAll('.machine__drum'))
  drums.forEach((d) => gsap.set(d, { svgOrigin: d.dataset.origin }))
  const L = belt.getTotalLength()
  const place = (t) => {
    cards.forEach((c, i) => {
      const s = ((((t + i / cards.length) % 1) + 1) % 1) * L
      const p = belt.getPointAtLength(s)
      const q = belt.getPointAtLength((s + 1.5) % L)
      const a = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI
      c.setAttribute('transform', `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${a.toFixed(2)})`)
    })
  }
  place(0)
  const PERIOD = 16 // seconds per lap
  const speed = L / PERIOD
  const state = { t: 0 }
  const loops = [
    gsap.to(state, { t: 1, duration: PERIOD, ease: 'none', repeat: -1, paused: true, onUpdate: () => place(state.t) }),
    gsap.to(cleats, { strokeDashoffset: -700, duration: 700 / speed, ease: 'none', repeat: -1, paused: true }),
    ...drums.map((d) => gsap.to(d, { rotation: 360, duration: (2 * Math.PI * 40) / speed, ease: 'none', repeat: -1, paused: true })),
  ]
  return {
    enter() {},
    replay: () => {
      loops.forEach((t) => t.timeScale(3.2))
      gsap.to(loops, { timeScale: 1, duration: 2.4, ease: 'power2.out' })
    },
    setActive: (on) => loops.forEach((t) => (on ? t.play() : t.pause())),
    static() {},
  }
}

const RIGS = { lever: leverRig, balance: balanceRig, belt: beltRig }

/* ------------------------------------------------------------------ init */
export function init(root) {
  const el = root.querySelector('#machine')
  if (!el) return
  el.querySelectorAll('.machine__plate').forEach((plate) => {
    const svg = plate.querySelector('svg')
    const pen = preparePen(svg)
    const rig = RIGS[plate.dataset.fig](svg)

    if (prefersReducedMotion) {
      pen.finish()
      rig.static()
      return
    }

    // the pen: one continuous line, scrubbed by the reader. On desktop the copy
    // sits beside the plate, so the drawing must exist by the time it is read.
    const draw = gsap.timeline({ scrollTrigger: { trigger: plate, start: 'top 100%', end: isMobile ? 'top 60%' : 'top 70%', scrub: 0.5 } })
    pen.build(draw)

    // the action: once the plate has arrived
    ScrollTrigger.create({ trigger: plate, start: 'top 44%', onEnter: () => rig.enter() })

    // loops only run while the plate is on screen
    ScrollTrigger.create({ trigger: plate, start: 'top 100%', end: 'bottom 0%', onToggle: (self) => rig.setActive(self.isActive) })

    plate.addEventListener('click', () => rig.replay())
  })
}
