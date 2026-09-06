// 01 (variant B) — Hero: the product first. The Feed on a phone, with three
// numbered proofs pinned to the screen: sources, the why-line, the ask.
import '../styles/hero-product.css'
import { gsap, prefersReducedMotion } from '../lib/scroll.js'
import { phoneFrame, appTopBar } from '../lib/phone.js'
import { logo } from '../data/logos.js'

const DAY_SHORT = new Date().toLocaleDateString('en-US', { weekday: 'short' })

const ROWS = [
  { id: 'bridges', title: 'Why every bridge in Pittsburgh is yellow', src: 'youtube', meta: 'YouTube · 14 min', why: 'you finished the last three from this channel' },
  { id: 'interview', title: 'Ep. 212: Craft, boredom, and the long apprenticeship', src: 'applepodcasts', meta: 'Podcasts · 1 h 12', why: 'long-form interviews over clips, your rule 13' },
  { id: 'bakery', title: 'The quiet economics of a good bakery', src: 'substack', meta: 'Substack · 9 min', why: 'you read every issue of this one' },
  { id: 'kyoto', title: 'Kyoto ceramicist on the last kiln in the valley', src: 'bluesky', meta: 'Bluesky · 6 min', why: 'two of your interests overlap here: pottery, Japan' },
  { id: 'atacama', title: 'Field notes from the Atacama, part 3', src: 'rss', meta: 'RSS · 7 min', why: 'parts one and two, both finished' },
  { id: 'pottery', title: 'r/pottery: glaze results from a wood kiln', src: 'reddit', meta: 'Reddit · thread', why: 'two of your interests overlap here' },
]

const PROOFS = [
  { n: 1, head: 'Everything you already follow, in one place.', text: 'YouTube, podcasts, Substack, RSS, Reddit, Bluesky. Ranked by what you asked for, not by what keeps you.' },
  { n: 2, head: 'Every pick says why it’s here.', text: 'Not to reassure you. So you can overrule it.' },
  { n: 3, head: 'Say “less crypto.” It writes the rule down.', text: 'In plain language, on your phone. Open it, change it, delete it.' },
]

const pin = (n) => `<i class="herop__pin" aria-hidden="true">${n}</i>`

const row = (r, i) => `
  <div class="app-row herop__row" data-thumb="${r.id}">
    <div class="app-row__thumb"></div>
    <div>
      <div class="app-row__title">${r.title}</div>
      <div class="app-row__meta">${logo(r.src, { size: 12 })}<span>${r.meta}</span></div>
      <div class="app-row__why${i === 0 ? ' herop__why--pinned' : ''}">${r.why}${i === 0 ? pin(2) : ''}</div>
    </div>
  </div>`

const screen = `
  <div class="herop__screen">
    ${appTopBar('Feed', `${DAY_SHORT} · 14 sources${pin(1)}`)}
    <div class="herop__rows">${ROWS.map(row).join('')}</div>
    <div class="app-convo herop__convo"><span class="app-convo__text">Tell your feed what you want</span><span class="app-convo__send" aria-hidden="true">↑</span>${pin(3)}</div>
  </div>`

const proof = (p) => `
  <li class="herop__proof">
    <span class="herop__num" aria-hidden="true">${p.n}</span>
    <div><strong class="herop__proof-head">${p.head}</strong> <span class="herop__proof-text">${p.text}</span></div>
  </li>`

export const html = `
<section class="herop section" id="top" data-page data-world-lock="paper" aria-label="Introduction">
  <div class="container herop__grid">
    <div class="herop__copy">
      <p class="eyebrow herop__eyebrow" data-reveal>Fall 2026 · iPhone &amp; Mac</p>
      <h1 class="herop__title">
        <span class="herop__line"><span class="herop__inner">Your feed,</span></span>
        <span class="herop__line"><span class="herop__inner"><em class="i accent">finally yours.</em></span></span>
      </h1>
      <p class="lead herop__lead measure-narrow">A feed of what you already follow, ranked by what you asked for, with a reason on every pick and one daily Edition that ends.</p>
      <div class="herop__actions">
        <a class="btn btn--accent" href="#waitlist">Join the waitlist <span class="arrow" aria-hidden="true">→</span></a>
        <a class="btn btn--ghost" href="#loop">See how a day goes</a>
      </div>
    </div>
    <div class="herop__phone-wrap">
      ${phoneFrame(screen, { cls: 'herop__phone', label: 'The Antiviral Feed on iPhone: six items from sources you follow, each with the reason it was picked, and a bar to tell the feed what you want', theme: 'dark' })}
    </div>
    <ol class="herop__proofs" aria-label="What it does">${PROOFS.map(proof).join('')}</ol>
  </div>
</section>`

export function init(root) {
  const section = root.querySelector('.herop')
  if (!section || prefersReducedMotion) return
  const inners = section.querySelectorAll('.herop__inner')
  const rows = section.querySelectorAll('.herop__row')
  const pins = section.querySelectorAll('.herop__pin')
  const proofs = section.querySelectorAll('.herop__proof')
  gsap.set(inners, { yPercent: 108 })
  gsap.set(['.herop__lead', '.herop__actions'], { opacity: 0, y: 18 })
  gsap.set(section.querySelector('.herop__phone'), { opacity: 0, y: 28 })
  gsap.set(rows, { opacity: 0, y: 14 })
  gsap.set(pins, { scale: 0, opacity: 0 })
  gsap.set(proofs, { opacity: 0, y: 14 })
  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .to(inners, { yPercent: 0, duration: 1.3, stagger: 0.12, delay: 0.15 })
    .to('.herop__lead', { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
    .to('.herop__actions', { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
    .to('.herop__phone', { opacity: 1, y: 0, duration: 1.1, clearProps: 'transform' }, '-=0.9')
    .to(rows, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, clearProps: 'transform' }, '-=0.6')
    .to(pins, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.16, ease: 'back.out(2)', clearProps: 'transform' }, '-=0.3')
    .to(proofs, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, clearProps: 'transform' }, '<')
}
