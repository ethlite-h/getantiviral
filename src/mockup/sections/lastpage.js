// 13 — The last page: a waitlist, a stretch of empty paper, a tombstone, and
// the colophon. The site ends here, and the section is built to prove it.
import '../styles/lastpage.css'
import { gsap, prefersReducedMotion } from '../lib/scroll.js'
import { WORDMARK } from '../data/brand.js'

// Same test the endpoint runs; the client just says it first.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MSG_INVALID = 'A valid email is required.'
const MSG_UNREACHABLE = "We couldn't reach the list. Please email info@studioikigai.ai to be added."
const MSG_DONE = "You're on the list. We'll write when it ships."

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
      <p class="lead lastpage__sub measure-narrow" data-reveal data-reveal-delay="0.15">Your first Edition prints the day iOS 27 does. Fall 2026, day-and-date with iOS 27.</p>

      <div class="lastpage__signup">
        <div id="waitlist" class="lastpage__waitlist">
          <form class="lastpage__form" action="/api/waitlist" method="post" novalidate data-reveal data-reveal-delay="0.25">
            <label class="visually-hidden" for="lastpage-email">Email address</label>
            <div class="lastpage__field">
              <div class="lastpage__line">
                <input
                  id="lastpage-email"
                  class="lastpage__input"
                  type="email"
                  name="email"
                  inputmode="email"
                  autocomplete="email"
                  autocapitalize="off"
                  autocorrect="off"
                  spellcheck="false"
                  enterkeyhint="send"
                  placeholder="you@somewhere.com"
                  aria-describedby="lastpage-alert"
                  required
                />
              </div>
              <button class="btn btn--primary lastpage__btn" type="submit">Join the waitlist <span class="arrow" aria-hidden="true">→</span></button>
            </div>
            <p id="lastpage-alert" class="lastpage__alert" role="alert"></p>
          </form>
          <p class="lastpage__status" role="status" tabindex="-1"></p>
        </div>

        <div class="lastpage__notes" data-reveal data-reveal-delay="0.35">
          <p class="lastpage__note">Free forever: Feed, Shortlist, Sunday Edition. The daily Edition is $5 a month.</p>
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
          <p class="lastpage__tagline">The name is aggressive. The product is gentle.</p>
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
  initWaitlist(el)
  initEnd(el)
}

// The form: validate first, then POST { email } and either become the status
// line or say exactly what the server said.
function initWaitlist(el) {
  const wrap = el.querySelector('#waitlist')
  const form = wrap.querySelector('.lastpage__form')
  const line = form.querySelector('.lastpage__line')
  const input = form.querySelector('.lastpage__input')
  const button = form.querySelector('.lastpage__btn')
  const alert = form.querySelector('.lastpage__alert')
  const status = wrap.querySelector('.lastpage__status')
  let busy = false
  let done = false

  function fail(msg) {
    alert.textContent = msg
    line.classList.add('is-invalid')
    input.setAttribute('aria-invalid', 'true')
    if (!prefersReducedMotion) {
      gsap.fromTo(line, { x: 0 }, { x: 5, duration: 0.07, repeat: 5, yoyo: true, ease: 'sine.inOut', clearProps: 'x' })
    }
  }
  function clear() {
    if (!alert.textContent) return
    alert.textContent = ''
    line.classList.remove('is-invalid')
    input.removeAttribute('aria-invalid')
  }
  function setBusy(v) {
    busy = v
    form.classList.toggle('is-busy', v)
    button.setAttribute('aria-busy', String(v))
    button.setAttribute('aria-disabled', String(v))
  }
  function succeed() {
    done = true
    const finish = () => {
      form.remove()
      status.textContent = MSG_DONE
      status.classList.add('is-shown')
      status.focus({ preventScroll: true })
      if (!prefersReducedMotion) {
        gsap.fromTo(status, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform' })
      }
    }
    if (prefersReducedMotion) finish()
    else gsap.to(form, { opacity: 0, y: -8, duration: 0.32, ease: 'power2.in', onComplete: finish })
  }

  input.addEventListener('input', clear)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (busy || done) return
    const email = input.value.trim()
    if (!EMAIL_RE.test(email) || email.length > 254) {
      fail(MSG_INVALID)
      input.focus()
      return
    }
    clear()
    setBusy(true)
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 15000)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
        signal: ctrl.signal,
      })
      let data = null
      try { data = await res.json() } catch { /* non-JSON body: fall through to the generic line */ }
      if (res.ok) { succeed(); return }
      fail((data && typeof data.error === 'string' && data.error) || MSG_UNREACHABLE)
    } catch {
      fail(MSG_UNREACHABLE)
    } finally {
      clearTimeout(timer)
      if (!done) setBusy(false)
    }
  })
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
