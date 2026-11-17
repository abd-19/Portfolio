import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile, skillGroups } from '../data'

const LINES: [string, string][] = [
  ['', `BIOS v4.2.0 — POST check ... memory 65536MB OK`],
  ['', `Booting kernel 6.8.0-${profile.handle} ...`],
  ['OK', 'Mounted /dev/brain on /'],
  ['OK', 'Started Network Manager'],
  ['OK', 'Started OpenSSH server daemon'],
  ['OK', 'Started Docker Application Container Engine'],
  ['OK', 'Reached target Kubernetes Node'],
  ['OK', `Loaded skills.service (${skillGroups.length} modules)`],
  ['WARN', 'coffee.service: low level detected, refilling'],
  ['OK', 'Started projects.target'],
  ['OK', `Started ${profile.handle}-portfolio.service`],
  ['', ''],
  ['', `${profile.handle} login: guest — access granted`],
]

export default function BootLoader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(true)
  const doneRef = useRef(false)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    setVisible(false)
    setTimeout(onDone, 500)
  }

  useEffect(() => {
    if (count >= LINES.length) {
      const t = setTimeout(finish, 450)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setCount((c) => c + 1), 90 + Math.random() * 110)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  useEffect(() => {
    const skip = () => finish()
    window.addEventListener('keydown', skip)
    return () => window.removeEventListener('keydown', skip)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const progress = Math.min(100, Math.round((count / LINES.length) * 100))

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col justify-end bg-bg p-5 font-mono text-[13px] sm:p-10 sm:text-sm"
          exit={{ opacity: 0, filter: 'blur(8px)', scale: 1.04 }}
          transition={{ duration: 0.5 }}
          onClick={finish}
        >
          <div className="mx-auto w-full max-w-3xl space-y-1">
            {LINES.slice(0, count).map(([tag, text], i) => (
              <div key={i} className="flex gap-3 text-muted">
                {tag && (
                  <span className={tag === 'OK' ? 'text-ok' : 'text-warn'}>
                    [{tag === 'OK' ? '  OK  ' : ' WARN '}]
                  </span>
                )}
                <span className={i === LINES.length - 1 ? 'text-fg glow-fg' : ''}>{text}</span>
              </div>
            ))}
            <div className="pt-6">
              <div className="mb-2 flex justify-between text-xs text-muted">
                <span>booting system</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 overflow-hidden bg-line">
                <motion.div
                  className="h-full bg-gradient-to-r from-fg to-hud"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
              <p className="mt-4 text-center text-xs text-muted">press any key to skip</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
