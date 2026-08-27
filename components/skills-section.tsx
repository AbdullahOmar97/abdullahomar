"use client"

import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { cn } from "@/lib/utils"

const skillsData = [
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

  const getCategoryTitle = (key: string) => {
    const categories = t.skills.categories as Record<string, string>
    return categories[key] || key
  }

  return (
    <section id="skills" className="py-24 scroll-mt-20">
      <div className="space-y-12">
        <div className={cn("space-y-4", isRTL && "text-right")}>
          <h2
            className={cn(
              "text-3xl font-bold text-foreground flex items-center gap-3",
              isRTL && "flex-row-reverse justify-end",
            )}
          >
            <span className="text-primary font-mono text-lg" aria-hidden="true">03.</span>
            {t.skills.title}
          </h2>
          <div className={cn("w-20 h-1 bg-primary rounded-full", isRTL && "mr-0 ml-auto")} aria-hidden="true" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsData.map((category) => (
            <div
              key={category.key}
              className={cn(
                "p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors",
                isRTL && "text-right",
              )}
            >
              <h3 className="font-semibold text-foreground mb-4 text-lg">{getCategoryTitle(category.key)}</h3>
              <div className={cn("flex flex-wrap gap-2", isRTL && "justify-end")}>
                {category.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
