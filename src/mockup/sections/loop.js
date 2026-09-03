// 05 — Loop: the product on a real phone. Feed → Shortlist → Edition,
// each smaller than the last, driven by the reader's own scroll.
import '../styles/loop.css'
import { gsap, ScrollTrigger, prefersReducedMotion, scrollTo } from '../lib/scroll.js'
import { phoneFrame, appTopBar } from '../lib/phone.js'
import { logo, SOURCES, brandHex } from '../data/logos.js'
import { WAVE_MARK } from '../data/brand.js'

const today = new Date()
const DATE_LONG = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
const DAY_SHORT = today.toLocaleDateString('en-US', { weekday: 'short' })
const TYPED = 'less crypto, more long-form interviews'


// The Feed before the ask: six rows. One leaves (crypto), one rises (the
// long-form interview) and one enters from below once there is room.
const ROWS = [
  { id: 'bridges', title: 'Why every bridge in Pittsburgh is yellow', src: 'youtube', meta: 'YouTube · 14 min', why: 'you finished the last three from this channel' },
  { id: 'bakery', title: 'The quiet economics of a good bakery', src: 'substack', meta: 'Substack · 9 min', why: 'you read every issue of this one' },
  { id: 'halving', title: 'The halving, explained one more time', src: 'youtube', meta: 'YouTube · 22 min', why: 'new from a channel you follow', move: 'leaves' },
  { id: 'interview', title: 'Ep. 212: Craft, boredom, and the long apprenticeship', src: 'applepodcasts', meta: 'Podcasts · 1 h 12', why: 'long-form, the kind you finish', move: 'rises' },
  { id: 'atacama', title: 'Field notes from the Atacama, part 3', src: 'rss', meta: 'RSS · 7 min', why: 'parts one and two, both finished' },
  { id: 'pottery', title: 'r/pottery: glaze results from a wood kiln', src: 'reddit', meta: 'Reddit · thread', why: 'two of your interests overlap here' },
  { id: 'kyoto', title: 'Kyoto ceramicist on the last kiln in the valley', src: 'bluesky', meta: 'Bluesky · 6 min', why: 'two of your interests overlap here: pottery, Japan', move: 'enters' },
]

const CARDS = [
  { id: 'bridges', title: 'Why the bridges are yellow', src: 'youtube', meta: 'YouTube · 14 min' },
  { id: 'atacama', title: 'Atacama, part 3', src: 'rss', meta: 'RSS · 7 min' },
  { id: 'interview', title: 'The long apprenticeship', src: 'applepodcasts', meta: 'Podcasts · 1 h 12' },
  { id: 'bakery', title: 'How a bakery prices bread', src: 'substack', meta: 'Substack · 9 min' },
  { id: 'kyoto', title: 'The last kiln in the valley', src: 'bluesky', meta: 'Bluesky · 6 min' },
]

const ISSUE = ['Ep. 212: Craft, boredom, and the long apprenticeship', 'Why every bridge in Pittsburgh is yellow', 'The quiet economics of a good bakery', 'Field notes from the Atacama, part 3', 'r/pottery: glaze results from a wood kiln', 'Kyoto ceramicist on the last kiln in the valley']

const row = (r) => `
  <div class="app-row loop__row" data-move="${r.move || ''}" data-thumb="${r.id}">
    <div class="app-row__thumb"></div>
    <div>
      <div class="app-row__title">${r.title}</div>
      <div class="app-row__meta">${logo(r.src, { size: 12 })}<span>${r.meta}</span></div>
      <div class="app-row__why">${r.why}</div>
    </div>
  </div>`

const card = (c) => `
  <div class="loop__card" data-thumb="${c.id}">
    <div class="loop__card-thumb"></div>
    <div class="loop__card-body">
      <div class="loop__card-title">${c.title}</div>
      <div class="loop__card-meta">${logo(c.src, { size: 11 })}<span>${c.meta}</span></div>
    </div>
  </div>`

const typed = TYPED.split(' ').map((w) => `<span class="loop__w">${w.split('').map((ch) => `<span class="loop__ch">${ch}</span>`).join('')}</span>`).join(' ')

