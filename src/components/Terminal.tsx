import { useEffect, useRef, useState, type ReactNode } from 'react'
import { certs, contactLinks, profile, projects, skillGroups } from '../data'
import { reducedMotion } from '../motion'

type Line = { kind: 'in' | 'out'; content: ReactNode }

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const COMMANDS: Record<string, { help: string; run: () => ReactNode }> = {
  help: {
    help: 'list available commands',
    run: () => (
      <div className="grid grid-cols-[auto_1fr] gap-x-6">
        {Object.entries(COMMANDS).map(([k, v]) => (
          <div key={k} className="contents">
            <span className="whitespace-nowrap text-fg">{k}</span>
            <span className="text-muted">{v.help}</span>
          </div>
        ))}
      </div>
    ),
  },
  whoami: {
    help: 'who am I',
    run: () => (
      <span>
        <span className="text-hud">{profile.name}</span> — {profile.shortRole} at Earthlink ISP, {profile.location}.
        Linux, private cloud, monitoring and automation.
      </span>
    ),
  },
  'ls projects': {
    help: 'list projects',
    run: () => (
      <div>
        {projects.map((p) => (
          <div key={p.id}>
            <span className="text-ok">drwxr-xr-x</span> <span className="text-fg">{p.name}/</span>
          </div>
        ))}
      </div>
    ),
  },
  'cat skills.txt': {
    help: 'print skills',
    run: () => (
      <div>
        {skillGroups.map((g) => (
          <div key={g.label}>
            <span className="text-hud">{g.label.toLowerCase()}:</span> {g.tools.join(', ')}
          </div>
        ))}
      </div>
    ),
  },
  certs: {
    help: 'show certifications',
    run: () => (
      <div>
        {certs.map((c) => (
          <div key={c.short}>
            <span className="text-hud">{c.short}</span> {c.name}{' '}
            <span className="text-muted">#{c.id}</span>
          </div>
        ))}
      </div>
    ),
  },
  uptime: {
    help: 'how long I have been doing this',
    run: () => (
      <span>
        up {profile.years} years (since 2022), load average: 0.42, 0.37, 0.31 — still learning
      </span>
    ),
  },
  contact: {
    help: 'how to reach me',
    run: () => (
      <div>
        {contactLinks.map((l) => (
          <div key={l.key}>
            {l.key}:{' '}
            <a
              className="text-fg underline"
              href={l.href}
              target={l.external ? '_blank' : undefined}
              rel="noreferrer"
            >
              {l.label}
            </a>
          </div>
        ))}
      </div>
    ),
  },
  'sudo rm -rf /': {
    help: "don't.",
    run: () => <span className="text-hud">Nice try. This incident has been reported.</span>,
  },
  clear: { help: 'clear the screen', run: () => null },
}

const NAV: Record<string, string> = {
  'cd about': 'about',
  'cd skills': 'skills',
  'cd projects': 'projects',
  'cd experience': 'experience',
}

const INTRO = ['whoami', 'help']

export default function Terminal({ start, compact = false }: { start: boolean; compact?: boolean }) {
  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIndex, setHIndex] = useState(-1)
  const [typing, setTyping] = useState(true)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const execute = (raw: string) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return
    setHistory((h) => [raw, ...h])
    setHIndex(-1)
    if (cmd === 'clear') {
      setLines([])
      return
    }
    let out: ReactNode
    if (COMMANDS[cmd]) out = COMMANDS[cmd].run()
    else if (NAV[cmd]) {
      scrollTo(NAV[cmd])
      out = <span className="text-muted">navigating to /{NAV[cmd]} ...</span>
    } else
      out = (
        <span className="text-hud">
          bash: {cmd}: command not found — try <span className="text-fg">help</span>
        </span>
      )
    setLines((l) => [...l, { kind: 'in', content: raw }, { kind: 'out', content: out }])
  }

  // Auto-type the intro commands once the boot screen is gone
  useEffect(() => {
    if (!start) return
    let cancelled = false
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
    ;(async () => {
      if (reducedMotion) {
        INTRO.forEach((c) => execute(c))
        setTyping(false)
        return
      }
      await sleep(500)
      for (const cmd of INTRO) {
        for (let i = 1; i <= cmd.length; i++) {
          if (cancelled) return
          setInput(cmd.slice(0, i))
          await sleep(70)
        }
        await sleep(250)
        if (cancelled) return
        setInput('')
        execute(cmd)
        await sleep(400)
      }
      setTyping(false)
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [lines])

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      execute(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const i = Math.min(hIndex + 1, history.length - 1)
      if (history[i]) {
        setHIndex(i)
        setInput(history[i])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const i = hIndex - 1
      setHIndex(Math.max(i, -1))
      setInput(i >= 0 ? history[i] : '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const all = [...Object.keys(COMMANDS), ...Object.keys(NAV)]
      const match = all.find((c) => c.startsWith(input.toLowerCase()))
      if (match) setInput(match)
    }
  }

  const prompt = (
    <span className="shrink-0 whitespace-pre">
      <span className="text-ok">guest@{profile.handle}</span>
      <span className="text-muted">:</span>
      <span className="text-fg">~</span>
      <span className="text-muted">$ </span>
    </span>
  )

  return (
    <div
      className="panel brackets overflow-hidden font-mono text-[13px] transition-colors focus-within:border-hud sm:text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      <div aria-hidden className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-hud" />
        <span className="h-3 w-3 rounded-full bg-muted" />
        <span className="h-3 w-3 rounded-full bg-muted" />
        <span className="ml-3 text-xs text-muted">guest@{profile.handle}: ~ — bash</span>
      </div>
      <div
        ref={bodyRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        className={`space-y-1.5 overflow-y-auto p-4 ${compact ? 'h-[240px] sm:h-[220px]' : 'h-[300px] sm:h-[340px]'}`}
      >
        {lines.map((l, i) =>
          l.kind === 'in' ? (
            <div key={i} className="flex">
              {prompt}
              <span>{l.content}</span>
            </div>
          ) : (
            <div key={i} className="pb-1 text-text/90">
              {l.content}
            </div>
          ),
        )}
        <div className="relative flex items-center">
          {prompt}
          <input
            ref={inputRef}
            value={input}
            readOnly={typing}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            aria-label="Type a terminal command, for example help"
            spellCheck={false}
            autoComplete="off"
            className="absolute h-0 w-0 opacity-0"
          />
          <span className="whitespace-pre">{input}</span>
          <span className="caret" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        {['whoami', 'ls projects', 'cat skills.txt', 'uptime', 'contact'].map((c) => (
          <button
            key={c}
            onClick={(e) => {
              e.stopPropagation()
              if (!typing) execute(c)
            }}
            className="min-h-8 border border-line px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-fg hover:text-fg"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}
