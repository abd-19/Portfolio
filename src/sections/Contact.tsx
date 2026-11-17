import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SectionTitle from '../components/SectionTitle'
import { contactLinks, profile } from '../data'

export default function Contact() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('[data-big]', {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-big]', start: 'top 85%' },
      })
      gsap.from('[data-link]', {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        scrollTrigger: { trigger: '[data-links]', start: 'top 90%' },
      })
    },
    { scope: ref },
  )


  return (
    <section id="contact" ref={ref} className="relative mx-auto max-w-6xl px-4 pb-44 pt-32 sm:px-6">
      <SectionTitle index="05" cmd="ssh guest@contact" title="Get in touch" />
      <h3 data-big className="text-5xl font-bold leading-tight sm:text-7xl">
        Let's keep it running.
      </h3>
      <p className="mt-6 max-w-xl text-lg text-muted">
        Need someone to build, automate or rescue your infrastructure? My inbox is always listening on port 25.
      </p>
      <div data-links className={`mt-10 grid gap-4 font-mono ${contactLinks.length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
        {contactLinks.map(({ key: k, label, href, external }) => (
          <div data-link key={k}>
          <a
            href={href}
            target={external ? '_blank' : undefined}
            rel="noreferrer"
            className="panel group block p-5 transition hover:-translate-y-1 hover:border-fg hover:shadow-[0_0_30px_-8px_rgba(255,255,255,0.6)]"
          >
            <div className="text-xs text-muted">$ open {k}</div>
            <div className="mt-2 truncate text-fg">{label}</div>
            <div className="mt-3 text-xs text-muted transition group-hover:text-hud">connect →</div>
          </a>
          </div>
        ))}
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
