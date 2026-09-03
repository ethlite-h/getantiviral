// 06 — Edition: anatomy of an issue, and the last page.
import '../styles/edition.css'
import { ScrollTrigger, prefersReducedMotion } from '../lib/scroll.js'
import { logo } from '../data/logos.js'
import { WAVE_MARK } from '../data/brand.js'

const LEGEND = ["Editor's note", 'Why this is here', "What's set aside, and why", 'The last page']

const now = new Date()
const dateLong = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
const dateShort = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })

const runningHead = (n) => `
  <header class="edition__rh" aria-hidden="true"><span>${dateShort}</span><span>p. ${n}</span></header>`

const page = (n, inner, cls = '') => `
  <li class="edition__page" role="listitem">
    <span class="edition__num" aria-hidden="true">${n}</span>
    <article class="edition__sheet ${cls}" aria-label="Page ${n}, ${LEGEND[n - 1]}">${inner}</article>
  </li>`

const pageNote = page(1, `
  <header class="edition__masthead">
    <span class="edition__brand">${WAVE_MARK(16)}Antiviral</span>
    <p class="edition__date"><span>${dateLong}</span></p>
    <p class="edition__date edition__date--sub">6 pieces · 11 minutes</p>
  </header>
  <p class="edition__kicker">Editor's note</p>
  <p class="edition__note">Quieter day. Two of your channels went long on the same bridge collapse; I've put them side by side so you can read both. Nothing from the crypto shelf today. You asked.</p>
  <footer class="edition__sig">The editor · composed 6:40 a.m.</footer>`, 'edition__sheet--note')

const pageWhy = page(2, `
  ${runningHead(2)}
  <h3 class="edition__title">Why this is here</h3>
  <div class="edition__items">
    <div class="edition__item">
      <p class="edition__item-t">Why every bridge in Pittsburgh is yellow</p>
      <p class="edition__item-m">${logo('youtube', { size: 12 })}<span>YouTube · 14 min</span></p>
      <p class="edition__why">you finished the last three from this channel</p>
    </div>
    <div class="edition__item">
      <p class="edition__item-t">Kyoto ceramicist on the last kiln in the valley</p>
      <p class="edition__item-m">${logo('bluesky', { size: 12 })}<span>Bluesky</span></p>
      <p class="edition__why">two of your interests overlap here: pottery, Japan</p>
    </div>
  </div>`)

const pageAside = page(3, `
  ${runningHead(3)}
  <h3 class="edition__title">What's set aside, and why</h3>
  <div class="edition__items">
    <div class="edition__aside">
      <p class="edition__aside-t">Two more episodes of the same show</p>
      <p class="edition__aside-r">you asked for one a day from this one</p>
    </div>
    <div class="edition__aside">
      <p class="edition__aside-t">A reaction video to a piece you already read</p>
      <p class="edition__aside-r">your rule from Aug 14</p>
    </div>
    <div class="edition__aside">
      <p class="edition__aside-t">Live-blog of the same story</p>
      <p class="edition__aside-r">superseded by the write-up above</p>
    </div>
  </div>`)

const pageLast = page(4, `
  ${runningHead(4)}
  <div class="edition__last">
    <span class="edition__tomb" aria-hidden="true">∎</span>
    <p class="edition__last-l">That's today.<br>You're caught up.</p>
    <p class="edition__last-m">Tomorrow's is tomorrow.</p>
  </div>`, 'edition__sheet--last')

