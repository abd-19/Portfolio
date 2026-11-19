import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SectionTitle from '../components/SectionTitle'
import { contactLinks, profile } from '../data'

// The ending: one wide "channel open" panel pointing to LinkedIn, then the footer.
export default function Contact() {
  const ref = useRef<HTMLElement>(null)
  const links = contactLinks

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-tx]',
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '[data-tx]', start: 'top 85%' } },
      )
      gsap.fromTo(
        '[data-big]',
        { scale: 0.92, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '[data-big]', start: 'top 85%' } },
      )
    },
    { scope: ref },
  )

  return (
    <section id="contact" ref={ref} className="relative mx-auto max-w-6xl px-4 pb-44 pt-32 sm:px-6">
      <SectionTitle index="06" cmd="ssh guest@contact" title="Get in touch" />

      <div data-tx data-spot className="panel relative p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs uppercase tracking-wider">
          <span className="flex items-center gap-2 text-hud">
            <span className="relative inline-block h-2 w-2">
              <span className="absolute inset-0 animate-ping bg-hud" />
              <span className="absolute inset-0 bg-hud" />
            </span>
            Channel open
          </span>
          <span className="text-muted">
            {profile.location} · UTC+3
          </span>
        </div>

        <h3 data-big className="mt-8 text-4xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
          Let's keep it <span className="text-hud glow-hud">running.</span>
        </h3>
        <p className="mt-5 max-w-xl text-lg text-muted">
          Need infrastructure built, automated or rescued? Message me on LinkedIn.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 border-t border-line pt-8 sm:grid-cols-2">
          {links.map(({ key: k, label, href }) => (
            <a
              key={k}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group flex min-w-0 items-center justify-between gap-6 border border-hud/40 bg-hud/[0.05] p-5 font-mono transition-colors hover:border-hud hover:bg-hud/[0.1]"
            >
              <span className="min-w-0">
                <span className="block text-xs text-muted">$ open {k}</span>
                <span className="mt-1 block truncate text-sm text-fg sm:text-base">{label}</span>
              </span>
              <span aria-hidden className="text-xl text-hud transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </a>
          ))}
        </div>

        {/* corner ticks */}
        <span aria-hidden className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-hud" />
        <span aria-hidden className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-hud" />
      </div>

      <footer className="mt-24 flex flex-col justify-between gap-2 border-t border-line pt-6 font-mono text-xs text-muted sm:flex-row">
        <span>
          © {new Date().getFullYear()} {profile.name} — served from GitHub Pages
        </span>
        <span>
          <span className="text-ok">●</span> all systems operational
        </span>
      </footer>
    </section>
  )
}
