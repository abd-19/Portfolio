import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { certs, profile } from '../data'

// Hero "camera feed": the photo is scanned in, a tracking box hunts around the frame,
// then locks onto the face, and the subject file types in beside it.

const src = import.meta.env.BASE_URL + profile.photo

export default function CamFeed({ start }: { start: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const tagRef = useRef<HTMLSpanElement>(null)
  const { face } = profile

  const rows: [string, string][] = [
    ['Subject', profile.name],
    ['Role', profile.shortRole],
    ['Loc', profile.location],
    ['Certs', `${certs.slice(0, 2).map((c) => c.short).join(' · ')} +${certs.length - 2}`],
  ]

  useGSAP(
    () => {
      if (!start) return
      const box = '[data-lockbox]'
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        // the frame is scanned in from the top
        .fromTo('[data-feed]', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'power2.inOut' })
        .fromTo('[data-scanbar]', { top: '0%', autoAlpha: 1 }, { top: '100%', duration: 0.7, ease: 'power2.inOut' }, '<')
        .set('[data-scanbar]', { autoAlpha: 0 })
        // tracking box hunts around, then snaps onto the face
        .fromTo(box, { left: '6%', top: '6%', width: '88%', height: '88%', autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 })
        .to(box, { left: '12%', top: '38%', width: '42%', height: '40%', duration: 0.35 })
        .to(box, { left: '50%', top: '18%', width: '36%', height: '36%', duration: 0.3 })
        .to(box, {
          left: `${face.x}%`,
          top: `${face.y}%`,
          width: `${face.w}%`,
          height: `${face.h}%`,
          borderColor: '#3dff8b',
          duration: 0.45,
          ease: 'back.out(1.8)',
        })
        .call(() => {
          if (tagRef.current) tagRef.current.textContent = 'MATCH 0.99'
        })
        .fromTo('[data-tagbg]', { backgroundColor: 'rgba(238,247,240,0.85)' }, { backgroundColor: '#2fe57a', duration: 0.2 }, '<')
        // subject file types in
        .fromTo('[data-row]', { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, stagger: 0.08, duration: 0.3 }, '-=0.1')
    },
    { scope: ref, dependencies: [start] },
  )

  return (
    <div ref={ref} className="panel brackets mb-4 grid grid-cols-[40%_1fr] font-mono text-xs">
      <div className="relative aspect-square overflow-hidden border-r border-line bg-black">
        <div data-feed className="absolute inset-0">
          <img
            src={src}
            alt={profile.name}
            width={400}
            height={400}
            className="h-full w-full object-cover grayscale contrast-125 brightness-95"
          />
          {/* phosphor tint + scanlines + vignette */}
          <div aria-hidden className="absolute inset-0 bg-hud/75 mix-blend-multiply" />
          <div
            aria-hidden
            className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(0,0,0,0.35)_0px,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_3px)]"
          />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.7)_100%)]" />
        </div>
        <div aria-hidden data-scanbar className="invisible absolute inset-x-0 h-px bg-hud shadow-[0_0_12px_2px_#3dff8b]" />

        {/* tracking box */}
        <div aria-hidden data-lockbox className="invisible absolute border border-fg/80" style={{ left: '6%', top: '6%', width: '88%', height: '88%' }}>
          <span data-tagbg className="absolute -left-px top-full mt-px whitespace-nowrap px-1 text-[9px] font-bold leading-4 text-black">
            <span ref={tagRef}>SCANNING…</span>
          </span>
        </div>

        <span aria-hidden className="absolute left-2 top-2 flex items-center gap-1.5 text-[10px] text-fg">
          <span className="rec inline-block h-1.5 w-1.5 bg-hud" /> CAM 01
        </span>
      </div>

      <div className="flex min-w-0 flex-col justify-between gap-3 p-3 sm:p-4">
        <dl className="space-y-1.5">
          {rows.map(([k, v]) => (
            <div data-row key={k} className="invisible grid grid-cols-[3.5rem_1fr] gap-2">
              <dt className="uppercase text-muted">{k}</dt>
              <dd className="truncate text-fg">{v}</dd>
            </div>
          ))}
        </dl>
        <div data-row aria-hidden className="invisible flex items-center gap-2 text-[11px] uppercase text-hud">
          <span className="h-1.5 w-1.5 bg-hud" /> identity confirmed
        </div>
      </div>
    </div>
  )
}
