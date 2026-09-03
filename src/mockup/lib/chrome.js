// Masthead + folio: the page has numbered pages and a last one.
import { WORDMARK } from '../data/brand.js'
import { gsap, ScrollTrigger } from './scroll.js'

export function mountChrome(root) {
  const el = document.createElement('div')
  el.innerHTML = `
    <a class="skip" href="#main">Skip to content</a>
    <div class="progress" aria-hidden="true"></div>
    <header class="masthead" role="banner">
      <a href="#top" class="masthead__brand" aria-label="Antiviral, home">${WORDMARK()}</a>
      <div class="masthead__right">
        <span class="folio" aria-live="polite"><span>p.</span><b data-folio-current>1</b><span>/</span><span data-folio-total>1</span></span>
        <a class="btn btn--primary" href="#waitlist">Join the waitlist</a>
      </div>
    </header>`
  root.prepend(...Array.from(el.childNodes))
}

export function initFolio() {
  const pages = Array.from(document.querySelectorAll('[data-page]'))
  const cur = document.querySelector('[data-folio-current]')
  const tot = document.querySelector('[data-folio-total]')
  const head = document.querySelector('.masthead')
  const bar = document.querySelector('.progress')
  if (!pages.length || !cur || !tot) return
  tot.textContent = String(pages.length)
  pages.forEach((p, i) => {
    ScrollTrigger.create({
      trigger: p, start: 'top 42%', end: 'bottom 42%',
      onEnter: () => set(i), onEnterBack: () => set(i),
    })
  })
  function set(i) {
    // the hero is the feed: it has no page number and no end
    if (i === 0) { cur.textContent = '—'; tot.textContent = '∞'; head.classList.add('is-infinite') }
    else { cur.textContent = String(i + 1); tot.textContent = String(pages.length); head.classList.remove('is-infinite') }
    head.classList.toggle('is-ending', i === pages.length - 1)
  }
  set(0)
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      gsap.set(bar, { scaleX: self.progress })
      head.classList.toggle('is-scrolled', self.scroll() > 24)
    },
  })
}
