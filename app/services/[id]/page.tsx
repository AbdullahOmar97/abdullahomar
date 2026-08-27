"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowLeft, ArrowRight } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { SubscriptionModal } from "@/components/services/subscription-modal"
import { useLanguage, LanguageProvider } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { getServiceById } from "@/lib/services"
import Image from "next/image"

interface DBService {
  id: string
  titleKey: string
  titleEn: string
  titleAr: string
  descriptionEn: string
  descriptionAr: string
  detailsEn?: string | null
  detailsAr?: string | null
  featuresEn: string[]
  featuresAr: string[]
  price: string | null
  imageSrc?: string | null
}

function ServiceDetailContent() {
  const params = useParams()
  const router = useRouter()
  const { language, isRTL } = useLanguage()
  const t = getTranslation(language)
  const [modalOpen, setModalOpen] = useState(false)
  const [dbService, setDbService] = useState<DBService | null>(null)

  const id = params.id as string

  useEffect(() => {
    if (!id) return
    fetch(`/api/services/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setDbService(data.data)
        }
      })
      .catch((err) => console.warn("Using static service detail fallback:", err))
  }, [id])

  const staticService = getServiceById(t, id)

  const service = dbService
    ? {
        id: dbService.id,
        title: language === "ar" ? dbService.titleAr : dbService.titleEn,
        description: language === "ar" ? dbService.descriptionAr : dbService.descriptionEn,
        details: language === "ar" ? dbService.detailsAr || "" : dbService.detailsEn || "",
        features: language === "ar" ? dbService.featuresAr : dbService.featuresEn,
        price: dbService.price || "100",
        imageSrc: dbService.imageSrc || staticService?.imageSrc || "/consulting-placeholder.jpg",
      }
    : staticService

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Service not found</h1>
          <Button onClick={() => router.push("/services")} className="mt-4">
            Back to Services
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main
        id="main-content"
        tabIndex={-1}
        className="container mx-auto max-w-6xl px-6 lg:px-8 py-24 focus:outline-none"
      >
        <Button
          variant="ghost"
          className="mb-8 gap-2 focus-visible:outline-2 focus-visible:outline-primary"
          onClick={() => router.push("/services")}
          aria-label={isRTL ? "العودة إلى صفحة الخدمات" : "Back to Services page"}
        >
          {isRTL ? <ArrowRight size={16} aria-hidden="true" /> : <ArrowLeft size={16} aria-hidden="true" />}
          {isRTL ? "العودة للخدمات" : "Back to Services"}
        </Button>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="relative h-[400px] w-full bg-muted rounded-xl overflow-hidden shadow-lg">
            {service.imageSrc ? (
              <Image
                src={service.imageSrc}
                alt={service.title}
                fill
                className="object-cover"
              />
            ) : (
              <div
                className="flex items-center justify-center h-full text-muted-foreground text-6xl"
                aria-hidden="true"
              >
                ✨
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl font-bold">{service.title}</h1>
                <Badge variant="secondary" className="text-xl px-4 py-1">
                  {service.price} {t.services.currency}
                </Badge>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="p-6 bg-secondary/20 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-4">{t.services.details}</h2>
              <p className="text-foreground/90 mb-6">{service.details}</p>

              <h3 className="font-semibold mb-3">
                {isRTL ? "الميزات الرئيسية:" : "Key Features:"}
              </h3>
              <ul className="grid gap-3">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div
                      className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0"
                      aria-hidden="true"
                    >
                      <Check size={14} />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              size="lg"
              className="w-full text-lg"
              onClick={() => setModalOpen(true)}
            >
              {t.services.subscribe}
            </Button>
          </div>
        </div>
      </main>

      <SubscriptionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceTitle={service.title}
      />
    </div>
  )
}

export default function ServiceDetailPage() {
  return (
    <LanguageProvider>
      <ServiceDetailContent />
    </LanguageProvider>
  )
}
