import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SectionTitle from '../components/SectionTitle'
import { siRedhat } from 'simple-icons'
import { certs, skillGroups } from '../data'

const hex = (i: number) => '0x' + ((i + 1) * 17).toString(16).toUpperCase().padStart(2, '0')

export default function Skills() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-card]',
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-grid]', start: 'top 80%' },
        },
      )
      // certificates "verify" one after another: red frame draws, then the card lands
      gsap.fromTo(
        '[data-cert]',
        { y: 24, autoAlpha: 0, clipPath: 'inset(0 100% 0 0)' },
        {
          y: 0,
          autoAlpha: 1,
          clipPath: 'inset(0 0% 0 0)',
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-certs]', start: 'top 85%' },
        },
      )
    },
    { scope: ref },
  )

  return (
    <section id="skills" ref={ref} className="relative mx-auto max-w-6xl px-4 pb-12 pt-32 sm:px-6">
      <SectionTitle index="02" cmd="ls /etc/skills.d/" title="Skills" />

      <div data-grid className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((g, i) => (
          <div
            data-card
            key={g.label}
            className="group panel relative p-6 transition-colors duration-300 hover:border-red"
          >
            <div aria-hidden className="font-mono text-[11px] font-bold uppercase text-red">{hex(i)} TEXT 0.99</div>
            <h3 className="mt-2 text-lg font-bold text-fg">{g.label}</h3>
            <p className="mt-1 text-sm text-muted">{g.note}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {g.tools.map((t) => (
                <li
                  key={t}
                  className="border border-line px-2.5 py-1 font-mono text-xs text-text transition-colors duration-300 group-hover:border-fg/30"
                >
                  {t}
                </li>
              ))}
            </ul>
            {/* corner ticks, light up red on hover */}
            <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-fg/60 transition-colors group-hover:border-red" />
            <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-fg/60 transition-colors group-hover:border-red" />
          </div>
        ))}
      </div>

      <div data-certs className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div aria-hidden className="font-mono text-xs font-bold uppercase text-red glow-red">
              0xC5 VERIFIED {certs.length}/{certs.length}
            </div>
            <h3 className="mt-1 text-2xl font-bold text-fg sm:text-3xl">Certifications</h3>
          </div>
          <p className="font-mono text-sm text-muted">
            <span className="text-fg">$</span> openssl verify ./certs/*
          </p>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {certs.map((c) => {
            const redHat = c.short !== 'ZCS'
            return (
              <li
                data-cert
                data-lock
                key={c.short}
                className="group relative flex flex-col border border-red/50 bg-red/[0.06] p-5 transition-colors duration-300 hover:border-red hover:bg-red/[0.12]"
              >
                <div className="flex items-start justify-between gap-3">
                  {redHat ? (
                    <svg viewBox="0 0 24 24" aria-hidden className="h-9 w-9 text-red">
                      <path d={siRedhat.path} fill="currentColor" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden className="h-9 w-9 text-red">
                      <rect x="1.5" y="1.5" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" />
                      <text x="12" y="17.5" textAnchor="middle" fontSize="15" fontWeight="700" fontFamily="JetBrains Mono, monospace" fill="currentColor">
                        Z
                      </text>
                    </svg>
                  )}
                  <span className="border border-ok/40 px-1.5 py-0.5 font-mono text-[11px] font-bold uppercase text-ok">
                    ✓ Certified
                  </span>
                </div>
                <div className="mt-5 font-mono text-xl font-bold uppercase leading-tight text-fg">{c.short}</div>
                <div className="mt-2 flex-1 text-sm leading-snug text-text">{c.name}</div>
                <div className="mt-4 border-t border-red/30 pt-3 font-mono text-xs text-muted">
                  ID <span className="text-fg">{c.id}</span>
                </div>
                {/* corner ticks like the skill cards */}
                <span aria-hidden className="absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-red" />
                <span aria-hidden className="absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-red" />
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