const feedScreen = `
  <div class="loop__screen loop__screen--feed">
    ${appTopBar('Feed', `${DAY_SHORT} · 14 sources`)}
    <div class="loop__rows">${ROWS.map(row).join('')}</div>
    <div class="app-convo loop__convo">
      <span class="app-convo__text loop__convo-text">
        <span class="loop__ph">Tell your feed what you want</span>
        <span class="loop__typed">${typed}</span><span class="loop__caret-wrap"><span class="loop__caret"></span></span>
      </span>
      <span class="app-convo__send">↑</span>
    </div>
  </div>`

const shortlistScreen = `
  <div class="loop__screen loop__screen--shortlist">
    <div class="app-topbar">
      <span class="app-topbar__title">Shortlist</span>
      <span class="app-topbar__right loop__count"><span class="loop__count-col"><i>5 cards</i><i>4 cards</i><i>3 cards</i><i>2 cards</i><i>1 card</i><i>0 cards</i></span></span>
    </div>
    <div class="loop__hand">
      ${CARDS.map(card).join('')}
      <div class="loop__period"><span>That's the hand.</span></div>
    </div>
  </div>`

const editionScreen = `
  <div class="loop__screen loop__screen--edition">
    <div class="loop__cover">
      <div class="loop__cover-mast">${WAVE_MARK(28)}<span>Antiviral</span></div>
      <div class="loop__cover-rule"></div>
      <div class="loop__cover-date">${DATE_LONG}</div>
      <div class="loop__cover-count">Today's edition · <span>6 pieces · 11 minutes</span></div>
      <div class="loop__cover-note">
        <span class="loop__cover-label">Editor's note</span>
        <p>Quieter day. Two of your channels went long on the same bridge collapse; I've put them side by side so you can read both.</p>
      </div>
      <div class="loop__cover-toc">
        <span class="loop__cover-label">In this issue</span>
        <ol>${ISSUE.map((t) => `<li><span>${t}</span></li>`).join('')}</ol>
      </div>
      <div class="loop__cover-foot"><span class="loop__cover-end">∎</span><span><span>Sunday Edition free forever</span> · <span>Daily for subscribers</span></span></div>
    </div>
  </div>`

const BEATS = [
  { tab: '1 · Feed', label: 'Go to the Feed', text: 'The Feed is honest curation of everything you follow: YouTube, podcasts, Substack, blogs, subreddits, Bluesky. Ranked by what you care about, not by what keeps you. Talk to it in plain language and it rebuilds.' },
  { tab: '2 · Shortlist', label: 'Go to the Shortlist', text: 'The Shortlist is a finite hand of cards for the moments you want a little more. A hand, not a deck. When it\'s empty, it\'s empty.' },
  { tab: '3 · Edition', label: 'Go to the Edition', text: 'The Edition is the centerpiece. Once a day, one issue composed from your sources, with a real last page.' },
]

const beat = (b, i) => `
  <div class="loop__beat${i === 0 ? ' is-active' : ''}">
    <button class="loop__beat-tab" type="button" aria-label="${b.label}"><span>${b.tab}</span></button>
    <p class="loop__beat-text">${b.text}</p>
  </div>`

const chip = (s) => `
  <div class="loop__chip" style="--brand:${brandHex(s.key)}">
    <span class="loop__chip-mark" aria-hidden="true">${logo(s.key, { size: 22 })}</span>
    <span class="loop__chip-label">${s.label}</span>
    <span class="loop__chip-note">${s.note}</span>
  </div>`

export const html = `
<section class="loop section" id="loop" data-page data-world-lock="paper" aria-labelledby="loop-h">
  <div class="container loop__head">
    <p class="eyebrow" data-reveal>05 · How a day goes</p>
    <h2 id="loop-h" data-reveal="lines">Feed, Shortlist, Edition. <em class="i accent">Each one is smaller than the last, on purpose.</em></h2>
    <p class="lead muted measure loop__lead" data-reveal>Bring what you already follow. The whole product is a funnel that narrows toward a last page.</p>
  </div>

  <div class="loop__stage">
    <div class="loop__sticky">
      <div class="container loop__grid">
        <div class="loop__beats">${BEATS.map(beat).join('')}</div>
        <div class="loop__phone-wrap">
          ${phoneFrame(feedScreen + shortlistScreen + editionScreen, { cls: 'loop__phone', label: 'Antiviral on iPhone: the Feed, then the Shortlist, then the cover of today\'s Edition', theme: 'dark' })}
        </div>
      </div>
    </div>
  </div>

  <div class="container loop__sources">
    <hr class="rule">
    <p class="loop__sources-label mono muted">Sources</p>
    <div class="loop__chips" data-reveal-group>${SOURCES.map(chip).join('')}</div>
    <div class="loop__notes" data-reveal>
      <p class="muted">Not TikTok. Not Instagram. They don't publish open feeds, so nobody can be your editor there.</p>
      <p class="muted">Videos play in YouTube's own player, logged out, ads and all. Creators are paid exactly as always.</p>
      <p class="loop__import">Import your YouTube subscriptions (read-only, one-way) or start from a blank slate.</p>
    </div>
  </div>
</section>`

