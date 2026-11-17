import { useEffect, useRef } from 'react'

// Red tracking box that only appears when the cursor is on a link or button,
// snapping around it like a camera "locking on". Hidden while reading/scrolling.

const hex = (n: number) => '0x' + n.toString(16).toUpperCase().padStart(2, '0')
const PAD = 6

export default function Tracker() {
  const boxRef = useRef<HTMLDivElement>(null)
  const tagRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const box = boxRef.current!
    let locked: Element | null = null
    let mx = -1
    let my = -1
    let raf = 0

    const place = (r: DOMRect) => {
      box.style.transform = `translate(${r.left - PAD}px, ${r.top - PAD}px)`
      box.style.width = `${r.width + PAD * 2}px`
      box.style.height = `${r.height + PAD * 2}px`
    }

    const hide = () => {
      locked = null
      box.style.opacity = '0'
    }

    const inside = (r: DOMRect) => mx >= r.left && mx <= r.right && my >= r.top && my <= r.bottom

    // Keep the box glued to the element's real position every frame;
    // if the cursor is no longer over it (page scrolled, element moved), drop the lock.
    const loop = () => {
      if (locked) {
        const r = locked.getBoundingClientRect()
        if (!locked.isConnected || !inside(r)) hide()
        else place(r)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      const target = (e.target as Element).closest('a, button, [data-lock]')
      if (target === locked) return
      if (!target) return hide()
      locked = target
      place(target.getBoundingClientRect())
      tagRef.current!.textContent = `${hex(Math.floor(Math.random() * 255))} LOCK`
      box.style.opacity = '1'
    }

    // hide immediately on scroll; it only comes back on real mouse movement
    const onScroll = () => {
      if (locked) hide()
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.documentElement.addEventListener('mouseleave', hide)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.documentElement.removeEventListener('mouseleave', hide)
    }
  }, [])

  return (
    <div
      ref={boxRef}
      data-tracker
      className="pointer-events-none fixed left-0 top-0 z-[70] border border-red transition-[opacity,width,height,transform] duration-150 ease-out"
      style={{ opacity: 0 }}
      aria-hidden
    >
      <div
        ref={tagRef}
        className="absolute -top-4 left-[-1px] whitespace-nowrap bg-redfill px-1 font-mono text-[9px] font-bold uppercase leading-4 text-white"
      />
    </div>
  )
}
