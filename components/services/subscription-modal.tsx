"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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

export function SubscriptionModal({
  isOpen,
  onClose,
  serviceTitle,
}: SubscriptionModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { language, isRTL } = useLanguage()
  const t = getTranslation(language)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Service Inquiry",
          email: email.trim() || `lead-${Date.now()}@inquiry.local`,
          phone: phone.trim(),
          subject: `Service Subscription: ${serviceTitle}`,
          message: `User requested details for service: ${serviceTitle}. Contact phone: ${phone}`,
        }),
      })

      if (response.ok) {
        toast.success(t.services.modal.success)
        onClose()
        setPhone("")
        setName("")
        setEmail("")
      } else {
        toast.error(
          language === "ar"
            ? "تعذر إرسال الطلب، يرجى المحاولة مرة أخرى"
            : "Failed to send request, please try again."
        )
      }
    } catch (err) {
      console.error("Subscription submission error:", err)
      toast.error(
        language === "ar"
          ? "تعذر إرسال الطلب، يرجى المحاولة مرة أخرى"
          : "Failed to send request, please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t.services.modal.title}
          </DialogTitle>
          <DialogDescription>
            {t.services.modal.description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} aria-busy={isLoading} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="service-name">
              {language === "ar" ? "الاسم (اختياري)" : "Name (Optional)"}
            </Label>
            <Input
              id="service-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === "ar" ? "اسمك الكريم" : "Your Name"}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">
              {t.services.modal.phoneLabel}
            </Label>
            <Input
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.services.modal.phonePlaceholder}
              dir="ltr"
              className="text-start font-mono"
              required
              aria-required="true"
              type="tel"
              autoComplete="tel"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="focus-visible:outline-2 focus-visible:outline-primary"
            >
              {isLoading ? "..." : t.services.modal.submit}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="focus-visible:outline-2 focus-visible:outline-primary"
            >
              {t.services.modal.cancel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
