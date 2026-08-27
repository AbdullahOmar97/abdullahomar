"use client"

import { Languages } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="relative focus-visible:outline-2 focus-visible:outline-primary"
      aria-label={language === "en" ? "التبديل إلى اللغة العربية" : "Switch to English"}
      lang={language === "en" ? "ar" : "en"}
    >
      <Languages className="h-5 w-5" aria-hidden="true" />
      <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-primary text-primary-foreground rounded px-1" aria-hidden="true">
        {language === "en" ? "ع" : "EN"}
      </span>
    </Button>
  )
}
