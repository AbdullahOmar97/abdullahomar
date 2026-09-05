"use client"

import { LoadingBadge3D } from "@/components/ui/loading-badge-3d"

export default function ServicesLoading() {
  return (
    <LoadingBadge3D
      variant="fullscreen"
      title="Loading Services"
      subtitle="Fetching architectural & engineering offerings..."
    />
  )
}
