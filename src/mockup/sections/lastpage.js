// 13 — The last page: the download link, a stretch of empty paper, a tombstone, and
// the colophon. The site ends here, and the section is built to prove it.
import '../styles/lastpage.css'
import { gsap, prefersReducedMotion } from '../lib/scroll.js'
import { WORDMARK, APP_STORE_URL } from '../data/brand.js'

export const html = `
<section class="lastpage section" id="lastpage" data-page data-world-lock="paper" aria-labelledby="lastpage-h">
  <div class="container">
    <header class="lastpage__head">
      <p class="eyebrow" data-reveal>13 · Last page</p>
      <h2 id="lastpage-h" class="lastpage__title">
        <span class="lastpage__l" data-reveal="lines">That's the issue.</span>
        <span class="lastpage__l" data-reveal="lines" data-reveal-delay="0.1"><em class="i accent">See you tomorrow.</em></span>
      </h2>
    </header>

    <div class="lastpage__body">
      <p class="lead lastpage__sub measure-narrow" data-reveal data-reveal-delay="0.15">Your first Edition prints today. Antiviral is on the App Store for iPhone and Mac.</p>

      <div class="lastpage__signup">
        <div id="download" class="lastpage__download" data-reveal data-reveal-delay="0.25">
          <a class="btn btn--primary lastpage__btn" href="${APP_STORE_URL}" target="_blank" rel="noopener">Download on the App Store <span class="arrow" aria-hidden="true">→</span></a>
        </div>

        <div class="lastpage__notes" data-reveal data-reveal-delay="0.35">
          <p class="lastpage__note">Free forever: Feed, Shortlist, Sunday Edition. The daily Edition is $4.99 a month.</p>
          <p class="lastpage__req"><span>Requires Apple Intelligence</span> · <span>iPhone 15 Pro or newer</span> · <span>Apple-silicon Mac</span></p>
        </div>
      </div>
    </div>
  </div>

  <div class="lastpage__paper" aria-hidden="true">
    <span class="lastpage__thread"></span>
  </div>

  <div class="container lastpage__end">
    <span class="lastpage__tombstone" aria-hidden="true">∎</span>
    <p class="lastpage__end-note">Nothing loads below this. We checked.</p>
  </div>

  <footer class="lastpage__colophon" aria-label="Colophon">
    <div class="container">
      <hr class="rule" />
      <div class="lastpage__colophon-grid">
        <div class="lastpage__colophon-brand">
          ${WORDMARK('lastpage__wordmark')}
          <p class="lastpage__tagline">Extractive feeds are the virus. This is the antidote.</p>
        </div>
        <nav class="lastpage__links" aria-label="Colophon links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="#ledger">The ledger</a>
          <a href="https://studioikigai.ai" rel="noopener">Studio Ikigai</a>
          <a href="https://studioikigai.ai" rel="noopener">Inner Voice</a>
        </nav>
      </div>
      <p class="lastpage__copyright">© 2026 Studio Ikigai · San Diego · Curated on your device · Ends every day ∎</p>
    </div>
  </footer>
</section>`

export function init(root) {
  const el = root.querySelector('#lastpage')
  if (!el) return
  initEnd(el)
}

// The end: a hairline descends through the empty paper as the reader scrolls
// (the hero's scroll cue, finally arriving somewhere), and the tombstone sets
// when it lands. Reduced motion: the CSS end state is the whole show.
function initEnd(el) {
  const paper = el.querySelector('.lastpage__paper')
  const thread = el.querySelector('.lastpage__thread')
  const stone = el.querySelector('.lastpage__tombstone')
  const note = el.querySelector('.lastpage__end-note')
  if (prefersReducedMotion) return

  gsap.set(thread, { scaleY: 0, transformOrigin: '50% 0%' })
  gsap.set(stone, { opacity: 0, scale: 0.35, transformOrigin: '50% 50%' })
  gsap.set(note, { opacity: 0, y: 8 })

  gsap.to(thread, {
    scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: paper, start: 'top 85%', end: 'bottom 70%', scrub: 0.4 },
  })
  gsap.timeline({ scrollTrigger: { trigger: paper, start: 'bottom 70%', toggleActions: 'play none none reverse' } })
    .to(stone, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(2.4)' })
    .to(note, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
}
