import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Local stand-in for /api/waitlist (the Resend-backed function in api/ runs on
// Vercel only), so the home-page form completes end-to-end in `vite dev`/`preview`.
function waitlistStub() {
  const handle = (req, res, next) => {
    if (req.url === '/api/waitlist' && req.method === 'POST') {
      let body = ''
      req.on('data', (c) => (body += c))
      req.on('end', () => {
        let email = ''
        try { email = JSON.parse(body || '{}').email || '' } catch {}
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
        res.setHeader('Content-Type', 'application/json')
        setTimeout(() => {
          res.statusCode = ok ? 200 : 400
          res.end(JSON.stringify(ok ? { ok: true, stub: true } : { error: 'A valid email is required.' }))
        }, 650)
      })
      return
    }
    next()
  }
  return {
    name: 'waitlist-stub',
    configureServer(server) { server.middlewares.use(handle) },
    configurePreviewServer(server) { server.middlewares.use(handle) },
  }
}

export default defineConfig({
  plugins: [react(), waitlistStub()],
  server: { host: true },
  preview: { host: true, port: 4173 },
  build: {
    target: 'es2020',
    rollupOptions: {
      // index.html is the home page (src/mockup); site.html carries the React
      // routes /privacy, /terms, /devlog (see vercel.json rewrites).
      input: { index: resolve(__dirname, 'index.html'), site: resolve(__dirname, 'site.html') },
      output: {
        manualChunks: { three: ['three'], gsap: ['gsap', 'gsap/ScrollTrigger', 'gsap/SplitText'], lenis: ['lenis'] },
      },
    },
  },
})
