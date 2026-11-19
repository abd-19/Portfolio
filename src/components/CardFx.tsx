import { useEffect } from 'react'
import { reducedMotion } from '../motion'

// Card life, for every element that opts in:
//  • [data-spot] — a soft green spotlight follows the cursor (CSS reads --mx / --my)
//  • [data-tilt] — the card leans a few degrees toward the cursor, then eases back
// One delegated pointer listener for the whole page; nothing runs without a mouse.

const MAX_TILT = 5 // degrees
const EASE = 0.14

type Tilt = { cx: number; cy: number; tx: number; ty: number }

export default function CardFx() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const tilts = new Map<HTMLElement, Tilt>()
    let active: HTMLElement | null = null
    let raf = 0

    const loop = () => {
      for (const [el, t] of tilts) {
        t.cx += (t.tx - t.cx) * EASE
        t.cy += (t.ty - t.cy) * EASE
        const resting = t.tx === 0 && t.ty === 0 && Math.abs(t.cx) < 0.02 && Math.abs(t.cy) < 0.02
        if (resting) {
          el.style.transform = '' // hand the element back untouched
          tilts.delete(el)
        } else el.style.transform = `perspective(900px) rotateX(${t.cx.toFixed(2)}deg) rotateY(${t.cy.toFixed(2)}deg)`
      }
      raf = tilts.size ? requestAnimationFrame(loop) : 0
    }
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }

    const release = (el: HTMLElement) => {
      const t = tilts.get(el)
      if (t) {
        t.tx = 0
        t.ty = 0
        wake()
      }
    }

    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null
      const spot = target?.closest<HTMLElement>('[data-spot]')
      if (spot) {
        const r = spot.getBoundingClientRect()
        spot.style.setProperty('--mx', `${e.clientX - r.left}px`)
        spot.style.setProperty('--my', `${e.clientY - r.top}px`)
      }

      if (reducedMotion) return
      const tilt = target?.closest<HTMLElement>('[data-tilt]') ?? null
      if (tilt !== active) {
        if (active) release(active)
        active = tilt
      }
      if (!tilt) return
      const r = tilt.getBoundingClientRect()
      const t = tilts.get(tilt) ?? { cx: 0, cy: 0, tx: 0, ty: 0 }
      t.tx = ((e.clientY - r.top) / r.height - 0.5) * -2 * MAX_TILT
      t.ty = ((e.clientX - r.left) / r.width - 0.5) * 2 * MAX_TILT
      tilts.set(tilt, t)
      wake()
    }
    const onLeave = () => {
      if (active) release(active)
      active = null
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', onLeave, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', onLeave)
      for (const el of tilts.keys()) el.style.transform = ''
    }
  }, [])

  return null
}
