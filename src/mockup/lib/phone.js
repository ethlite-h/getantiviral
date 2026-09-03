// Shared iPhone frame. Every product screen on the site uses this so the
// device reads identically everywhere. Screen content is plain HTML.
//   phoneFrame(screenHTML, { cls: 'loop__phone', label: 'The Feed' })
import '../styles/phone.css'

export function phoneFrame(screen, opts = {}) {
  const { cls = '', label = 'Antiviral on iPhone', theme = 'dark' } = opts
  return `
  <div class="phone ${cls}" role="img" aria-label="${label}" data-theme="${theme}">
    <div class="phone__body">
      <div class="phone__island" aria-hidden="true"></div>
      <div class="phone__screen">
        <div class="phone__status" aria-hidden="true"><span class="phone__time">9:41</span><span class="phone__signal"><i></i><i></i><i></i></span></div>
        <div class="phone__content">${screen}</div>
        <div class="phone__home" aria-hidden="true"></div>
      </div>
    </div>
  </div>`
}

// App chrome helpers for screens
export const appTopBar = (title, right = '') => `
  <div class="app-topbar"><span class="app-topbar__title">${title}</span><span class="app-topbar__right">${right}</span></div>`

export const convoBar = (text = 'Tell your feed what you want', extra = '') => `
  <div class="app-convo ${extra}"><span class="app-convo__text">${text}</span><span class="app-convo__send" aria-hidden="true">↑</span></div>`
