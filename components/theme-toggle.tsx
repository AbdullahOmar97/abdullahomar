"use client"

import { useState, useEffect } from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"

type Theme = "light" | "dark" | "system"

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system")
  const [mounted, setMounted] = useState(false)
  const { language } = useLanguage()
  const t = getTranslation(language)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      // Smart auto-detection based on time
      const hour = new Date().getHours()
      const isNightTime = hour < 6 || hour >= 19
      const autoTheme = isNightTime ? "dark" : "light"
      applyTheme(autoTheme)
    }
  }, [])

  const applyTheme = (selectedTheme: Theme) => {
    const root = document.documentElement

    if (selectedTheme === "system") {
      const hour = new Date().getHours()
      const isNightTime = hour < 6 || hour >= 19
      if (isNightTime) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    } else if (selectedTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }

  const cycleTheme = () => {
    const themes: Theme[] = ["light", "dark", "system"]
    const currentIndex = themes.indexOf(theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]

    setTheme(nextTheme)
    localStorage.setItem("theme", nextTheme)
    applyTheme(nextTheme)
  }

  if (!mounted) return null

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun size={18} aria-hidden="true" />
      case "dark":
        return <Moon size={18} aria-hidden="true" />
      case "system":
        return <Monitor size={18} aria-hidden="true" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case "light":
        return language === "ar" ? "فاتح" : "Light"
      case "dark":
        return language === "ar" ? "داكن" : "Dark"
      case "system":
        return language === "ar" ? "تلقائي" : "System"
    }
  }

  const ariaLabelText = `${t.a11y?.themeToggle || "Toggle theme, current theme:"} ${getLabel()}`

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
        "bg-secondary/50 hover:bg-secondary text-foreground",
        "transition-all duration-300 border border-border/50",
        "focus-visible:outline-2 focus-visible:outline-primary",
      )}
      aria-label={ariaLabelText}
      title={ariaLabelText}
    >
      <span className="transition-transform duration-300" aria-hidden="true">{getIcon()}</span>
      <span className="hidden sm:inline text-xs">{getLabel()}</span>
    </button>
  )
}
