"use client"

import { useState, useEffect, useCallback } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { language, isRTL } = useLanguage()
  const t = getTranslation(language)

  const navItems = [
    { label: t.nav.about, href: "/#about" },
    { label: t.nav.experience, href: "/#experience" },
    { label: t.nav.skills, href: "/#skills" },
    { label: t.nav.education, href: "/#education" },
    { label: t.nav.contact, href: "/#contact" },
    { label: t.nav.services, href: "/services" },
  ]

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    },
    [isMobileMenuOpen],
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isMobileMenuOpen, handleKeyDown])

  return (
    <>
      {/* WCAG 2.4.1 Bypass Blocks - Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring font-medium"
      >
        {t.a11y?.skipLink || "Skip to main content"}
      </a>

      <header
        role="banner"
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-transparent",
        )}
      >
        <nav
          aria-label={t.a11y?.navAriaLabel || "Main Navigation"}
          className="container mx-auto max-w-6xl px-6 lg:px-8 py-4"
        >
          <div className="flex items-center justify-between">
            <a
              href="#"
              className="text-xl font-bold tracking-tight text-foreground focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-primary"
              aria-label={t.a11y?.logoAria || "Abdullah Omar - Home"}
            >
              {language === "ar" ? "عبدالله عمر" : "Abdullah Omar"}
              <span className="text-primary" aria-hidden="true">.</span>
            </a>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-primary px-1 py-0.5"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-foreground p-2 rounded-md focus-visible:outline-2 focus-visible:outline-primary"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? t.a11y?.closeMenu || "Close menu" : t.a11y?.openMenu || "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-menu"
              >
                {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div
              id="mobile-nav-menu"
              role="region"
              aria-label="Mobile Navigation"
              className="md:hidden mt-4 pb-4 pt-4 px-4 w-full bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-lg"
            >
              <ul className={cn("flex flex-col gap-4", isRTL && "items-end")}>
                {navItems.map((item) => (
                  <li key={item.href} className="w-full">
                    <a
                      href={item.href}
                      className="text-base text-foreground hover:text-primary transition-colors block py-2 font-medium focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </header>
    </>
  )
}
