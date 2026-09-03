// 08 — Missing: the contact sheet of everything you follow.
// 200 tiles. 15 lit (what the feed showed). Scrolling lights the other 185
// row by row, and the counter beneath is the count of lit tiles.
import '../styles/missing.css'
import { ScrollTrigger, prefersReducedMotion } from '../lib/scroll.js'
import { logo } from '../data/logos.js'

const TOTAL = 200
const SHOWN_AT = [3, 17, 28, 44, 59, 66, 81, 92, 107, 118, 133, 146, 158, 171, 189] // 15, scattered
const SHOWN = SHOWN_AT.length

const tiles = Array.from({ length: TOTAL }, (_, i) =>
  `<i class="missing__tile${SHOWN_AT.includes(i) ? ' is-shown' : ''}"></i>`).join('')

export const html = `
<section class="missing section" id="missing" data-page data-world-lock="paper" aria-labelledby="missing-h">
  <div class="container missing__head">
    <p class="eyebrow" data-reveal>08 · But won't I miss things?</p>
    <h2 id="missing-h" data-reveal="lines">You're already missing out.</h2>
    <p class="lead missing__lead measure" data-reveal data-reveal-delay="0.1">Your subscriptions published 200 videos this week. Your feed showed you 15. What about the other 185?</p>
  </div>

  <div class="missing__stage">
    <div class="missing__sticky">
      <div class="container missing__frame">
        <div class="missing__caption mono" aria-hidden="true">
          <span>Contact sheet<span class="hide-mobile"> · this week</span></span>
          <span class="missing__legend"><i></i>the 15 your feed showed</span>
        </div>
        <div class="missing__sheet" role="img" aria-label="A contact sheet of 200 tiles, one per piece your subscriptions published this week. 15 are lit: the ones your feed showed you. As you scroll, the other 185 light up row by row.">
          ${tiles}
          <span class="missing__front" aria-hidden="true"></span>
        </div>
        <div class="missing__counter">
          <div class="missing__figure">
            <span class="missing__num" data-missing-num>${SHOWN}</span><span class="missing__of">/ ${TOTAL}</span>
          </div>
          <p class="missing__label">pieces you follow, shown</p>
        </div>
      </div>
    </div>
  </div>

  <div class="container missing__after">
    <p class="missing__body measure" data-reveal>They weren't buried because they were bad. They were buried because the ranking thought something else would keep you watching longer. Antiviral looks through everything you follow. Every channel, every episode, every post. Ranked by what you asked for, not by what gets the most clicks.</p>

    <ul class="missing__panels" data-reveal-group>
      <li class="missing__panel">
        <span class="missing__panel-n mono" aria-hidden="true">01</span>
        <h3 class="missing__panel-title">Your hidden library</h3>
        <p>You follow 150 channels and see maybe 20. That's the strangest feature of the modern internet, and nobody put it on the box.</p>
        <div class="missing__foot" aria-hidden="true">
          <span class="missing__mini">${Array.from({ length: 15 }, (_, i) => `<i${i === 4 || i === 11 ? ' class="is-on"' : ''}></i>`).join('')}</span>
          <span class="missing__foot-label mono">150 followed · maybe 20 seen</span>
        </div>
      </li>
      <li class="missing__panel">
        <span class="missing__panel-n mono" aria-hidden="true">02</span>
        <h3 class="missing__panel-title">Connections you haven't made</h3>
        <p>You've been watching pottery. You've been reading about Japan. A ceramicist in Kyoto has been sitting in your subscriptions for a week.</p>
        <dl class="missing__convo">
          <div class="missing__turn"><dt>you →</dt><dd>surprise me</dd></div>
          <div class="missing__turn missing__turn--av"><dt>antiviral →</dt><dd>A channel you follow posted a piece on a ceramicist in Kyoto last week. It sits where two of your interests overlap. Want to see it?</dd></div>
        </dl>
      </li>
      <li class="missing__panel">
        <span class="missing__panel-n mono" aria-hidden="true">03</span>
        <h3 class="missing__panel-title">Bring a book club</h3>
        <p>Add a subreddit or a Bluesky feed and you have a book club: you bring your taste, they bring the surprises. When you want something entirely new, Brave Search finds it, when you ask.</p>
        <div class="missing__foot" aria-hidden="true">
          <span class="missing__marks">${logo('reddit', { size: 18 })}${logo('bluesky', { size: 18 })}</span>
          <span class="missing__foot-label mono">Reddit · Bluesky · Brave Search</span>
        </div>
      </li>
    </ul>

    <h3 class="missing__close" data-reveal>You're not giving up discovery. <em class="i accent">You're discovering what was already yours.</em></h3>
  </div>
</section>`

export function init(root) {
  const el = root.querySelector('#missing')
  if (!el) return
  const stage = el.querySelector('.missing__stage')
  const sheet = el.querySelector('.missing__sheet')
  const front = el.querySelector('.missing__front')
  const num = el.querySelector('[data-missing-num]')
  const counter = el.querySelector('.missing__counter')
  const all = Array.from(sheet.querySelectorAll('.missing__tile'))
  // DOM order is row-major, so lighting in DOM order lights the sheet row by row.
  const hidden = all.filter((t) => !t.classList.contains('is-shown'))
  const HIDDEN = hidden.length // 185

  let cols = 20, rows = 10, sheetH = 0
  const measure = () => {
    cols = getComputedStyle(sheet).gridTemplateColumns.split(' ').filter(Boolean).length || 20
    rows = Math.ceil(TOTAL / cols)
    sheetH = sheet.clientHeight
  }

  let lit = 0
  const paint = (n) => {
    if (n === lit) return
    if (n > lit) for (let i = lit; i < n; i++) hidden[i].classList.add('is-lit')
    else for (let i = n; i < lit; i++) hidden[i].classList.remove('is-lit')
    lit = n
    num.textContent = String(SHOWN + n)
    counter.classList.toggle('is-full', n === HIDDEN)
    // the developing front: a hairline at the bottom edge of the row being lit
    if (n === 0 || n === HIDDEN) { sheet.classList.remove('is-sweeping'); return }
    const idx = all.indexOf(hidden[n - 1])
    const row = Math.floor(idx / cols)
    front.style.transform = `translateY(${((row + 1) / rows) * sheetH}px)`
    sheet.classList.add('is-sweeping')
  }

  if (prefersReducedMotion) {
    el.classList.add('is-static')
    paint(HIDDEN)
    return
  }

  measure()
  ScrollTrigger.create({
    trigger: stage, start: 'top top', end: 'bottom bottom', scrub: true,
    onRefresh: measure,
    onUpdate: (self) => {
      // a short hold at either end so the reader sees 15, then 200
      const q = Math.min(1, Math.max(0, (self.progress - 0.06) / 0.86))
      paint(Math.round(q * HIDDEN))
    },
  })
}
