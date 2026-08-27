"use client"

import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { cn } from "@/lib/utils"

const experienceSkills = [
  ["Python", "Next.js", "Django", "LangGraph", "Computer Vision", "n8n", "ComfyUI"],
  ["Next.js", "Django", "PostgreSQL", "REST APIs", "TailwindCSS"],
]

export function ExperienceSection() {
  const { language, isRTL } = useLanguage()
  const t = getTranslation(language)

  return (
    <section id="experience" className="py-24 scroll-mt-20">
      <div className="space-y-12">
        <div className={cn("space-y-4", isRTL && "text-right")}>
          <h2
            className={cn(
              "text-3xl font-bold text-foreground flex items-center gap-3",
              isRTL && "flex-row-reverse justify-end",
            )}
          >
            <span className="text-primary font-mono text-lg" aria-hidden="true">02.</span>
            {t.experience.title}
          </h2>
          <div className={cn("w-20 h-1 bg-primary rounded-full", isRTL && "mr-0 ml-auto")} aria-hidden="true" />
        </div>

        <div className="space-y-8">
          {t.experience.jobs.map((exp, index) => (
            <div
              key={index}
              className={cn(
                "relative border-l-2 border-border hover:border-primary transition-colors",
                isRTL ? "pr-8 border-l-0 border-r-2" : "pl-8",
              )}
            >
              <div
                className={cn("absolute top-0 w-4 h-4 rounded-full bg-primary", isRTL ? "-right-[9px]" : "-left-[9px]")}
                aria-hidden="true"
              />
              <div className={cn("space-y-4", isRTL && "text-right")}>
                <div
                  className={cn(
                    "flex flex-col md:flex-row md:justify-between gap-2 md:items-center",
                    isRTL && "md:flex-row-reverse",
                  )}
                >
                  <div>
                    <h3 className="text-xl font-semibold text-foreground text-left">{exp.title}</h3>
                    <p className={cn("text-primary flex items-center gap-2", isRTL && "flex-row-reverse justify-end")}>
                      {exp.company}
                      <ExternalLink size={14} aria-hidden="true" />
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">{exp.period}</div>
                </div>

                <ul className="space-y-2">
                  {exp.description.map((item, i) => (
                    <li
                      key={i}
                      className={cn("text-muted-foreground flex items-start gap-2", isRTL && "flex-row-reverse")}
                    >
                      <span className="text-primary mt-1.5" aria-hidden="true">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className={cn("flex flex-wrap gap-2 pt-2", isRTL && "justify-end")}>
                  {experienceSkills[index]?.map((skill) => (
                    <Badge key={skill} variant="secondary" className="font-mono text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
