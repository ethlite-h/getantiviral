// 04 — The turn: same machinery, different employer. This section performs the
// page's world change (feed → paper). It carries NO data-world-lock on purpose:
// its background follows the page world so the transition is visible here.
import '../styles/turn.css'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/scroll.js'
import { setWorld } from '../lib/world.js'

const ROWS = [
  ['Optimizes for:', 'minutes', 'what you asked for'],
  ['Learns you:', 'on their servers', 'on your phone'],
  ['Shows its reasons:', 'never', 'every pick'],
  ['Paid by:', 'advertisers', 'you, five dollars'],
  ['Ends:', 'never', 'last page'],
]

const row = ([key, adv, you], i) => `
      <div class="turn__row" style="--i:${i}">
        <dt class="turn__key">${key}</dt>
        <dd class="turn__val">
          <span class="turn__v turn__v--adv">${adv}</span>
          <span class="turn__v turn__v--you" aria-hidden="true">${you}</span>
        </dd>
      </div>`

export const html = `
<section class="turn section section--flush" id="turn" data-page data-state="adv" aria-labelledby="turn-h">
  <div class="turn__pin">
    <div class="turn__stage">
      <div class="container turn__frame">
        <p class="eyebrow turn__eyebrow">04 · The other deployment</p>

        <h2 id="turn-h" class="turn__title">
          <span class="turn__line"><span class="turn__inner">Same machinery.</span></span>
          <span class="turn__line"><span class="turn__inner">Different employer.</span></span>
          <span class="turn__line turn__line--you"><span class="turn__inner turn__you">You.</span></span>
        </h2>

        <div class="turn__deck">
          <div class="turn__control">
            <p class="turn__q" id="turn-q">Who does the model of you work for?</p>
            <button type="button" class="turn__switch" role="switch" aria-checked="false" aria-labelledby="turn-q" aria-describedby="turn-state">
              <span class="turn__knob" aria-hidden="true"><span class="turn__lamp"></span></span>
              <span class="turn__opts" aria-hidden="true">
                <span class="turn__opt turn__opt--adv">Advertisers</span>
                <span class="turn__opt turn__opt--you">You</span>
              </span>
            </button>
            <span class="visually-hidden" id="turn-state">Advertisers</span>
          </div>

          <div class="turn__rows">
            <div class="turn__head" aria-hidden="true">
              <span class="turn__key"></span>
              <span class="turn__val">
                <span class="turn__v turn__v--adv">Advertisers</span>
                <span class="turn__v turn__v--you">You</span>
              </span>
            </div>
            <dl class="turn__list">${ROWS.map(row).join('')}
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="turn__after">
    <div class="container">
      <div class="turn__body stack">
        <p class="turn__lead measure" data-reveal>Yes, Antiviral is AI. If we hid that, we'd be running exactly the evasion you're tired of. The feed's problem was never that it's intelligent. It's that the intelligence works for someone else, toward a number you'll never see. Antiviral runs Apple's on-device models on your phone, learns only from what you do inside it, has no ad inventory to fill, and nothing to gain from your eleventh video.</p>
        <h3 class="turn__coda measure-narrow" data-reveal data-reveal-delay="0.1">The extraction was a choice. <em class="i">This is the other one.</em></h3>
      </div>
    </div>
  </div>
</section>`

export function init(root) {
  const el = root.querySelector('#turn')
  if (!el) return
  const pin = el.querySelector('.turn__pin')
  const sw = el.querySelector('.turn__switch')
  const knob = el.querySelector('.turn__knob')
  const stateText = el.querySelector('#turn-state')
  const advLayers = el.querySelectorAll('.turn__row .turn__v--adv')
  const youLayers = el.querySelectorAll('.turn__row .turn__v--you')

  const LEAN_MAX = 7 // px the knob leans toward where the scroll wants it
  let state = 'adv'
  let progress = 0

  // The single source of truth. Scroll boundaries and the tap both call this;
  // it is idempotent so the two never fight.
  function apply(next) {
    if (state === next) return
    state = next
    const on = next === 'you'
    el.dataset.state = next
    sw.setAttribute('aria-checked', String(on))
    stateText.textContent = on ? 'You' : 'Advertisers'
    advLayers.forEach((n) => n.setAttribute('aria-hidden', String(on)))
    youLayers.forEach((n) => n.setAttribute('aria-hidden', String(!on)))
    setWorld(on ? 'paper' : 'feed')
    if (!prefersReducedMotion) {
      sw.classList.remove('is-thunk')
      void sw.offsetWidth
      sw.classList.add('is-thunk')
    }
    lean()
  }

  // Before the midpoint the knob leans toward "You" as the reader approaches it;
  // if the reader tapped early or late, it leans back toward where scroll will put it.
  function lean() {
    if (prefersReducedMotion) return
    const t = Math.min(1, Math.max(0, progress / 0.5))
    const px = (t - (state === 'you' ? 1 : 0)) * LEAN_MAX
    knob.style.setProperty('--lean', px.toFixed(2) + 'px')
  }

  // Where should the switch be, given only the scroll position? Used on init
  // and after refreshes so a mid-page load lands in the right world.
  function sync() {
    const r = pin.getBoundingClientRect()
    const mid = r.top + r.height / 2
    apply(mid <= window.innerHeight / 2 ? 'you' : 'adv')
  }

  sw.addEventListener('click', () => apply(state === 'you' ? 'adv' : 'you'))

  // automatic flip at the pinned stage's midpoint; leaving in either direction
  // resets whatever the tap did to the state scroll expects there.
  ScrollTrigger.create({
    trigger: pin, start: 'center center', end: 'bottom top',
    onEnter: () => apply('you'),
    onLeaveBack: () => apply('adv'),
    onLeave: () => apply('you'),
    onEnterBack: () => apply('you'),
  })
  ScrollTrigger.create({
    trigger: pin, start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: (self) => { progress = self.progress; lean() },
  })
  sync()
  ScrollTrigger.addEventListener('refresh', sync)

  // entrance: eyebrow, the two lines, one beat, then "You." larger; then the deck
  const inners = el.querySelectorAll('.turn__inner')
  const eyebrow = el.querySelector('.turn__eyebrow')
  const control = el.querySelector('.turn__control')
  const rows = el.querySelectorAll('.turn__head, .turn__row')
  if (!prefersReducedMotion) {
    gsap.set(inners, { yPercent: 112 })
    gsap.set([eyebrow, control], { opacity: 0, y: 16 })
    gsap.set(rows, { opacity: 0, y: 18 })
    gsap.timeline({ defaults: { ease: 'power4.out' }, scrollTrigger: { trigger: el, start: 'top 78%', once: true } })
      .to(eyebrow, { opacity: 1, y: 0, duration: 0.8 }, 0)
      .to(inners[0], { yPercent: 0, duration: 1.25 }, 0.05)
      .to(inners[1], { yPercent: 0, duration: 1.25 }, 0.19)
      .to(inners[2], { yPercent: 0, duration: 1.35 }, 0.95)
      .to(control, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', clearProps: 'transform' }, 1.05)
      .to(rows, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06, clearProps: 'transform' }, 1.15)
  }
}
