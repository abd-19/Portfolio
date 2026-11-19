import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { experience } from '../data'

// Career at a glance: one bar per role across the years, drawn from the `time` field
// of each job ("2025-05 → now", "2022 → 2024"). Bars grow in on scroll; each row links
// to that role's card below.

function toYear(s: string) {
  const t = s.trim()
  if (t === 'now') {
    const d = new Date()
    return d.getFullYear() + d.getMonth() / 12
  }
  const [y, m] = t.split('-').map(Number)
  return y + (m ? (m - 1) / 12 : 0)
}

const rows = experience.map((e, k) => {
  const [a, b] = e.time.split('→')
  return { k, title: e.title, company: e.company, edu: e.level === 'EDU', current: b.trim() === 'now', start: toYear(a), end: toYear(b) }
})
const MIN = Math.floor(Math.min(...rows.map((r) => r.start)))
const MAX = Math.max(...rows.map((r) => r.end))
const pct = (y: number) => ((y - MIN) / (MAX - MIN)) * 100
const YEARS = Array.from({ length: Math.floor(MAX) - MIN + 1 }, (_, i) => MIN + i)

const ROW = 'grid grid-cols-[7rem_1fr] items-center gap-x-4 sm:grid-cols-[14rem_1fr]'

function Gridlines() {
  return (
    <>
      {YEARS.map((y) => (
        <span key={y} aria-hidden className="absolute inset-y-0 w-px bg-line" style={{ left: `${pct(y)}%` }} />
      ))}
    </>
  )
}

export default function CareerRail() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-bar]',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.1, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: ref.current, start: 'top 85%' } },
      )
    },
    { scope: ref },
  )

  return (
    <div ref={ref} data-spot className="panel relative mb-12 p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-muted">
        <span>
          <span className="text-fg">$</span> timeline --since {MIN}
        </span>
        <span className="text-hud">● now</span>
      </div>

      {/* year axis */}
      <div aria-hidden className={ROW}>
        <span />
        <div className="relative h-5 font-mono text-[10px] text-muted">
          {YEARS.map((y, i) => (
            <span
              key={y}
              className={`absolute -translate-x-1/2 ${i % 2 ? 'hidden sm:inline' : ''}`}
              style={{ left: `${pct(y)}%` }}
            >
              {y}
            </span>
          ))}
        </div>
      </div>

      <ul>
        {rows.map((r) => (
          <li key={r.k}>
            <a href={`#exp-${r.k}`} className={`${ROW} group py-2`}>
              <span className="min-w-0">
                <span className="block truncate font-mono text-xs text-text transition-colors group-hover:text-hud">
                  {r.title}
                </span>
                <span className="hidden truncate text-xs text-muted sm:block">{r.company}</span>
              </span>
              <span className="relative block h-7">
                <Gridlines />
                <span
                  data-bar
                  className={`absolute top-1/2 h-2.5 origin-left -translate-y-1/2 transition-colors ${
                    r.current
                      ? 'bg-hud shadow-[0_0_14px_rgba(61,255,139,0.7)]'
                      : r.edu
                        ? 'border border-warn/70 bg-warn/15 group-hover:bg-warn/30'
                        : 'bg-fg/35 group-hover:bg-fg/70'
                  }`}
                  style={{ left: `${pct(r.start)}%`, width: `${pct(r.end) - pct(r.start)}%` }}
                />
                {r.current && (
                  <span aria-hidden className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2" style={{ left: '100%' }}>
                    <span className="absolute inset-0 animate-ping bg-hud" />
                    <span className="absolute inset-0 bg-hud" />
                  </span>
                )}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
