// Scroll infrastructure: Lenis (smooth wheel on desktop, native touch on phones)
// wired into GSAP's ticker, and ScrollTrigger kept in sync.
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const isTouch = window.matchMedia('(pointer: coarse)').matches
export const isMobile = window.matchMedia('(max-width: 879px)').matches

let lenis = null

export function initScroll() {
  if (prefersReducedMotion) {
    ScrollTrigger.config({ ignoreMobileResize: true })
    return null
  }
  lenis = new Lenis({
    lerp: 0.11,
    wheelMultiplier: 1,
    smoothWheel: true,
    syncTouch: false, // keep iOS native momentum; ScrollTrigger reads native scroll anyway
    anchors: true,
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  ScrollTrigger.config({ ignoreMobileResize: true })
  return lenis
}

export function scrollTo(target, opts = {}) {
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4, ...opts })
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }
}

export { gsap, ScrollTrigger }
