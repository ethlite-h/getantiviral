import './styles/base.css'
import './styles/chrome.css'
import './styles/hero.css'
import './styles/sections.css'
import './styles/phone.css'
import { initScroll, ScrollTrigger } from './lib/scroll.js'
import { initReveals, initCounters } from './lib/reveal.js'
import { mountChrome, initFolio } from './lib/chrome.js'
import { SECTIONS, SECTIONS_B } from './sections/index.js'
import { getVariant, renumber, trackWorld } from './lib/variant.js'

const app = document.getElementById('app')
const main = document.createElement('main')
main.id = 'main'
const variant = getVariant()
const sections = variant === 'b' ? SECTIONS_B : SECTIONS
main.innerHTML = sections.map((s) => s.html).join('\n')
renumber(main)
app.appendChild(main)
mountChrome(app)

initScroll()
for (const s of sections) { try { s.init && s.init(main) } catch (e) { console.error('section init failed', s.name || s, e) } }
initReveals(main)
initCounters(main)
initFolio()
if (variant === 'b') trackWorld(main)

// fonts settle → recompute pinned/scrub positions
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh())
window.addEventListener('load', () => ScrollTrigger.refresh())
