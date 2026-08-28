"use client"

import { useState, useEffect, useCallback } from "react"
import { Menu, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { language, isRTL } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const t = getTranslation(language)

  const navItems = [
    { id: "about", label: t.nav.about, href: "#about" },
    { id: "experience", label: t.nav.experience, href: "#experience" },
    { id: "projects", label: language === "ar" ? "المشاريع" : "Projects", href: "#projects" },
    { id: "skills", label: t.nav.skills, href: "#skills" },
    { id: "education", label: t.nav.education, href: "#education" },
    { id: "contact", label: t.nav.contact, href: "#contact" },
    { id: "services", label: t.nav.services, href: "/services" },
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
      setIsScrolled(window.scrollY > 30)

      if (pathname === "/") {
        const sections = ["contact", "education", "skills", "projects", "experience", "about", "hero"]
        const scrollPosition = window.scrollY + 200

        for (const sectionId of sections) {
          const el = document.getElementById(sectionId)
          if (el && el.offsetTop <= scrollPosition) {
            setActiveSection(sectionId === "hero" ? "" : sectionId)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  useEffect(() => {
    if (isMobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isMobileMenuOpen, handleKeyDown])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const targetId = href.replace("#", "")

      if (pathname !== "/") {
        router.push(`/${href}`)
      } else {
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" })
          setActiveSection(targetId)
        }
      }
      setIsMobileMenuOpen(false)
    }
  }

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
          isScrolled
            ? "bg-background/85 backdrop-blur-md border-b border-border/80 shadow-sm py-3"
            : "bg-transparent py-5",
        )}
      >
        <nav
          aria-label={t.a11y?.navAriaLabel || "Main Navigation"}
          className="container mx-auto max-w-6xl px-6 lg:px-8"
        >
          <div className="flex items-center justify-between">
            <a
              href="/#hero"
              onClick={(e) => handleNavClick(e, "#hero")}
              className="text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-primary"
              aria-label={t.a11y?.logoAria || "Abdullah Omar - Home"}
            >
              {language === "ar" ? "عبدالله عمر" : "Abdullah Omar"}
              <span className="text-primary animate-pulse" aria-hidden="true">.</span>
            </a>

            {/* Desktop Navigation with Active ScrollSpy Highlighting */}
            <ul className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/services"
                    ? pathname.startsWith("/services")
                    : activeSection === item.id

                return (
                  <li key={item.id}>
                    <a
                      href={pathname === "/" ? item.href : `/${item.href}`}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={cn(
                        "relative text-sm px-3 py-1.5 rounded-full transition-all duration-200 focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-primary font-medium",
                        isActive
                          ? "text-primary bg-primary/10 font-semibold shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {item.label}
                      {isActive && (
                        <span
                          className="absolute bottom-0 inset-x-3 h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(20,184,166,0.8)]"
                          aria-hidden="true"
                        />
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-foreground p-2 rounded-lg hover:bg-muted/60 transition-colors focus-visible:outline-2 focus-visible:outline-primary"
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
              className="md:hidden mt-4 pb-4 pt-4 px-4 w-full bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <ul className="flex flex-col gap-1.5 w-full">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/services"
                      ? pathname.startsWith("/services")
                      : activeSection === item.id

                  return (
                    <li key={item.id} className="w-full">
                      <a
                        href={pathname === "/" ? item.href : `/${item.href}`}
                        className={cn(
                          "text-base block py-2.5 px-3 rounded-xl font-medium transition-all focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-primary",
                          isActive
                            ? "text-primary bg-primary/10 font-semibold"
                            : "text-foreground hover:text-primary hover:bg-muted/50"
                        )}
                        onClick={(e) => handleNavClick(e, item.href)}
                      >
                        {item.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </nav>
      </header>
    </>
  )
}

