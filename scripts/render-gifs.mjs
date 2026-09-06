// Render the site's SVG animations to looping GIFs for posts that cannot run
// them (Substack, email). Each target is a capture page under video-src/ that
// mounts one element, exposes window.__seek(t) to render time t by hand, and
// window.__ready = { total }. Frames come from headless Chrome; ffmpeg-static
// builds a per-file palette and encodes. Also writes a PNG poster of the last frame.
// Usage: node scripts/render-gifs.mjs [target ...]   (default: all)
//   targets: machine-lever machine-balance machine-belt floorplan
import { chromium } from 'playwright-core'
import ffmpegPath from 'ffmpeg-static'
import { spawn } from 'node:child_process'
import { mkdirSync, rmSync, copyFileSync, statSync } from 'node:fs'
import { resolve, join } from 'node:path'

// width = the element's CSS width; frames are captured at 2x
const TARGETS = {
  'machine-lever': { url: '/video-src/machine-plates.html?fig=lever', selector: '.machine__plate', width: 546, out: 'exports/machine-gifs' },
  'machine-balance': { url: '/video-src/machine-plates.html?fig=balance', selector: '.machine__plate', width: 546, out: 'exports/machine-gifs' },
  'machine-belt': { url: '/video-src/machine-plates.html?fig=belt', selector: '.machine__plate', width: 546, out: 'exports/machine-gifs' },
  'floorplan': { url: '/video-src/floorplan.html', selector: '.architecture__sheet', width: 728, out: 'exports/floorplan' },
}
const FPS = 20
const PORT = 5179
const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(TARGETS)
for (const n of names) if (!TARGETS[n]) { console.error(`unknown target ${n}; known: ${Object.keys(TARGETS).join(' ')}`); process.exit(1) }

// a private vite so the capture pages resolve gsap and the mockup CSS
const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], { stdio: 'ignore' })
const base = `http://127.0.0.1:${PORT}`
for (let i = 0; i < 100; i++) {
  try { await fetch(base); break } catch { await new Promise((r) => setTimeout(r, 200)) }
}

function run(args) {
  return new Promise((res, rej) => {
    const p = spawn(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'inherit'] })
    p.on('exit', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exit ' + c))))
  })
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  for (const name of names) {
    const { url, selector, width, out: outDir } = TARGETS[name]
    const out = resolve(outDir)
    mkdirSync(out, { recursive: true })
    const tmp = resolve('.video-frames', name)
    rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true })
    const page = await browser.newPage({ viewport: { width: Math.max(1000, width + 200), height: 900 }, deviceScaleFactor: 2 })
    page.on('pageerror', (e) => console.error(`[${name}] pageerror`, e.message))
    await page.goto(`${base}${url}`, { waitUntil: 'networkidle' })
    await page.waitForFunction(() => window.__ready)
    await page.evaluate((w) => { document.getElementById('stage').style.width = w + 'px' }, width)
    const { total } = await page.evaluate(() => window.__ready)
    const el = await page.$(selector)
    const frames = Math.round(total * FPS)
    const t0 = Date.now()
    for (let i = 0; i < frames; i++) {
      await page.evaluate((t) => window.__seek(t), i / FPS)
      await el.screenshot({ path: join(tmp, `f${String(i).padStart(5, '0')}.png`), type: 'png' })
      if (i % 40 === 0) process.stdout.write(`\r[${name}] frame ${i}/${frames}`)
    }
    console.log(`\n[${name}] ${frames} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s`)
    await page.close()

    const gif = join(out, `${name}.gif`)
    await run(['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(tmp, 'f%05d.png'),
      '-vf', 'split[a][b];[a]palettegen=max_colors=256:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle',
      '-loop', '0', gif])
    copyFileSync(join(tmp, `f${String(frames - 1).padStart(5, '0')}.png`), join(out, `${name}.png`))
    console.log(`wrote ${gif} (${(statSync(gif).size / 1e6).toFixed(2)} MB)`)
    rmSync(tmp, { recursive: true, force: true })
  }
} finally {
  await browser.close()
  vite.kill()
}
