// 11 — The ledger: the price, printed where you can check it.
import '../styles/ledger.css'
import { gsap, prefersReducedMotion } from '../lib/scroll.js'

const row = (no, name, price) => `
      <li class="ledger__row">
        <span class="ledger__no">${no}</span>
        <span class="ledger__item">
          <span class="ledger__name">${name}</span>
          <span class="ledger__date">published 2026</span>
        </span>
        <span class="ledger__price">${price}</span>
      </li>`

export const html = `
<section class="ledger section" id="ledger" data-page data-world-lock="paper" aria-labelledby="ledger-h">
  <div class="container">
    <header class="ledger__head">
      <p class="eyebrow" data-reveal>11 · The price</p>
      <h2 id="ledger-h" class="ledger__title">
        <span class="ledger__l" data-reveal="lines">$4.99 a month,</span>
        <span class="ledger__l" data-reveal="lines" data-reveal-delay="0.1"><em class="i">printed where you can check it.</em></span>
      </h2>
      <p class="lead ledger__lead measure" data-reveal data-reveal-delay="0.15">Every feed has a payer, and the payer is who the software works for. The free ones are paid for by advertisers, which is why the model of you they build works for advertisers. The subscription is you taking that seat.</p>
    </header>

    <div class="ledger__table" data-reveal data-reveal-delay="0.1">
      <div class="ledger__thead" aria-hidden="true">
        <span class="ledger__th">No.</span>
        <span class="ledger__th">Item</span>
        <span class="ledger__th ledger__th--date">Date</span>
        <span class="ledger__th ledger__th--price">Price</span>
      </div>
      <ol class="ledger__rows">
        ${row('01', 'Feed · Shortlist · Sunday Edition', 'Free, forever')}
        ${row('02', 'Daily Edition', '$4.99 / month')}
        ${row('03', 'Daily Edition', '$49.99 / year')}
      </ol>
    </div>

    <footer class="ledger__foot">
      <div class="ledger__notes" data-reveal>
        <p class="ledger__note">You subscribe, or we make nothing. No ads. No data sold. No investor whose return depends on your time.</p>
        <p class="ledger__note ledger__note--muted">The Sunday Edition is free, forever. The daily is for subscribers.</p>
      </div>
      <div class="ledger__mark-wrap" data-reveal data-reveal-delay="0.1">
        <a class="ledger__mark" href="#">
          <svg class="ledger__mark-glyph" aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.25">
            <circle cx="12" cy="12" r="7.5"/>
            <path d="M12 .75v22.5M.75 12h22.5"/>
            <circle cx="12" cy="12" r="1.9" fill="currentColor" stroke="none"/>
          </svg>
          <span class="ledger__mark-text">Read the public ledger</span>
        </a>
      </div>
    </footer>
  </div>
</section>`

export function init(root) {
  const el = root.querySelector('#ledger')
  if (!el) return
  const list = el.querySelector('.ledger__rows')
  const rows = Array.from(el.querySelectorAll('.ledger__row'))

  // Reduced motion: the CSS end state (rows visible) is the whole show.
  if (prefersReducedMotion) return

  // Rows file in one at a time, ruled hairlines and all.
  gsap.set(rows, { y: 16, opacity: 0 })
  gsap.to(rows, {
    y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', stagger: 0.09,
    scrollTrigger: { trigger: list, start: 'top 86%', once: true },
  })
}
