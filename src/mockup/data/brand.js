// The wave mark: a line that rises, crests, and ends. Finite, on purpose.
export const WAVE_MARK = (size = 28, cls = '') => `
<svg class="wave-mark ${cls}" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M3 21 C 8 21, 9 9, 14.5 9 C 20 9, 20 21, 25 21" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  <circle cx="28.2" cy="21" r="2" fill="currentColor"/>
</svg>`

// The site's own wordmark carries the Av monogram (2026-10-09); the wave mark
// survives inside the product mockups (Edition masthead, loop cover), where it
// depicts the app's own chrome.
export const AV_MARK = (cls = '') => `
<img class="av-mark ${cls}" src="/av-logo.png" alt="" width="30" height="26" decoding="async">`

export const WORDMARK = (cls = '') => `
<span class="wordmark ${cls}">${AV_MARK()}<span class="wordmark__text">Antiviral</span></span>`
