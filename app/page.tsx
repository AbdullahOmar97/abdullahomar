"use client"

import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ExperienceSection } from "@/components/experience-section"
import { ProjectsSection } from "@/components/projects-section"
import { SkillsSection } from "@/components/skills-section"
import { EducationSection } from "@/components/education-section"
import { ContactSection } from "@/components/contact-section"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AIChatbot } from "@/components/ai-chatbot"
import { LanguageProvider, useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"

function PageContent() {
  const { language } = useLanguage()
  const t = getTranslation(language)

  return (
    <>
      <Navigation />
      <main id="main-content" tabIndex={-1} className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 focus:outline-none w-full flex-1">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
        <ContactSection />
      </main>
      <Footer />
      <AIChatbot />
    </>
  )
}

export default function Home() {
  return (
    <LanguageProvider>
      <PageContent />
    </LanguageProvider>
  )
}

