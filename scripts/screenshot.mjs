// Capture review screenshots of the mockup at phone + desktop viewports.
// Usage: node scripts/screenshot.mjs [url] [outDir]
//   default url http://localhost:4173, outDir ./shots
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const url = process.argv[2] || 'http://localhost:4173'
const out = process.argv[3] || join(process.cwd(), 'shots')
mkdirSync(out, { recursive: true })

const DEVICES = {
  iphone: {
    viewport: { width: 393, height: 852 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
  },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
}

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist'] })
const errors = []
for (const [name, opts] of Object.entries(DEVICES)) {
  const ctx = await browser.newContext(opts)
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push(`[${name}] pageerror: ${e.message}`))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${name}] console.error: ${m.text()}`) })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  await page.screenshot({ path: join(out, `${name}-00-top.png`) })

  // Walk the page one viewport at a time so scroll-triggered reveals fire.
  const total = await page.evaluate(() => document.documentElement.scrollHeight)
  const vh = opts.viewport.height
  const steps = Math.ceil(total / vh)
  for (let i = 0; i <= steps; i++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), i * vh)
    await page.waitForTimeout(350)
  }
  // Second pass for the actual captures once everything has revealed.
  const sections = await page.$$eval('main > section, main > header, main > footer, [data-shot]', (els) =>
    els.map((el) => ({ id: el.id || el.dataset.shot || el.tagName.toLowerCase(), top: el.getBoundingClientRect().top + window.scrollY, height: el.getBoundingClientRect().height })))
  let n = 1
  for (const s of sections) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), s.top)
    await page.waitForTimeout(700)
    await page.screenshot({ path: join(out, `${name}-${String(n).padStart(2, '0')}-${s.id}.png`) })
    n++
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(300)
  await page.screenshot({ path: join(out, `${name}-full.png`), fullPage: true })
  const overflow = await page.evaluate(() => ({ docW: document.documentElement.scrollWidth, winW: window.innerWidth }))
  if (overflow.docW > overflow.winW + 1) errors.push(`[${name}] HORIZONTAL OVERFLOW: scrollWidth ${overflow.docW} > innerWidth ${overflow.winW}`)
  await ctx.close()
}
await browser.close()
console.log(`screenshots written to ${out}`)
if (errors.length) { console.log('ISSUES:'); for (const e of errors) console.log(' -', e) } else console.log('no page errors, no horizontal overflow')
