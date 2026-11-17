import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Mark, ROWS, type Logo } from '../logos'
import { reducedMotion } from '../motion'

function Chip({ logo }: { logo: Logo }) {
  return (
    <div
      data-lock
      className="group flex shrink-0 items-center gap-3 border border-line bg-panel/85 px-5 py-4 transition-colors duration-200 hover:border-hud"
    >
      <Mark logo={logo} className="h-8 w-8 text-fg/85 transition-colors duration-200 group-hover:text-hud" />
      <span className="whitespace-nowrap font-mono text-sm uppercase tracking-wider text-muted transition-colors group-hover:text-fg">
        {logo.title}
      </span>
    </div>
  )
}

const total = ROWS.flat().length

export default function TechStack() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      const trigger = { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 }

      // rows fly sideways in alternating directions as the page scrolls
      gsap.utils.toArray<HTMLElement>('[data-row]').forEach((row, i) => {
        const dir = i % 2 === 0 ? 1 : -1
        const travel = 18 + i * 6 // % of row width
        gsap.fromTo(
          row,
          { xPercent: dir > 0 ? -5 : -5 - travel },
          { xPercent: dir > 0 ? -5 - travel : -5, ease: 'none', scrollTrigger: { ...trigger } },
        )
      })

      // lean into the scroll: faster scrolling skews the rows, then they settle back
      const skew = gsap.quickTo('[data-rows]', 'skewX', { duration: 0.5, ease: 'power3.out' })
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => skew(gsap.utils.clamp(-8, 8, self.getVelocity() / -300)),
        onLeave: () => skew(0),
        onLeaveBack: () => skew(0),
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} aria-labelledby="stack-title" className="relative overflow-hidden pb-24 pt-12">
      <div className="relative mx-auto mb-10 max-w-6xl px-4 sm:px-6">
        <div aria-hidden className="font-mono text-xs font-bold uppercase text-muted">
          0x7E TRACKING {total} OBJECTS
        </div>
        <h2 id="stack-title" className="mt-1 text-2xl font-bold text-fg sm:text-3xl">
          Stack in production
        </h2>
        <p className="mt-2 font-mono text-sm text-muted">
          <span className="text-fg">$</span> kubectl get nodes --all-namespaces
        </p>
      </div>

      {/* screen readers get one clean list instead of the repeated moving rows */}
      <ul className="sr-only">
        {ROWS.flat().map((l) => (
          <li key={l.title}>{l.title}</li>
        ))}
      </ul>

      <div
        data-rows
        aria-hidden
        className="relative space-y-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        {ROWS.map((row, i) =>
          reducedMotion ? (
            <div key={i} className="mx-auto flex max-w-6xl flex-wrap justify-center gap-4 px-4">
              {row.map((l) => (
                <Chip key={l.title} logo={l} />
              ))}
            </div>
          ) : (
            <div key={i} data-row className="flex w-max gap-4">
              {/* repeated so the row always covers the screen while it travels */}
              {[0, 1, 2].flatMap((rep) => row.map((l) => <Chip key={`${rep}-${l.title}`} logo={l} />))}
            </div>
          ),
        )}
      </div>
    </section>
  )
}
