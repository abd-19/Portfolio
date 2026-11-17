import { lazy, Suspense, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import { reducedMotion } from './motion'
import BootLoader from './components/BootLoader'
const NetworkScene = lazy(() => import('./components/NetworkScene'))
import Hud from './components/Hud'
import Tracker from './components/Tracker'
import TrackTrail from './components/TrackTrail'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import TechStack from './sections/TechStack'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import Contact from './sections/Contact'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
// Reduced motion: every GSAP reveal still runs, but finishes instantly
if (reducedMotion) gsap.globalTimeline.timeScale(100)

const BOOT_KEY = 'boot-seen'
const bootSeen = () => {
  try {
    return sessionStorage.getItem(BOOT_KEY) === '1'
  } catch {
    return false
  }
}

export default function App() {
  // the boot sequence plays once per visit, never for reduced-motion users
  const [booted, setBooted] = useState(() => reducedMotion || bootSeen())

  // Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync
  useEffect(() => {
    if (reducedMotion) return
    const lenis = new Lenis({ lerp: 0.1, anchors: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = booted ? '' : 'hidden'
    if (booted) ScrollTrigger.refresh()
  }, [booted])

  return (
    <div className="scanlines">
      <a
        href="#main"
        className="sr-only z-[200] bg-redfill px-4 py-2 font-mono text-sm text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      {!booted && (
        <BootLoader
          onDone={() => {
            try {
              sessionStorage.setItem(BOOT_KEY, '1')
            } catch {
              /* storage unavailable: boot will just play again */
            }
            setBooted(true)
          }}
        />
      )}
      <Suspense fallback={null}>
        <NetworkScene />
      </Suspense>
      <div className="grid-bg pointer-events-none fixed inset-0 z-0 opacity-40" />
      {booted && <Hud />}
      {booted && <Tracker />}
      {booted && <TrackTrail />}
      <main id="main" tabIndex={-1} className="relative z-10 outline-none">
        <Hero ready={booted} />
        <About />
        <Skills />
        <TechStack />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </div>
  )
}
