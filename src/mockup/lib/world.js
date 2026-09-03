// The page's "world": feed (dark) or paper (light). Switched by the story's
// pivot section via ScrollTrigger, and by the toggle inside that section.
const html = document.documentElement
const meta = document.querySelector('meta[name="theme-color"]')

export function setWorld(world) {
  if (html.dataset.world === world) return
  html.dataset.world = world
  if (meta) meta.setAttribute('content', world === 'paper' ? '#F5F2EB' : '#0B0A09')
  window.dispatchEvent(new CustomEvent('worldchange', { detail: { world } }))
}
export function getWorld() { return html.dataset.world || 'feed' }
