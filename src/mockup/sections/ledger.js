// 11 — The ledger: the price, printed where you can check it.
import '../styles/ledger.css'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/scroll.js'

const row = (no, name, price, opts = {}) => `
      <li class="ledger__row${opts.cls ? ' ' + opts.cls : ''}">
        <span class="ledger__no">${no}</span>
        <span class="ledger__item">
          <span class="ledger__name">${name}${opts.stamp ? `<span class="ledger__stamp"><span class="ledger__stamp-text">${opts.stamp}</span></span>` : ''}</span>
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
        <span class="ledger__l" data-reveal="lines">Five dollars a month,</span>
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
        ${row('02', 'Daily Edition', '$5 / month')}
        ${row('03', 'Daily Edition', '$50 / year')}
        ${row('04', 'Founding Reader', '$199, once', { cls: 'ledger__row--founding', stamp: 'Yours for good' })}
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
  const founding = el.querySelector('.ledger__row--founding')
  const stamp = el.querySelector('.ledger__stamp')

  // Reduced motion: the CSS end state (rows visible, stamp down at -8deg) is the whole show.
  if (prefersReducedMotion) return

  // Rows file in one at a time, ruled hairlines and all.
  let rowsDone = false, stampArmed = false, stamped = false
  gsap.set(rows, { y: 16, opacity: 0 })
  gsap.set(stamp, { opacity: 0, scale: 1.6, rotation: -8, filter: 'blur(3px)', transformOrigin: '50% 50%' })
  gsap.to(rows, {
    y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', stagger: 0.09,
    scrollTrigger: { trigger: list, start: 'top 86%', once: true },
    onComplete: () => { rowsDone = true; tryStamp() },
  })

  // The stamp fires once, when the Founding Reader row is in view and has finished arriving.
  ScrollTrigger.create({
    trigger: founding, start: 'top 84%', once: true,
    onEnter: () => { stampArmed = true; tryStamp() },
  })

  function tryStamp() {
    if (stamped || !rowsDone || !stampArmed) return
    stamped = true
    stampDown()
  }

  function stampDown() {
    const tl = gsap.timeline({ delay: 0.14 })
    // the drop: 1.6 → 1, blurred → sharp, accelerating into the paper
    tl.to(stamp, { opacity: 1, scale: 1, rotation: -8, filter: 'blur(0px)', duration: 0.22, ease: 'power3.in' })
      // the paper flinches on impact
      .to(founding, { y: 1.5, duration: 0.05, ease: 'power1.out' }, 0.2)
      .to(founding, { y: 0, duration: 0.2, ease: 'power2.out' })
      // a tiny settle: the rubber gives, then rests
      .to(stamp, { scale: 0.965, rotation: -7.3, duration: 0.07, ease: 'power1.out' }, 0.22)
      .to(stamp, { scale: 1, rotation: -8, duration: 0.3, ease: 'elastic.out(1, 0.6)' })
      .set(stamp, { clearProps: 'filter,willChange' })
  }
}
