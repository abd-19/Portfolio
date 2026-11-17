import { useEffect, useState } from 'react'

// Architecture diagram in the tracking-HUD style: stages of boxes joined by lines,
// with red "packets" flowing along each link. Left → right on wide screens,
// top → bottom on phones so labels stay readable.

type Box = { x: number; y: number; w: number; h: number; label: string; stage: number }

function useNarrow(query = '(max-width: 640px)') {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setNarrow(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return narrow
}

const BOX_H = 36
const TOP = 30 // room for stage labels / lock tag

function layoutHorizontal(stages: string[][]) {
  const W = 680
  const pad = 8
  // boxes shrink when there are many stages so links keep room between columns
  const boxW = Math.min(128, (W - 2 * pad - (stages.length - 1) * 34) / stages.length)
  const gap = 14
  const maxRows = Math.max(...stages.map((s) => s.length))
  const contentH = maxRows * (BOX_H + gap) - gap
  const H = TOP + contentH + 12
  const step = stages.length > 1 ? (W - 2 * pad - boxW) / (stages.length - 1) : 0
  const boxes: Box[][] = stages.map((items, i) => {
    const total = items.length * (BOX_H + gap) - gap
    const y0 = TOP + (contentH - total) / 2
    return items.map((label, j) => ({ x: pad + i * step, y: y0 + j * (BOX_H + gap), w: boxW, h: BOX_H, label, stage: i }))
  })
  return { W, H, boxes, vertical: false }
}

function layoutVertical(stages: string[][]) {
  const W = 340
  const pad = 6
  const gap = 8
  const rowGap = 54
  const boxes: Box[][] = stages.map((items, i) => {
    const w = Math.min(150, (W - 2 * pad - gap * (items.length - 1)) / items.length)
    const total = items.length * w + gap * (items.length - 1)
    const x0 = (W - total) / 2
    return items.map((label, j) => ({ x: x0 + j * (w + gap), y: TOP + i * (BOX_H + rowGap), w, h: BOX_H, label, stage: i }))
  })
  const H = TOP + stages.length * (BOX_H + rowGap) - rowGap + 12
  return { W, H, boxes, vertical: true }
}

function edgePath(a: Box, b: Box, vertical: boolean) {
  if (vertical) {
    const x1 = a.x + a.w / 2
    const y1 = a.y + a.h
    const x2 = b.x + b.w / 2
    const y2 = b.y
    const my = (y1 + y2) / 2
    return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`
  }
  const x1 = a.x + a.w
  const y1 = a.y + a.h / 2
  const x2 = b.x
  const y2 = b.y + b.h / 2
  const mx = (x1 + x2) / 2
  return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`
}

export default function FlowDiagram({
  stages,
  pairs = [],
  focus = 1,
  tag = '0x3A LOCK 0.97',
  className = '',
}: {
  stages: string[][]
  pairs?: number[] // transitions drawn one-to-one
  focus?: number // stage drawn in red, with the lock tag
  tag?: string
  className?: string
}) {
  const narrow = useNarrow()
  const { W, H, boxes, vertical } = narrow ? layoutVertical(stages) : layoutHorizontal(stages)

  const edges: { d: string; i: number }[] = []
  let n = 0
  for (let s = 0; s < boxes.length - 1; s++)
    if (pairs.includes(s) && boxes[s].length === boxes[s + 1].length)
      boxes[s].forEach((a, j) => edges.push({ d: edgePath(a, boxes[s + 1][j], vertical), i: n++ }))
    else for (const a of boxes[s]) for (const b of boxes[s + 1]) edges.push({ d: edgePath(a, b, vertical), i: n++ })

  const label = stages.map((s) => s.join(', ')).join(' → ')
  const lockBox = boxes[Math.min(focus, boxes.length - 1)]?.[0]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Architecture: ${label}`} className={`h-auto w-full ${className}`}>
      {/* links: faint base line + red packets flowing along it */}
      {edges.map((e) => (
        <g key={e.i}>
          <path d={e.d} fill="none" stroke="rgba(220,240,228,0.18)" strokeWidth="1" />
          <path
            d={e.d}
            fill="none"
            stroke="#3dff8b"
            strokeWidth="1.6"
            strokeDasharray="3 13"
            className="flow-dash"
            style={{ animationDelay: `${(e.i % 7) * -0.17}s` }}
          />
        </g>
      ))}

      {/* nodes */}
      {boxes.flat().map((b, k) => {
        const hot = b.stage === focus
        const small = b.w < 112
        return (
          <g key={k}>
            <rect
              x={b.x + 0.5}
              y={b.y + 0.5}
              width={b.w - 1}
              height={b.h - 1}
              fill="#131313"
              stroke={hot ? '#3dff8b' : 'rgba(220,240,228,0.45)'}
              strokeWidth={hot ? 1.5 : 1}
            />
            {/* corner ticks */}
            <path d={`M${b.x},${b.y + 7} V${b.y} H${b.x + 7}`} fill="none" stroke={hot ? '#3dff8b' : '#dcf0e4'} strokeWidth="1.5" />
            <path
              d={`M${b.x + b.w - 7},${b.y + b.h} H${b.x + b.w} V${b.y + b.h - 7}`}
              fill="none"
              stroke={hot ? '#3dff8b' : '#dcf0e4'}
              strokeWidth="1.5"
            />
            <text
              x={b.x + b.w / 2}
              y={b.y + b.h / 2 + 4}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize={small ? 10 : 11.5}
              fill={hot ? '#ffffff' : '#e4e4e4'}
            >
              {b.label}
            </text>
          </g>
        )
      })}

      {/* tracking tag on the focused stage */}
      {lockBox && (
        <g aria-hidden>
          <rect x={lockBox.x} y={lockBox.y - 17} width={tag.length * 6.4 + 8} height={14} fill="#2fe57a" />
          <text
            x={lockBox.x + 4}
            y={lockBox.y - 7}
            fontFamily="JetBrains Mono, monospace"
            fontSize="9.5"
            fontWeight="700"
            fill="#000000"
          >
            {tag}
          </text>
        </g>
      )}
    </svg>
  )
}
