"use client"

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import { usePathname } from "next/navigation"

export type LoadingMode = "fullscreen" | "floating" | "inline"

interface LoadingState {
  isLoading: boolean
  mode: LoadingMode
  title?: string
  subtitle?: string
  progress?: number
}

interface LoadingContextType {
  loadingState: LoadingState
  startLoading: (options?: {
    mode?: LoadingMode
    title?: string
    subtitle?: string
    progress?: number
  }) => void
  stopLoading: () => void
  startPageTransition: (title?: string, subtitle?: string) => void
  endPageTransition: () => void
  startFetchLoading: (title?: string, subtitle?: string) => void
  endFetchLoading: () => void
  withLoading: <T>(
    action: Promise<T> | (() => Promise<T>),
    options?: { mode?: LoadingMode; title?: string; subtitle?: string }
  ) => Promise<T>
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    mode: "fullscreen",
  })
  const [activeFetches, setActiveFetches] = useState<number>(0)
  const pathname = usePathname()

  // Reset page transition loading when pathname actually changes
  useEffect(() => {
    setLoadingState((prev) => {
      if (prev.isLoading && prev.mode === "fullscreen") {
        return { isLoading: false, mode: "fullscreen" }
      }
      return prev
    })
  }, [pathname])

  // Global click listener for internal route link navigation
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = (e.target as HTMLElement)?.closest("a")
      if (!target) return

      const href = target.getAttribute("href")
      if (!href) return

      // Ignore external links, hash-only anchors, target="_blank", or modifier clicks
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        target.getAttribute("target") === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return
      }

      // Check if destination is a different route than current pathname
      const currentPath = window.location.pathname
      const targetUrl = new URL(href, window.location.origin)

      if (targetUrl.pathname !== currentPath) {
        setLoadingState({
          isLoading: true,
          mode: "fullscreen",
        })
      }
    }

    document.addEventListener("click", handleLinkClick, { capture: true })
    return () => document.removeEventListener("click", handleLinkClick, { capture: true })
  }, [])

  const startLoading = useCallback(
    (options?: {
      mode?: LoadingMode
      title?: string
      subtitle?: string
      progress?: number
    }) => {
      setLoadingState({
        isLoading: true,
        mode: options?.mode || "fullscreen",
        title: options?.title,
        subtitle: options?.subtitle,
        progress: options?.progress,
      })
    },
    []
  )

  const stopLoading = useCallback(() => {
    setLoadingState((prev) => ({ ...prev, isLoading: false }))
  }, [])

  const startPageTransition = useCallback((title?: string, subtitle?: string) => {
    setLoadingState({
      isLoading: true,
      mode: "fullscreen",
      title,
      subtitle,
    })
  }, [])

  const endPageTransition = useCallback(() => {
    setLoadingState((prev) => {
      if (prev.mode === "fullscreen") {
        return { ...prev, isLoading: false }
      }
      return prev
    })
  }, [])

  const startFetchLoading = useCallback((title?: string, subtitle?: string) => {
    setActiveFetches((count) => {
      const next = count + 1
      if (next === 1) {
        setLoadingState((prev) =>
          prev.isLoading && prev.mode === "fullscreen"
            ? prev
            : {
                isLoading: true,
                mode: "floating",
                title,
                subtitle,
              }
        )
      }
      return next
    })
  }, [])

  const endFetchLoading = useCallback(() => {
    setActiveFetches((count) => {
      const next = Math.max(0, count - 1)
      if (next === 0) {
        setLoadingState((prev) => (prev.mode === "floating" ? { ...prev, isLoading: false } : prev))
      }
      return next
    })
  }, [])

  const withLoading = useCallback(
    async <T,>(
      action: Promise<T> | (() => Promise<T>),
      options?: { mode?: LoadingMode; title?: string; subtitle?: string }
    ): Promise<T> => {
      const isFloating = options?.mode === "floating"
      if (isFloating) {
        startFetchLoading(options?.title, options?.subtitle)
      } else {
        startLoading({
          mode: options?.mode || "fullscreen",
          title: options?.title,
          subtitle: options?.subtitle,
        })
      }

      try {
        const result = typeof action === "function" ? await action() : await action
        return result
      } finally {
        if (isFloating) {
          endFetchLoading()
        } else {
          stopLoading()
        }
      }
    },
    [startFetchLoading, endFetchLoading, startLoading, stopLoading]
  )

  return (
    <LoadingContext.Provider
      value={{
        loadingState,
        startLoading,
        stopLoading,
        startPageTransition,
        endPageTransition,
        startFetchLoading,
        endFetchLoading,
        withLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}
