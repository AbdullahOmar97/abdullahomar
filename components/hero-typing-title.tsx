"use client"

import React, { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"

const titlesEn = [
  "Data Science & Artificial Intelligence",
  "Autonomous AI Agents & LangGraph",
  "Full-Stack Web Engineering (Next.js / Django)",
  "Computer Vision & Workflow Automation",
]

const titlesAr = [
  "علوم البيانات والذكاء الاصطناعي",
  "وكلاء الذكاء الاصطناعي و LangGraph",
  "تطوير البرمجيات المتكاملة (Next.js / Django)",
  "الرؤية الحاسوبية وأتمتة العمليات",
]

export function HeroTypingTitle({ className }: { className?: string }) {
  const { language } = useLanguage()
  const titles = language === "ar" ? titlesAr : titlesEn

  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(70)

  // Reset index when language switches
  useEffect(() => {
    setCurrentIndex(0)
    setDisplayText("")
    setIsDeleting(false)
  }, [language])

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      setDisplayText(titles[0])
      return
    }

    const currentFullTitle = titles[currentIndex % titles.length]

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        setDisplayText(currentFullTitle.slice(0, displayText.length + 1))
        setTypingSpeed(60)

        // Finished typing word
        if (displayText.length + 1 === currentFullTitle.length) {
          // Pause at full word
          setTypingSpeed(2200)
          setIsDeleting(true)
        }
      } else {
        // Deleting backward
        setDisplayText(currentFullTitle.slice(0, displayText.length - 1))
        setTypingSpeed(30)

        // Finished deleting
        if (displayText.length === 0) {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % titles.length)
          setTypingSpeed(400)
        }
      }
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, currentIndex, titles, typingSpeed])

  return (
    <div className={cn("min-h-[1.75rem] flex items-center gap-1.5", className)}>
      <span className="text-lg md:text-xl font-medium text-primary tracking-wide">
        {displayText}
      </span>
      <span
        className="inline-block w-0.5 h-5 bg-primary animate-pulse ml-0.5"
        aria-hidden="true"
      />
    </div>
  )
}
