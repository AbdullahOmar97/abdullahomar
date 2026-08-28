"use client"

import { Brain, Code2, Database, Cpu } from "lucide-react"
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
      icon: Database,
      title: t.about.highlights.data.title,
      description: t.about.highlights.data.description,
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
        <ScrollReveal direction="up" className={cn("space-y-4", isRTL && "text-right")}>
          <h2
            className={cn(
              "text-3xl font-bold text-foreground flex items-center gap-3",
              isRTL && "flex-row-reverse justify-end",
            )}
          >
            <span className="text-primary font-mono text-lg" aria-hidden="true">01.</span>
            {t.about.title}
          </h2>
          <div className={cn("w-20 h-1 bg-primary rounded-full", isRTL && "mr-0 ml-auto")} aria-hidden="true" />
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal
            direction={isRTL ? "left" : "right"}
            delay={100}
            className={cn("space-y-6 text-muted-foreground leading-relaxed text-base", isRTL && "text-right lg:order-2")}
          >
            <p>
              {language === "en" ? (
                <>
                  I&apos;m a Full-Stack Software Engineer specializing in{" "}
                  <span className="text-primary font-medium">Data Science & Artificial Intelligence</span> with a Civil Engineering
                  background. This unique combination allows me to approach problems with both analytical rigor and
                  creative innovation.
                </>
              ) : (
                <>
                  أنا مهندس برمجيات Full-Stack متخصص في{" "}
                  <span className="text-primary font-medium">علوم البيانات والذكاء الاصطناعي</span> مع خلفية في الهندسة المدنية. هذا
                  المزيج الفريد يمكنني من معالجة المشكلات بدقة تحليلية وابتكار إبداعي.
                </>
              )}
            </p>
            <p>
              {language === "en" ? (
                <>
                  Experienced in building end-to-end systems with <span className="text-foreground font-medium">React/Next.js</span>{" "}
                  and <span className="text-foreground font-medium">Django/FastAPI</span>, I integrate advanced AI solutions
                  including AI Agents, LLM Orchestration, Workflow Automation, Generative AI, and Computer Vision to
                  drive digital transformation.
                </>
              ) : (
                <>
                  لدي خبرة في بناء أنظمة متكاملة باستخدام <span className="text-foreground font-medium">React/Next.js</span> و{" "}
                  <span className="text-foreground font-medium">Django/FastAPI</span>، حيث أدمج حلول الذكاء الاصطناعي المتقدمة بما
                  في ذلك وكلاء الذكاء الاصطناعي، تنسيق نماذج اللغة الكبيرة، أتمتة سير العمل، الذكاء الاصطناعي التوليدي،
                  والرؤية الحاسوبية.
                </>
              )}
            </p>
            <p>{t.about.paragraph3}</p>
          </ScrollReveal>

          <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", isRTL && "lg:order-1")}>
            {highlights.map((item, idx) => (
              <ScrollReveal key={item.title} direction="up" delay={150 + idx * 75}>
                <SpotlightCard
                  className={cn(
                    "p-6 h-full border border-border/80 hover:border-primary/50 group shadow-sm",
                    isRTL && "text-right",
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300",
                      isRTL && "mr-0 ml-auto",
                    )}
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

