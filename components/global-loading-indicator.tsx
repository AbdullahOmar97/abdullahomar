"use client"

import React from "react"
import { useLoading } from "@/lib/loading-context"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { LoadingBadge3D } from "@/components/ui/loading-badge-3d"

export const GlobalLoadingIndicator: React.FC = () => {
  const { loadingState } = useLoading()
  const { language, isRTL } = useLanguage()
  const t = getTranslation(language)

  if (!loadingState.isLoading) {
    return null
  }

  const isPageTransition = loadingState.mode === "fullscreen"

  const title =
    loadingState.title ||
    (isPageTransition ? t.loading.pageTitle : t.loading.dataTitle)

  const subtitle =
    loadingState.subtitle ||
    (isPageTransition ? t.loading.pageSubtitle : t.loading.dataSubtitle)

  return (
    <LoadingBadge3D
      variant={loadingState.mode}
      title={title}
      subtitle={subtitle}
      progress={loadingState.progress}
      isRTL={isRTL}
    />
  )
}
