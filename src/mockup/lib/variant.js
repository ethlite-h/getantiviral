// Layout variants. B (product first) is the page; `?v=a` still renders the
// story-first order for comparison, with no visible switch. The choice persists
// in localStorage; index.html reads it before first paint.
//   A · story first   — the original order, the argument before the app
//   B · product first — the Feed in the hero, the app before the argument
import { ScrollTrigger } from './scroll.js'
import { setWorld } from './world.js'

export function getVariant() {
  return document.documentElement.dataset.variant === 'a' ? 'a' : 'b'
}

// Eyebrows carry their story number ("05 · How a day goes"). After a reorder
// the number is the section's position on the page, hero = 01.
export function renumber(main) {
  Array.from(main.querySelectorAll('[data-page]')).forEach((page, i) => {
    const eb = page.querySelector('.eyebrow')
    if (!eb) return
    const m = eb.textContent.match(/^\s*(\d{2}) · /)
    if (!m) return
    eb.textContent = eb.textContent.replace(m[1], String(i + 1).padStart(2, '0'))
  })
}

// In order B the page alternates paper and feed more than once, so the masthead
// follows whichever locked section sits under it. The turn keeps its own switch.
export function trackWorld(main) {
  Array.from(main.querySelectorAll('[data-world-lock]')).forEach((sec) => {
    const world = sec.dataset.worldLock
    ScrollTrigger.create({
      trigger: sec, start: 'top 48px', end: 'bottom 48px',
      onEnter: () => setWorld(world), onEnterBack: () => setWorld(world),
    })
  })
}
