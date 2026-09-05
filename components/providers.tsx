"use client"

import React, { type ReactNode } from "react"
import { LanguageProvider } from "@/lib/language-context"
import { LoadingProvider } from "@/lib/loading-context"
import { GlobalLoadingIndicator } from "@/components/global-loading-indicator"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <LoadingProvider>
        {children}
        <GlobalLoadingIndicator />
      </LoadingProvider>
    </LanguageProvider>
  )
}
