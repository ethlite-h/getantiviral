// 12 — The studio: seventeen years at Apple, then the other thing.
// Quiet and still: fade-ups only. Amber is reserved for the studio credit.
import '../styles/maker.css'
import { ScrollTrigger, prefersReducedMotion } from '../lib/scroll.js'

const POSTER = '/video/wave-loop.jpg'
const ICON = '/brand/app-icon-512.png'

const principles = [
  'On-device first.',
  'Transparent by default.',
  'Built for your attention being worth something.',
]

export const html = `
<section class="maker section" id="maker" data-page data-world-lock="paper" aria-labelledby="maker-h">
  <div class="container">
    <header class="maker__head">
      <p class="eyebrow" data-reveal>12 · The studio</p>
      <h2 id="maker-h" class="maker__title" data-reveal data-reveal-delay="0.08">
        <span class="maker__l">Seventeen years at Apple.</span>
        <span class="maker__l"><em class="i">Then she went and built the other thing.</em></span>
      </h2>
    </header>

    <div class="maker__grid">
      <figure class="maker__plate" data-reveal data-reveal-delay="0.12">
        <div class="maker__plate-frame">
          <div class="maker__plate-media">
            <video class="maker__video" autoplay muted loop playsinline preload="metadata" poster="${POSTER}" disablepictureinpicture aria-hidden="true" tabindex="-1">
              <source src="/video/wave-loop.hevc.mp4" type='video/mp4; codecs="hvc1"'>
              <source src="/video/wave-loop.mp4" type="video/mp4">
            </video>
            <img class="maker__poster" src="${POSTER}" alt="" aria-hidden="true" decoding="async" loading="lazy" width="1600" height="900">
          </div>
        </div>
        <figcaption class="maker__plate-cap mono"><span class="maker__fig">Fig. 5</span> · the wave: a line that rises, crests, and ends.</figcaption>
      </figure>

      <div class="maker__body stack measure" data-reveal data-reveal-delay="0.18">
        <p>Antiviral is made by Studio Ikigai, an independent software studio in San Diego, founded by Helen. From inside, the extractive version looks like a law of nature, until you notice it was a choice, made because it paid. A grudge would be an essay. This is an existence proof you can put in your pocket.</p>
        <p>The studio runs on three principles: on-device first, transparent by default, built for your attention being worth something. It also makes Inner Voice, a vocal wellness app that listens for whether you sound like yourself rather than whether you hit the note. On-device, too. Ikigai is the intersection of what matters and what sustains you. That's the business plan.</p>
      </div>
    </div>

    <ol class="maker__principles" aria-label="Three principles" data-reveal-group data-reveal-delay="0.05">
      ${principles.map((text, i) => `
      <li class="maker__principle">
        <span class="maker__principle-no" aria-hidden="true">0${i + 1}</span>
        <span class="maker__principle-text">${text}</span>
      </li>`).join('')}
    </ol>

    <footer class="maker__foot" data-reveal>
      <a class="maker__credit amber" href="https://studioikigai.ai" rel="noopener"><span>From Studio Ikigai · studioikigai.ai</span></a>
    </footer>
  </div>
</section>`

export function init(root) {
  const el = root.querySelector('#maker')
  if (!el) return
  const plate = el.querySelector('.maker__plate')
  const video = el.querySelector('.maker__video')
  const poster = el.querySelector('.maker__poster')
  if (!plate || !video || !poster) return

  // Fallback chain: video → poster still → app icon in the same frame.
  const showPoster = () => plate.classList.remove('is-playing')
  const showVideo = () => plate.classList.add('is-playing')
  poster.addEventListener('error', () => {
    if (poster.dataset.fallback) return
    poster.dataset.fallback = 'icon'
    poster.src = ICON
    plate.classList.add('maker__plate--icon')
    showPoster()
  })
  video.addEventListener('error', showPoster)
  const sources = video.querySelectorAll('source')
  // Only the last <source> failing means the video is unavailable.
  sources[sources.length - 1]?.addEventListener('error', showPoster)

  // Reduced motion: the still is the whole show.
  if (prefersReducedMotion) {
    video.removeAttribute('autoplay')
    video.removeAttribute('loop')
    try { video.pause() } catch (_) {}
    showPoster()
    return
  }

  // Cross-fade to the moving picture only once frames are actually rendering.
  video.addEventListener('playing', showVideo)
  video.addEventListener('waiting', showPoster)

  const play = () => {
    const p = video.play()
    if (p && typeof p.catch === 'function') p.catch(() => showPoster())
  }
  const pause = () => { try { video.pause() } catch (_) {} }

  // Spend the decoder only while the plate is anywhere near the viewport.
  ScrollTrigger.create({
    trigger: el, start: 'top bottom', end: 'bottom top',
    onEnter: play, onEnterBack: play, onLeave: pause, onLeaveBack: pause,
  })
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause()
    else if (ScrollTrigger.isInViewport(el)) play()
  })
}