export const html = `
<section class="edition section" id="edition" data-page data-world-lock="paper" aria-labelledby="edition-h">
  <div class="container">
    <header class="edition__head">
      <p class="eyebrow" data-reveal>06 · Anatomy of an Edition</p>
      <h2 id="edition-h" class="edition__h2">
        <span class="edition__l" data-reveal="lines">It has a last page.</span>
        <span class="edition__l" data-reveal="lines" data-reveal-delay="0.12"><em class="i accent">On purpose.</em></span>
      </h2>
      <p class="lead measure edition__lead" data-reveal data-reveal-delay="0.2">An Edition is built the way a good issue is, plus one thing publications never print: what was left out.</p>
    </header>
  </div>

  <div class="edition__wide" role="region" aria-label="The four pages of an Edition">
    <ol class="edition__strip" role="list" data-lenis-prevent data-reveal-group>
      ${pageNote}
      ${pageWhy}
      ${pageAside}
      ${pageLast}
    </ol>
    <ol class="edition__legend" role="list" aria-hidden="true">
      ${LEGEND.map((t, i) => `<li><b>${i + 1}</b><span>${t}</span></li>`).join('')}
    </ol>
    <div class="edition__nav">
      <div class="edition__dots" role="group" aria-label="Go to page">
        ${LEGEND.map((t, i) => `<button type="button" class="edition__dot" aria-label="Page ${i + 1}: ${t}" aria-current="${i === 0 ? 'true' : 'false'}" data-i="${i}"><span>${i + 1}</span></button>`).join('')}
      </div>
      <p class="edition__nav-label" aria-live="polite">1 · ${LEGEND[0]}</p>
    </div>
  </div>

  <div class="container">
    <div class="edition__what">
      <!-- A · Dismissal: the wrong categories leave the page; one line stays -->
      <div class="edition__va">
        <p class="eyebrow">What this isn't</p>
        <ul class="edition__dismiss" role="list">
          <li class="edition__dismiss-line">Not a timer.</li>
          <li class="edition__dismiss-line">Not a blocker.</li>
          <li class="edition__dismiss-line">Not a filter.</li>
        </ul>
        <p class="edition__stays">A daily edition with a last page.</p>
        <div class="edition__va-body">
          <p class="edition__p">Timers, blockers, and filters all accept the same premise: the feed is bottomless, so the fix is to ration you. You're cast as the problem to be managed, and the feed stays exactly as it was, waiting. Antiviral doesn't ration anything. It replaces the feed with something that was never built to hold you. No streak. No counter. No badge for finishing. Nothing is measuring whether you did.</p>
          <blockquote class="edition__quote"><p>Nobody sets a timer on a magazine. It just ends.</p></blockquote>
          <p class="edition__ai">Yes, it is an AI. <em class="i">One that only works for you.</em></p>
        </div>
      </div>

    </div>
    <p class="edition__foot" data-reveal>Composed once a day on Apple's Private Cloud Compute, built so no one, including Apple and us, can see or keep what it processes.</p>
  </div>
</section>`

export function init(root) {
  const el = root.querySelector('#edition')
  if (!el) return

  // What this isn't: each wrong category is dismissed as it enters (slides off and fades), the true line stays.
  const dis = Array.from(el.querySelectorAll('.edition__dismiss-line'))
  const stays = el.querySelector('.edition__stays')
  if (prefersReducedMotion) {
    dis.forEach((li) => li.classList.add('is-gone'))
    stays.classList.add('is-in')
  } else {
    dis.forEach((li, i) => {
      ScrollTrigger.create({
        trigger: li, start: 'top 72%', once: true,
        onEnter: () => setTimeout(() => li.classList.add('is-gone'), 380 + i * 160),
      })
    })
    ScrollTrigger.create({ trigger: stays, start: 'top 80%', once: true, onEnter: () => setTimeout(() => stays.classList.add('is-in'), 900) })
  }

  // The strip: snap on phones, with numbered page marks.
  const strip = el.querySelector('.edition__strip')
  const pages = Array.from(strip.children)
  const dots = Array.from(el.querySelectorAll('.edition__dot'))
  const label = el.querySelector('.edition__nav-label')
  let active = 0
  const padLeft = () => parseFloat(getComputedStyle(strip).paddingLeft) || 0
  const setActive = (i) => {
    if (i === active) return
    active = i
    dots.forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'))
    label.textContent = `${i + 1} · ${LEGEND[i]}`
  }
  let raf = 0
  strip.addEventListener('scroll', () => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      const x = strip.scrollLeft + padLeft()
      let best = 0, bestD = Infinity
      pages.forEach((p, i) => { const d = Math.abs(p.offsetLeft - x); if (d < bestD) { bestD = d; best = i } })
      setActive(best)
    })
  }, { passive: true })
  dots.forEach((d) => {
    d.addEventListener('click', () => {
      const i = Number(d.dataset.i)
      strip.scrollTo({ left: pages[i].offsetLeft - padLeft(), behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    })
  })
}
