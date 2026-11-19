import { useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import SectionTitle from '../components/SectionTitle'
import { profile, softSkills } from '../data'

export default function About() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // words light up one by one as you scroll through the paragraph
      const split = SplitText.create('[data-words]', { type: 'words' })
      gsap.fromTo(
        split.words,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: '[data-words]', start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )
      gsap.from('[data-card]', {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-cards]', start: 'top 85%' },
      })
      // soft skills report in one by one, like services starting
      gsap.fromTo(
        '[data-soft] li',
        { autoAlpha: 0, x: -12 },
        {
          autoAlpha: 1,
          x: 0,
          stagger: 0.07,
          duration: 0.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-soft]', start: 'top 85%' },
        },
      )
    },
    { scope: ref },
  )

  const facts = [
    ['$ whoami --job', `${profile.shortRole} @ Earthlink ISP`],
    ['$ cat /etc/location', profile.location],
    ['$ cat /etc/education', 'B.Sc. Computer Engineering — University of Technology, Baghdad'],
  ]

  return (
    <section id="about" ref={ref} className="relative mx-auto max-w-6xl px-4 py-32 sm:px-6">
      <SectionTitle index="01" cmd="cat about.md" title="About me" />
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div data-words className="space-y-6 text-2xl leading-relaxed sm:text-3xl">
          {profile.about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div data-cards className="space-y-3 font-mono text-sm">
          {facts.map(([k, v]) => (
            <div data-card key={k} className="panel p-4">
              <div className="text-muted">{k}</div>
              <div className="mt-1 text-fg">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div data-soft className="mt-16">
        <p className="font-mono text-sm text-muted">
          <span className="text-fg">$</span> systemctl status soft-skills.target
        </p>
        <ul className="mt-4 grid gap-x-8 gap-y-2.5 font-mono text-sm sm:grid-cols-2">
          {softSkills.map((sk) => (
            <li key={sk} className="flex gap-3 text-text">
              <span className="shrink-0 text-ok">[ OK ]</span>
              <span>{sk}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
