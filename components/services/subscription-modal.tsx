"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"

interface SubscriptionModalProps {
    isOpen: boolean
    onClose: () => void
    serviceTitle: string
}

export function SubscriptionModal({ isOpen, onClose, serviceTitle }: SubscriptionModalProps) {
    const [phone, setPhone] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { language, isRTL } = useLanguage()
    const t = getTranslation(language)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // In a real app, you would send this to your backend
        console.log(`Subscribing to ${serviceTitle} with phone: ${phone}`)
        console.log(`Email to notify: AbdullahOmar@outlook.com`)

        toast.success(t.services.modal.success)
        setIsLoading(false)
        onClose()
        setPhone("")
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className={isRTL ? "text-right" : "text-left"}>{t.services.modal.title}</DialogTitle>
                    <DialogDescription className={isRTL ? "text-right" : "text-left"}>
                        {t.services.modal.description}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} aria-busy={isLoading} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="phone" className={isRTL ? "text-right" : "text-left"}>
                            {t.services.modal.phoneLabel}
                        </Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={t.services.modal.phonePlaceholder}
                            className={isRTL ? "text-right" : "text-left"}
                            required
                            aria-required="true"
                            type="tel"
                            autoComplete="tel"
                        />
                    </div>
                    <DialogFooter className={isRTL ? "sm:flex-row-reverse" : ""}>
                        <Button type="submit" disabled={isLoading} className="focus-visible:outline-2 focus-visible:outline-primary">
                            {isLoading ? "..." : t.services.modal.submit}
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose} className="focus-visible:outline-2 focus-visible:outline-primary">
                            {t.services.modal.cancel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
