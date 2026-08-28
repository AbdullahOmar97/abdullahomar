"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Linkedin, Github, Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { SpotlightCard } from "./spotlight-card"
import { ScrollReveal } from "./scroll-reveal"
import { cn } from "@/lib/utils"

const contactData = [
  {
    icon: Mail,
    key: "email",
    value: "AbdullahOmar@outlook.com",
    href: "mailto:AbdullahOmar@outlook.com",
  },
  {
    icon: Phone,
    key: "phone",
    value: "+962 787 900 948",
    href: "tel:+962787900948",
  },
  {
    icon: MapPin,
    key: "location",
    valueEn: "Amman, Jordan, 11623",
    valueAr: "عمّان، الأردن، 11623",
    href: null,
  },
]

const socialLinks = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/AbdullahOmar97",
  },
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/AbdullahOmar97",
  },
]

export function ContactSection() {
  const { language, isRTL } = useLanguage()
  const t = getTranslation(language)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const getContactLabel = (key: string) => {
    const info = t.contact.info as Record<string, string>
    return info[key] || key
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          subject: "Portfolio Inquiry",
          message: message.trim(),
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        toast.success(
          language === "ar"
            ? "تم إرسال رسالتك بنجاح وحفظها في قاعدة البيانات!"
            : "Your message was sent successfully and saved!"
        )
        setName("")
        setEmail("")
        setPhone("")
        setMessage("")
      } else {
        toast.error(
          language === "ar"
            ? "حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً."
            : "Failed to send message, please try again."
        )
      }
    } catch (err) {
      console.error("Error submitting contact form:", err)
      toast.error(
        language === "ar"
          ? "حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً."
          : "Failed to send message, please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 scroll-mt-20">
      <div className="space-y-12">
        <ScrollReveal direction="up" className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-foreground">
            <span className="text-primary font-mono text-lg" aria-hidden="true">
              06.
            </span>{" "}
            {t.contact.title}
          </h2>
          <div className="w-20 h-1 bg-primary rounded-full mx-auto" aria-hidden="true" />
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">
            {t.contact.description}
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
          {/* Contact Info */}
          <ScrollReveal direction={isRTL ? "left" : "right"} delay={100} className={cn("space-y-6", isRTL && "text-right")}>
            <h3 className="text-xl font-bold text-foreground">
              {t.contact.info.title}
            </h3>
            <div className="space-y-4">
              {contactData.map((item) => (
                <SpotlightCard
                  key={item.key}
                  className={cn(
                    "flex items-center gap-4 p-4 border border-border/80 hover:border-primary/50 shadow-sm transition-all duration-300",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  <div
                    className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary"
                    aria-hidden="true"
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      {getContactLabel(item.key)}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        aria-label={
                          item.key === "email"
                            ? t.a11y?.emailAria || "Email Abdullah Omar"
                            : t.a11y?.phoneAria || "Call Abdullah Omar"
                        }
                        className="text-foreground hover:text-primary font-medium transition-colors focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-foreground font-medium">
                        {language === "ar" ? item.valueAr : item.valueEn}
                      </p>
                    )}
                  </div>
                </SpotlightCard>
              ))}
            </div>

            <div className="pt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">
                {t.contact.info.connect}
              </h4>
              <div className={cn("flex gap-4", isRTL && "justify-end")}>
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-card border border-border/80 hover:border-primary flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 shadow-sm transition-all duration-300 focus-visible:outline-2 focus-visible:outline-primary"
                    aria-label={`${link.label} ${t.a11y?.newTab || "(opens in a new tab)"}`}
                  >
                    <link.icon size={20} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Interactive Direct Message Form */}
          <ScrollReveal direction={isRTL ? "right" : "left"} delay={150}>
            <SpotlightCard className="p-6 md:p-8 border border-border/80 shadow-md">
              <h3
                className={cn(
                  "text-xl font-bold text-foreground mb-4",
                  isRTL && "text-right"
                )}
              >
                {language === "ar" ? "أرسل رسالة مباشرة" : "Send a Direct Message"}
              </h3>

              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <CheckCircle2 className="h-12 w-12 text-primary mx-auto animate-bounce" />
                  <h4 className="text-lg font-bold">
                    {language === "ar" ? "شكراً لتواصلك!" : "Thank you for reaching out!"}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {language === "ar"
                      ? "تم تسجيل رسالتك بنجاح وسأقوم بالرد عليك في أقرب وقت."
                      : "Your message has been stored and I will get back to you shortly."}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setSubmitted(false)} className="rounded-full">
                    {language === "ar" ? "إرسال رسالة أخرى" : "Send Another Message"}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name" className={isRTL ? "text-right block text-xs" : "text-xs"}>
                      {language === "ar" ? "الاسم" : "Name"}
                    </Label>
                    <Input
                      id="contact-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === "ar" ? "اسمك الكامل" : "Your Name"}
                      required
                      className={isRTL ? "text-right" : ""}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email" className={isRTL ? "text-right block text-xs" : "text-xs"}>
                      {language === "ar" ? "البريد الإلكتروني" : "Email"}
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className={isRTL ? "text-right" : ""}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-phone" className={isRTL ? "text-right block text-xs" : "text-xs"}>
                      {language === "ar" ? "رقم الهاتف (اختياري)" : "Phone (Optional)"}
                    </Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+962 7..."
                      className={isRTL ? "text-right" : ""}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-message" className={isRTL ? "text-right block text-xs" : "text-xs"}>
                      {language === "ar" ? "الرسالة" : "Message"}
                    </Label>
                    <Textarea
                      id="contact-message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        language === "ar"
                          ? "اكتب تفاصيل استفسارك أو مشروعك هنا..."
                          : "Write your message or project details here..."
                      }
                      required
                      className={isRTL ? "text-right resize-none" : "resize-none"}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full shadow-md hover:scale-[1.01] transition-all">
                    <Send className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                    {isSubmitting
                      ? language === "ar"
                        ? "جاري الإرسال..."
                        : "Sending..."
                      : language === "ar"
                      ? "إرسال الرسالة"
                      : "Send Message"}
                  </Button>
                </form>
              )}
            </SpotlightCard>
          </ScrollReveal>
        </div>

        {/* Professional Vision */}
        <ScrollReveal direction="up" delay={200}>
          <SpotlightCard
            className={cn(
              "max-w-3xl mx-auto mt-16 p-8 border border-border/80 shadow-sm",
              isRTL && "text-right"
            )}
          >
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" aria-hidden="true" />
              <span>{t.contact.vision.title}</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed text-base">
              {t.contact.vision.text}
            </p>
          </SpotlightCard>
        </ScrollReveal>
      </div>
    </section>
  )
}

