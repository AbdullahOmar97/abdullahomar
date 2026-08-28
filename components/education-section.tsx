"use client"

import { useState, useEffect } from "react"
import { GraduationCap, Award, HeartHandshake } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { SpotlightCard } from "./spotlight-card"
import { ScrollReveal } from "./scroll-reveal"
import { cn } from "@/lib/utils"

interface DBEducation {
  id: string
  institutionEn: string
  institutionAr: string
  degreeEn: string
  degreeAr: string
  fieldEn?: string | null
  fieldAr?: string | null
  yearEn: string
  yearAr: string
  descriptionEn?: string | null
  descriptionAr?: string | null
}

export function EducationSection() {
  const { language, isRTL } = useLanguage()
  const t = getTranslation(language)
  const [dbEducation, setDbEducation] = useState<DBEducation[]>([])

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data?.education) && data.data.education.length > 0) {
          setDbEducation(data.data.education)
        }
      })
      .catch((err) => console.warn("Using fallback education data:", err))
  }, [])

  const degreesList =
    dbEducation.length > 0
      ? dbEducation.map((edu) => ({
          degree: language === "ar" ? edu.degreeAr : edu.degreeEn,
          field: language === "ar" ? edu.fieldAr : edu.fieldEn,
          institution: language === "ar" ? edu.institutionAr : edu.institutionEn,
          location: language === "ar" ? "عمّان، الأردن" : "Amman, Jordan",
          period: language === "ar" ? edu.yearAr : edu.yearEn,
        }))
      : t.education.degrees

  return (
    <section id="education" className="py-24 scroll-mt-20">
      <div className="space-y-12">
        <ScrollReveal direction="up" className={cn("space-y-4", isRTL && "text-right")}>
          <h2
            className={cn(
              "text-3xl font-bold text-foreground flex items-center gap-3",
              isRTL && "flex-row-reverse justify-end"
            )}
          >
            <span className="text-primary font-mono text-lg" aria-hidden="true">
              05.
            </span>
            {t.education.title}
          </h2>
          <div
            className={cn("w-20 h-1 bg-primary rounded-full", isRTL && "mr-0 ml-auto")}
            aria-hidden="true"
          />
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left Column: Education & Volunteer Initiatives */}
          <div className="space-y-10">
            {/* Education */}
            <div className="space-y-4">
              <ScrollReveal
                direction="up"
                delay={50}
                className={cn(
                  "text-xl font-semibold text-foreground flex items-center gap-2",
                  isRTL && "flex-row-reverse justify-end"
                )}
              >
                <GraduationCap className="text-primary" aria-hidden="true" />
                <span>{t.education.educationLabel}</span>
              </ScrollReveal>

              <div className="space-y-4">
                {degreesList.map((edu, index) => (
                  <ScrollReveal key={index} direction="up" delay={100 + index * 75}>
                    <SpotlightCard
                      className={cn(
                        "p-6 border border-border/80 hover:border-primary/50 shadow-sm transition-all duration-300",
                        isRTL && "text-right"
                      )}
                    >
                      <h3 className="font-bold text-foreground text-lg">{edu.degree}</h3>
                      {edu.field && <p className="text-primary font-medium text-sm mt-0.5">{edu.field}</p>}
                      <p className="text-muted-foreground mt-2">{edu.institution}</p>
                      {edu.location && <p className="text-sm text-muted-foreground">{edu.location}</p>}
                      <p className="text-xs text-primary font-mono mt-3 inline-block px-2.5 py-1 rounded-md bg-primary/10">
                        {edu.period}
                      </p>
                    </SpotlightCard>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Volunteer Initiatives */}
            <div className="space-y-4">
              <ScrollReveal
                direction="up"
                delay={80}
                className={cn(
                  "text-xl font-semibold text-foreground flex items-center gap-2",
                  isRTL && "flex-row-reverse justify-end"
                )}
              >
                <HeartHandshake className="text-primary" aria-hidden="true" />
                <span>{t.education.volunteerLabel}</span>
              </ScrollReveal>

              <div className="space-y-4">
                {t.education.volunteer?.map((vol, index) => (
                  <ScrollReveal key={index} direction="up" delay={120 + index * 75}>
                    <SpotlightCard
                      className={cn(
                        "p-5 border border-border/80 hover:border-primary/50 shadow-sm transition-all duration-300",
                        isRTL && "text-right"
                      )}
                    >
                      <div className={cn("flex flex-wrap items-center justify-between gap-2", isRTL && "flex-row-reverse")}>
                        <h3 className="font-bold text-foreground text-base">{vol.title}</h3>
                        <span className="text-xs text-primary font-mono px-2 py-0.5 rounded bg-primary/10">
                          {vol.period}
                        </span>
                      </div>
                      <p className="text-sm text-primary font-medium mt-1">{vol.organization}</p>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{vol.description}</p>
                    </SpotlightCard>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Certifications & Training */}
          <div className="space-y-4">
            <ScrollReveal
              direction="up"
              delay={50}
              className={cn(
                "text-xl font-semibold text-foreground flex items-center gap-2",
                isRTL && "flex-row-reverse justify-end"
              )}
            >
              <Award className="text-primary" aria-hidden="true" />
              <span>{t.education.certificationsLabel}</span>
            </ScrollReveal>

            <div className="space-y-4">
              {t.education.certifications.map((cert, index) => (
                <ScrollReveal key={index} direction="up" delay={100 + index * 60}>
                  <SpotlightCard
                    className={cn(
                      "p-5 border border-border/80 hover:border-primary/50 shadow-sm transition-all duration-300",
                      isRTL && "text-right"
                    )}
                  >
                    <h3 className="font-semibold text-foreground text-base">{cert.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{cert.institution}</p>
                    <div
                      className={cn(
                        "flex flex-wrap items-center gap-2 mt-3 text-xs text-muted-foreground font-mono",
                        isRTL && "flex-row-reverse justify-end"
                      )}
                    >
                      <span className="px-2.5 py-0.5 rounded-md bg-muted text-foreground/80 font-medium">
                        {cert.date}
                      </span>
                      {cert.hours && <span className="text-primary/90">• {cert.hours}</span>}
                    </div>
                  </SpotlightCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

