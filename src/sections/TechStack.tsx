import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  siAlmalinux,
  siAnsible,
  siApachecloudstack,
  siArgo,
  siCentos,
  siCisco,
  siDebian,
  siDell,
  siDocker,
  siFirebase,
  siFlutter,
  siGit,
  siGitlab,
  siGnubash,
  siGrafana,
  siKubernetes,
  siLinux,
  siMikrotik,
  siPodman,
  siPrometheus,
  siPython,
  siQemu,
  siRedhat,
  siRockylinux,
  siUbuntu,
  siVmware,
} from 'simple-icons'
import { reducedMotion } from '../motion'

// Logos from Simple Icons (CC0). Zabbix and Kustomize are not in the set, so they get a lettered mark.
type Logo = { title: string; path?: string; letter?: string }
const L = (icon: { path: string }, title: string): Logo => ({ title, path: icon.path })
const ZABBIX: Logo = { title: 'Zabbix', letter: 'Z' }
const KUSTOMIZE: Logo = { title: 'Kustomize', letter: 'K' }

const ROWS: Logo[][] = [
  [
    L(siKubernetes, 'Kubernetes'),
    L(siArgo, 'ArgoCD'),
    KUSTOMIZE,
    L(siGitlab, 'GitLab CI/CD'),
    L(siPython, 'Python'),
    L(siDocker, 'Docker'),
    L(siAnsible, 'Ansible'),
    ZABBIX,
    L(siPrometheus, 'Prometheus'),
    L(siGrafana, 'Grafana'),
    L(siPodman, 'Podman'),
  ],
  [
    L(siRedhat, 'Red Hat'),
    L(siLinux, 'Linux'),
    L(siRockylinux, 'Rocky Linux'),
    L(siAlmalinux, 'AlmaLinux'),
    L(siCentos, 'CentOS'),
    L(siUbuntu, 'Ubuntu'),
    L(siDebian, 'Debian'),
    L(siGnubash, 'Bash'),
  ],
  [
    L(siApachecloudstack, 'CloudStack'),
    L(siQemu, 'KVM / QEMU'),
    L(siVmware, 'VMware'),
    L(siMikrotik, 'MikroTik'),
    L(siCisco, 'Cisco'),
    L(siDell, 'Dell'),
    L(siGit, 'Git'),
    L(siFlutter, 'Flutter'),
    L(siFirebase, 'Firebase'),
  ],
]

// Big faint logos that drift behind the rows at different speeds
const FLYERS = [
  { icon: siKubernetes, cls: 'left-[4%] top-[8%] h-40 w-40', y: -260, r: 40 },
  { icon: siGitlab, cls: 'right-[6%] top-[2%] h-32 w-32', y: -180, r: -30 },
  { icon: siRedhat, cls: 'left-[42%] bottom-[0%] h-36 w-36', y: -320, r: 20 },
  { icon: siAnsible, cls: 'right-[22%] bottom-[10%] h-28 w-28', y: -140, r: -45 },
]

function Mark({ logo, className }: { logo: Logo; className: string }) {
  if (!logo.path)
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <rect x="1.5" y="1.5" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" />
        <text x="12" y="17.5" textAnchor="middle" fontSize="15" fontWeight="700" fontFamily="JetBrains Mono, monospace" fill="currentColor">
          {logo.letter}
        </text>
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d={logo.path} fill="currentColor" />
    </svg>
  )
}

function Chip({ logo }: { logo: Logo }) {
  return (
    <div
      data-lock
      className="group flex shrink-0 items-center gap-3 border border-line bg-panel/85 px-5 py-4 transition-colors duration-200 hover:border-hud"
    >
      <Mark logo={logo} className="h-8 w-8 text-fg/85 transition-colors duration-200 group-hover:text-hud" />
      <span className="whitespace-nowrap font-mono text-sm uppercase tracking-wider text-muted transition-colors group-hover:text-fg">
        {logo.title}
      </span>
    </div>
  )
}

const total = ROWS.flat().length

export default function TechStack() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      const trigger = { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 }

      // rows fly sideways in alternating directions as the page scrolls
      gsap.utils.toArray<HTMLElement>('[data-row]').forEach((row, i) => {
        const dir = i % 2 === 0 ? 1 : -1
        const travel = 18 + i * 6 // % of row width
        gsap.fromTo(
          row,
          { xPercent: dir > 0 ? -5 : -5 - travel },
          { xPercent: dir > 0 ? -5 - travel : -5, ease: 'none', scrollTrigger: { ...trigger } },
        )
      })

      // big background logos drift up and spin at different speeds
      gsap.utils.toArray<HTMLElement>('[data-flyer]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 0, rotate: 0 },
          {
            y: Number(el.dataset.y),
            rotate: Number(el.dataset.r),
            ease: 'none',
            scrollTrigger: { ...trigger },
          },
        )
      })

      // lean into the scroll: faster scrolling skews the rows, then they settle back
      const skew = gsap.quickTo('[data-rows]', 'skewX', { duration: 0.5, ease: 'power3.out' })
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => skew(gsap.utils.clamp(-8, 8, self.getVelocity() / -300)),
        onLeave: () => skew(0),
        onLeaveBack: () => skew(0),
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} aria-labelledby="stack-title" className="relative overflow-hidden pb-24 pt-12">
      {/* drifting background logos */}
      {!reducedMotion &&
        FLYERS.map((f, i) => (
          <svg
            key={i}
            data-flyer
            data-y={f.y}
            data-r={f.r}
            viewBox="0 0 24 24"
            aria-hidden
            className={`pointer-events-none absolute text-fg/[0.05] ${f.cls}`}
          >
            <path d={f.icon.path} fill="currentColor" />
          </svg>
        ))}

      <div className="relative mx-auto mb-10 max-w-6xl px-4 sm:px-6">
        <div aria-hidden className="font-mono text-xs font-bold uppercase text-hud glow-hud">
          0x7E TRACKING {total} OBJECTS
        </div>
        <h2 id="stack-title" className="mt-1 text-2xl font-bold text-fg sm:text-3xl">
          Stack in production
        </h2>
        <p className="mt-2 font-mono text-sm text-muted">
          <span className="text-fg">$</span> kubectl get nodes --all-namespaces
        </p>
      </div>

      {/* screen readers get one clean list instead of the repeated moving rows */}
      <ul className="sr-only">
        {ROWS.flat().map((l) => (
          <li key={l.title}>{l.title}</li>
        ))}
      </ul>

      <div
        data-rows
        aria-hidden
        className="relative space-y-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        {ROWS.map((row, i) =>
          reducedMotion ? (
            <div key={i} className="mx-auto flex max-w-6xl flex-wrap justify-center gap-4 px-4">
              {row.map((l) => (
                <Chip key={l.title} logo={l} />
              ))}
            </div>
          ) : (
            <div key={i} data-row className="flex w-max gap-4">
              {/* repeated so the row always covers the screen while it travels */}
              {[0, 1, 2].flatMap((rep) => row.map((l) => <Chip key={`${rep}-${l.title}`} logo={l} />))}
            </div>
          ),
        )}
      </div>
    </section>
  )
}
