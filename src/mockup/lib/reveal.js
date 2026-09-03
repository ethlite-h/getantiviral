// Reveal system. Markup contract:
//   data-reveal            fade/rise when it enters the viewport
//   data-reveal="lines"    split text into masked lines that rise (headlines)
//   data-reveal="words"    split into words that fade up with a stagger
//   data-reveal-group      stagger the direct children instead of the element
//   data-reveal-delay="0.2"
import { gsap, ScrollTrigger, prefersReducedMotion } from './scroll.js'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

const EASE = 'power3.out'

export function initReveals(root = document) {
  if (prefersReducedMotion) return
  const els = root.querySelectorAll('[data-reveal], [data-reveal-group]')
  els.forEach((el) => {
    if (el.__revealed) return
    el.__revealed = true
    const delay = parseFloat(el.dataset.revealDelay || '0')
    const mode = el.dataset.reveal
    const trigger = { trigger: el, start: 'top 88%', once: true }

    if (el.hasAttribute('data-reveal-group')) {
      const kids = Array.from(el.children)
      gsap.set(kids, { y: 26, opacity: 0 })
      gsap.to(kids, { y: 0, opacity: 1, duration: 1.0, ease: EASE, stagger: 0.09, delay, scrollTrigger: trigger })
      return
    }
    if (mode === 'lines') {
      const split = new SplitText(el, { type: 'lines', linesClass: 'split-line' })
      // wrap each line in an inner span so the mask can clip it
      split.lines.forEach((line) => {
        const inner = document.createElement('span')
        inner.className = 'split-inner'
        while (line.firstChild) inner.appendChild(line.firstChild)
        line.appendChild(inner)
      })
      const inners = split.lines.map((l) => l.firstChild)
      gsap.set(inners, { yPercent: 110 })
      gsap.to(inners, { yPercent: 0, duration: 1.15, ease: 'power4.out', stagger: 0.085, delay, scrollTrigger: trigger })
      return
    }
    if (mode === 'words') {
      const split = new SplitText(el, { type: 'words' })
      gsap.set(split.words, { y: 14, opacity: 0 })
      gsap.to(split.words, { y: 0, opacity: 1, duration: 0.8, ease: EASE, stagger: 0.03, delay, scrollTrigger: trigger })
      return
    }
    gsap.set(el, { y: 28, opacity: 0 })
    gsap.to(el, { y: 0, opacity: 1, duration: 1.05, ease: EASE, delay, scrollTrigger: trigger })
  })
}

// Count a number up when it scrolls into view. <span data-count="185" data-count-format="int">0</span>
export function initCounters(root = document) {
  root.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count)
    const decimals = parseInt(el.dataset.countDecimals || '0', 10)
    const prefix = el.dataset.countPrefix || ''
    const suffix = el.dataset.countSuffix || ''
    const fmt = (v) => prefix + v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix
    if (prefersReducedMotion) { el.textContent = fmt(target); return }
    const obj = { v: 0 }
    gsap.to(obj, {
      v: target, duration: 1.8, ease: 'power2.out',
      onUpdate: () => { el.textContent = fmt(obj.v) },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    })
  })
}

export { ScrollTrigger }
