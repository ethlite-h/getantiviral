// 02 — Confession: the reader caught in the act. A very large clock scrubs
// from 0:00 to 40:12 while a ledger of the evening lights up line by line.
import '../styles/confession.css'
import { ScrollTrigger, prefersReducedMotion } from '../lib/scroll.js'

const LEDGER = [
  { at: 0, text: 'best pizza near me', hot: 'var(--hot-red)' },
  { at: 7, text: 'the best pizza in the world (ranked)', hot: 'var(--hot-orange)' },
  { at: 14, text: 'what they actually put in your cheese', hot: 'var(--hot-blue)' },
  { at: 23, text: 'why your oven is lying to you', hot: 'var(--hot-violet)' },
  { at: 31, text: 'the moon landing, explained by a man in a garage', hot: 'var(--hot-cyan)' },
  { at: 40, text: 'you, closing the app', hot: 'var(--accent)', end: true },
]
const END_SECONDS = 40 * 60 + 12 // 40:12
const HOLD = 0.88 // the clock reaches 40:12 here and holds for the rest of the descent

const lines = LEDGER.map((l) => `
      <li class="confession__line${l.end ? ' confession__line--end' : ''}" style="--hot:${l.hot}" data-at="${l.at}">
        <span class="confession__stamp">0:${String(l.at).padStart(2, '0')}</span>
        <span class="confession__dot" aria-hidden="true">·</span>
        <span class="confession__text">${l.text}</span>
        <span class="confession__card" aria-hidden="true"><i class="confession__thumb"></i><i class="confession__bar"></i><i class="confession__bar confession__bar--2"></i></span>
      </li>`).join('')

export const html = `
<section class="confession section section--flush" id="confession" data-page data-world-lock="feed" aria-labelledby="confession-h">
  <div class="container confession__head">
    <p class="eyebrow" data-reveal>02 · Be honest</p>
    <h2 id="confession-h" class="confession__title" data-reveal="lines">You opened it to watch one video. <em class="i accent">That was forty minutes ago.</em></h2>
    <p class="lead muted measure confession__lead" data-reveal>You watched none of the things you meant to and all of the things you didn't. Nobody is surprised, least of all the people who built it.</p>
  </div>

  <div class="confession__descent">
    <div class="confession__stage">
      <div class="confession__glow" aria-hidden="true"></div>
      <div class="confession__stage-grid">
        <div class="confession__clock" aria-hidden="true">
          <span class="confession__label">elapsed</span>
          <div class="confession__digits">
            <span class="confession__d confession__d--mt" data-d="mt"></span><span class="confession__d" data-d="mo">0</span><span class="confession__colon">:</span><span class="confession__d" data-d="st">0</span><span class="confession__d" data-d="so">0</span>
          </div>
        </div>
        <div class="confession__ledger-wrap">
          <p class="confession__label">Ledger of the evening</p>
          <ol class="confession__ledger">${lines}
          </ol>
        </div>
      </div>
    </div>
  </div>

  <div class="container confession__after">
    <h3 class="confession__close" data-reveal="lines">That's not a lack of willpower.</h3>
    <p class="lead muted confession__engine" data-reveal>That's a billion-dollar recommendation engine working exactly as designed.</p>
    <p class="confession__note" data-reveal>You just wanted pizza.</p>
  </div>
</section>`

export function init(root) {
  const section = root.querySelector('#confession')
  if (!section) return
  const descent = section.querySelector('.confession__descent')
  const stage = section.querySelector('.confession__stage')
  const glow = section.querySelector('.confession__glow')
  const cells = {
    mt: section.querySelector('[data-d="mt"]'),
    mo: section.querySelector('[data-d="mo"]'),
    st: section.querySelector('[data-d="st"]'),
    so: section.querySelector('[data-d="so"]'),
  }
  const lineEls = Array.from(section.querySelectorAll('.confession__line'))
  const canAnimate = !prefersReducedMotion && typeof cells.mo.animate === 'function'

  const setCell = (el, ch, bump) => {
    if (el.textContent === ch) return
    el.textContent = ch
    if (bump && canAnimate) el.animate(
      [{ transform: 'translateY(-16%)', opacity: 0.25 }, { transform: 'none', opacity: 1 }],
      { duration: 300, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
    )
  }

  let lastSeconds = -1
  let lastCurrent = -2
  const renderTime = (seconds) => {
    if (seconds === lastSeconds) return
    lastSeconds = seconds
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    cells.mt.classList.toggle('is-wide', m >= 10)
    setCell(cells.mt, m >= 10 ? String(Math.floor(m / 10)) : '', true)
    setCell(cells.mo, String(m % 10), true)
    setCell(cells.st, String(Math.floor(s / 10)), false)
    setCell(cells.so, String(s % 10), false)
    stage.classList.toggle('is-stopped', seconds >= END_SECONDS)

    // which ledger line is lit
    let current = -1
    for (let i = 0; i < LEDGER.length; i++) if (LEDGER[i].at * 60 <= seconds) current = i
    if (current !== lastCurrent) {
      lastCurrent = current
      lineEls.forEach((li, i) => {
        li.classList.toggle('is-lit', i === current)
        li.classList.toggle('is-past', i < current)
      })
      if (current >= 0) stage.style.setProperty('--hot-now', LEDGER[current].hot)
    }
  }

  const render = (p) => {
    const t = p >= HOLD ? END_SECONDS : Math.round((p / HOLD) * END_SECONDS)
    renderTime(t)
    glow.style.opacity = (0.08 + 0.2 * Math.min(1, p / HOLD)).toFixed(3)
  }

  if (prefersReducedMotion) {
    // the end state, statically: the clock stopped, the evening on the ledger
    section.classList.add('confession--static')
    render(1)
    return
  }

  render(0)
  ScrollTrigger.create({
    trigger: descent,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => render(self.progress),
  })
}
