// Render a deterministic canvas/WebGL animation to an H.264 mp4 (+ optional HEVC)
// using headless Chrome for frames and ffmpeg-static for encoding.
// The source page must define window.__renderFrame(tSeconds) -> Promise|void that
// draws the frame for time t into a canvas that fills the viewport.
// Usage: node scripts/render-video.mjs video-src/<name>.html public/video/<name>.mp4 [seconds=10] [fps=30] [w=1080] [h=1080]
import { chromium } from 'playwright-core'
import ffmpegPath from 'ffmpeg-static'
import { spawn } from 'node:child_process'
import { mkdirSync, rmSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const [src, outFile, secArg = '10', fpsArg = '30', wArg = '1080', hArg = '1080'] = process.argv.slice(2)
if (!src || !outFile) { console.error('usage: render-video.mjs <src.html> <out.mp4> [seconds] [fps] [w] [h]'); process.exit(1) }
const seconds = Number(secArg), fps = Number(fpsArg), W = Number(wArg), H = Number(hArg)
const frames = Math.round(seconds * fps)
const tmp = resolve('.video-frames')
rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true })
mkdirSync(dirname(resolve(outFile)), { recursive: true })

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
page.on('pageerror', (e) => console.error('pageerror', e.message))
await page.goto(pathToFileURL(resolve(src)).href, { waitUntil: 'load' })
await page.waitForFunction(() => typeof window.__renderFrame === 'function')
const t0 = Date.now()
for (let i = 0; i < frames; i++) {
  const t = i / fps
  await page.evaluate((t) => window.__renderFrame(t), t)
  await page.screenshot({ path: join(tmp, `f${String(i).padStart(5, '0')}.png`), type: 'png', omitBackground: false })
  if (i % 30 === 0) process.stdout.write(`\rframe ${i}/${frames}`)
}
console.log(`\nframes rendered in ${((Date.now() - t0) / 1000).toFixed(1)}s`)
await browser.close()

function run(args) {
  return new Promise((res, rej) => {
    const p = spawn(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'inherit'] })
    p.on('exit', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exit ' + c))))
  })
}
// H.264: universally playable, iOS Safari autoplay-safe when muted+playsinline.
await run(['-y', '-framerate', String(fps), '-i', join(tmp, 'f%05d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.1', '-crf', '20', '-preset', 'slow', '-movflags', '+faststart', '-an', resolve(outFile)])
console.log('wrote', outFile)
// HEVC companion (smaller on Apple devices). Safari picks it when listed first.
const hevcOut = resolve(outFile).replace(/\.mp4$/, '.hevc.mp4')
try {
  await run(['-y', '-framerate', String(fps), '-i', join(tmp, 'f%05d.png'), '-c:v', 'libx265', '-pix_fmt', 'yuv420p', '-crf', '24', '-preset', 'medium', '-tag:v', 'hvc1', '-movflags', '+faststart', '-an', hevcOut])
  console.log('wrote', hevcOut)
} catch (e) { console.warn('hevc skipped:', e.message) }
rmSync(tmp, { recursive: true, force: true })
