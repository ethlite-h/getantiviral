// 07 — Editor: say "this doesn't belong here." It writes the rule down.
// A dark phone showing the Feed, three instruction chips in the reader's voice,
// and a Rules drawer under the phone. Tap a chip: the convo bar types it, the
// targeted row leaves (or a creator's row rises), and the rule is typed into
// the drawer. Every job runs through one serial queue so fast taps stay sane.
import '../styles/editor.css'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/scroll.js'
import { phoneFrame, appTopBar, convoBar } from '../lib/phone.js'
import { logo } from '../data/logos.js'

const D = prefersReducedMotion ? 0 : 1
let tempo = 1                    // after the first play, everything runs 1.5x faster
const dur = (s) => (s * D) / tempo
const PLACEHOLDER = 'Tell your feed what you want'

const GLYPH = {
  video: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 7.2v9.6l7.4-4.8z" fill="currentColor"/></svg>`,
  audio: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 10v4M9 7v10M12.5 9.5v5M16 5v14M19.5 10v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" fill="none"/></svg>`,
  text: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12M6 12h12M6 16h8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" fill="none"/></svg>`,
}

// The feed. Two rows are the machine's kind of thing (hot thumbs); the rest are honest.
const ROWS = [
  { id: 'bridge', kind: 'video', src: 'youtube', meta: 'YouTube · 18 min', title: 'The slow bridge: a 40-year repair, in one shot', why: 'you finished the last three from this channel', thumb: 'linear-gradient(135deg, #6E8595, #26333D)' },
  { id: 'reaction', kind: 'video', src: 'youtube', meta: 'YouTube · 22 min', title: 'REACTING to the bridge collapse footage', why: 'a channel you follow posted it today', thumb: 'linear-gradient(135deg, var(--hot-red), #4A1611)' },
  { id: 'crypto', kind: 'video', src: 'youtube', meta: 'YouTube · 9 min', title: 'Bitcoin to 200k? Why this week matters', why: 'you watched two of these last month', thumb: 'linear-gradient(135deg, var(--hot-orange), #4A2708)' },
  { id: 'apprentice', kind: 'audio', src: 'applepodcasts', meta: 'Podcasts · 51 min', title: 'Ep. 88: The apprentice years', why: 'long-form interviews over clips, your rule 13', thumb: 'linear-gradient(135deg, #8C7A57, #362E1F)' },
  { id: 'bakery', kind: 'text', src: 'substack', meta: 'The Bakery Ledger · 6 min', title: 'What a croissant actually costs in October', why: 'two of your interests overlap here: bread, economics', thumb: 'linear-gradient(135deg, #CBA76A, #57431E)' },
]
const BACKFILL = [
  { id: 'atacama', kind: 'text', src: 'rss', meta: 'RSS · 8 min', title: 'Field notes from the Atacama, part 4', why: 'you read parts one to three', thumb: 'linear-gradient(135deg, #B58C6B, #3B2C21)' },
  { id: 'kiln', kind: 'text', src: 'reddit', meta: 'r/pottery · Reddit', title: 'First wood-kiln firing: glaze results', why: 'two of your interests overlap here: pottery, Japan', thumb: 'linear-gradient(135deg, #7E6C5C, #2A2420)' },
]

const CHIPS = [
  { id: 'reaction', say: 'this doesn’t belong here', target: 'reaction', action: 'remove', rule: 'Set aside reaction videos, even from channels I follow.' },
  { id: 'bakery', say: 'more from this creator', target: 'bakery', action: 'rise', why: 'you asked for more from this creator', rule: 'More from The Bakery Ledger; surface new posts first.' },
  { id: 'crypto', say: 'I’m done with that', target: 'crypto', action: 'remove', rule: 'Done with crypto price commentary for now.' },
]
const EARLIER = [
  { no: 12, text: 'Fewer live-blogs; wait for the write-up.', meta: 'Aug 14' },
  { no: 13, text: 'Long-form interviews over clips.', meta: 'Aug 21' },
]

