"use client"

import { useState, useEffect } from "react"
import { GraduationCap, Award } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
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
        <div className={cn("space-y-4", isRTL && "text-right")}>
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
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Education */}
          <div className="space-y-6">
            <h3
              className={cn(
                "text-xl font-semibold text-foreground flex items-center gap-2",
                isRTL && "flex-row-reverse justify-end"
              )}
            >
              <GraduationCap className="text-primary" aria-hidden="true" />
              {t.education.educationLabel}
            </h3>
            <div className="space-y-4">
              {degreesList.map((edu, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors",
                    isRTL && "text-right"
                  )}
                >
                  <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                  {edu.field && <p className="text-primary text-sm">{edu.field}</p>}
                  <p className="text-muted-foreground mt-2">{edu.institution}</p>
                  {edu.location && <p className="text-sm text-muted-foreground">{edu.location}</p>}
                  <p className="text-sm text-muted-foreground font-mono mt-2">{edu.period}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-6">
            <h3
              className={cn(
                "text-xl font-semibold text-foreground flex items-center gap-2",
                isRTL && "flex-row-reverse justify-end"
              )}
            >
              <Award className="text-primary" aria-hidden="true" />
              {t.education.certificationsLabel}
            </h3>
            <div className="space-y-4">
              {t.education.certifications.map((cert, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors",
                    isRTL && "text-right"
                  )}
                >
                  <h4 className="font-medium text-foreground">{cert.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{cert.institution}</p>
                  <div
                    className={cn(
                      "flex items-center gap-4 mt-2 text-xs text-muted-foreground font-mono",
                      isRTL && "flex-row-reverse justify-end"
                    )}
                  >
                    <span>{cert.date}</span>
                    {cert.hours && <span>• {cert.hours}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
