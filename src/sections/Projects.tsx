import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { AnimatePresence, motion } from 'motion/react'
import SectionTitle from '../components/SectionTitle'
import FlowDiagram from '../components/FlowDiagram'
import { projects, type Project } from '../data'

const STEPS: [keyof Project, string, string][] = [
  ['problem', 'Problem', 'text-warn'],
  ['investigation', 'Investigation', 'text-hud'],
  ['fix', 'Fix', 'text-fg'],
  ['result', 'Result', 'text-ok'],
]

const hex = (i: number) => '0x' + ((i + 3) * 29).toString(16).toUpperCase().padStart(2, '0')

function Report({ p }: { p: Project }) {
  return (
    <div>
      <p className="font-mono text-xs text-muted">
        <span className="text-fg">$</span> kubectl describe pod <span className="text-fg">{p.name}</span>
      </p>
      <ol className="relative mt-5 space-y-5 border-l border-line pl-5">
        {STEPS.map(([key, label, color]) => (
          <li key={key} className="relative">
            <span aria-hidden className={`absolute -left-[25px] top-1.5 h-2 w-2 bg-current ${color}`} />
            <div className={`font-mono text-xs font-bold uppercase tracking-wider ${color}`}>{label}</div>
            <p className="mt-1 leading-relaxed text-text/90">{p[key] as string}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Stack({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((s) => (
        <li key={s} className="border border-line px-2.5 py-1 font-mono text-xs text-text">
          {s}
        </li>
      ))}
    </ul>
  )
}

export default function Projects() {
  const ref = useRef<HTMLElement>(null)
  const featured = projects.find((p) => p.featured) ?? projects[0]
  const rest = projects.filter((p) => p !== featured)
  const [open, setOpen] = useState<string | null>(rest[0]?.id ?? null)
  const selected = rest.find((p) => p.id === open)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-featured]',
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-featured]', start: 'top 80%' },
        },
      )
      gsap.fromTo(
        '[data-pcard]',
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-pcards]', start: 'top 85%' },
        },
      )
    },
    { scope: ref },
  )

  return (
    <section id="projects" ref={ref} className="relative mx-auto max-w-6xl px-4 py-32 sm:px-6">
      <SectionTitle index="03" cmd="kubectl get pods -n projects" title="Projects" />
      <p className="-mt-6 mb-10 max-w-2xl text-muted">
        What I build and run at Earthlink ISP. Each project is written as an incident report: the problem, how I
        investigated it, the fix and the result.
      </p>

      {/* featured project: diagram + full report, always visible */}
      <article data-featured className="panel brackets grid gap-10 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider">
            <span className="bg-hudfill px-2 py-0.5 font-bold text-black">Featured</span>
            <span className="text-muted">{featured.since}</span>
            <span className="text-ok">● Running</span>
          </div>
          <h3 className="mt-4 text-2xl font-bold text-fg sm:text-3xl">{featured.title}</h3>
          <p className="mt-1 font-mono text-xs text-muted">pod/{featured.name}</p>
          <p className="mt-4 text-lg leading-relaxed text-text">{featured.summary}</p>
          <div className="mt-8 border border-line bg-black/30 p-3 sm:p-4">
            <FlowDiagram stages={featured.flow} pairs={featured.pairs} focus={1} tag="0x3A LOCK 50+ HOSTS" />
          </div>
          <div className="mt-6">
            <Stack items={featured.stack} />
          </div>
        </div>
        <Report p={featured} />
      </article>

      {/* other projects: pick one to open its report + diagram */}
      <div data-pcards className="mt-6 grid gap-4 sm:grid-cols-2">
        {rest.map((p, i) => {
          const isOpen = open === p.id
          return (
            <button
              data-pcard
              key={p.id}
              aria-expanded={isOpen}
              aria-controls="project-detail"
              onClick={() => setOpen(isOpen ? null : p.id)}
              className={`group relative flex flex-col border p-5 text-left transition-colors duration-300 ${
                isOpen ? 'border-hud bg-hud/[0.07]' : 'panel hover:border-fg/50'
              }`}
            >
              <span aria-hidden className="font-mono text-[11px] font-bold uppercase text-hud">
                {hex(i)} TRK 0.9{i + 4}
              </span>
              <span className="mt-2 font-mono text-lg font-bold uppercase tracking-wide text-fg">{p.title}</span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.summary}</span>
              <span className="mt-4 flex items-center justify-between font-mono text-xs uppercase tracking-wider">
                <span className="text-ok">● Running</span>
                <span className={isOpen ? 'text-hud' : 'text-fg group-hover:text-hud'}>
                  {isOpen ? 'Close report ×' : 'Open report →'}
                </span>
              </span>
              <span aria-hidden className={`absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 ${isOpen ? 'border-hud' : 'border-fg/60'}`} />
              <span aria-hidden className={`absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 ${isOpen ? 'border-hud' : 'border-fg/60'}`} />
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {selected && (
          <motion.article
            key={selected.id}
            id="project-detail"
            aria-label={`${selected.title} incident report`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="panel mt-4 grid gap-10 border-hud/40 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]"
          >
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-muted">{selected.since}</div>
              <h3 className="mt-2 text-xl font-bold text-fg sm:text-2xl">{selected.title}</h3>
              <p className="mt-1 font-mono text-xs text-muted">pod/{selected.name}</p>
              <div className="mt-6 border border-line bg-black/30 p-3 sm:p-4">
                <FlowDiagram
                  stages={selected.flow}
                  pairs={selected.pairs}
                  focus={selected.focus ?? selected.flow.length - 2}
                  tag={selected.tag}
                />
              </div>
              <div className="mt-6">
                <Stack items={selected.stack} />
              </div>
            </div>
            <Report p={selected} />
          </motion.article>
        )}
      </AnimatePresence>

      {/* closing note: these are a sample, not the full list */}
      <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-sm text-muted">
          <span className="text-fg">$</span> kubectl get pods -n projects{' '}
          <span className="text-hud">--show-more</span>
          <span className="mt-2 block font-sans text-base text-text">
            These are just a few examples of my projects. There's more I've built and run.
          </span>
        </p>
        <a
          href="#contact"
          className="shrink-0 border border-fg/60 px-5 py-3 font-mono text-sm uppercase tracking-wider text-fg transition-colors hover:border-hud hover:text-hud"
        >
          Ask me about the rest →
        </a>
      </div>
    </section>
  )
}
