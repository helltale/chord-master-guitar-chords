import { useRef, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

const PARTICLE_COUNT = 90
const CONNECT_DISTANCE = 140
const MOUSE_RADIUS = 200
const MOUSE_ATTRACT_STRENGTH = 0.012
const DRIFT = 0.06
const LINE_OPACITY = 0.12
const LINE_HIGHLIGHT_RADIUS = 120
const LINE_HIGHLIGHT_OPACITY = 0.45
const PARTICLE_RADIUS = 1.5
const MAX_VELOCITY = 1.8
const DAMPING = 0.92
const RETURN_TO_BASE = 0.003

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  baseX: number
  baseY: number
}

// Distance from point (px, py) to segment (x1,y1)-(x2,y2)
function pointToSegmentDist(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1
  const dy = y2 - y1
  const lenSq = dx * dx + dy * dy
  if (lenSq === 0) return Math.hypot(px - x1, py - y1)
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq
  t = Math.max(0, Math.min(1, t))
  const qx = x1 + t * dx
  const qy = y1 + t * dy
  return Math.hypot(px - qx, py - qy)
}

const THEME_COLORS = {
  dark: {
    line: 'rgba(160, 160, 200',
    particle: 'rgba(180, 180, 210, 0.5)',
  },
  light: {
    line: 'rgba(100, 100, 130',
    particle: 'rgba(80, 80, 110, 0.4)',
  },
} as const

export function MouseReactiveBackground() {
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const particlesRef = useRef<Particle[]>([])
  const initializedRef = useRef(false)
  const themeRef = useRef(theme)

  themeRef.current = theme

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let w = 0
    let h = 0

    const initParticles = () => {
      if (w < 10 || h < 10) return
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        baseX: 0,
        baseY: 0,
      }))
      particlesRef.current.forEach((p) => {
        p.baseX = p.x
        p.baseY = p.y
      })
      initializedRef.current = true
    }

    const setSize = () => {
      const dpr = window.devicePixelRatio ?? 1
      const rect = container.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      if (!initializedRef.current || particlesRef.current.length === 0) {
        initParticles()
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height
      if (inside) {
        mouseRef.current = { x, y }
      } else {
        mouseRef.current = { x: -9999, y: -9999 }
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    const draw = () => {
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseActive = mx >= 0 && my >= 0
      const particles = particlesRef.current

      if (particles.length === 0) {
        const rect = container.getBoundingClientRect()
        if (rect.width >= 10 && rect.height >= 10) {
          w = rect.width
          h = rect.height
          initParticles()
        }
        animationId = requestAnimationFrame(draw)
        return
      }

      ctx.clearRect(0, 0, w, h)

      // Attract to cursor + gentle return to base + light drift; cap velocity
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = mx - p.x
        const dy = my - p.y
        const dist = Math.hypot(dx, dy)

        if (mouseActive && dist < MOUSE_RADIUS && dist > 1) {
          const strength =
            (1 - dist / MOUSE_RADIUS) * MOUSE_ATTRACT_STRENGTH
          const nx = dx / dist
          const ny = dy / dist
          p.vx += nx * strength
          p.vy += ny * strength
        }

        p.vx += (p.baseX - p.x) * RETURN_TO_BASE + (Math.random() - 0.5) * DRIFT
        p.vy += (p.baseY - p.y) * RETURN_TO_BASE + (Math.random() - 0.5) * DRIFT
        p.vx *= DAMPING
        p.vy *= DAMPING

        const speed = Math.hypot(p.vx, p.vy)
        if (speed > MAX_VELOCITY) {
          p.vx = (p.vx / speed) * MAX_VELOCITY
          p.vy = (p.vy / speed) * MAX_VELOCITY
        }

        p.x += p.vx
        p.y += p.vy

        p.x = Math.max(0, Math.min(w, p.x))
        p.y = Math.max(0, Math.min(h, p.y))
        if (p.x <= 0 || p.x >= w) p.vx *= -0.3
        if (p.y <= 0 || p.y >= h) p.vy *= -0.3
      }

      // Draw connections; highlight lines near cursor
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist >= CONNECT_DISTANCE) continue

          const baseAlpha = (1 - dist / CONNECT_DISTANCE) * LINE_OPACITY
          let alpha = baseAlpha

          if (mouseActive) {
            const d = pointToSegmentDist(mx, my, a.x, a.y, b.x, b.y)
            if (d < LINE_HIGHLIGHT_RADIUS) {
              const t = 1 - d / LINE_HIGHLIGHT_RADIUS
              alpha = baseAlpha + t * (LINE_HIGHLIGHT_OPACITY - baseAlpha)
            }
          }

          const colors = THEME_COLORS[themeRef.current]
          ctx.strokeStyle = `${colors.line}, ${alpha})`
          ctx.lineWidth = alpha > 0.2 ? 1.2 : 0.8
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      ctx.fillStyle = THEME_COLORS[themeRef.current].particle
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        ctx.beginPath()
        ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(draw)
    }

    setSize()

    window.addEventListener('resize', setSize)
    document.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    draw()

    return () => {
      window.removeEventListener('resize', setSize)
      document.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [theme])

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden
      />
    </div>
  )
}
