"use client"

import React, { useEffect, useRef } from "react"
import * as THREE from "three"
import { cn } from "@/lib/utils"

export interface LoadingBadge3DProps {
  title?: string
  subtitle?: string
  variant?: "fullscreen" | "floating" | "inline"
  isRTL?: boolean
  className?: string
  progress?: number
}

export const LoadingBadge3D: React.FC<LoadingBadge3DProps> = ({
  title = "Loading...",
  subtitle,
  variant = "fullscreen",
  isRTL = false,
  className,
  progress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasMountRef = useRef<HTMLDivElement>(null)
  const reqRef = useRef<number>(0)

  useEffect(() => {
    const mount = canvasMountRef.current
    if (!mount) return

    const size = variant === "floating" ? 44 : 88
    const width = mount.clientWidth || size
    const height = mount.clientHeight || size

    // Minimal, lightweight Three.js Scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.z = 3.6

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2))
    mount.appendChild(renderer.domElement)

    // Soft balanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x14b8a6, 2.5, 8)
    pointLight.position.set(2, 2, 2)
    scene.add(pointLight)

    const pointLightBack = new THREE.PointLight(0x8b5cf6, 1.5, 8)
    pointLightBack.position.set(-2, -1, 1)
    scene.add(pointLightBack)

    // Sleek faceted 3D Octahedron core
    const coreGeo = new THREE.OctahedronGeometry(0.85, 0)
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x0d9488,
      emissive: 0x115e59,
      emissiveIntensity: 0.25,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.92,
      flatShading: true,
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    scene.add(core)

    // Single delicate orbit ring
    const ringGeo = new THREE.TorusGeometry(1.22, 0.018, 16, 48)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      transparent: true,
      opacity: 0.75,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 3.5
    scene.add(ring)

    // Resize handling
    const handleResize = () => {
      if (!mount || !renderer) return
      const w = mount.clientWidth || width
      const h = mount.clientHeight || height
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(mount)

    // Smooth, gentle rotation animation
    let lastTime = performance.now()
    const animate = (time: number) => {
      reqRef.current = requestAnimationFrame(animate)
      const delta = (time - lastTime) * 0.001
      lastTime = time

      core.rotation.y += 1.4 * delta
      core.rotation.x += 0.8 * delta

      ring.rotation.z += 1.1 * delta
      ring.rotation.y -= 0.6 * delta

      const pulse = 1 + Math.sin(time * 0.003) * 0.03
      core.scale.set(pulse, pulse, pulse)

      renderer.render(scene, camera)
    }

    reqRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(reqRef.current)
      resizeObserver.disconnect()
      coreGeo.dispose()
      coreMat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [variant])

  // Fullscreen Page Transition Mode: Clean, minimal frosted glass card
  if (variant === "fullscreen") {
    return (
      <div
        ref={containerRef}
        role="status"
        aria-live="polite"
        className={cn(
          "fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-md p-4 transition-opacity duration-200 animate-in fade-in select-none",
          className
        )}
      >
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="relative max-w-xs w-full mx-auto p-6 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/80 shadow-2xl flex flex-col items-center text-center"
        >
          {/* 3D Minimal Canvas */}
          <div
            ref={canvasMountRef}
            className="w-24 h-24 relative flex items-center justify-center"
            aria-hidden="true"
          />

          {/* Clean Title & Subtitle */}
          <div className="mt-3 space-y-1 w-full">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Minimal Progress Bar */}
          <div className="w-full mt-4 h-1 bg-muted/70 rounded-full overflow-hidden relative">
            {typeof progress === "number" ? (
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary to-primary/30 rounded-full animate-[shimmer-sweep_1.6s_infinite]" />
            )}
          </div>
        </div>
      </div>
    )
  }

  // Floating Corner Mode: Ultra-clean minimal pill
  if (variant === "floating") {
    return (
      <aside
        ref={containerRef}
        role="status"
        aria-live="polite"
        dir={isRTL ? "rtl" : "ltr"}
        className={cn(
          "fixed bottom-6 z-[90] flex items-center gap-2.5 px-3 py-2 rounded-full bg-card/90 backdrop-blur-xl border border-border/80 shadow-lg animate-in slide-in-from-bottom-3 duration-200 select-none",
          isRTL ? "left-6" : "right-6",
          className
        )}
      >
        <div
          ref={canvasMountRef}
          className="w-9 h-9 relative flex-shrink-0"
          aria-hidden="true"
        />
        <div className="flex flex-col text-start pr-1 pl-0.5">
          <span className="text-xs font-medium text-foreground line-clamp-1 max-w-[180px]">
            {title}
          </span>
          {subtitle && (
            <span className="text-[10px] text-muted-foreground line-clamp-1 max-w-[180px]">
              {subtitle}
            </span>
          )}
        </div>
      </aside>
    )
  }

  // Inline mode: Simple embedded badge
  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      dir={isRTL ? "rtl" : "ltr"}
      className={cn(
        "relative w-full p-5 rounded-xl bg-card/50 backdrop-blur-sm border border-border/60 flex flex-col items-center justify-center text-center",
        className
      )}
    >
      <div
        ref={canvasMountRef}
        className="w-20 h-20 relative flex items-center justify-center"
        aria-hidden="true"
      />
      <div className="mt-2 space-y-0.5">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  )
}
