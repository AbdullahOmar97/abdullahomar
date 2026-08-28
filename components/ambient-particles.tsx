"use client"

import React, { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseAlpha: number
}

export function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const isDark = resolvedTheme === "dark" || !resolvedTheme

    // Node count scaled for performance
    const particleCount = Math.min(Math.floor((width * height) / 22000), 55)
    const maxDistance = 140
    const mouseRadius = 160

    const particles: Particle[] = []
    const mouse = { x: -1000, y: -1000, isOver: false }

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 1,
        baseAlpha: Math.random() * 0.4 + 0.25,
      })
    }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.isOver = true
    }

    const handleMouseLeave = () => {
      mouse.isOver = false
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener("resize", handleResize, { passive: true })
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true })

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Theme-based colors
      const particleColor = isDark ? "20, 184, 166" : "13, 148, 136" // Teal primary
      const secondaryColor = isDark ? "56, 189, 248" : "2, 132, 199" // Cyan secondary

      // Draw subtle connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.hypot(dx, dy)

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isDark ? 0.18 : 0.12)
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(${particleColor}, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }

        // Mouse connection & gentle repel
        if (mouse.isOver) {
          const mdx = p1.x - mouse.x
          const mdy = p1.y - mouse.y
          const mDist = Math.hypot(mdx, mdy)

          if (mDist < mouseRadius) {
            const mouseAlpha = (1 - mDist / mouseRadius) * (isDark ? 0.35 : 0.22)
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = `rgba(${secondaryColor}, ${mouseAlpha})`
            ctx.lineWidth = 1
            ctx.stroke()

            // Subtle push
            const force = (1 - mDist / mouseRadius) * 0.6
            p1.x += (mdx / mDist) * force
            p1.y += (mdy / mDist) * force
          }
        }

        // Draw particle node
        ctx.beginPath()
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particleColor}, ${p1.baseAlpha * (isDark ? 0.7 : 0.5)})`
        ctx.fill()

        // Move particle
        p1.x += p1.vx
        p1.y += p1.vy

        // Screen wrap
        if (p1.x < 0) p1.x = width
        if (p1.x > width) p1.x = 0
        if (p1.y < 0) p1.y = height
        if (p1.y > height) p1.y = 0
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [resolvedTheme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60 dark:opacity-45 transition-opacity duration-700"
      aria-hidden="true"
    />
  )
}
