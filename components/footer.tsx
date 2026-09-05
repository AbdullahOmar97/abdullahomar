"use client"

import React, { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { useLoading } from "@/lib/loading-context"
import { getTranslation } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Box, Sparkles, ChevronUp } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Footer() {
  const { language, isRTL } = useLanguage()
  const { startLoading, stopLoading } = useLoading()
  const t = getTranslation(language)
  const [isPreviewing, setIsPreviewing] = useState(false)

  const triggerPreview = (mode: "fullscreen" | "floating") => {
    if (isPreviewing) return
    setIsPreviewing(true)

    const isFullscreen = mode === "fullscreen"
    const title =
      isFullscreen
        ? (language === "ar" ? "جارٍ التحميل..." : "Loading...")
        : (language === "ar" ? "جارٍ جلب البيانات..." : "Fetching Data...")

    const subtitle =
      isFullscreen
        ? (language === "ar" ? "يرجى الانتظار لحظة" : "Please wait a moment")
        : (language === "ar" ? "تحديث المحتوى" : "Updating content")

    let progress = 0
    startLoading({
      mode,
      title,
      subtitle,
      progress: 0,
    })

    const interval = setInterval(() => {
      progress += 10
      if (progress >= 100) {
        clearInterval(interval)
        startLoading({
          mode,
          title,
          subtitle,
          progress: 100,
        })
        setTimeout(() => {
          stopLoading()
          setIsPreviewing(false)
        }, 600)
      } else {
        startLoading({
          mode,
          title,
          subtitle,
          progress,
        })
      }
    }, 280)
  }

  return (
    <footer
      role="contentinfo"
      className="border-t border-border py-8 mt-24 bg-background/50 backdrop-blur-sm"
    >
      <div className="container mx-auto max-w-6xl px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start text-muted-foreground text-sm">
        <p>
          © {new Date().getFullYear()} Abdullah Omar. {t.footer.rights}
        </p>

        {/* 3D Badge Preview Controls */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isPreviewing}
                className="gap-2 rounded-full border-primary/40 bg-primary/5 hover:bg-primary/10 text-foreground font-mono text-xs shadow-[0_0_15px_rgba(20,184,166,0.15)] transition-all hover:border-primary focus-visible:ring-primary"
                aria-label={t.footer.previewBadge}
              >
                <Box className="w-3.5 h-3.5 text-primary animate-pulse" aria-hidden="true" />
                <span>{t.footer.previewBadge}</span>
                <ChevronUp className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={isRTL ? "start" : "end"}
              side="top"
              className="w-56 p-1.5 rounded-2xl bg-card/95 backdrop-blur-xl border-border/80 shadow-xl"
            >
              <DropdownMenuItem
                onClick={() => triggerPreview("fullscreen")}
                className="gap-2.5 py-2 px-3 rounded-xl cursor-pointer text-xs font-medium focus:bg-primary/10 focus:text-primary"
              >
                <Sparkles className="w-4 h-4 text-teal-500" aria-hidden="true" />
                <div className="flex flex-col text-start">
                  <span>{t.footer.previewFullscreen}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {language === "ar" ? "شاشة كاملة وتأثير زجاجي" : "Full overlay & glass HUD"}
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => triggerPreview("floating")}
                className="gap-2.5 py-2 px-3 rounded-xl cursor-pointer text-xs font-medium focus:bg-primary/10 focus:text-primary"
              >
                <Box className="w-4 h-4 text-purple-500" aria-hidden="true" />
                <div className="flex flex-col text-start">
                  <span>{t.footer.previewFloating}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {language === "ar" ? "شارة عائمة في الزاوية" : "Corner floating HUD"}
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </footer>
  )
}
