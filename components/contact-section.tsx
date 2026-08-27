"use client"

import { Mail, Phone, MapPin, Linkedin, Github, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
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
    valueEn: "Amman, Jordan",
    valueAr: "عمّان، الأردن",
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

  const getContactLabel = (key: string) => {
    const info = t.contact.info as Record<string, string>
    return info[key] || key
  }

  return (
    <section id="contact" className="py-24 scroll-mt-20">
      <div className="space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-foreground">
            <span className="text-primary font-mono text-lg" aria-hidden="true">05.</span> {t.contact.title}
          </h2>
          <div className="w-20 h-1 bg-primary rounded-full mx-auto" aria-hidden="true" />
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">{t.contact.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact Info */}
          <div className={cn("space-y-6", isRTL && "text-right")}>
            <h3 className="text-xl font-semibold text-foreground">{t.contact.info.title}</h3>
            <div className="space-y-4">
              {contactData.map((item) => (
                <div
                  key={item.key}
                  className={cn(
                    "flex items-center gap-4 p-4 bg-card rounded-lg border border-border",
                    isRTL && "flex-row-reverse",
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{getContactLabel(item.key)}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        aria-label={item.key === "email" ? (t.a11y?.emailAria || "Email Abdullah Omar") : (t.a11y?.phoneAria || "Call Abdullah Omar")}
                        className="text-foreground hover:text-primary transition-colors focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-foreground">{language === "ar" ? item.valueAr : item.valueEn}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <h4 className="text-sm text-muted-foreground mb-4">{t.contact.info.connect}</h4>
              <div className={cn("flex gap-4", isRTL && "justify-end")}>
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary"
                    aria-label={`${link.label} ${t.a11y?.newTab || "(opens in a new tab)"}`}
                  >
                    <link.icon size={20} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-card rounded-lg border border-border p-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center" aria-hidden="true">
              <Send className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">{t.contact.cta.title}</h3>
              <p className="text-muted-foreground text-sm">{t.contact.cta.description}</p>
            </div>
            <Button asChild size="lg" className="w-full">
              <a href="mailto:AbdullahOmar@outlook.com" aria-label={t.a11y?.emailAria || "Send an email to Abdullah Omar"}>
                <Mail className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} aria-hidden="true" />
                {t.contact.cta.button}
              </a>
            </Button>
          </div>
        </div>

        {/* Professional Vision */}
        <div
          className={cn("max-w-3xl mx-auto mt-16 p-8 bg-card rounded-lg border border-border", isRTL && "text-right")}
        >
          <h3 className="text-xl font-semibold text-foreground mb-4">{t.contact.vision.title}</h3>
          <p className="text-muted-foreground leading-relaxed">{t.contact.vision.text}</p>
        </div>
      </div>
    </section>
  )
}
