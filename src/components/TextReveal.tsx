import { useEffect } from 'react'
import { reducedMotion } from '../motion'

// Page-wide text entrance, run once per element the first time it scrolls into view:
//  • headings (h2/h3/h4) "decrypt" letter by letter, like the section titles
//  • everything else eases in from a soft green-glowing blur (~0.9s), readable almost at once

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&'
const LOWER = 'abcdefghijklmnopqrstuvwxyz0123456789#%&'
const DIGITS = '0123456789'

// parts that already animate their own text, or that must stay as they are
const SKIP = [
  'h1', // hero name: letter-by-letter 3D reveal
  'svg',
  '[data-scramble]', // hero role line: has its own decrypt
  '[data-no-scramble]', // section titles: have their own decrypt
  '[data-count]', // count-up numbers
  '[data-rows]', // moving logo rows
  '[role="log"]', // terminal output types itself
  '.sr-only',
  'script',
  'style',
].join(',')

const HEADING = 'h2, h3, h4'
// the block a piece of text belongs to: it is revealed as one unit
const BLOCK = 'p, li, dt, dd, a, button, label, blockquote, td, th'

const HAS_ALNUM = /[A-Za-z0-9]/
const REFRESH_MS = 45 // how often unrevealed heading letters re-roll
const REVEAL_MS = 900
const STAGGER_MS = 45 // between blocks that appear together
const MAX_STAGGER_MS = 360
const EASE = 'cubic-bezier(0.33, 0, 0.2, 1)' // soft start, gentle settle: no snap

// Smooth focus-in: from dark and blurred, through a faint green glow, to sharp.
// Filter only, so it never fights the GSAP fades/slides that already run on cards (opacity, transform).
const glow = (a: number, r: number) => `drop-shadow(0 0 ${r}px rgba(61, 255, 139, ${a}))`
const REVEAL: Keyframe[] = [
  { filter: `brightness(0.15) blur(8px) ${glow(0, 0)}`, offset: 0 },
  { filter: `brightness(1.15) blur(2px) ${glow(0.35, 8)}`, offset: 0.45 },
  { filter: `brightness(1) blur(0px) ${glow(0, 0)}`, offset: 1 },
]

type Part = { node: Text; text: string; offset: number; last: string }
type Job = { parts: Part[]; total: number; start: number; dur: number; tick: number }

const pick = (set: string) => set[Math.floor(Math.random() * set.length)]
function noise(c: string) {
  if (c >= 'A' && c <= 'Z') return pick(UPPER)
  if (c >= 'a' && c <= 'z') return pick(LOWER)
  if (c >= '0' && c <= '9') return pick(DIGITS)
  return c // spaces, punctuation and symbols stay put
}

export default function TextReveal({ root = 'main' }: { root?: string }) {
  useEffect(() => {
    if (reducedMotion) return
    const host = document.querySelector(root)
    if (!host) return

    const seen = new WeakSet<Text>()
    const revealed = new WeakSet<Element>()
    const headings = new Map<Element, Text[]>() // heading → its text, waiting to be seen
    const jobs: Job[] = []
    let raf = 0

    // ---- headings: letter scramble ----
    const frame = (now: number) => {
      for (let i = jobs.length - 1; i >= 0; i--) {
        const job = jobs[i]
        const p = Math.min(1, (now - job.start) / job.dur)
        const reroll = now - job.tick >= REFRESH_MS
        if (reroll) job.tick = now
        const n = Math.floor(p * job.total)
        for (let k = job.parts.length - 1; k >= 0; k--) {
          const part = job.parts[k]
          // React changed this text while we were animating: its value wins
          if (part.node.nodeValue !== part.last) {
            job.parts.splice(k, 1)
            continue
          }
          if (p < 1 && !reroll) continue
          const shown = Math.max(0, Math.min(part.text.length, n - part.offset))
          let out = part.text.slice(0, shown)
          for (let c = shown; c < part.text.length; c++) out += noise(part.text[c])
          part.node.nodeValue = out
          part.last = out
        }
        if (p >= 1 || !job.parts.length) jobs.splice(i, 1)
      }
      raf = jobs.length ? requestAnimationFrame(frame) : 0
    }

    const scramble = (nodes: Text[]) => {
      const parts: Part[] = []
      let total = 0
      for (const node of nodes) {
        const text = node.nodeValue ?? ''
        if (!node.isConnected || !HAS_ALNUM.test(text)) continue
        parts.push({ node, text, offset: total, last: text })
        total += text.length
      }
      if (!parts.length) return
      const dur = Math.min(800, Math.max(400, 250 + total * 22))
      jobs.push({ parts, total, start: performance.now(), dur, tick: -Infinity })
      if (!raf) raf = requestAnimationFrame(frame)
    }

    // ---- everything else: smooth blur-in ----
    const reveal = (el: Element, delay: number) => {
      el.animate(REVEAL, { duration: REVEAL_MS, delay, easing: EASE, fill: 'backwards' })
    }

    const io = new IntersectionObserver(
      (entries) => {
        let order = 0
        for (const e of entries) {
          if (!e.isIntersecting) continue
          io.unobserve(e.target)
          const nodes = headings.get(e.target)
          if (nodes) {
            headings.delete(e.target)
            scramble(nodes)
          } else reveal(e.target, Math.min(MAX_STAGGER_MS, order++ * STAGGER_MS))
        }
      },
      { rootMargin: '0px 0px -6% 0px' },
    )

    const consider = (t: Text) => {
      if (seen.has(t)) return
      const parent = t.parentElement
      if (!parent || !HAS_ALNUM.test(t.nodeValue ?? '') || parent.closest(SKIP)) return
      seen.add(t)
      const heading = parent.closest(HEADING)
      if (heading) {
        const list = headings.get(heading)
        if (list) list.push(t)
        else {
          headings.set(heading, [t])
          io.observe(heading)
        }
        return
      }
      const block = parent.closest(BLOCK) ?? parent
      if (revealed.has(block)) return
      revealed.add(block)
      io.observe(block)
    }

    const collect = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) return consider(node as Text)
      if (node.nodeType !== Node.ELEMENT_NODE) return
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT)
      for (let t = walker.nextNode(); t; t = walker.nextNode()) consider(t as Text)
    }

    collect(host)
    // content that appears later (project reports, experience tabs) gets the same entrance
    const mo = new MutationObserver((muts) => {
      for (const m of muts) m.addedNodes.forEach(collect)
    })
    mo.observe(host, { childList: true, subtree: true })

    return () => {
      mo.disconnect()
      io.disconnect()
      cancelAnimationFrame(raf)
      // never leave half-scrambled text behind
      for (const job of jobs) for (const part of job.parts) if (part.node.nodeValue === part.last) part.node.nodeValue = part.text
    }
  }, [root])

  return null
}
