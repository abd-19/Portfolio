import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SectionTitle from '../components/SectionTitle'
import { experience } from '../data'

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
        gsap.from(el, {
          x: 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
        })
      })
    },
    { scope: ref },
  )

  return (
    <section id="experience" ref={ref} className="relative mx-auto max-w-6xl px-4 py-32 sm:px-6">
      <SectionTitle index="04" cmd="tail -f /var/log/career.log" title="Experience" />
      <div data-log className="relative pl-8 sm:pl-12">
        <div
          data-line
          className="absolute left-2 top-0 h-full w-px origin-top bg-gradient-to-b from-fg via-red to-transparent sm:left-4"
        />
        <div className="space-y-10">
          {experience.map((e) => (
            <div data-entry key={e.time} className="relative">
              <span className="absolute -left-[29px] top-2 h-3 w-3 border-2 border-red bg-bg sm:-left-[37px]" />
              <div className="panel p-5 sm:p-6">
                <div className="font-mono text-xs text-muted">
                  [{e.time}]{' '}
                  <span className={e.level === 'EDU' ? 'text-red' : 'text-ok'}>{e.level}</span>{' '}
                  {e.level === 'EDU' ? 'education.service' : 'career.service'}:
                </div>
                <h3 className="mt-2 text-xl font-bold sm:text-2xl">
                  {e.title} <span className="text-red">@ {e.company}</span>
                </h3>
                <ul className={`mt-4 grid gap-x-8 gap-y-2 text-muted ${e.points.length > 5 ? 'lg:grid-cols-2' : ''}`}>
                  {e.points.map((pt) => (
                    <li key={pt} className="flex gap-3 leading-relaxed">
                      <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 bg-red" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <div data-entry className="font-mono text-sm text-muted">
            [now] <span className="text-warn">WAIT</span> next role: <span className="text-fg">your company?</span>
            <span className="caret ml-1" />
          </div>
        </div>
      </div>
    </section>
  )
}
