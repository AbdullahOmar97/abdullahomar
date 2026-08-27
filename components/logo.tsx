"use client"

import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: number
}

export function Logo({ className, size = 40 }: LogoProps) {
  return (
    <div
      className={cn("relative shrink-0 flex items-center justify-center overflow-hidden", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Image
        src="/logo-3d-cutout.png"
        alt="Abdullah Omar Logo"
        width={size * 2}
        height={size * 2}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  )
}
