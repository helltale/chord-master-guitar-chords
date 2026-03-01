import { useRef, useEffect } from 'react'

const PARTICLE_COUNT = 90
const CONNECT_DISTANCE = 140
const MOUSE_RADIUS = 180
const MOUSE_FORCE = 0.08
const DRIFT = 0.2
const LINE_OPACITY = 0.15
const PARTICLE_RADIUS = 1.5

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  baseX: number
  baseY: number
}

export function MouseReactiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const particlesRef = useRef<Particle[]>([])

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
      initParticles()
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
      const particles = particlesRef.current

      ctx.clearRect(0, 0, w, h)

      // Mouse repulsion and drift
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.hypot(dx, dy)

        if (dist < MOUSE_RADIUS && dist > 0) {
          const strength = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE
          const nx = dx / dist
          const ny = dy / dist
          p.vx += nx * strength
          p.vy += ny * strength
        }

        // Gentle return toward base + random drift
        p.vx += (p.baseX - p.x) * 0.002 + (Math.random() - 0.5) * DRIFT
        p.vy += (p.baseY - p.y) * 0.002 + (Math.random() - 0.5) * DRIFT
        p.vx *= 0.95
        p.vy *= 0.95
        p.x += p.vx
        p.y += p.vy

        // Keep in bounds (soft wrap)
        p.x = (p.x + w) % w
        p.y = (p.y + h) % h
      }

      // Draw connections
      ctx.strokeStyle = `rgba(100, 100, 120, ${LINE_OPACITY})`
      ctx.lineWidth = 0.8

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < CONNECT_DISTANCE) {
            const alpha = (1 - dist / CONNECT_DISTANCE) * LINE_OPACITY
            ctx.strokeStyle = `rgba(80, 80, 100, ${alpha})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // Draw particles
      ctx.fillStyle = 'rgba(90, 90, 110, 0.5)'
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
  }, [])

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
