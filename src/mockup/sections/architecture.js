// 10 — Architecture: privacy by floor plan.
// An architect's sheet: rooms drawn to scale, arrows that draw on scroll,
// and a key beneath that opens a plain-language note per room.
import '../styles/architecture.css'
import { gsap, ScrollTrigger, prefersReducedMotion, isMobile, scrollTo } from '../lib/scroll.js'

const ROOMS = [
  {
    key: '1', n: '01', title: 'Your iPhone or Mac', sub: 'ranking · rules · interest graph · saves · history',
    note: "Everything that learns you lives in this room: ranking, your rules, the interest graph, your saves and history. It runs on Apple Foundation Models and Apple's on-device text embeddings, and it never has to leave the room to do its job.",
  },
  {
    key: '2', n: '02', title: 'Your iCloud', sub: 'sync · yours, not ours',
    note: "A hallway between your own devices, and nobody else's. Your graph, sources, and preferences sync through your own private iCloud. With Advanced Data Protection on, that sync is end-to-end encrypted. We are not in the hallway.",
  },
  {
    key: '3', n: '03', title: 'Apple Private Cloud Compute', sub: 'one Edition a day · composed, not kept',
    note: "The one room that isn't yours, and it isn't ours either. Once a day your Edition is composed here, on Apple's privacy-hardened cloud, built so no one, including Apple and us, can see or keep what it processes. The door opens one way. Nothing stays behind.",
  },
  {
    key: '4', n: '04', title: 'Studio Ikigai servers', sub: 'none',
    note: "An empty lot. No Studio Ikigai account, no tracking, no analytics, no ads, so there is nothing of yours for us to store. A server that doesn't exist has nothing to leak.",
  },
  {
    key: '5', n: '→', title: 'Out the door', sub: 'content fetches · Brave Search queries · one Edition call a day',
    note: "Three things leave the building: content fetches for what you asked for, Brave Search queries with no user identifier, and one Edition call a day. We won't tell you nothing ever leaves your phone, because these do, and you'd catch it.",
  },
]

