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
      className="focus-visible:outline-2 focus-visible:outline-primary"
      aria-label={language === "en" ? "التبديل إلى اللغة العربية" : "Switch to English"}
      title={language === "en" ? "التبديل إلى اللغة العربية" : "Switch to English"}
      lang={language === "en" ? "ar" : "en"}
    >
      <Languages className="h-5 w-5" aria-hidden="true" />
    </Button>
  )
}
