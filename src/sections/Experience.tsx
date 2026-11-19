import { useRef, useState, type KeyboardEvent } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { AnimatePresence, motion } from 'motion/react'
import SectionTitle from '../components/SectionTitle'
import CareerRail from '../components/CareerRail'
import { experience, type Job } from '../data'

function Bullets({ points, bright = false }: { points: string[]; bright?: boolean }) {
  return (
    <>
      {points.map((pt) => (
        <li key={pt} className={`flex gap-3 leading-relaxed ${bright ? 'text-text/90' : 'text-muted'}`}>
          <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 bg-fg/40" />
          {pt}
        </li>
      ))}
    </>
  )
}

// Big numbers for the current role; they count up when scrolled into view
// tile grid per number of highlights (literal classes so Tailwind keeps them)
const COLS: Record<number, string> = {
  1: 'sm:max-w-xs',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

function Highlights({ items }: { items: NonNullable<Job['highlights']> }) {
  return (
    <ul className={`mt-6 grid gap-3 ${COLS[items.length] ?? 'sm:grid-cols-3'}`}>
      {items.map((h) => {
        const n = parseInt(h.value.replace(/,/g, ''), 10)
        const suffix = h.value.replace(/[\d,]/g, '')
        return (
          <li key={h.label} className="flex items-center gap-4 border border-line bg-black/30 px-4 py-3 sm:block sm:p-4">
            <div className="w-24 shrink-0 font-mono text-2xl font-bold text-hud glow-hud sm:w-auto sm:text-4xl">
              <span data-count={n}>{n.toLocaleString('en-US')}</span>
              {suffix}
            </div>
            <div className="text-sm text-muted sm:mt-1">{h.label}</div>
          </li>
        )
      })}
    </ul>
  )
}

// Responsibilities split by topic: keyboard-friendly tabs (arrow keys move between them)
function Topics({ id, groups }: { id: string; groups: NonNullable<Job['groups']> }) {
  const [sel, setSel] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  const onKey = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (sel + step + groups.length) % groups.length
    setSel(next)
    tabs.current[next]?.focus()
  }

  const g = groups[sel]
  return (
    <div className="mt-7">
      <p aria-hidden className="font-mono text-xs text-muted">
        <span className="text-fg">$</span> grep -i "<span className="text-hud">{g.label.toLowerCase()}</span>" career.log
      </p>
      <div role="tablist" aria-label="Responsibilities by topic" className="mt-3 flex flex-wrap gap-2" onKeyDown={onKey}>
        {groups.map((t, j) => {
          const on = j === sel
          return (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[j] = el
              }}
              role="tab"
              id={`${id}-tab-${j}`}
              aria-selected={on}
              aria-controls={`${id}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => setSel(j)}
              className={`min-h-10 border px-3 font-mono text-xs uppercase tracking-wider transition-colors ${
                on ? 'border-hud bg-hud/10 text-hud' : 'border-line text-muted hover:border-fg/50 hover:text-fg'
              }`}
            >
              {t.label} <span className="ml-1 opacity-60">{t.points.length}</span>
            </button>
          )
        })}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={sel}
          id={`${id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${sel}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mt-5 space-y-3"
        >
          <Bullets points={g.points} bright />
        </motion.ul>
      </AnimatePresence>
    </div>
  )
}

export default function Experience() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // the timeline line draws itself as you scroll
      gsap.fromTo(
        '[data-line]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-log]', start: 'top 70%', end: 'bottom 60%', scrub: true },
        },
      )
      gsap.utils.toArray<HTMLElement>('[data-entry]').forEach((el) => {
        gsap.fromTo(
          el,
          { x: 40, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 82%' } },
        )
      })
      // headline numbers count up from zero
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count)
        const state = { v: 0 }
        gsap.to(state, {
          v: end,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.round(state.v).toLocaleString('en-US')
          },
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })
    },
    { scope: ref },
  )

  return (
    <section id="experience" ref={ref} className="relative mx-auto max-w-6xl px-4 py-32 sm:px-6">
      <SectionTitle index="05" cmd="tail -f /var/log/career.log" title="Experience" />
      <CareerRail />
      <div data-log className="relative pl-8 sm:pl-12">
        <div
          data-line
          className="absolute left-2 top-0 h-full w-px origin-top bg-gradient-to-b from-hud via-fg/30 to-transparent sm:left-4"
        />
        <div className="space-y-10">
          {experience.map((e, k) => {
            const current = e.time.includes('now')
            return (
              <div data-entry key={e.time} id={`exp-${k}`} className="relative scroll-mt-28">
                <span
                  className={`absolute -left-[29px] top-2 h-3 w-3 border-2 bg-bg sm:-left-[37px] ${
                    current ? 'border-hud shadow-[0_0_10px_rgba(61,255,139,0.7)]' : 'border-fg/40'
                  }`}
                />
                <div data-spot className={`panel relative p-5 sm:p-6 ${current ? 'sm:p-8' : ''}`}>
                  <div className="font-mono text-xs text-muted">
                    [{e.time}]{' '}
                    <span className={e.level === 'EDU' ? 'text-warn' : 'text-ok'}>{e.level}</span>{' '}
                    {e.level === 'EDU' ? 'education.service' : 'career.service'}:
                    {current && <span className="ml-2 text-hud">● active</span>}
                  </div>
                  <h3 className={`mt-2 font-bold ${current ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
                    {e.title} <span className={current ? 'text-hud' : 'text-muted'}>@ {e.company}</span>
                  </h3>
                  {e.highlights && <Highlights items={e.highlights} />}
                  {e.groups ? (
                    <Topics id={`job-${k}`} groups={e.groups} />
                  ) : (
                    <ul className="mt-4 space-y-2">
                      <Bullets points={e.points} />
                    </ul>
                  )}
                </div>
              </div>
            )
          })}
          <div data-entry className="font-mono text-sm text-muted">
            [now] <span className="text-warn">WAIT</span> next role: <span className="text-fg">your company?</span>
            <span className="caret ml-1" />
          </div>
        </div>
      </div>
    </section>
  )
}
