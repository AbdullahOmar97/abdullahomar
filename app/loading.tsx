"use client"

import { LoadingBadge3D } from "@/components/ui/loading-badge-3d"

export default function Loading() {
  return (
    <LoadingBadge3D
      variant="fullscreen"
      title="Loading Experience"
      subtitle="Preparing 3D environment..."
    />
  )
}
