// 01 — Hero: the stream that becomes an edition.
import { gsap, ScrollTrigger, isMobile, prefersReducedMotion } from '../lib/scroll.js'

export const html = `
<section class="hero section--flush" id="top" data-page data-folio="infinite" data-world-lock="feed" aria-label="Introduction">
  <div class="hero__sticky">
    <canvas class="hero__canvas" aria-hidden="true"></canvas>
    <div class="hero__fallback" aria-hidden="true"></div>
    <div class="hero__scrim" aria-hidden="true"></div>
    <div class="container hero__content">
      <p class="eyebrow hero__eyebrow" data-reveal>Fall 2026 · iPhone &amp; Mac</p>
      <h1 class="hero__title">
        <span class="hero__line"><span class="hero__inner">Your feed,</span></span>
        <span class="hero__line"><span class="hero__inner"><em class="i accent">finally yours.</em></span></span>
      </h1>
      <p class="lead hero__lead measure-narrow">One honest daily edition from the sources you already follow, with a real last page. Curated on your phone by an AI that works for you, not an advertiser.</p>
      <div class="hero__actions">
        <a class="btn btn--accent" href="#waitlist">Join the waitlist <span class="arrow" aria-hidden="true">→</span></a>
        <a class="btn btn--ghost" href="#edition">See the Edition</a>
      </div>
      <div class="hero__cue" aria-hidden="true">
        <span class="hero__cue-line"></span>
        <span class="mono">Scroll. It ends, we promise.</span>
      </div>
    </div>
    <div class="hero__stack-caption mono" aria-hidden="true">
      <span class="hero__stack-label">Today's edition · 6 pieces · a last page</span>
    </div>
  </div>
</section>`

export function init(root) {
  const section = root.querySelector('.hero')
  const canvas = section.querySelector('.hero__canvas')
  // Three.js is the heaviest chunk on the page; fetch it after the text is on screen.
  let stream = null
  let pendingOrder = 0
  import('../hero/stream.js').then(({ mountStream }) => {
    stream = mountStream(canvas, { mobile: isMobile, reducedMotion: prefersReducedMotion })
    if (!stream) { section.classList.add('hero--nogl'); return }
    stream.setOrder(pendingOrder)
    stream.start()
    if (!isMobile) {
      window.addEventListener('pointermove', (e) => {
        stream.setPointer((e.clientX / window.innerWidth - 0.5) * 2, -(e.clientY / window.innerHeight - 0.5) * 2)
      }, { passive: true })
    } else {
      let a = 0
      gsap.ticker.add(() => { a += 0.004; stream.setPointer(Math.sin(a) * 0.35, Math.cos(a * 0.7) * 0.2) })
    }
    const ro = new ResizeObserver(() => stream.resize()); ro.observe(canvas)
    canvas.classList.add('is-ready')
  }).catch(() => section.classList.add('hero--nogl'))

  // entrance
  const inners = section.querySelectorAll('.hero__inner')
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  if (!prefersReducedMotion) {
    gsap.set(inners, { yPercent: 108 })
    gsap.set(['.hero__lead', '.hero__actions', '.hero__cue'], { opacity: 0, y: 18 })
    tl.to(inners, { yPercent: 0, duration: 1.3, stagger: 0.12, delay: 0.15 })
      .to('.hero__lead', { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
      .to('.hero__actions', { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
      .to('.hero__cue', { opacity: 1, y: 0, duration: 0.9, clearProps: 'opacity,transform' }, '-=0.6')
  }

  // scroll drives order 0 → 1 across the hero's extra height
  ScrollTrigger.create({
    trigger: section, start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: (self) => {
      pendingOrder = self.progress
      if (stream) stream.setOrder(self.progress)
      section.style.setProperty('--order', self.progress.toFixed(3))
    },
  })
  // pause the renderer when the hero is off screen
  ScrollTrigger.create({
    trigger: section, start: 'top bottom', end: 'bottom top',
    onEnter: () => stream && stream.start(), onEnterBack: () => stream && stream.start(),
    onLeave: () => stream && stream.stop(), onLeaveBack: () => stream && stream.stop(),
  })
}
