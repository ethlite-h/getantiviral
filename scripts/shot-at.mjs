// Screenshot a URL at a given scroll position (px or CSS selector), phone + desktop.
// Usage: node scripts/shot-at.mjs <url> <scrollY|selector> <outPrefix> [waitMs]
import { chromium } from 'playwright-core'
const [url, where, prefix, waitArg] = process.argv.slice(2)
const wait = Number(waitArg || 1200)
const DEV = {
  iphone: { viewport: { width: 393, height: 852 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
}
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist'] })
for (const [name, opts] of Object.entries(DEV)) {
  const ctx = await browser.newContext(opts)
  const page = await ctx.newPage()
  page.on('pageerror', (e) => console.log(`[${name}] pageerror`, e.message))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  const y = await page.evaluate((w) => {
    if (/^\d+$/.test(w)) return Number(w)
    const el = document.querySelector(w); if (!el) return 0
    return el.getBoundingClientRect().top + window.scrollY
  }, where)
  // step there so ScrollTriggers fire in order
  const steps = 8
  for (let i = 1; i <= steps; i++) { await page.evaluate((yy) => window.scrollTo(0, yy), (y * i) / steps); await page.waitForTimeout(80) }
  await page.waitForTimeout(wait)
  await page.screenshot({ path: `${prefix}-${name}.png` })
  await ctx.close()
}
await browser.close()
console.log('done')
