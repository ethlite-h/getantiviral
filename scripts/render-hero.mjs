// Render the variant A hero ("Your feed, finally yours." over the stream, then the
// stream settling into the edition) for posts that cannot run the live WebGL
// (Substack, email): an H.264 mp4 of the whole 12.5 s, a 728 px GIF of just the
// title entrance (a full-length GIF of this scene is 30+ MB), and two PNG posters.
// Frames come from headless Chrome stepping a fake clock (video-src/hero-a.html).
// Usage: node scripts/render-hero.mjs [outDir=exports/hero] [fps=30] [w=1920] [h=1080]
import { chromium } from 'playwright-core'
import ffmpegPath from 'ffmpeg-static'
import { spawn } from 'node:child_process'
import { mkdirSync, rmSync, copyFileSync, statSync } from 'node:fs'
import { resolve, join } from 'node:path'

const [outArg = 'exports/hero', fpsArg = '30', wArg = '1920', hArg = '1080'] = process.argv.slice(2)
const out = resolve(outArg), fps = Number(fpsArg), W = Number(wArg), H = Number(hArg)
const PORT = 5179
mkdirSync(out, { recursive: true })
const tmp = resolve('.video-frames', 'hero')
rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true })

const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], { stdio: 'ignore' })
const base = `http://127.0.0.1:${PORT}`
for (let i = 0; i < 100; i++) { try { await fetch(base); break } catch { await new Promise((r) => setTimeout(r, 200)) } }

function run(args) {
  return new Promise((res, rej) => {
    const p = spawn(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'inherit'] })
    p.on('exit', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exit ' + c))))
  })
}

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] })
try {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
  page.on('pageerror', (e) => console.error('pageerror', e.message))
  await page.goto(`${base}/video-src/hero-a.html`, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.__ready, null, { timeout: 30000 })
  const { total, titleAt } = await page.evaluate(() => window.__ready)
  const frames = Math.round(total * fps)
  const t0 = Date.now()
  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.__seek(t), i / fps)
    await page.screenshot({ path: join(tmp, `f${String(i).padStart(5, '0')}.png`), type: 'png' })
    if (i % 30 === 0) process.stdout.write(`\rframe ${i}/${frames}`)
  }
  console.log(`\n${frames} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s`)
  const f = (i) => join(tmp, `f${String(i).padStart(5, '0')}.png`)
  copyFileSync(f(Math.round(titleAt * fps)), join(out, 'hero-a-title.png'))
  copyFileSync(f(frames - 1), join(out, 'hero-a-edition.png'))
} finally {
  await browser.close()
}

const mp4 = join(out, 'hero-a.mp4')
await run(['-y', '-framerate', String(fps), '-i', join(tmp, 'f%05d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.1', '-crf', '19', '-preset', 'slow', '-movflags', '+faststart', '-an', mp4])
console.log(`wrote ${mp4} (${(statSync(mp4).size / 1e6).toFixed(2)} MB)`)
// the GIF: the first TITLE_S seconds only, 728 px wide, 12 fps, 128 colours with ordered dither
const TITLE_S = 4.5
const gif = join(out, 'hero-a-title.gif')
await run(['-y', '-t', String(TITLE_S), '-i', mp4,
  '-vf', 'fps=12,scale=728:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle',
  '-loop', '0', gif])
console.log(`wrote ${gif} (${(statSync(gif).size / 1e6).toFixed(2)} MB)`)
vite.kill()
rmSync(tmp, { recursive: true, force: true })
