"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"

interface ServiceCardProps {
    id: string
    title: string
    description: string
    price?: string
    features?: string[]
    imageSrc?: string
    onSubscribe: () => void
    onDetails: () => void
}

export function ServiceCard({
    id,
    title,
    description,
    price,
    features = [],
    imageSrc,
    onSubscribe,
    onDetails,
}: ServiceCardProps) {
    const { language, isRTL } = useLanguage()
    const t = getTranslation(language)

    return (
        <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="relative h-48 w-full bg-muted">
                {imageSrc ? (
                    <Image src={imageSrc} alt={title} fill className="object-cover" />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground" aria-hidden="true">
                        {/* Placeholder if no image provided */}
                        <span className="text-4xl">✨</span>
                    </div>
                )}
            </div>
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl">{title}</CardTitle>
                    {price && (
                        <Badge variant="secondary" className="text-sm font-semibold whitespace-nowrap">
                            {price} {t.services.currency}
                        </Badge>
                    )}
                </div>
                <CardDescription className="line-clamp-2">{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <ul className="grid gap-2 text-sm text-foreground/80">
                    {features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                            <span className="truncate">{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-4">
                <Button onClick={onSubscribe} aria-label={`${t.services.subscribe} - ${title}`} className="w-full">
                    {t.services.subscribe}
                </Button>
                <Button onClick={onDetails} aria-label={`${t.services.details} - ${title}`} variant="outline" className="w-full">
                    {t.services.details}
                </Button>
            </CardFooter>
        </Card>
    )
}
