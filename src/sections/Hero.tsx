import { useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import Terminal from '../components/Terminal'
import { profile, stats } from '../data'
import { reducedMotion } from '../motion'

const CHARS = '!<>-_\\/[]{}—=+*^?#01'

export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!ready) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // "decrypt" the role text: scramble each char until it settles
      const role = ref.current!.querySelector<HTMLElement>('[data-scramble]')!
      const final = role.dataset.scramble!
      const state = { p: 0 }
      tl.to(state, {
        p: 1,
        duration: 1.4,
        ease: 'none',
        onUpdate: () => {
          const n = Math.floor(state.p * final.length)
          role.textContent =
            final.slice(0, n) +
            final
              .slice(n)
              .split('')
              .map((c) => (c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]))
              .join('')
        },
      })

      const split = SplitText.create('[data-split]', { type: 'chars' })
      tl.from(split.chars, { y: 80, opacity: 0, rotateX: -90, stagger: 0.03, duration: 0.8 }, 0.1)
      tl.from('[data-fade]', { y: 20, opacity: 0, stagger: 0.1, duration: 0.7 }, 0.6)
      tl.from('[data-box]', { clipPath: 'inset(0 100% 0 0)', duration: 0.6 }, 0.05)
      tl.from('[data-term]', { x: 60, opacity: 0, scale: 0.95, duration: 1 }, 0.4)

      // parallax out on scroll (skipped for reduced motion)
      if (!reducedMotion) gsap.to('[data-hero-inner]', {
        yPercent: -15,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    },
    { scope: ref, dependencies: [ready] },
  )

  return (
    <section id="top" ref={ref} className="relative flex min-h-dvh items-center pb-36 pt-28">
      <div
        data-hero-inner
        className={`mx-auto grid w-full max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] ${ready ? '' : 'invisible'}`}
      >
        <div>
          <p data-fade className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span className="rec mr-2 inline-block h-2 w-2 bg-red align-middle" />
            subject acquired — system online
          </p>
          <div data-fade aria-hidden className="mt-6 font-mono text-xs font-bold uppercase text-red glow-red">
            0x2A IDENT 0.99
          </div>
          <div data-box className="relative inline-block border-2 border-red bg-black/40 px-4 py-3 sm:px-6">
            <h1
              data-split
              className="text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.95] text-fg"
              style={{ perspective: 600 }}
            >
              {profile.name}
            </h1>
          </div>
          <p className="sr-only">{profile.role}</p>
          <p
            aria-hidden
            data-scramble={profile.role}
            className="mt-5 min-h-[3.5rem] font-mono text-lg text-fg glow-fg sm:text-xl"
          >
            {profile.role}
          </p>
          <p data-fade className="mt-4 max-w-md text-lg text-muted">
            {profile.tagline}
          </p>
          <div data-fade className="mt-8 flex flex-wrap gap-3 font-mono text-sm">
            <a
              href="#projects"
              className="bg-redfill px-5 py-3 font-bold uppercase tracking-wider text-white transition-colors hover:bg-fg hover:text-bg"
            >
              ./view-projects.sh
            </a>
            <a
              href="#contact"
              className="border border-fg/60 px-5 py-3 uppercase tracking-wider text-fg transition-colors hover:border-red hover:text-red"
            >
              ssh contact
            </a>
          </div>
          <div data-fade className="mt-10 flex gap-8 font-mono text-xs uppercase tracking-wider text-muted">
            {stats.map((s) => (
              <div key={s.label}>
                <div className={`text-2xl font-bold ${s.accent ? 'text-red' : 'text-text'}`}>{s.value}</div>
                {s.label}
              </div>
            ))}
          </div>
        </div>
        <div data-term>
          <Terminal start={ready} />
          <p className="mt-3 text-center font-mono text-xs text-muted">
            ↑ it's a real terminal — type <span className="text-fg">help</span>
          </p>
        </div>
      </div>
      <div aria-hidden className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted sm:block">
        <div className="animate-bounce">scroll ↓</div>
      </div>
    </section>
  )
}