const PLAN = `
<svg class="architecture__plan architecture__plan--d" viewBox="0 0 800 520" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="architecture-grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M20 0H0V20" fill="none" stroke="currentColor" stroke-opacity="0.07" stroke-width="0.6"/>
    </pattern>
    <pattern id="architecture-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="9" stroke="currentColor" stroke-opacity="0.16" stroke-width="0.8"/>
    </pattern>
  </defs>

  <!-- sheet -->
  <rect x="12" y="12" width="776" height="496" fill="url(#architecture-grid)"/>
  <rect class="architecture__border" x="12" y="12" width="776" height="496"/>

  <!-- your lot, the curb, the street -->
  <rect class="architecture__lotline architecture__fade" x="28" y="32" width="384" height="340"/>
  <text class="architecture__tiny architecture__fade" x="30" y="27">property line · yours</text>
  <line class="architecture__curb architecture__fade" x1="12" y1="404" x2="788" y2="404"/>
  <text class="architecture__tiny architecture__fade" x="772" y="500" text-anchor="end">street</text>
  <g class="architecture__north architecture__fade">
    <line x1="744" y1="76" x2="744" y2="50"/>
    <path d="M738 56 L744 50 L750 56"/>
    <text x="744" y="91" text-anchor="middle">N</text>
  </g>

  <!-- Room 1 · your iPhone or Mac -->
  <g class="architecture__room" data-room="1">
    <rect class="architecture__floor" x="40" y="96" width="360" height="264"/>
    <path class="architecture__wall architecture__draw" d="M40 96 V360 H76 M104 360 H316 M344 360 H400 V132 M400 104 V96"/>
    <text class="architecture__num" x="52" y="118">01</text>
    <text class="architecture__name" x="220" y="228" text-anchor="middle">Your iPhone or Mac</text>
    <text class="architecture__detail" x="220" y="250" text-anchor="middle">ranking · rules · interest graph · saves · history</text>
    <text class="architecture__detail" x="220" y="266" text-anchor="middle">Apple Foundation Models · on-device embeddings</text>
    <g class="architecture__glyph">
      <rect x="104" y="140" width="16" height="30" rx="3"/>
      <path d="M109 144 H115"/>
      <rect x="336" y="142" width="34" height="22" rx="2"/>
      <path d="M330 166 H376"/>
    </g>
    <circle class="architecture__here-dot" cx="58" cy="344" r="3"/>
    <text class="architecture__tiny architecture__here" x="68" y="348">you are here</text>
  </g>

  <!-- Room 2 · your iCloud, a hallway between your own devices -->
  <g class="architecture__room" data-room="2">
    <rect class="architecture__hit" x="40" y="14" width="360" height="90"/>
    <rect class="architecture__floor" x="40" y="44" width="360" height="52"/>
    <path class="architecture__wall architecture__draw" d="M40 96 V44 H400 V96 M40 96 H100 M128 96 H356 M384 96 H400"/>
    <path class="architecture__door architecture__draw" d="M100 96 V124 A28 28 0 0 0 128 96"/>
    <path class="architecture__door architecture__draw" d="M384 96 V124 A28 28 0 0 1 356 96"/>
    <text class="architecture__num" x="52" y="76">02</text>
    <text class="architecture__name" x="100" y="76">Your iCloud</text>
    <text class="architecture__detail" x="388" y="76" text-anchor="end">sync · yours, not ours</text>
  </g>

  <!-- Room 3 · Apple Private Cloud Compute, a one-way door -->
  <g class="architecture__room" data-room="3">
    <rect class="architecture__floor" x="540" y="96" width="220" height="124"/>
    <path class="architecture__wall architecture__draw" d="M540 104 V96 H760 V220 H540 V132"/>
    <path class="architecture__door architecture__draw" d="M540 132 H568 A28 28 0 0 0 540 104"/>
    <text class="architecture__num" x="582" y="118">03</text>
    <text class="architecture__name" x="650" y="148" text-anchor="middle">Apple Private</text>
    <text class="architecture__name" x="650" y="165" text-anchor="middle">Cloud Compute</text>
    <text class="architecture__detail" x="650" y="188" text-anchor="middle">one Edition a day</text>
    <text class="architecture__detail" x="650" y="203" text-anchor="middle">composed, not kept</text>
  </g>

  <!-- Lot 4 · Studio Ikigai servers: an empty lot -->
  <g class="architecture__room architecture__lot" data-room="4">
    <rect class="architecture__floor" x="540" y="252" width="220" height="144"/>
    <rect class="architecture__fade" x="540" y="252" width="220" height="144" fill="url(#architecture-hatch)"/>
    <rect class="architecture__lotedge architecture__fade" x="540" y="252" width="220" height="144"/>
    <text class="architecture__num" x="552" y="274">04</text>
    <text class="architecture__name" x="650" y="306" text-anchor="middle">Studio Ikigai servers</text>
    <text class="architecture__detail" x="650" y="324" text-anchor="middle">none</text>
    <g class="architecture__sign architecture__sign--d">
      <line x1="650" y1="364" x2="650" y2="388"/>
      <g class="architecture__sign-board">
        <rect x="613" y="347" width="74" height="17" rx="1.5"/>
        <text x="650" y="359" text-anchor="middle">FOR LEASE</text>
      </g>
    </g>
  </g>

  <!-- Out the door: the three arrows -->
  <g class="architecture__room architecture__exits" data-room="5">
    <rect class="architecture__hit architecture__floor" x="12" y="405" width="776" height="103"/>
    <rect class="architecture__hit" x="402" y="50" width="136" height="100"/>
    <g class="architecture__arrow" data-arrow="1">
      <path class="architecture__shaft" d="M400 118 H556"/>
      <path class="architecture__head" d="M549 111 L556 118 L549 125"/>
      <text class="architecture__lbl" x="470" y="97" text-anchor="middle">one Edition</text>
      <text class="architecture__lbl" x="470" y="110" text-anchor="middle">call a day</text>
    </g>
    <g class="architecture__arrow" data-arrow="2">
      <path class="architecture__shaft" d="M90 360 V440"/>
      <path class="architecture__head" d="M83 433 L90 440 L97 433"/>
      <text class="architecture__lbl" x="100" y="425">content fetches</text>
      <text class="architecture__lbl" x="100" y="439">for what you asked for</text>
    </g>
    <g class="architecture__arrow" data-arrow="3">
      <path class="architecture__shaft" d="M330 360 V440"/>
      <path class="architecture__head" d="M323 433 L330 440 L337 433"/>
      <text class="architecture__lbl" x="340" y="425">Brave Search queries,</text>
      <text class="architecture__lbl" x="340" y="439">no user identifier</text>
    </g>
  </g>
</svg>`
const PLAN_M = `
<svg class="architecture__plan architecture__plan--m" viewBox="0 0 400 470" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="architecture-grid-m" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M20 0H0V20" fill="none" stroke="currentColor" stroke-opacity="0.07" stroke-width="0.6"/>
    </pattern>
    <pattern id="architecture-hatch-m" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="9" stroke="currentColor" stroke-opacity="0.16" stroke-width="0.8"/>
    </pattern>
  </defs>

  <!-- sheet -->
  <rect x="8" y="8" width="384" height="454" fill="url(#architecture-grid-m)"/>
  <rect class="architecture__border" x="8" y="8" width="384" height="454"/>

  <!-- your lot, the curb, the street -->
  <rect class="architecture__lotline architecture__fade" x="14" y="34" width="196" height="292"/>
  <text class="architecture__tiny architecture__fade" x="16" y="28">property line · yours</text>
  <line class="architecture__curb architecture__fade" x1="8" y1="346" x2="392" y2="346"/>
  <text class="architecture__tiny architecture__fade" x="384" y="452" text-anchor="end">street</text>
  <g class="architecture__north architecture__fade">
    <line x1="372" y1="52" x2="372" y2="30"/>
    <path d="M366 36 L372 30 L378 36"/>
    <text x="372" y="66" text-anchor="middle">N</text>
  </g>

  <!-- Room 2 · your iCloud, a hallway between your own devices -->
  <g class="architecture__room" data-room="2">
    <rect class="architecture__hit" x="14" y="34" width="196" height="70"/>
    <rect class="architecture__floor" x="24" y="46" width="176" height="36"/>
    <path class="architecture__wall architecture__draw" d="M24 82 V46 H200 V82 H148 M128 82 H68 M48 82 H24"/>
    <path class="architecture__door architecture__draw" d="M48 82 V104 M68 82 V104 M128 82 V104 M148 82 V104"/>
    <text class="architecture__num" x="34" y="68">02</text>
    <text class="architecture__name" x="58" y="68">Your iCloud</text>
  </g>

  <!-- Room 1 · your iPhone or Mac -->
  <g class="architecture__room" data-room="1">
    <rect class="architecture__floor" x="24" y="104" width="176" height="200"/>
    <path class="architecture__wall architecture__draw" d="M24 104 V304 H40 M60 304 H172 M192 304 H200 V141 M200 121 V104 H148 M128 104 H68 M48 104 H24"/>
    <path class="architecture__door architecture__draw" d="M48 104 V124 A20 20 0 0 0 68 104"/>
    <path class="architecture__door architecture__draw" d="M148 104 V124 A20 20 0 0 1 128 104"/>
    <text class="architecture__num" x="34" y="150">01</text>
    <text class="architecture__name" x="112" y="200" text-anchor="middle">Your iPhone or Mac</text>
    <text class="architecture__detail" x="112" y="224" text-anchor="middle">ranking · rules</text>
    <text class="architecture__detail" x="112" y="242" text-anchor="middle">interest graph</text>
    <text class="architecture__detail" x="112" y="260" text-anchor="middle">saves · history</text>
    <circle class="architecture__here-dot" cx="36" cy="288" r="3"/>
    <text class="architecture__tiny architecture__here" x="46" y="292">you are here</text>
  </g>

  <!-- Room 3 · Apple Private Cloud Compute, a one-way door -->
  <g class="architecture__room" data-room="3">
    <rect class="architecture__floor" x="256" y="112" width="132" height="100"/>
    <path class="architecture__wall architecture__draw" d="M256 118 V112 H388 V212 H256 V144"/>
    <path class="architecture__door architecture__draw" d="M256 144 H282 A26 26 0 0 0 256 118"/>
    <text class="architecture__num" x="294" y="132">03</text>
    <text class="architecture__name" x="322" y="170" text-anchor="middle">Apple Private</text>
    <text class="architecture__name" x="322" y="188" text-anchor="middle">Cloud Compute</text>
  </g>

  <!-- Lot 4 · Studio Ikigai servers: an empty lot -->
  <g class="architecture__room architecture__lot" data-room="4">
    <rect class="architecture__floor" x="256" y="234" width="132" height="92"/>
    <rect class="architecture__fade" x="256" y="234" width="132" height="92" fill="url(#architecture-hatch-m)"/>
    <rect class="architecture__lotedge architecture__fade" x="256" y="234" width="132" height="92"/>
    <text class="architecture__num" x="266" y="254">04</text>
    <text class="architecture__name" x="322" y="272" text-anchor="middle">Studio Ikigai</text>
    <text class="architecture__name" x="322" y="288" text-anchor="middle">servers</text>
    <g class="architecture__sign architecture__sign--m">
      <line x1="322" y1="312" x2="322" y2="326"/>
      <g class="architecture__sign-board">
        <rect x="280" y="294" width="84" height="18" rx="1.5"/>
        <text x="322" y="307" text-anchor="middle">FOR LEASE</text>
      </g>
    </g>
  </g>

  <!-- Out the door: the three arrows -->
  <g class="architecture__room architecture__exits" data-room="5">
    <rect class="architecture__hit architecture__floor" x="8" y="347" width="384" height="115"/>
    <rect class="architecture__hit" x="210" y="70" width="46" height="90"/>
    <g class="architecture__arrow" data-arrow="1">
      <path class="architecture__shaft" d="M200 131 H256"/>
      <path class="architecture__head" d="M249 124 L256 131 L249 138"/>
      <text class="architecture__lbl" x="222" y="88">one Edition</text>
      <text class="architecture__lbl" x="222" y="104">call a day</text>
    </g>
    <g class="architecture__arrow" data-arrow="2">
      <path class="architecture__shaft" d="M50 304 V380"/>
      <path class="architecture__head" d="M43 373 L50 380 L57 373"/>
      <text class="architecture__lbl" x="60" y="398">content fetches</text>
      <text class="architecture__lbl" x="60" y="414">for what you</text>
      <text class="architecture__lbl" x="60" y="430">asked for</text>
    </g>
    <g class="architecture__arrow" data-arrow="3">
      <path class="architecture__shaft" d="M182 304 V380"/>
      <path class="architecture__head" d="M175 373 L182 380 L189 373"/>
      <text class="architecture__lbl" x="192" y="398">Brave Search</text>
      <text class="architecture__lbl" x="192" y="414">queries, no</text>
      <text class="architecture__lbl" x="192" y="430">user identifier</text>
    </g>
  </g>
</svg>`

