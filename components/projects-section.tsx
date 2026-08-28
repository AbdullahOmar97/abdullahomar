"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Github, Sparkles, FolderGit2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { SpotlightCard } from "./spotlight-card"
import { ScrollReveal } from "./scroll-reveal"
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
    slug: "digital-customs-platform",
    titleEn: "Digital Customs Platform — Libyan Customs Authority",
    titleAr: "منصة الجمارك الرقمية — مصلحة الجمارك الليبية",
    summaryEn:
      "Bilingual digital customs platform digitizing import/export clearance with React, FastAPI, PostgreSQL, and AI shipment risk analysis, OCR, and forgery detection.",
    summaryAr:
      "منصة جمركية رقمية ثنائية اللغة لأتمتة عمليات الاستيراد والتصدير مع React و FastAPI و PostgreSQL ودمج الذكاء الاصطناعي لتحليل المخاطر واستخراج البيانات بـ OCR وكشف التزوير.",
    category: "fullstack",
    technologies: ["React", "FastAPI", "PostgreSQL", "AI Risk Analysis", "OCR", "Document AI"],
    featured: true,
    githubUrl: "https://github.com/AbdullahOmar97",
  },
  {
    id: "2",
    slug: "ai-commerce-platform",
    titleEn: "Multi-Tenant AI-Powered Commerce Platform",
    titleAr: "منصة تجارة إلكترونية متعددة المستأجرين بالذكاء الاصطناعي",
    summaryEn:
      "Full-stack commerce platform with Next.js, Django, PostgreSQL, LangGraph/Gemini conversational AI ordering, POS workflows, vector search, and real-time kitchen tracking.",
    summaryAr:
      "منصة تجارة متكاملة بـ Next.js و Django و PostgreSQL مع طلب ذكي عبر LangGraph و Gemini، وسير عمل POS، وبحث متجهي، وتتبع فوري للطلبات.",
    category: "ai_agent",
    technologies: ["Next.js", "TypeScript", "Django", "LangGraph", "PostgreSQL", "Redis", "YOLO", "WebSockets"],
    featured: true,
    githubUrl: "https://github.com/AbdullahOmar97",
  },
  {
    id: "3",
    slug: "ai-vehicle-inspection",
    titleEn: "AI-Powered Vehicle Inspection Platform",
    titleAr: "منصة فحص المركبات الذكية بالرؤية الحاسوبية",
    summaryEn:
      "Automates vehicle identification (VIN, plate, make, model) and detects visible damage from video using computer vision models.",
    summaryAr:
      "أتمتة التعرف على المركبات (VIN، اللوحة، الموديل، اللون) وكشف الأضرار الظاهرة وتصنيفها من الفيديو باستخدام الرؤية الحاسوبية.",
    category: "ai_agent",
    technologies: ["Python", "Computer Vision", "YOLO", "FastAPI", "Video Processing", "AI Damage Classification"],
    featured: true,
    githubUrl: "https://github.com/AbdullahOmar97",
  },
  {
    id: "4",
    slug: "maidan-martial-arts-saas",
    titleEn: "Maidan — Multi-Tenant Martial Arts Academy SaaS",
    titleAr: "ميدان — منصة SaaS متعددة المستأجرين لأكاديميات الفنون القتالية",
    summaryEn:
      "Schema-per-tenant SaaS architecture using django-tenants, Next.js, DRF, Celery, Redis, MinIO/S3, and Docker for martial arts academy operations and billing.",
    summaryAr:
      "بنية SaaS متعددة المستأجرين باستخدام django-tenants و Next.js و DRF و Celery و Redis و MinIO و Docker لإدارة الأكاديميات والفوترة الآلية.",
    category: "fullstack",
    technologies: ["Next.js", "TypeScript", "Django", "django-tenants", "PostgreSQL", "Celery", "Redis", "Docker"],
    featured: true,
    githubUrl: "https://github.com/AbdullahOmar97",
  },
  {
    id: "5",
    slug: "ai-digital-human-interaction",
    titleEn: "Real-Time Multilingual AI Digital Human",
    titleAr: "الإنسان الرقمي التفاعلي بالذكاء الاصطناعي الفوري",
    summaryEn:
      "Optimized digital human avatar for real-time multilingual voice conversation, frame-accurate lip sync, and natural facial behavior.",
    summaryAr:
      "نظام إنسان رقمي ذكي للمحادثة الصوتية التفاعلية متعددة اللغات مع مطابقة دقيقة لحركة الشفاه وتعابير الوجه في الوقت الفعلي.",
    category: "ai_agent",
    technologies: ["Python", "ComfyUI", "WebSockets", "Lip-Sync AI", "TTS / STT", "n8n"],
    featured: true,
    githubUrl: "https://github.com/AbdullahOmar97",
  },
  {
    id: "6",
    slug: "medical-classification-robustness",
    titleEn: "Medical ML Classification & Noise Robustness",
    titleAr: "تقييم ومتانة نماذج التعلم الآلي للتصنيف الطبي",
    summaryEn:
      "Supervised KNN and SVM classification on breast cancer data with Gaussian noise simulation, achieving 97.1% SVM accuracy and 1.17% critical error rate.",
    summaryAr:
      "تطبيق وتدريب مصنفات KNN و SVM على بيانات طبية حقيقية مع محاكاة ضوضاء Gaussian لتقييم المتانة، محققاً دقة 97.1% وخفض معدل الخطأ الحرج.",
    category: "ai_agent",
    technologies: ["Python", "Scikit-learn", "SVM", "KNN", "Noise Simulation", "Data Analysis"],
    featured: true,
    githubUrl: "https://github.com/AbdullahOmar97",
  },
  {
    id: "7",
    slug: "property-management-system",
    titleEn: "Full-Stack Property Management System",
    titleAr: "نظام شامل لإدارة العقارات والمستأجرين",
    summaryEn:
      "End-to-end platform for rental contracts, lease tracking, payment processing, and maintenance dispatching using Next.js and Django.",
    summaryAr:
      "منصة متكاملة لإدارة عقود الإيجار، وتتبع الدفعات، وتذاكر الصيانة، والتواصل بين الملاك والمستأجرين بـ Next.js و Django.",
    category: "fullstack",
    technologies: ["Next.js", "React", "Django REST Framework", "PostgreSQL", "Tailwind CSS"],
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
    { id: "ai_agent", labelEn: "AI & Vision", labelAr: "الذكاء الاصطناعي والرؤية" },
    { id: "fullstack", labelEn: "Full-Stack & SaaS", labelAr: "تطوير شامل و SaaS" },
  ]

  const filteredProjects =
    selectedCategory === "all"
      ? projectsList
      : projectsList.filter((p) => p.category === selectedCategory)

  return (
    <section id="projects" className="py-24 scroll-mt-20">
      <div className="space-y-12">
        <ScrollReveal direction="up" className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <span className="text-primary font-mono text-lg" aria-hidden="true">
              03.
            </span>
            {language === "ar" ? "المشاريع المميزة" : "Featured Projects"}
          </h2>
          <div className="w-20 h-1 bg-primary rounded-full" aria-hidden="true" />
        </ScrollReveal>

        {/* Category Filters */}
        <ScrollReveal direction="up" delay={100} className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="rounded-full text-xs font-medium transition-all duration-300 hover:scale-105"
            >
              {language === "ar" ? cat.labelAr : cat.labelEn}
            </Button>
          ))}
        </ScrollReveal>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <ScrollReveal key={project.id} direction="up" delay={150 + idx * 80}>
              <SpotlightCard
                className="group relative flex flex-col justify-between p-6 h-full border border-border/80 hover:border-primary/50 shadow-sm transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <FolderGit2 className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-primary hover:scale-110 transition-all p-1"
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
                          className="hover:text-primary hover:scale-110 transition-all p-1"
                          aria-label="Live Demo"
                        >
                          <ExternalLink className="h-5 w-5 rtl:rotate-180" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {language === "ar" ? project.titleAr : project.titleEn}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2 line-clamp-3 leading-relaxed">
                      {language === "ar" ? project.summaryAr : project.summaryEn}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-border/50">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies?.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="font-mono text-[11px] px-2 py-0.5 hover:bg-primary/20 hover:text-primary transition-colors"
                      >
                        {tech}
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

