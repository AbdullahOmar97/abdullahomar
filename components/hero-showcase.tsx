"use client"

import React, { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function HeroShowcase({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Gentle 3D tilt limits (+/- 10 degrees)
    const rotateX = ((y - centerY) / centerY) * -10
    const rotateY = ((x - centerX) / centerX) * 10

    setRotate({ x: rotateX, y: rotateY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setRotate({ x: 0, y: 0 })
  }, [])

  return (
    <div
      className={cn(
        "flex justify-center items-center w-full my-2 lg:my-0 perspective-1000 max-w-full overflow-visible",
        className,
      )}
      aria-hidden="true"
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative group animate-hero-float cursor-pointer w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[450px] mx-auto"
        style={{
          transformStyle: "preserve-3d",
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
        }}
      >
        {/* Breathing multi-color ambient backlights */}
        <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-primary/40 via-amber-500/30 to-primary/40 rounded-3xl blur-xl sm:blur-2xl animate-hero-glow pointer-events-none" />

        {/* 3D Framed Card */}
        <div className="relative w-full aspect-[16/9.5] rounded-2xl overflow-hidden border border-border/80 bg-card/90 shadow-2xl backdrop-blur-md flex items-center justify-center p-2 sm:p-2.5">
          <Image
            src="/hero-logo.jpg"
            alt=""
            width={520}
            height={300}
            className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
            priority
          />

          {/* Continuous Metallic Shimmer Sweep Light Sheen */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-xl">
            <div className="absolute inset-0 -top-1/2 -bottom-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer-sweep" />
          </div>

          {/* Interactive Mouse Glare on Hover */}
          {isHovered && (
            <div
              className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent"
              style={{
                transform: `translateX(${rotate.y * 3}px) translateY(${rotate.x * -3}px)`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
