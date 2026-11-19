import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { reducedMotion } from '../motion'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&'

// Section heading: a HUD ruler draws in, the command types in, and a giant outlined
// title decrypts letter by letter — then fills solid left → right as you scroll past it.
export default function SectionTitle({ index, cmd, title }: { index: string; cmd: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const h = ref.current!.querySelector('h2')!
      const final = title.toUpperCase()
      const state = { p: 0 }
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 85%' } })
      tl.fromTo('[data-ruler]', { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power3.out' })
        .fromTo('[data-cmd]', { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.35 }, '<0.15')
        .to(
          state,
          {
            p: 1,
            duration: 0.9,
            ease: 'none',
            onUpdate: () => {
              const n = Math.floor(state.p * final.length)
              h.textContent =
                final.slice(0, n) +
                final
                  .slice(n)
                  .split('')
                  .map((c) => (c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]))
                  .join('')
            },
          },
          '<0.1',
        )

      // outline → solid, tied to scroll position
      if (reducedMotion) gsap.set(h, { '--fill': '100%' })
      else
        gsap.fromTo(
          h,
          { '--fill': '0%' },
          { '--fill': '100%', ease: 'none', scrollTrigger: { trigger: h, start: 'top 88%', end: 'top 35%', scrub: 0.4 } },
        )
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="mb-14">
      <div data-ruler aria-hidden className="ruler mb-5 origin-left" />
      <p data-cmd className="font-mono text-sm text-muted">
        <span className="text-hud">{index}</span> <span className="text-fg">$</span> {cmd}
      </p>
      <h2
        data-no-scramble
        aria-label={title}
        className="title-outline mt-2 inline-block text-[clamp(2.75rem,9vw,8rem)] font-bold leading-[0.95]"
      >
        {title.toUpperCase()}
      </h2>
    </div>
  )
}
