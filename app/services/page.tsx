"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ServiceCard } from "@/components/services/service-card"
import { SubscriptionModal } from "@/components/services/subscription-modal"
import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { LanguageProvider } from "@/lib/language-context"
import { getServices } from "@/lib/services"

function ServicesPageContent() {
    const { language } = useLanguage()
    const t = getTranslation(language)
    const router = useRouter()
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedService, setSelectedService] = useState("")

    const services = getServices(t) // Use the helper function

    const handleSubscribe = (title: string) => {
        setSelectedService(title)
        setModalOpen(true)
    }

    const handleDetails = (id: string) => {
        router.push(`/services/${id}`)
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main id="main-content" tabIndex={-1} className="container mx-auto max-w-6xl px-6 lg:px-8 py-24 focus:outline-none">
                <div className="space-y-4 mb-12">
                    <h1 className="text-4xl font-bold tracking-tight">{t.services.title}</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        {t.services.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <ServiceCard
                            key={service.id}
                            id={service.id}
                            title={service.title}
                            description={service.description}
                            price={service.price}
                            features={service.features}
                            onSubscribe={() => handleSubscribe(service.title)}
                            onDetails={() => handleDetails(service.id)}
                        />
                    ))}
                </div>
            </main>

            <SubscriptionModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                serviceTitle={selectedService}
            />
        </div>
    )
}

export default function ServicesPage() {
    return (
        <LanguageProvider>
            <ServicesPageContent />
        </LanguageProvider>
    )
}