const keyHTML = ROOMS.map((r) => `
      <div class="architecture__item" data-room="${r.key}">
        <h3 class="architecture__item-h">
          <button type="button" class="architecture__toggle" id="architecture-toggle-${r.key}" aria-expanded="false" aria-controls="architecture-note-${r.key}">
            <span class="architecture__n" aria-hidden="true">${r.n}</span>
            <span class="architecture__title">${r.title}</span>
            <span class="architecture__plus" aria-hidden="true"></span>
            <span class="architecture__sub">${r.sub}</span>
          </button>
        </h3>
        <div class="architecture__note" id="architecture-note-${r.key}" role="region" aria-labelledby="architecture-toggle-${r.key}" aria-hidden="true">
          <div><p>${r.note}</p></div>
        </div>
      </div>`).join('')

export const html = `
<section class="architecture section" id="architecture" data-page data-world-lock="paper" aria-labelledby="architecture-h">
  <div class="container">
    <header class="architecture__head">
      <p class="eyebrow architecture__eyebrow" data-reveal>10 · Privacy by floor plan</p>
      <h2 id="architecture-h" class="architecture__h" data-reveal="lines">We run no server that stores you.<br><em class="i accent">Not a policy. <span class="architecture__nowrap">A floor plan.</span></em></h2>
      <p class="lead architecture__lead" data-reveal data-reveal-delay="0.15">The intelligence runs on your phone. Once a day the Edition is composed on Apple's Private Cloud Compute. Sync is your own iCloud. That's the whole map.</p>
    </header>

    <figure class="architecture__sheet" data-reveal>
      <div class="architecture__paper">${PLAN}${PLAN_M}</div>
      <figcaption class="architecture__titleblock">
        <span class="architecture__tb-grow hide-mobile">Antiviral · privacy by floor plan</span>
        <span>Sheet 10</span>
        <span>Drawn to scale</span>
        <span class="visually-hidden">Floor plan. A large room, your iPhone or Mac, holds ranking, rules, the interest graph, saves and history on Apple Foundation Models and on-device embeddings. A hallway, your iCloud, connects your own devices. A small room, Apple Private Cloud Compute, has a one-way door and composes one Edition a day without keeping it. An empty lot marked for lease is where Studio Ikigai servers would be. Three arrows leave through the door: content fetches for what you asked for, Brave Search queries with no user identifier, and one Edition call a day.</span>
      </figcaption>
    </figure>

    <div class="architecture__grid">
      <div class="architecture__key">
        <p class="architecture__key-h"><span>Key</span><span class="faint hide-desktop">tap a room</span><span class="faint hide-mobile">click a room</span></p>
        <div class="architecture__items" data-reveal-group>${keyHTML}
        </div>
      </div>

      <div class="architecture__body">
        <p class="measure" data-reveal>On your device: ranking, rules, the interest graph, your saves and history, on Apple Foundation Models and Apple's on-device text embeddings. Once a day, your Edition is composed on Apple's Private Cloud Compute, Apple's privacy-hardened cloud, not a server we run, built so no one, including Apple and us, can see or keep what it processes. Your graph, sources, and preferences sync through your own private iCloud; with Advanced Data Protection on, that sync is end-to-end encrypted.</p>
        <p class="measure" data-reveal>No Studio Ikigai account. No tracking. No analytics. No ads. We won't tell you nothing ever leaves your phone, because provider fetches and one Edition a day do, and you'd catch it.</p>
        <ul class="architecture__req" aria-label="Requirements" data-reveal>
          <li>Requires Apple Intelligence</li>
          <li>iOS 27 / macOS 27</li>
          <li>iPhone 15 Pro or newer</li>
          <li>Apple-silicon Mac</li>
        </ul>
        <p class="architecture__close" data-reveal>We'd rather require a better phone than run a server that <em class="i">stores you</em>.</p>
      </div>
    </div>
  </div>
</section>`

