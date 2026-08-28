"use client"

import React, { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  delay?: number // ms
  direction?: "up" | "down" | "left" | "right" | "none"
  threshold?: number
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  threshold = 0.15,
  ...props
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const domRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (domRef.current) {
            observer.unobserve(domRef.current)
          }
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    )

    const currentRef = domRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold])

  const getTransformStyle = () => {
    if (isVisible) return "translate3d(0, 0, 0)"
    switch (direction) {
      case "up":
        return "translate3d(0, 28px, 0)"
      case "down":
        return "translate3d(0, -28px, 0)"
      case "left":
        return "translate3d(28px, 0, 0)"
      case "right":
        return "translate3d(-28px, 0, 0)"
      case "none":
      default:
        return "translate3d(0, 0, 0)"
    }
  }

  return (
    <div
      ref={domRef}
      className={cn("transition-all duration-700 ease-out will-change-[opacity,transform]", className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransformStyle(),
        transitionDelay: `${delay}ms`,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
