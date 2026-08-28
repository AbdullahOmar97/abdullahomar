"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { SpotlightCard } from "./spotlight-card"
import { ScrollReveal } from "./scroll-reveal"
import { cn } from "@/lib/utils"

interface DBSkill {
  id: string
  name: string
  category: "languages" | "ai_ml" | "web_backend" | "databases" | "devops_cloud"
  proficiency: number
  featured: boolean
}

const defaultSkillsData = [
  {
    key: "languages",
    skills: ["Python", "JavaScript", "TypeScript", "SQL", "HTML", "CSS"],
  },
  {
    key: "aiMl",
    skills: [
      "AI Agents",
      "LangChain",
      "LangGraph",
      "RAG",
      "Computer Vision",
      "NLP",
      "Generative AI",
      "LLMs",
      "TensorFlow",
      "PyTorch",
      "Scikit-learn",
      "Hugging Face",
      "OpenAI API",
      "YOLO",
    ],
  },
  {
    key: "backend",
    skills: ["Django", "FastAPI", "Node.js", "RESTful APIs", "PostgreSQL", "MySQL"],
  },
  {
    key: "frontend",
    skills: ["Next.js", "React.js", "TailwindCSS", "Bootstrap", "TanStack-Query", "Zod"],
  },
  {
    key: "cloud",
    skills: ["Git", "GitHub", "GitHub Actions", "CI/CD", "Docker", "AWS", "GCP", "Linux"],
  },
  {
    key: "automation",
    skills: ["n8n", "ComfyUI", "Prompt Engineering", "Vector Databases"],
  },
]

export function SkillsSection() {
  const { language, isRTL } = useLanguage()
  const t = getTranslation(language)
  const [dbSkills, setDbSkills] = useState<DBSkill[]>([])

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data?.skills) && data.data.skills.length > 0) {
          setDbSkills(data.data.skills)
        }
      })
      .catch((err) => console.warn("Using fallback skills data:", err))
  }, [])

  const getCategoryTitle = (key: string) => {
    const categories = t.skills.categories as Record<string, string>
    return categories[key] || key
  }

  // If we have DB skills, we can group them or enhance categories
  const categoriesToRender =
    dbSkills.length > 0
      ? [
          {
            key: "languages",
            skills: dbSkills
              .filter((s) => s.category === "languages")
              .map((s) => s.name),
          },
          {
            key: "aiMl",
            skills: dbSkills
              .filter((s) => s.category === "ai_ml")
              .map((s) => s.name),
          },
          {
            key: "backend",
            skills: dbSkills
              .filter((s) => s.category === "web_backend" || s.category === "databases")
              .map((s) => s.name),
          },
          {
            key: "cloud",
            skills: dbSkills
              .filter((s) => s.category === "devops_cloud")
              .map((s) => s.name),
          },
        ].filter((cat) => cat.skills.length > 0)
      : defaultSkillsData

  return (
    <section id="skills" className="py-24 scroll-mt-20">
      <div className="space-y-12">
        <ScrollReveal direction="up" className={cn("space-y-4", isRTL && "text-right")}>
          <h2
            className={cn(
              "text-3xl font-bold text-foreground flex items-center gap-3",
              isRTL && "flex-row-reverse justify-end"
            )}
          >
            <span className="text-primary font-mono text-lg" aria-hidden="true">
              04.
            </span>
            {t.skills.title}
          </h2>
          <div
            className={cn("w-20 h-1 bg-primary rounded-full", isRTL && "mr-0 ml-auto")}
            aria-hidden="true"
          />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesToRender.map((category, idx) => (
            <ScrollReveal key={category.key} direction="up" delay={100 + idx * 75}>
              <SpotlightCard
                className={cn(
                  "p-6 h-full border border-border/80 hover:border-primary/50 shadow-sm transition-all duration-300",
                  isRTL && "text-right"
                )}
              >
                <h3 className="font-bold text-foreground mb-4 text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                  <span>{getCategoryTitle(category.key)}</span>
                </h3>
                <div className={cn("flex flex-wrap gap-2", isRTL && "justify-end")}>
                  {category.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 hover:scale-105 transition-all duration-200 cursor-default"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

