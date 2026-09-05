"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ServiceCard } from "@/components/services/service-card"
import { SubscriptionModal } from "@/components/services/subscription-modal"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useLanguage, LanguageProvider } from "@/lib/language-context"
import { useLoading } from "@/lib/loading-context"
import { getTranslation } from "@/lib/translations"
import { getServices } from "@/lib/services"

interface DBService {
  id: string
  titleKey: string
  titleEn: string
  titleAr: string
  descriptionEn: string
  descriptionAr: string
  featuresEn: string[]
  featuresAr: string[]
  price: string | null
}

function ServicesPageContent() {
  const { language } = useLanguage()
  const { startFetchLoading, endFetchLoading, startPageTransition } = useLoading()
  const t = getTranslation(language)
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState("")
  const [dbServices, setDbServices] = useState<DBService[]>([])

  useEffect(() => {
    startFetchLoading(
      language === "ar" ? "جارٍ جلب الخدمات" : "Loading Services",
      language === "ar" ? "مزامنة باقات الخدمات المتاحة..." : "Synchronizing available services..."
    )

    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setDbServices(data.data)
        }
      })
      .catch((err) => console.warn("Using static services fallback:", err))
      .finally(() => {
        endFetchLoading()
      })
  }, [language, startFetchLoading, endFetchLoading])

  const defaultServices = getServices(t)

  const servicesList =
    dbServices.length > 0
      ? dbServices.map((s) => ({
          id: s.id,
          title: language === "ar" ? s.titleAr : s.titleEn,
          description: language === "ar" ? s.descriptionAr : s.descriptionEn,
          price: s.price || "100",
          features: language === "ar" ? s.featuresAr : s.featuresEn,
        }))
      : defaultServices

  const handleSubscribe = (title: string) => {
    setSelectedService(title)
    setModalOpen(true)
  }

  const handleDetails = (id: string) => {
    startPageTransition(
      language === "ar" ? "جارٍ تحميل تفاصيل الخدمة" : "Loading Service Details",
      language === "ar" ? "تهيئة بيئة العرض ثلاثية الأبعاد..." : "Preparing 3D environment..."
    )
    router.push(`/services/${id}`)
  }

  return (
    <>
      <Navigation />
      <main
        id="main-content"
        tabIndex={-1}
        className="container mx-auto max-w-6xl px-6 lg:px-8 py-24 focus:outline-none flex-1"
      >
        <ScrollReveal direction="up" className="space-y-4 mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">{t.services.title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {t.services.description}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((service, idx) => (
            <ScrollReveal key={service.id} direction="up" delay={idx * 100}>
              <ServiceCard
                id={service.id}
                title={service.title}
                description={service.description}
                price={service.price}
                features={service.features}
                onSubscribe={() => handleSubscribe(service.title)}
                onDetails={() => handleDetails(service.id)}
              />
            </ScrollReveal>
          ))}
        </div>
      </main>

      <Footer />

      <SubscriptionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceTitle={selectedService}
      />
    </>
  )
}

export default function ServicesPage() {
  return (
    <LanguageProvider>
      <ServicesPageContent />
    </LanguageProvider>
  )
}

