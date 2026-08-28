"use client"

import { HeroShowcase } from "./hero-showcase"
import { Github, Linkedin, Mail, Phone, MapPin, Sparkles, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { HeroTypingTitle } from "./hero-typing-title"
import { ScrollReveal } from "./scroll-reveal"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const { language, isRTL } = useLanguage()
  const t = getTranslation(language)

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center pt-24 pb-12 lg:py-0 scroll-mt-20">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Mobile: Placed at the top above "Hello, I'm"; Desktop: Side column */}
        <ScrollReveal
          direction={isRTL ? "left" : "right"}
          delay={150}
          className={cn("w-full flex justify-center order-first", isRTL ? "lg:order-1" : "lg:order-2")}
        >
          <HeroShowcase />
        </ScrollReveal>

        {/* Text & Actions: Placed below artwork on mobile, adjacent column on desktop */}
        <ScrollReveal
          direction={isRTL ? "right" : "left"}
          delay={50}
          className={cn(
            "space-y-6 order-2",
            isRTL ? "text-right lg:order-2" : "text-left lg:order-1",
          )}
        >
          {/* Live Status Badge with Animated Radar Ping */}
          <div className={cn("flex items-center", isRTL ? "justify-end" : "justify-start")}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>
                {language === "ar"
                  ? "متاح لمشاريع الذكاء الاصطناعي وتطوير البرمجيات"
                  : "Available for AI & Full-Stack Projects"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-primary font-mono text-sm font-semibold tracking-wider uppercase">
              {t.hero.greeting}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground text-balance tracking-tight">
              {t.hero.name}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              {t.hero.title}
            </p>
            {/* Dynamic Typewriter Title */}
            <HeroTypingTitle className={isRTL ? "justify-end" : "justify-start"} />
          </div>

          <p className="text-muted-foreground leading-relaxed max-w-lg text-base">
            {t.hero.description}
          </p>

          <div
            className={cn(
              "flex flex-wrap gap-4 text-sm text-muted-foreground",
              isRTL && "flex-row-reverse justify-end",
            )}
          >
            <span className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <MapPin size={16} className="text-primary shrink-0" aria-hidden="true" />
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
              <Mail size={16} className="text-primary shrink-0" aria-hidden="true" />
              AbdullahOmar@outlook.com
            </a>
          </div>

          <div className={cn("flex flex-wrap items-center gap-3 pt-4", isRTL && "flex-row-reverse justify-end")}>
            <Button
              asChild
              className="w-full sm:w-auto shadow-md hover:shadow-primary/25 hover:scale-[1.02] transition-all duration-300 group"
            >
              <a href="#contact" className="flex items-center gap-2">
                <span>{t.hero.getInTouch}</span>
                {isRTL ? (
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                )}
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="w-full sm:w-auto hover:bg-muted/80 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
            >
              <a href="#experience">{t.hero.viewExperience}</a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="w-full sm:w-auto hover:bg-muted/80 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
            >
              <a href="/services">{t.hero.viewServices}</a>
            </Button>
          </div>

          <div className={cn("flex items-center gap-4 pt-4", isRTL && "flex-row-reverse justify-end")}>
            <a
              href="https://linkedin.com/in/AbdullahOmar97"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-primary p-1"
              aria-label={`LinkedIn ${t.a11y?.newTab || "(opens in a new tab)"}`}
            >
              <Linkedin size={22} aria-hidden="true" />
            </a>
            <a
              href="https://github.com/AbdullahOmar97"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-primary p-1"
              aria-label={`GitHub ${t.a11y?.newTab || "(opens in a new tab)"}`}
            >
              <Github size={22} aria-hidden="true" />
            </a>
            <a
              href="tel:+962787900948"
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-primary p-1"
              aria-label={t.a11y?.phoneAria || "Call Abdullah Omar"}
            >
              <Phone size={22} aria-hidden="true" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