const rowHTML = (r) => `
<div class="app-row" data-row="${r.id}">
  <div class="app-row__thumb" style="--thumb:${r.thumb}">${GLYPH[r.kind]}</div>
  <div class="app-row__body">
    <div class="app-row__title">${r.title}</div>
    <div class="app-row__meta">${logo(r.src, { size: 12 })}<span>${r.meta}</span></div>
    <div class="app-row__why">${r.why}</div>
  </div>
</div>`

const ruleHTML = (r) => `
<li class="editor__rule" data-no="${r.no}">
  <span class="editor__rule-n">Rule ${r.no}</span>
  <span class="editor__rule-text">${r.text}</span>
  <span class="editor__rule-meta">
    <span>${r.meta}</span>
    <span class="editor__rule-actions"><span class="editor__rule-dot" aria-hidden="true">·</span><button class="editor__rule-act" type="button" data-act="edit" aria-label="Edit rule ${r.no}">Edit</button><span class="editor__rule-dot" aria-hidden="true">·</span><button class="editor__rule-act" type="button" data-act="delete" aria-label="Delete rule ${r.no}">Delete</button></span>
  </span>
</li>`

const chipHTML = (c) => `
<button class="editor__chip" type="button" data-chip="${c.id}" data-state="idle" aria-pressed="false">
  <span class="editor__chip-mark" aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M2.5 6.4l2.4 2.4 4.6-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
  <span class="editor__chip-text">${c.say}</span>
</button>`

const screen = `
  ${appTopBar('Feed', 'Tue · 14 sources')}
  <div class="editor__rows">${ROWS.map(rowHTML).join('')}</div>
  ${convoBar(PLACEHOLDER)}`

export const html = `
<section class="editor section" id="editor" data-page data-world-lock="paper" aria-labelledby="editor-h">
  <div class="container">
    <header class="editor__head">
      <p class="eyebrow" data-reveal>07 · You’re the editor</p>
      <h2 id="editor-h" class="editor__h" data-reveal="lines"><span class="editor__h-line">Say “this doesn’t belong here.”</span><em class="i accent editor__h-line">It writes the rule down.</em></h2>
      <p class="lead editor__lead" data-reveal data-reveal-delay="0.1">Every platform keeps a model of you it never shows you. This one keeps its rules in a drawer you can open.</p>
    </header>

    <div class="editor__demo">
      <div class="editor__say">
        <div class="editor__chips" data-reveal>
          <p class="editor__chips-label">Tap to say it</p>
          <div class="editor__chips-list" role="group" aria-label="Instructions to the feed">${CHIPS.map(chipHTML).join('')}</div>
          <p class="editor__status" role="status" aria-live="polite"></p>
        </div>
        <div class="editor__body" data-reveal>
          <p>Tell Antiviral something doesn’t belong and it writes a durable, inspectable rule that re-ranks your feed. The rule lives on your device, in plain language. Open it, change it, delete it. Nothing you’ve decided is buried behind a “Not interested” button that quietly stops working in a week.</p>
          <p class="editor__close">Every item arrives with its reason attached. Not to reassure you. So you can overrule it. Don’t trust it. Check it.</p>
        </div>
      </div>

      <div class="editor__stage">
        <div class="editor__phone-wrap" data-reveal>
          ${phoneFrame(screen, { cls: 'editor__phone', label: 'Antiviral Feed on iPhone, re-ranking as you give it instructions', theme: 'dark' })}
        </div>
        <div class="editor__drawer" data-reveal data-reveal-delay="0.1">
          <div class="editor__drawer-handle" aria-hidden="true"></div>
          <div class="editor__drawer-head"><span class="editor__drawer-title">Rules</span><span class="editor__drawer-count"><b>${EARLIER.length}</b></span></div>
          <ol class="editor__rules">${EARLIER.map(ruleHTML).join('')}</ol>
          <p class="editor__drawer-note">Rules live on this device. Read them all. Change any.</p>
        </div>
      </div>
    </div>
  </div>
</section>`

