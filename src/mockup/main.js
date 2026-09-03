import './styles/base.css'
import './styles/chrome.css'
import './styles/hero.css'
import './styles/sections.css'
import './styles/phone.css'
import { initScroll, ScrollTrigger } from './lib/scroll.js'
import { initReveals, initCounters } from './lib/reveal.js'
import { mountChrome, initFolio } from './lib/chrome.js'
import { SECTIONS } from './sections/index.js'

const app = document.getElementById('app')
const main = document.createElement('main')
main.id = 'main'
main.innerHTML = SECTIONS.map((s) => s.html).join('\n')
app.appendChild(main)
mountChrome(app)

initScroll()
for (const s of SECTIONS) { try { s.init && s.init(main) } catch (e) { console.error('section init failed', s.name || s, e) } }
initReveals(main)
initCounters(main)
initFolio()

// fonts settle → recompute pinned/scrub positions
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh())
window.addEventListener('load', () => ScrollTrigger.refresh())
