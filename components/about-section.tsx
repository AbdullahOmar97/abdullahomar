"use client"

import { Brain, Code2, Layers, Cpu } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { SpotlightCard } from "./spotlight-card"
import { ScrollReveal } from "./scroll-reveal"
import { cn } from "@/lib/utils"

export function AboutSection() {
  const { language, isRTL } = useLanguage()
  const t = getTranslation(language)

  const highlights = [
    {
      icon: Code2,
      title: t.about.highlights.fullStack.title,
      description: t.about.highlights.fullStack.description,
    },
    {
      icon: Brain,
      title: t.about.highlights.ai.title,
      description: t.about.highlights.ai.description,
    },
    {
      icon: Layers,
      title: t.about.highlights.saas.title,
      description: t.about.highlights.saas.description,
    },
    {
      icon: Cpu,
      title: t.about.highlights.automation.title,
      description: t.about.highlights.automation.description,
    },
  ]

  return (
    <section id="about" className="py-24 scroll-mt-20">
      <div className="space-y-12">
        <ScrollReveal direction="up" className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <span className="text-primary font-mono text-lg" aria-hidden="true">01.</span>
            {t.about.title}
          </h2>
          <div className="w-20 h-1 bg-primary rounded-full" aria-hidden="true" />
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal
            direction={isRTL ? "left" : "right"}
            delay={100}
            className="space-y-6 text-muted-foreground leading-relaxed text-base"
          >
            <p className="text-base md:text-lg leading-relaxed text-foreground/90">
              {t.about.paragraph1}
            </p>
            <p>
              {t.about.paragraph2}
            </p>
            <p>
              {t.about.paragraph3}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, idx) => (
              <ScrollReveal key={item.title} direction="up" delay={150 + idx * 75}>
                <SpotlightCard
                  className="p-6 h-full border border-border/80 hover:border-primary/50 group shadow-sm"
                >
                  <div
                    className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                    aria-hidden="true"
                  >
                    <item.icon className="w-6 h-6 transition-transform duration-300" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-base group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </SpotlightCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