const toEl = (markup) => { const t = document.createElement('template'); t.innerHTML = markup.trim(); return t.content.firstElementChild }

export function init(root) {
  const el = root.querySelector('#editor')
  if (!el) return
  const list = el.querySelector('.editor__rows')
  const convo = el.querySelector('.app-convo')
  const convoText = el.querySelector('.app-convo__text')
  const send = el.querySelector('.app-convo__send')
  const rules = el.querySelector('.editor__rules')
  const countEl = el.querySelector('.editor__drawer-count b')
  const status = el.querySelector('.editor__status')
  const chipEls = new Map(CHIPS.map((c) => [c.id, el.querySelector(`[data-chip="${c.id}"]`)]))

  const pool = [...BACKFILL]       // rows that fill in when one leaves
  const applied = new Map()        // chip id -> { li, record, cfg }
  const queue = []
  let running = false
  let nextNo = 14

  const setChip = (chip, state) => { chip.dataset.state = state; chip.setAttribute('aria-pressed', state === 'done' ? 'true' : 'false') }
  const say = (msg) => { status.textContent = msg }
  const updateCount = () => { countEl.textContent = String(rules.children.length) }
  const wait = (s) => new Promise((r) => gsap.delayedCall(dur(s), r))

  function typeText(node, text, cps) {
    const o = { n: 0 }
    node.textContent = ''
    return gsap.to(o, {
      n: text.length, duration: dur(text.length / cps), ease: 'none', snap: 'n',
      onUpdate: () => { node.textContent = text.slice(0, o.n) },
      onComplete: () => { node.textContent = text },
    })
  }

  // collapse / expand a row or a rule card by animating its box (only ever one at a time)
  const BOX = { height: 0, paddingTop: 0, paddingBottom: 0, borderTopWidth: 0, borderBottomWidth: 0, opacity: 0 }
  const collapse = (node, s = 0.45) => { gsap.set(node, { overflow: 'hidden' }); return gsap.to(node, { ...BOX, duration: dur(s), ease: 'power3.inOut' }) }
  const expand = (node, s = 0.45) => {
    gsap.set(node, { overflow: 'hidden' })
    return gsap.from(node, { ...BOX, duration: dur(s), ease: 'power3.out', clearProps: 'height,paddingTop,paddingBottom,borderTopWidth,borderBottomWidth,opacity,overflow' })
  }

  // FLIP the feed rows around a DOM mutation
  async function flip(mutate) {
    const rows = [...list.children]
    const before = rows.map((r) => r.getBoundingClientRect().top)
    mutate()
    const after = rows.map((r) => r.getBoundingClientRect().top)
    rows.forEach((r, i) => gsap.set(r, { y: before[i] - after[i] }))
    await gsap.to(rows, { y: 0, duration: dur(0.75), ease: 'power3.inOut', clearProps: 'transform' })
  }

  const swapWhy = (row, text) => {
    const whyEl = row.querySelector('.app-row__why')
    return gsap.timeline()
      .to(whyEl, { opacity: 0, duration: dur(0.18), onComplete: () => { whyEl.textContent = text } })
      .to(whyEl, { opacity: 1, duration: dur(0.3), clearProps: 'opacity' })
  }

  async function removeRow(row) {
    const idx = [...list.children].indexOf(row)
    row.classList.remove('is-target')
    await gsap.to(row, { x: -28, opacity: 0, duration: dur(0.32), ease: 'power2.in' })
    const fill = pool.shift()
    let fillEl = null
    if (fill) { fillEl = toEl(rowHTML(fill)); list.appendChild(fillEl) }
    await Promise.all([collapse(row, 0.45), fillEl ? expand(fillEl, 0.5) : null])
    row.remove()
    gsap.set(row, { clearProps: 'all' })
    return { row, idx, fill, fillEl }
  }
  async function restoreRow({ row, idx, fill, fillEl }) {
    if (fill) pool.unshift(fill)
    const kids = [...list.children].filter((r) => r !== fillEl)
    list.insertBefore(row, kids[idx] || fillEl || null)
    await Promise.all([expand(row, 0.5), fillEl ? collapse(fillEl, 0.45) : null])
    if (fillEl) fillEl.remove()
  }

  async function riseRow(row, why) {
    row.classList.remove('is-target')
    row.classList.add('is-rising')
    const idx = [...list.children].indexOf(row)
    const oldWhy = row.querySelector('.app-row__why').textContent
    await Promise.all([flip(() => list.prepend(row)), swapWhy(row, why)])
    row.classList.remove('is-rising')
    return { row, idx, oldWhy }
  }
  async function unriseRow({ row, idx, oldWhy }) {
    row.classList.add('is-rising')
    await Promise.all([
      flip(() => { const others = [...list.children].filter((r) => r !== row); list.insertBefore(row, others[idx] || null) }),
      swapWhy(row, oldWhy),
    ])
    row.classList.remove('is-rising')
  }

  async function writeRule(no, text) {
    const li = toEl(ruleHTML({ no, text, meta: 'written by you, just now' }))
    const textEl = li.querySelector('.editor__rule-text')
    const metaEl = li.querySelector('.editor__rule-meta')
    textEl.textContent = ''
    gsap.set(metaEl, { opacity: 0 })
    const next = [...rules.children].find((l) => Number(l.dataset.no) > no)   // a replayed number keeps its place
    rules.insertBefore(li, next || null)
    updateCount()
    li.classList.add('is-typing')
    await expand(li, 0.45)
    await typeText(textEl, text, 42)
    li.classList.remove('is-typing')
    li.classList.add('is-new')
    await gsap.to(metaEl, { opacity: 1, duration: dur(0.35), clearProps: 'opacity' })
    return li
  }

  async function clearConvo() {
    await gsap.to(convoText, { opacity: 0, duration: dur(0.25) })
    convoText.textContent = PLACEHOLDER
    convo.classList.remove('is-active')
    await gsap.to(convoText, { opacity: 1, duration: dur(0.3), clearProps: 'opacity' })
  }

  async function applyChip(id, fixedNo) {
    const cfg = CHIPS.find((c) => c.id === id)
    const chip = chipEls.get(id)
    setChip(chip, 'running')
    const row = list.querySelector(`[data-row="${cfg.target}"]`)
    if (row) row.classList.add('is-target')
    convo.classList.add('is-active')
    await typeText(convoText, cfg.say, 26)
    await wait(0.4)
    await gsap.to(send, { scale: 0.8, duration: dur(0.12), yoyo: true, repeat: 1, ease: 'power2.inOut', clearProps: 'transform' })
    await wait(0.15)
    let record = null
    if (row) record = cfg.action === 'rise' ? await riseRow(row, cfg.why) : await removeRow(row)
    const no = fixedNo ?? nextNo++
    const li = await writeRule(no, cfg.rule)
    li.__chip = id
    applied.set(id, { li, record, cfg, no })
    setChip(chip, 'done')
    say(`Rule ${no} written.`)
    tempo = 1.5
    await wait(0.6)
    await clearConvo()
  }

  // Replay a chip that has already been pressed: quietly take its rule back,
  // put the row where it was, then say it and write the same rule number again.
  async function replayChip(id) {
    const entry = applied.get(id)
    if (!entry) return applyChip(id)
    const { li, record, cfg, no } = entry
    applied.delete(id)
    if (li.isConnected) {
      if (li.__commit) li.__commit()
      await gsap.to(li, { x: -12, opacity: 0, duration: dur(0.2), ease: 'power2.in' })
      await collapse(li, 0.35)
      li.remove()
      updateCount()
    }
    if (record) { if (cfg.action === 'rise') await unriseRow(record); else await restoreRow(record) }
    await wait(0.2)
    return applyChip(id, no)
  }

  async function deleteRule(li) {
    if (!li.isConnected) return
    const id = li.__chip
    const entry = id ? applied.get(id) : null
    if (li.__commit) li.__commit()
    await gsap.to(li, { x: -12, opacity: 0, duration: dur(0.25), ease: 'power2.in' })
    await collapse(li, 0.4)
    li.remove()
    updateCount()
    if (entry) {
      applied.delete(id)
      if (entry.record) { if (entry.cfg.action === 'rise') await unriseRow(entry.record); else await restoreRow(entry.record) }
      setChip(chipEls.get(id), 'idle')
    }
    say(`Rule ${li.dataset.no} deleted.`)
  }

  // one serial queue for everything that touches the feed or the drawer
  function enqueue(job) { queue.push(job); pump() }
  function pump() {
    if (running || !queue.length) return
    running = true
    const job = queue.shift()
    const p = job.type === 'apply' ? applyChip(job.id) : job.type === 'replay' ? replayChip(job.id) : deleteRule(job.li)
    p.catch((e) => console.error('editor job failed', e)).then(() => { running = false; pump() })
  }

  const nudge = (chip) => gsap.fromTo(chip, { x: 0 }, { x: 3, duration: dur(0.06), repeat: 3, yoyo: true, ease: 'power1.inOut', clearProps: 'transform' })

  el.querySelector('.editor__chips-list').addEventListener('click', (e) => {
    const chip = e.target.closest('.editor__chip')
    if (!chip) return
    const state = chip.dataset.state
    if (state === 'queued' || state === 'running') { nudge(chip); return }
    setChip(chip, 'queued')
    enqueue({ type: state === 'done' ? 'replay' : 'apply', id: chip.dataset.chip })
  })

  // Edit: the rule text becomes editable in place. Enter or blur saves, Escape reverts.
  function toggleEdit(li) {
    if (li.classList.contains('is-editing')) { li.__commit && li.__commit(); return }
    const t = li.querySelector('.editor__rule-text')
    const btn = li.querySelector('[data-act="edit"]')
    const orig = t.textContent
    li.classList.add('is-editing')
    btn.textContent = 'Save'
    btn.setAttribute('aria-label', `Save rule ${li.dataset.no}`)
    t.contentEditable = 'plaintext-only'
    if (t.contentEditable !== 'plaintext-only') t.contentEditable = 'true'
    t.focus()
    const sel = window.getSelection()
    if (sel) { const r = document.createRange(); r.selectNodeContents(t); r.collapse(false); sel.removeAllRanges(); sel.addRange(r) }
    const onKey = (e) => {
      if (e.key === 'Enter') { e.preventDefault(); commit() }
      else if (e.key === 'Escape') { t.textContent = orig; commit() }
    }
    const onBlur = () => commit()
    t.addEventListener('keydown', onKey)
    t.addEventListener('blur', onBlur)
    function commit() {
      if (!li.classList.contains('is-editing')) return
      t.removeEventListener('keydown', onKey)
      t.removeEventListener('blur', onBlur)
      const v = t.textContent.replace(/\s+/g, ' ').trim()
      t.textContent = v || orig
      t.contentEditable = 'false'
      li.classList.remove('is-editing')
      btn.textContent = 'Edit'
      btn.setAttribute('aria-label', `Edit rule ${li.dataset.no}`)
      li.__commit = null
    }
    li.__commit = commit
  }

  rules.addEventListener('pointerdown', (e) => { if (e.target.closest('[data-act="edit"]')) e.preventDefault() })
  rules.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-act]')
    if (!btn) return
    const li = btn.closest('.editor__rule')
    if (btn.dataset.act === 'edit') { toggleEdit(li); return }
    if (li.__pending) return
    li.__pending = true
    li.classList.add('is-pending')
    enqueue({ type: 'delete', li })
  })

  // Auto-play the first instruction once, when the phone is in view.
  const first = CHIPS[0].id
  const autoplay = () => {
    if (applied.size || queue.length || running) return
    setChip(chipEls.get(first), 'queued')
    enqueue({ type: 'apply', id: first })
  }
  if (prefersReducedMotion) autoplay()
  else ScrollTrigger.create({ trigger: el.querySelector('.editor__phone-wrap'), start: 'top 45%', once: true, onEnter: autoplay })
}
