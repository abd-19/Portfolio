import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&'

// Section heading styled as a tracking label: red tag, red bounding box, scrambled text.
export default function SectionTitle({ index, cmd, title }: { index: string; cmd: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const h = ref.current!.querySelector('h2')!
      const final = title.toUpperCase()
      const state = { p: 0 }
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 85%' } })
      tl.fromTo('[data-tag]', { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.3 })
        .fromTo('[data-box]', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: 'power3.out' }, '<0.1')
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
          '<0.15',
        )
        .fromTo('[data-cmd]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, '<0.3')
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="mb-14">
      <div data-tag aria-hidden className="mb-1 font-mono text-xs font-bold uppercase text-muted">
        0x{(parseInt(index) * 21).toString(16).toUpperCase()} TEXT 0.99
      </div>
      <div data-box className="inline-block border-2 border-fg/60 bg-black/40 px-4 py-2 sm:px-6">
        <h2 aria-label={title} className="text-4xl font-bold text-fg sm:text-6xl">{title.toUpperCase()}</h2>
      </div>
      <p data-cmd className="mt-4 font-mono text-sm text-muted">
        <span className="text-hud">{index}</span> <span className="text-fg">$</span> {cmd}
      </p>
    </div>
  )
}
