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

    // Gentle 3D tilt limits (+/- 8 degrees)
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8

    setRotate({ x: rotateX, y: rotateY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setRotate({ x: 0, y: 0 })
  }, [])

  return (
    <div
      className={cn(
        "flex justify-center items-center w-full my-2 lg:my-0 max-w-full overflow-visible",
        className,
      )}
      aria-hidden="true"
    >
      {/* Floating animation wrapper */}
      <div className="animate-hero-float w-full max-w-[300px] xs:max-w-[330px] sm:max-w-[380px] lg:max-w-[440px] mx-auto flex justify-center">
        {/* Interactive Tilt Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="relative group cursor-pointer w-full"
          style={{
            transform: isHovered
              ? `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1)`
              : "none",
            transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
          }}
        >
          {/* 3D Framed Card with Static Shadow */}
          <div className="relative w-full aspect-[16/9.5] rounded-2xl overflow-hidden border border-border/80 bg-card/90 shadow-xl flex items-center justify-center p-2 sm:p-2.5">
            <Image
              src="/hero-logo.jpg"
              alt=""
              width={520}
              height={300}
              className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
              priority
            />

            {/* Continuous Metallic Shimmer Sweep Light Sheen (GPU-composited) */}
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-xl">
              <div className="absolute inset-0 -top-1/2 -bottom-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer-sweep will-change-transform" />
            </div>

            {/* Interactive Mouse Glare on Hover */}
            {isHovered && (
              <div
                className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                style={{
                  transform: `translateX(${rotate.y * 2}px) translateY(${rotate.x * -2}px)`,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

