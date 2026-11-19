import { useEffect, useMemo, useRef } from 'react'
import { ALL_LOGOS, Mark, type Logo } from '../logos'
import { reducedMotion } from '../motion'

// Faint logos of every skill floating behind the whole page.
// • each one bobs and tilts on its own slow loop (CSS)
// • scrolling carries them upward at different speeds by depth (parallax), wrapping around
// • the mouse nudges them a little, nearer ones more
// Most sit in the side margins so they never compete with the text in the middle.

type Floater = {
  logo: Logo
  x: number // % of viewport width
  base: number // 0..1 position along the vertical track
  depth: number // 0 = far, 1 = near
  size: number // px
  opacity: number
  green: boolean
  dur: number // s, bob loop
  delay: number // s
  rot: number // deg, bob tilt
}

// small seeded random so the layout is the same on every visit
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

function layout(logos: Logo[]): Floater[] {
  const r = rng(7)
  return logos.map((logo, i) => {
    const depth = r()
    const side = i % 3 !== 2 // two of every three live in the side margins
    const x = side ? (i % 2 ? 2 + r() * 15 : 83 + r() * 13) : 20 + r() * 60
    return {
      logo,
      x,
      base: (i + r() * 0.8) / logos.length,
      depth,
      size: Math.round(36 + depth * 84),
      opacity: side ? 0.08 + depth * 0.08 : 0.035 + depth * 0.03,
      green: i % 4 === 0,
      dur: 9 + r() * 8,
      delay: -r() * 12,
      rot: (r() - 0.5) * 24,
    }
  })
}

export default function FloatingLogos() {
  const ref = useRef<HTMLDivElement>(null)
  const items = useMemo(() => layout(ALL_LOGOS), [])

  useEffect(() => {
    const host = ref.current
    if (!host) return
    const nodes = [...host.querySelectorAll<HTMLElement>('[data-floater]')]
    // phones: fewer, so the small screen stays calm
    const mobile = window.matchMedia('(max-width: 767px)').matches
    if (mobile)
      nodes.forEach((n, i) => {
        if (i % 2) n.style.display = 'none'
        else n.style.scale = '0.6'
        const inner = n.firstElementChild as HTMLElement
        inner.style.opacity = String(items[i].opacity * 0.6)
      })

    let raf = 0
    let mx = 0
    let my = 0
    let cx = 0
    let cy = 0

    const place = () => {
      const vh = window.innerHeight
      const track = vh * 1.3
      const y0 = window.scrollY
      nodes.forEach((n, i) => {
        const f = items[i]
        const speed = 0.12 + f.depth * 0.45
        const y = ((((f.base * track - y0 * speed) % track) + track) % track) - vh * 0.15
        n.style.transform = `translate3d(${cx * f.depth * 40}px, ${y + cy * f.depth * 26}px, 0)`
      })
    }

    const loop = () => {
      cx += (mx - cx) * 0.06
      cy += (my - cy) * 0.06
      place()
      raf = Math.abs(mx - cx) + Math.abs(my - cy) > 0.002 ? requestAnimationFrame(loop) : 0
    }
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5
      my = e.clientY / window.innerHeight - 0.5
      wake()
    }

    place()
    host.style.opacity = '1'
    if (reducedMotion) return // static layout, no drifting

    window.addEventListener('scroll', wake, { passive: true })
    window.addEventListener('resize', wake)
    window.addEventListener('mousemove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', wake)
      window.removeEventListener('resize', wake)
      window.removeEventListener('mousemove', onMove)
    }
  }, [items])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-0 transition-opacity duration-[1500ms]"
      // logos stay strong in the side margins and fade behind the reading column
      style={{
        maskImage:
          'linear-gradient(to right, #000 calc(50% - 640px), rgba(0,0,0,0.25) calc(50% - 470px), rgba(0,0,0,0.25) calc(50% + 470px), #000 calc(50% + 640px))',
      }}
    >
      {items.map((f) => (
        <div
          key={f.logo.title}
          data-floater
          className="absolute top-0 will-change-transform"
          style={{ left: `${f.x}%`, marginLeft: -f.size / 2 }}
        >
          <div
            className="float-bob"
            style={
              {
                '--dur': `${f.dur}s`,
                '--delay': `${f.delay}s`,
                '--rot': `${f.rot}deg`,
                width: f.size,
                height: f.size,
                opacity: f.opacity,
                filter: f.depth < 0.3 ? 'blur(1.5px)' : undefined,
              } as React.CSSProperties
            }
          >
            <Mark logo={f.logo} className={`h-full w-full ${f.green ? 'text-hud' : 'text-fg'}`} />
          </div>
        </div>
      ))}
    </div>
  )
}
