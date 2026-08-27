"use client"

import { HeroShowcase } from "./hero-showcase"
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const { language, isRTL } = useLanguage()
  const t = getTranslation(language)

  return (
    <section className="min-h-screen flex flex-col justify-center pt-24 pb-12 lg:py-0">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Mobile: Placed at the top above "Hello, I'm"; Desktop: Side column */}
        <div className={cn("w-full flex justify-center order-first", isRTL ? "lg:order-1" : "lg:order-2")}>
          <HeroShowcase />
        </div>

        {/* Text & Actions: Placed below artwork on mobile, adjacent column on desktop */}
        <div
          className={cn(
            "space-y-6 order-2",
            isRTL ? "text-right lg:order-2" : "text-left lg:order-1",
          )}
        >
          <div className="space-y-2">
            <p className="text-primary font-mono text-sm">{t.hero.greeting}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">{t.hero.name}</h1>
            <p className="text-xl md:text-2xl text-muted-foreground">{t.hero.title}</p>
            <p className="text-lg text-primary">{t.hero.specialization}</p>
          </div>

          <p className="text-muted-foreground leading-relaxed max-w-lg">{t.hero.description}</p>

          <div
            className={cn(
              "flex flex-wrap gap-4 text-sm text-muted-foreground",
              isRTL && "flex-row-reverse justify-end",
            )}
          >
            <span className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <MapPin size={16} className="text-primary" aria-hidden="true" />
              {t.hero.location}
            </span>
            <a
              href="mailto:AbdullahOmar@outlook.com"
              aria-label={t.a11y?.emailAria || "Send an email to Abdullah Omar at AbdullahOmar@outlook.com"}
              className={cn(
                "flex items-center gap-2 hover:text-primary transition-colors focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-primary",
                isRTL && "flex-row-reverse",
              )}
            >
              <Mail size={16} className="text-primary" aria-hidden="true" />
              AbdullahOmar@outlook.com
            </a>
          </div>

          <div className={cn("flex flex-wrap items-center gap-3 pt-4", isRTL && "flex-row-reverse justify-end")}>
            <Button asChild className="w-full sm:w-auto">
              <a href="#contact">{t.hero.getInTouch}</a>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <a href="#experience">{t.hero.viewExperience}</a>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <a href="/services">{t.hero.viewServices}</a>
            </Button>
          </div>

          <div className={cn("flex items-center gap-4 pt-4", isRTL && "flex-row-reverse justify-end")}>
            <a
              href="https://linkedin.com/in/AbdullahOmar97"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-primary p-1"
              aria-label={`LinkedIn ${t.a11y?.newTab || "(opens in a new tab)"}`}
            >
              <Linkedin size={22} aria-hidden="true" />
            </a>
            <a
              href="https://github.com/AbdullahOmar97"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-primary p-1"
              aria-label={`GitHub ${t.a11y?.newTab || "(opens in a new tab)"}`}
            >
              <Github size={22} aria-hidden="true" />
            </a>
            <a
              href="tel:+962787900948"
              className="text-muted-foreground hover:text-primary transition-colors focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-primary p-1"
              aria-label={t.a11y?.phoneAria || "Call Abdullah Omar"}
            >
              <Phone size={22} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
