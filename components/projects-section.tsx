"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Github, Sparkles, FolderGit2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { cn } from "@/lib/utils"

interface ProjectItem {
  id: string
  slug: string
  titleEn: string
  titleAr: string
  summaryEn: string
  summaryAr: string
  descriptionEn?: string | null
  descriptionAr?: string | null
  category: string
  technologies: string[]
  featured: boolean
  demoUrl?: string | null
  githubUrl?: string | null
}

const fallbackProjects: ProjectItem[] = [
  {
    id: "1",
    slug: "ai-avatar-order-system",
    titleEn: "Real-Time Multilingual AI Avatar & Order Platform",
    titleAr: "منصة الأفاتار الذكي الفوري ونظام إدارة الطلبات",
    summaryEn:
      "Real-time voice conversational avatar with lip-sync alignment integrated with an order management ecosystem.",
    summaryAr:
      "أفاتار ذكي للمحادثة الصوتية الفورية متعددة اللغات مع مطابقة حركة الشفاه متصل بنظام إدارة الطلبات.",
    category: "ai_agent",
    technologies: ["Python", "ComfyUI", "Next.js", "Django", "WebSockets", "n8n"],
    featured: true,
    githubUrl: "https://github.com/AbdullahOmar97",
  },
  {
    id: "2",
    slug: "property-management-system",
    titleEn: "Full-Stack Property Management System",
    titleAr: "نظام شامل لإدارة العقارات والمستأجرين",
    summaryEn:
      "End-to-end platform for rental contracts, lease tracking, payment processing, and maintenance dispatching.",
    summaryAr:
      "منصة متكاملة لإدارة عقود الإيجار، وتتبع الدفعات، والصيانة، والتواصل بين الملاك والمستأجرين.",
    category: "fullstack",
    technologies: ["Next.js", "React", "Django", "PostgreSQL", "Tailwind CSS"],
    featured: true,
    githubUrl: "https://github.com/AbdullahOmar97",
  },
  {
    id: "3",
    slug: "voice-ai-agent-langgraph",
    titleEn: "Autonomous Voice Product Ordering Agent",
    titleAr: "وكيل صوتي ذكي مستقل للطلب بالصوت",
    summaryEn:
      "Stateful AI agent powered by LangGraph that handles natural voice ordering and catalog navigation.",
    summaryAr:
      "وكيل ذكاء اصطناعي متطور مبني بـ LangGraph لمعالجة الطلبات الصوتية والتنقل في كتالوج المنتجات.",
    category: "ai_agent",
    technologies: ["LangGraph", "LangChain", "Python", "FastAPI", "Gemini API"],
    featured: true,
    githubUrl: "https://github.com/AbdullahOmar97",
  },
]

export function ProjectsSection() {
  const { language, isRTL } = useLanguage()
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(fallbackProjects)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProjectsList(data.data)
        }
      })
      .catch((err) => console.warn("Using fallback projects data:", err))
  }, [])

  const categories = [
    { id: "all", labelEn: "All Projects", labelAr: "جميع المشاريع" },
    { id: "ai_agent", labelEn: "AI & Agents", labelAr: "الذكاء الاصطناعي والوكلاء" },
    { id: "fullstack", labelEn: "Full-Stack", labelAr: "تطوير شامل" },
  ]

  const filteredProjects =
    selectedCategory === "all"
      ? projectsList
      : projectsList.filter((p) => p.category === selectedCategory)

  return (
    <section id="projects" className="py-24 scroll-mt-20">
      <div className="space-y-12">
        <div className={cn("space-y-4", isRTL && "text-right")}>
          <h2
            className={cn(
              "text-3xl font-bold text-foreground flex items-center gap-3",
              isRTL && "flex-row-reverse justify-end"
            )}
          >
            <span className="text-primary font-mono text-lg" aria-hidden="true">
              03.
            </span>
            {language === "ar" ? "المشاريع المميزة" : "Featured Projects"}
          </h2>
          <div
            className={cn("w-20 h-1 bg-primary rounded-full", isRTL && "mr-0 ml-auto")}
            aria-hidden="true"
          />
        </div>

        {/* Category Filters */}
        <div className={cn("flex flex-wrap gap-2", isRTL && "justify-end")}>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="rounded-full text-xs font-medium"
            >
              {language === "ar" ? cat.labelAr : cat.labelEn}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={cn(
                "group relative flex flex-col justify-between p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all hover:shadow-lg duration-300",
                isRTL && "text-right"
              )}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                    <FolderGit2 className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary transition-colors"
                        aria-label="GitHub Repository"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary transition-colors"
                        aria-label="Live Demo"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {language === "ar" ? project.titleAr : project.titleEn}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
                    {language === "ar" ? project.summaryAr : project.summaryEn}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-border/50">
                <div className={cn("flex flex-wrap gap-1.5", isRTL && "justify-end")}>
                  {project.technologies?.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="font-mono text-[11px] px-2 py-0.5"
                    >
                      {tech}
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
