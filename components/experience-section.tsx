"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { SpotlightCard } from "./spotlight-card"
import { ScrollReveal } from "./scroll-reveal"
import { cn } from "@/lib/utils"

interface DBExperience {
  id: string
  companyEn: string
  companyAr: string
  roleEn: string
  roleAr: string
  locationEn?: string | null
  locationAr?: string | null
  periodEn: string
  periodAr: string
  descriptionEn?: string | null
  descriptionAr?: string | null
  highlightsEn: string[]
  highlightsAr: string[]
}

const experienceSkills = [
  ["Python", "Next.js", "Django", "LangGraph", "Computer Vision", "n8n", "ComfyUI"],
  ["Next.js", "Django", "PostgreSQL", "REST APIs", "TailwindCSS"],
]

export function ExperienceSection() {
  const { language, isRTL } = useLanguage()
  const t = getTranslation(language)
  const [dbExperiences, setDbExperiences] = useState<DBExperience[]>([])

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data?.experiences) && data.data.experiences.length > 0) {
          setDbExperiences(data.data.experiences)
        }
      })
      .catch((err) => console.warn("Using fallback experience data:", err))
  }, [])

  // Map either DB experiences or static translations
  const experiencesList =
    dbExperiences.length > 0
      ? dbExperiences.map((exp) => ({
          title: language === "ar" ? exp.roleAr : exp.roleEn,
          company: language === "ar" ? exp.companyAr : exp.companyEn,
          location: language === "ar" ? exp.locationAr : exp.locationEn,
          period: language === "ar" ? exp.periodAr : exp.periodEn,
          description:
            (language === "ar" ? exp.highlightsAr : exp.highlightsEn)?.length > 0
              ? (language === "ar" ? exp.highlightsAr : exp.highlightsEn)
              : [language === "ar" ? exp.descriptionAr : exp.descriptionEn].filter(Boolean) as string[],
        }))
      : t.experience.jobs

  return (
    <section id="experience" className="py-24 scroll-mt-20">
      <div className="space-y-12">
        <ScrollReveal direction="up" className={cn("space-y-4", isRTL && "text-right")}>
          <h2
            className={cn(
              "text-3xl font-bold text-foreground flex items-center gap-3",
              isRTL && "flex-row-reverse justify-end"
            )}
          >
            <span className="text-primary font-mono text-lg" aria-hidden="true">
              02.
            </span>
            {t.experience.title}
          </h2>
          <div
            className={cn("w-20 h-1 bg-primary rounded-full", isRTL && "mr-0 ml-auto")}
            aria-hidden="true"
          />
        </ScrollReveal>

        <div className="space-y-8 relative">
          {experiencesList.map((exp, index) => (
            <ScrollReveal
              key={index}
              direction={isRTL ? "right" : "left"}
              delay={index * 120}
              className={cn(
                "relative transition-all duration-300",
                isRTL ? "pr-8 border-r-2 border-primary/30 hover:border-primary" : "pl-8 border-l-2 border-primary/30 hover:border-primary"
              )}
            >
              {/* Glowing Pulse Node on Timeline */}
              <div
                className={cn(
                  "absolute top-5 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-[0_0_12px_rgba(20,184,166,0.6)]",
                  isRTL ? "-right-[11px]" : "-left-[11px]"
                )}
                aria-hidden="true"
              >
                <span className="w-2 h-2 rounded-full bg-background animate-ping opacity-75" />
              </div>

              <SpotlightCard className="p-6 md:p-8 border border-border/80 hover:border-primary/50 shadow-sm transition-all duration-300">
                <div className={cn("space-y-4", isRTL && "text-right")}>
                  <div
                    className={cn(
                      "flex flex-col md:flex-row md:justify-between gap-2 md:items-center",
                      isRTL && "md:flex-row-reverse"
                    )}
                  >
                    <div>
                      <h3 className="text-xl font-bold text-foreground hover:text-primary transition-colors">
                        {exp.title}
                      </h3>
                      <p
                        className={cn(
                          "text-primary font-medium flex items-center gap-2 mt-1",
                          isRTL && "flex-row-reverse justify-end"
                        )}
                      >
                        <Briefcase size={16} className="shrink-0" />
                        <span>{exp.company}</span>
                        <ExternalLink size={14} aria-hidden="true" className="opacity-70" />
                      </p>
                    </div>
                    <div className="text-xs md:text-sm text-primary font-mono px-3 py-1 rounded-full bg-primary/10 border border-primary/20 self-start md:self-auto">
                      {exp.period}
                    </div>
                  </div>

                  <ul className="space-y-2.5 pt-2">
                    {exp.description?.map((item, i) => (
                      <li
                        key={i}
                        className={cn(
                          "text-muted-foreground flex items-start gap-2.5 text-sm md:text-base leading-relaxed",
                          isRTL && "flex-row-reverse"
                        )}
                      >
                        <span className="text-primary mt-1 font-bold select-none shrink-0" aria-hidden="true">
                          ▹
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={cn("flex flex-wrap gap-2 pt-4 border-t border-border/50", isRTL && "justify-end")}>
                    {experienceSkills[index]?.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="font-mono text-xs hover:bg-primary/20 hover:text-primary transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

