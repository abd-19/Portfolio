import { useEffect, useRef } from 'react'

// Motion-tracking trail: as the cursor moves it drops feature points (small squares),
// links them with thin lines like a KLT tracker, and tags some with telemetry labels.
// Everything decays in under a second, and nothing runs while the mouse is still.

type Point = { x: number; y: number; life: number; red: boolean; label: string | null }

const SPACING = 34 // px between dropped points
const LIFE = 50 // frames
const MAX_POINTS = 40

const hex = () => '0x' + Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0')
const LABELS = ['AMP', 'TRK', 'VEC', 'LCK', 'SIG']

export default function TrackTrail() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const pts: Point[] = []
    let raf = 0
    let running = false
    let lastX = -1
    let lastY = -1
    let count = 0

    const resize = () => {
      canvas.width = innerWidth * dpr
      canvas.height = innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const drop = (x: number, y: number) => {
      count++
      pts.push({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 14,
        life: LIFE,
        red: count % 3 === 0,
        label: count % 5 === 0 ? `${hex()} ${LABELS[count % LABELS.length]} ${(0.7 + Math.random() * 0.29).toFixed(2)}` : null,
      })
      if (pts.length > MAX_POINTS) pts.shift()
    }

    const frame = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      for (let i = pts.length - 1; i >= 0; i--) if (--pts[i].life <= 0) pts.splice(i, 1)

      // connecting lines between consecutive points
      ctx.lineWidth = 1
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1]
        const b = pts[i]
        const t = Math.min(a.life, b.life) / LIFE
        ctx.strokeStyle = `rgba(242, 242, 242, ${0.35 * t})`
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }

      // feature points + labels
      ctx.font = '600 9px "JetBrains Mono", monospace'
      for (const p of pts) {
        const t = p.life / LIFE
        const s = p.red ? 8 : 5
        ctx.strokeStyle = p.red ? `rgba(255, 42, 42, ${t})` : `rgba(242, 242, 242, ${0.7 * t})`
        ctx.strokeRect(Math.round(p.x - s / 2) + 0.5, Math.round(p.y - s / 2) + 0.5, s, s)
        if (p.red) {
          ctx.fillStyle = `rgba(255, 42, 42, ${t})`
          ctx.fillRect(Math.round(p.x) - 1, Math.round(p.y) - 1, 2, 2)
        }
        if (p.label) {
          // short leader line, then the label
          ctx.strokeStyle = `rgba(255, 42, 42, ${0.8 * t})`
          ctx.beginPath()
          ctx.moveTo(p.x + 5, p.y - 5)
          ctx.lineTo(p.x + 16, p.y - 14)
          ctx.stroke()
          ctx.fillStyle = `rgba(255, 42, 42, ${t})`
          ctx.fillText(p.label, p.x + 19, p.y - 14)
        }
      }

      if (pts.length) raf = requestAnimationFrame(frame)
      else running = false
    }

    const onMove = (e: MouseEvent) => {
      if (lastX < 0) {
        lastX = e.clientX
        lastY = e.clientY
        return
      }
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY)
      if (dist < SPACING) return
      // fill in points along fast movements so the trail stays continuous
      const steps = Math.min(4, Math.floor(dist / SPACING))
      for (let i = 1; i <= steps; i++) {
        drop(lastX + ((e.clientX - lastX) * i) / steps, lastY + ((e.clientY - lastY) * i) / steps)
      }
      lastX = e.clientX
      lastY = e.clientY
      if (!running) {
        running = true
        raf = requestAnimationFrame(frame)
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[65] h-full w-full" aria-hidden />
}
