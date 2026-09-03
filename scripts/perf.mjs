// Rough hero frame-rate probe at phone viewport with CPU throttling (4x).
import { chromium } from 'playwright-core'
const url = process.argv[2] || 'http://localhost:4173'
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist'] })
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
const page = await ctx.newPage()
const cdp = await ctx.newCDPSession(page)
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
const fps = await page.evaluate(() => new Promise((res) => {
  let n = 0; const t0 = performance.now()
  const tick = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(tick); else res(n / 3) }
  requestAnimationFrame(tick)
}))
console.log(`hero @ 4x CPU throttle, DPR3: ~${fps.toFixed(1)} fps`)
const mem = await page.evaluate(() => performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB heap' : 'n/a')
console.log(mem)
await browser.close()
