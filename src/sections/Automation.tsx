import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SectionTitle from '../components/SectionTitle'
import FlowDiagram from '../components/FlowDiagram'
import { ALL_LOGOS, Mark, type Logo } from '../logos'
import { automationTools } from '../data'

// The tools I automate with: one card each, with a small live flow (packets moving
// through the stages), drawn the same way as the project architecture diagrams.

// logo by title; tools without one (e.g. Power Automate) get their initials as a mark
const logoFor = (title: string): Logo =>
  ALL_LOGOS.find((l) => l.title === title) ?? {
    title,
    letter: title
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  }

export default function Automation() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-auto]',
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-autogrid]', start: 'top 80%' },
        },
      )
    },
    { scope: ref },
  )

  return (
    <section id="automation" ref={ref} className="relative mx-auto max-w-6xl px-4 pb-4 pt-20 sm:px-6">
      <SectionTitle index="03" cmd="ansible-playbook automate.yml" title="Automation" />
      <p className="-mt-6 mb-10 max-w-2xl text-muted">Tools I use to automate the boring parts.</p>

      <div data-autogrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {automationTools.map((t) => (
          <article
            data-auto
            data-lock
            key={t.name}
            className="group panel relative flex flex-col p-5 transition-colors duration-300 hover:border-hud"
          >
            <div className="flex items-center gap-3">
              <Mark logo={logoFor(t.logo)} className="h-8 w-8 shrink-0 text-fg/85 transition-colors duration-300 group-hover:text-hud" />
              <h3 className="text-lg font-bold text-fg">{t.name}</h3>
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{t.use}</p>
            <div className="mt-5 border border-line bg-black/30 p-2">
              <FlowDiagram compact stages={t.flow} focus={t.focus} tag={t.tag} />
            </div>
            {/* corner ticks, light up on hover like the skill cards */}
            <span aria-hidden className="absolute -left-px -top-px h-3 w-3 border-l border-t border-fg/60 transition-colors group-hover:border-hud" />
            <span aria-hidden className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-fg/60 transition-colors group-hover:border-hud" />
          </article>
        ))}
      </div>
    </section>
  )
}