export function init(root) {
  const el = root.querySelector('#loop')
  if (!el) return
  const stage = el.querySelector('.loop__stage')
  const phone = el.querySelector('.loop__phone')
  const beats = Array.from(el.querySelectorAll('.loop__beat'))
  const tabs = beats.map((b) => b.querySelector('.loop__beat-tab'))
  const feed = el.querySelector('.loop__screen--feed')
  const shortlist = el.querySelector('.loop__screen--shortlist')
  const edition = el.querySelector('.loop__screen--edition')
  const rowsEl = feed.querySelector('.loop__rows')
  const rows = Array.from(rowsEl.children)
  const leaving = rows.find((r) => r.dataset.move === 'leaves')
  const rising = rows.find((r) => r.dataset.move === 'rises')
  const entering = rows.find((r) => r.dataset.move === 'enters')
  const ph = feed.querySelector('.loop__ph')
  const chars = Array.from(feed.querySelectorAll('.loop__ch'))
  const caret = feed.querySelector('.loop__caret-wrap')
  const send = feed.querySelector('.app-convo__send')
  const cards = Array.from(shortlist.querySelectorAll('.loop__card'))
  const countCol = shortlist.querySelector('.loop__count-col')
  const period = shortlist.querySelector('.loop__period')
  const coverKids = Array.from(edition.querySelectorAll('.loop__cover > *'))
  const animated = [feed, shortlist, edition, ...rows, ph, ...chars, caret, send, ...cards, countCol, period, ...coverKids]

  // Beat boundaries along the scrub (0–1) and where the phone turns to paper.
  const BEAT_AT = [0.41, 0.78]
  const THEME_AT = 0.77
  const BEAT_P = [0.36, 0.47, 1]
  const state = { p: 0, beat: -1, theme: '' }
  let tl = null

  // One timeline, 100 units long, built once; scroll only sets its progress.
  function build() {
    const pw = phone.offsetWidth || 300
    tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } })

    // 1 · Feed: the ask is typed into the bar
    gsap.set(chars, { display: 'none' })
    gsap.set(caret, { opacity: 0 })
    tl.to(ph, { opacity: 0, duration: 1.2 }, 7.5)
    tl.to(caret, { opacity: 1, duration: 0.6 }, 7.8)
    chars.forEach((c, i) => tl.set(c, { display: 'inline' }, 9 + (i / chars.length) * 11))
    tl.to(caret, { opacity: 0, duration: 0.4 }, 21.4)
    tl.to(send, { scale: 0.78, duration: 0.5, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 21)

    // The re-rank, FLIP style: measure, reorder the DOM once, animate from the old positions.
    const before = rows.map((r) => r.offsetTop)
    const leaveTop = before[rows.indexOf(leaving)]
    rowsEl.insertBefore(rising, rowsEl.firstChild)
    Object.assign(leaving.style, { position: 'absolute', top: leaveTop + 'px', left: '0', right: '0' })
    const after = rows.map((r) => r.offsetTop)
    rows.forEach((r, i) => {
      if (r === leaving) return
      const d = before[i] - after[i]
      if (r === entering) {
        gsap.set(r, { y: d + pw * 0.06, opacity: 0 })
        tl.to(r, { y: 0, opacity: 1, duration: 5, ease: 'power3.out' }, 28)
        return
      }
      if (!d) return
      gsap.set(r, { y: d })
      tl.to(r, { y: 0, duration: 7, ease: 'power3.inOut' }, r === rising ? 24 : 25)
    })
    tl.to(leaving, { x: -pw * 1.05, opacity: 0, duration: 5, ease: 'power2.in' }, 22)

    // Feed → Shortlist: an app push
    gsap.set(shortlist, { xPercent: 100 })
    tl.to(feed, { xPercent: -28, opacity: 0, duration: 6, ease: 'power2.inOut' }, 38)
    tl.to(shortlist, { xPercent: 0, duration: 6, ease: 'power2.inOut' }, 38)

    // 2 · Shortlist: five cards fanned, dealt away from the top of the hand
    const n0 = cards.length
    const fan = (n, i) => (n === 1 ? 0 : -9 + (18 * i) / (n - 1))
    gsap.set(cards, { transformOrigin: '50% 150%', rotation: (i) => fan(n0, i), x: 0, y: 0, opacity: 1 })
    const STEP = 3.2
    const T0 = 50
    for (let k = 0; k < n0; k++) {
      const n = n0 - k
      const top = cards[n - 1]
      const t = T0 + k * STEP
      tl.to(top, { x: pw * 0.55, y: -pw * 0.42, rotation: fan(n, n - 1) + 28, opacity: 0, duration: 2.6, ease: 'power2.in' }, t)
      for (let i = 0; i < n - 1; i++) tl.to(cards[i], { rotation: fan(n - 1, i), duration: 2.4, ease: 'power2.out' }, t + 0.8)
    }
    gsap.set(countCol, { yPercent: 0 })
    tl.to(countCol, { yPercent: -(100 * n0) / (n0 + 1), duration: STEP * n0, ease: `steps(${n0})` }, T0 + 1.3 - STEP)
    gsap.set(period, { opacity: 0, scale: 0.6 })
    tl.to(period, { opacity: 1, scale: 1, duration: 4, ease: 'back.out(1.7)' }, 66)

    // Shortlist → Edition: paper comes down over the screen
    gsap.set(edition, { clipPath: 'inset(0 0 100% 0)' })
    tl.to(edition, { clipPath: 'inset(0 0 0% 0)', duration: 6, ease: 'power2.inOut' }, 76)
    tl.to(shortlist, { opacity: 0, duration: 3 }, 79)

    // 3 · Edition: the cover sets itself, line by line
    gsap.set(coverKids, { y: pw * 0.03, opacity: 0 })
    tl.to(coverKids, { y: 0, opacity: 1, duration: 4, stagger: 1.1, ease: 'power2.out' }, 80)
    tl.to({}, { duration: 1 }, 99)
  }

  function restore() {
    if (tl) tl.kill()
    tl = null
    gsap.set(animated, { clearProps: 'transform,opacity,display,clipPath' })
    rows.forEach((r) => rowsEl.appendChild(r))
    leaving.style.cssText = ''
  }

  function apply(p) {
    state.p = p
    if (tl) tl.progress(p)
    const b = p < BEAT_AT[0] ? 0 : p < BEAT_AT[1] ? 1 : 2
    if (b !== state.beat) {
      state.beat = b
      beats.forEach((el2, i) => el2.classList.toggle('is-active', i === b))
      el.dataset.beat = String(b)
    }
    const theme = p >= THEME_AT ? 'paper' : 'dark'
    if (theme !== state.theme) { state.theme = theme; phone.dataset.theme = theme }
    // The Shortlist's shadow only once it is pushed on (timeline position 38); parked, it would bleed onto the Feed.
    shortlist.classList.toggle('is-on', p >= 0.38)
  }

  build()

  if (prefersReducedMotion) {
    // No pin, no scrub: the Edition cover is the resting state; the running heads switch the screen.
    apply(1)
    tabs.forEach((t, i) => t.addEventListener('click', () => apply(BEAT_P[i])))
    return
  }

  const st = ScrollTrigger.create({
    trigger: stage, start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: (self) => apply(self.progress),
  })
  apply(0)

  tabs.forEach((t, i) => t.addEventListener('click', () => {
    const y = st.start + (st.end - st.start) * BEAT_P[i]
    scrollTo(y, { duration: 1.2 })
  }))

  // Row heights change with fonts and phone width, so the FLIP is re-measured then.
  const rebuild = () => { restore(); build(); apply(state.p) }
  let lastW = phone.offsetWidth
  ScrollTrigger.addEventListener('refreshInit', () => {
    const w = phone.offsetWidth
    if (Math.abs(w - lastW) > 1) { lastW = w; rebuild() }
  })
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(rebuild)
}
