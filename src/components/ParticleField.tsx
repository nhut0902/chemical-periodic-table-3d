import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../lib/hooks'

interface Atom {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  orbit: number
  phase: number
  speed: number
  color: string
}

const COLORS = ['#38BDF8', '#A78BFA', '#4FD1C5', '#63A9FF']

/**
 * Ambient 2D field of drifting "atoms". Deliberately cheap: one canvas, a few
 * dozen bodies, animation paused when the tab is hidden.
 */
export function ParticleField({ density = 46 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let atoms: Atom[] = []
    let raf = 0
    let running = true

    const build = () => {
      const parent = canvas.parentElement
      width = parent?.clientWidth ?? window.innerWidth
      height = parent?.clientHeight ?? 480
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(density * Math.min(1.25, Math.max(0.5, width / 1280)))
      atoms = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        r: 0.9 + Math.random() * 1.6,
        orbit: 4 + Math.random() * 10,
        phase: Math.random() * Math.PI * 2,
        speed: 0.12 + Math.random() * 0.35,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }))
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height)
      for (const a of atoms) {
        a.x += a.vx
        a.y += a.vy
        if (a.x < -20) a.x = width + 20
        if (a.x > width + 20) a.x = -20
        if (a.y < -20) a.y = height + 20
        if (a.y > height + 20) a.y = -20

        ctx.globalAlpha = 0.28
        ctx.strokeStyle = a.color
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.ellipse(a.x, a.y, a.orbit, a.orbit * 0.42, 0, 0, Math.PI * 2)
        ctx.stroke()

        const ang = t * 0.001 * a.speed + a.phase
        const ex = a.x + Math.cos(ang) * a.orbit
        const ey = a.y + Math.sin(ang) * a.orbit * 0.42
        ctx.globalAlpha = 0.7
        ctx.fillStyle = a.color
        ctx.beginPath()
        ctx.arc(ex, ey, 0.9, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = 0.5
        ctx.fillStyle = '#F8FAFC'
        ctx.beginPath()
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      if (running && !reduced) raf = requestAnimationFrame(draw)
    }

    build()
    if (reduced) {
      draw(0)
    } else {
      raf = requestAnimationFrame(draw)
    }

    const onResize = () => {
      build()
      if (reduced) draw(0)
    }
    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!reduced) {
        running = true
        raf = requestAnimationFrame(draw)
      }
    }

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      running = false
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [density, reduced])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
    />
  )
}
