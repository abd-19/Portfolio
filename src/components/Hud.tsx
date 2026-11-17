import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile } from '../data'

// Fixed camera-style HUD that frames the whole site:
// corner brackets, telemetry, live timecode, section counter and scroll "PROC" meter.

const SECTIONS = [
  { id: 'top', label: 'IDENT' },
  { id: 'about', label: 'PROFILE' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'experience', label: 'LOGS' },
  { id: 'contact', label: 'CONTACT' },
]

const pad = (n: number, l = 2) => String(n).padStart(l, '0')

function Corner({ className }: { className: string }) {
  return <span className={`absolute h-6 w-6 border-fg/80 ${className}`} />
}

export default function Hud() {
  const [active, setActive] = useState(0)
  const [proc, setProc] = useState(0)
  const tcRef = useRef<HTMLSpanElement>(null)

  // session timecode HH:MM:SS, ticking once per second (calm, not per frame)
  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const s = Math.floor((Date.now() - start) / 1000)
      if (tcRef.current)
        tcRef.current.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // which section is on screen + overall scroll progress
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProc(Math.round((window.scrollY / Math.max(1, max)) * 100))
      const mid = window.innerHeight * 0.45
      let idx = 0
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= mid) idx = i
      })
      setActive(idx)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const sec = SECTIONS[active]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="pointer-events-none fixed inset-3 z-50 font-mono text-[11px] uppercase tracking-[0.15em] text-muted sm:inset-5 sm:text-xs"
    >
      {/* dark bands so HUD text stays readable over content */}
      <div className="absolute -inset-x-5 -top-5 h-28 bg-gradient-to-b from-bg via-bg/85 to-transparent" />
      <div className="absolute -inset-x-5 -bottom-5 h-28 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
      <Corner className="left-0 top-0 border-l border-t" />
      <Corner className="right-0 top-0 border-r border-t" />
      <Corner className="bottom-0 left-0 border-b border-l" />
      <Corner className="bottom-0 right-0 border-b border-r" />

      {/* top telemetry + nav */}
      <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-4 sm:inset-x-6">
        <div className="pointer-events-auto space-y-1">
          <a href="#top" className="block text-fg">
            ~/{profile.handle}
          </a>
          <div aria-hidden className="hidden sm:block">SSH + PROM SCRAPE_</div>
        </div>

        <nav aria-label="Sections" className="pointer-events-auto hidden gap-1 lg:flex">
          {SECTIONS.slice(1).map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === i + 1 ? 'location' : undefined}
              className={`px-2 py-1.5 transition-colors hover:text-fg ${active === i + 1 ? 'text-red' : 'text-muted'}`}
            >
              {active === i + 1 ? '▸ ' : ''}
              {s.label}
            </a>
          ))}
        </nav>

        <div aria-hidden className="space-y-1 text-right">
          <div>
            <span className="rec mr-2 inline-block h-2 w-2 bg-red align-middle" />
            TC <span ref={tcRef}>00:00:00</span>
          </div>
          <div className="text-muted">LATENCY 12 MS</div>
        </div>
      </div>

      {/* bottom-left: section counter like "7 / 20  TRACKING" */}
      <div aria-hidden className="absolute bottom-4 left-4 hidden sm:bottom-6 sm:left-6 sm:block">
        <div className="flex items-stretch">
          <div className="flex w-12 flex-col items-center justify-center bg-redfill py-1 text-white sm:w-16">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={active}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-xl font-bold leading-none tracking-normal sm:text-3xl"
              >
                {active + 1}
              </motion.span>
            </AnimatePresence>
            <span className="text-[9px] opacity-80">/ {pad(SECTIONS.length)}</span>
          </div>
          <div className="flex items-center bg-black/85 px-4 sm:px-6">
            <AnimatePresence mode="wait">
              <motion.span
                key={sec.label}
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                exit={{ clipPath: 'inset(0 0 0 100%)' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="text-sm font-bold tracking-[0.25em] text-fg sm:text-xl"
              >
                {sec.label}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* bottom-right: scroll progress as processing meter */}
      <div aria-hidden className="absolute bottom-4 right-4 w-28 text-right sm:bottom-6 sm:right-6 sm:w-40">
        <div className="mb-1.5 h-px w-full bg-line">
          <div className="h-full bg-fg" style={{ width: `${proc}%` }} />
        </div>
        PROC {pad(proc, 3)}%
      </div>
    </motion.div>
  )
}