export function init(root) {
  const el = root.querySelector('#architecture')
  if (!el) return
  const sheet = el.querySelector('.architecture__sheet')
  // two drawings of the same building: a wide sheet for desktop, a taller one for phones
  const svg = el.querySelector(isMobile ? '.architecture__plan--m' : '.architecture__plan--d')
  const rooms = Array.from(el.querySelectorAll('.architecture__room'))
  const items = Array.from(el.querySelectorAll('.architecture__item'))

  // ---- the key: one note open at a time; rooms and rows drive the same state
  let openKey = null
  function setOpen(key) {
    openKey = openKey === key ? null : key
    items.forEach((it) => {
      const on = it.dataset.room === openKey
      it.classList.toggle('is-open', on)
      it.querySelector('.architecture__toggle').setAttribute('aria-expanded', String(on))
      it.querySelector('.architecture__note').setAttribute('aria-hidden', String(!on))
    })
    rooms.forEach((r) => r.classList.toggle('is-open', r.dataset.room === openKey))
  }
  items.forEach((it) => {
    it.querySelector('.architecture__toggle').addEventListener('click', () => setOpen(it.dataset.room))
  })
  rooms.forEach((r) => {
    r.addEventListener('click', () => {
      const key = r.dataset.room
      setOpen(key)
      if (openKey !== key) return
      // if the row is below the fold, bring it up so the note is readable
      const item = items.find((it) => it.dataset.room === key)
      const rect = item.getBoundingClientRect()
      if (rect.top > window.innerHeight - 120) scrollTo(item, { offset: -96, duration: 1.1 })
    })
  })

  if (prefersReducedMotion) return

  // ---- the walls draw themselves in once, when the sheet arrives
  const draws = Array.from(svg.querySelectorAll('.architecture__draw'))
  const fades = Array.from(svg.querySelectorAll(
    '.architecture__fade, .architecture__num, .architecture__name, .architecture__detail, .architecture__tiny, .architecture__glyph, .architecture__sign, .architecture__here-dot',
  ))
  const lengths = draws.map((p) => {
    const L = p.getTotalLength()
    p.style.strokeDasharray = `${L} ${L}`
    p.style.strokeDashoffset = `${L}`
    return L
  })
  gsap.set(fades, { opacity: 0 })
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } })
  draws.forEach((p, i) => {
    tl.to(p, { strokeDashoffset: 0, duration: 0.5 + Math.min(lengths[i], 1200) / 1500 }, i * 0.16)
  })
  tl.to(fades, { opacity: 1, duration: 0.7, stagger: 0.025, ease: 'power2.out' }, '-=0.5')
  ScrollTrigger.create({ trigger: sheet, start: 'top 80%', once: true, onEnter: () => tl.play() })

  // ---- the arrows draw with the scroll: the Edition call first, then the two that cross the street
  const arrows = Array.from(svg.querySelectorAll('.architecture__arrow')).map((g) => {
    const shaft = g.querySelector('.architecture__shaft')
    const L = shaft.getTotalLength()
    shaft.style.strokeDasharray = `${L} ${L}`
    shaft.style.strokeDashoffset = `${L}`
    const tips = Array.from(g.querySelectorAll('.architecture__head, .architecture__lbl'))
    tips.forEach((t) => { t.style.opacity = '0' })
    return { shaft, L, tips }
  })
  const windows = [[0.02, 0.42], [0.3, 0.72], [0.55, 0.98]]
  const clamp01 = (v) => Math.min(1, Math.max(0, v))
  ScrollTrigger.create({
    trigger: sheet, start: 'top 72%', end: 'bottom 72%', scrub: 0.5,
    onUpdate: (self) => {
      const t = self.progress
      arrows.forEach((a, i) => {
        const [s, e] = windows[i]
        const p = clamp01((t - s) / (e - s))
        a.shaft.style.strokeDashoffset = `${a.L * (1 - p)}`
        const o = clamp01((p - 0.78) / 0.22)
        a.tips.forEach((n) => { n.style.opacity = String(o) })
      })
    },
  })
}
