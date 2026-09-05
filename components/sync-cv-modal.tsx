"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/language-context"
import {
  RefreshCw,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Key,
  Loader2,
} from "lucide-react"

interface SyncDataCounts {
  experiences: number
  education: number
  skills: number
}

interface SyncResponseData {
  success: boolean
  message: string
  data?: {
    counts: SyncDataCounts
    durationMs: number
    parsedPreview?: {
      name: string
      title: string
      skillsCount: number
    }
  }
}

export function SyncCvModal() {
  const { language, isRTL } = useLanguage()
  const isAr = language === "ar"

  const [isOpen, setIsOpen] = useState(false)
  const [secret, setSecret] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SyncResponseData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Retrieve saved secret from localStorage on client load
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cv_sync_secret")
      if (saved) setSecret(saved)
    } catch {
      // localStorage may be unavailable
    }
  }, [])

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!secret.trim()) {
      setError(isAr ? "يرجى إدخال مفتاح المزامنة (Secret)" : "Please enter the sync secret key")
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // Persist secret in localStorage for convenience
      localStorage.setItem("cv_sync_secret", secret.trim())

      const res = await fetch("/api/sync-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret.trim()}`,
        },
        body: JSON.stringify({}),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.message || `Server returned HTTP ${res.status}`)
      }

      setResult(json)
    } catch (err: any) {
      setError(err?.message || (isAr ? "فشلت المزامنة" : "Sync failed"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full border-teal-500/40 bg-teal-500/5 hover:bg-teal-500/15 text-foreground font-mono text-xs shadow-[0_0_15px_rgba(20,184,166,0.15)] transition-all hover:border-teal-500 focus-visible:ring-teal-500"
          aria-label={isAr ? "مزامنة السيرة الذاتية من Google Doc" : "Sync CV from Google Doc"}
        >
          <RefreshCw className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
          <span>{isAr ? "مزامنة السيرة الذاتية" : "Sync CV"}</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        dir={isRTL ? "rtl" : "ltr"}
        className="sm:max-w-md rounded-2xl bg-card/95 backdrop-blur-2xl border-border/80 shadow-2xl p-6"
      >
        <DialogHeader className="text-start space-y-2">
          <div className="flex items-center gap-2 text-teal-400 font-mono text-xs">
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isAr ? "مزامنة المحتوى المباشر" : "Direct Content Sync"}</span>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            {isAr ? "تحديث السيرة الذاتية من Google Doc" : "Sync CV from Google Doc"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {isAr
              ? "يقوم هذا الإجراء بسحب البيانات المحدثة من مستند Google Doc الخاص بك وتحليلها عبر الذكاء الاصطناعي (Gemini) وتحديث قاعدة بيانات الموقع فوراً."
              : "This fetches live updates directly from your shared Google Doc, parses and translates them via Gemini AI, and updates the website database immediately."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Google Doc Quick Link */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/60 text-xs">
            <div className="flex items-center gap-2 text-foreground font-medium truncate">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">Abdullah Omar - CV Document</span>
            </div>
            <a
              href="https://docs.google.com/document/d/12xqyy8FcXRNRNAFbrTG0OrNwciBWKp4C1o6pOP3JzPo/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-teal-400 hover:text-teal-300 font-mono text-[11px] underline shrink-0 ms-2"
            >
              <span>{isAr ? "فتح المستند" : "Open Doc"}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <form onSubmit={handleSync} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sync-secret" className="text-xs font-medium flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{isAr ? "مفتاح المزامنة (Sync Secret)" : "Sync Secret Key"}</span>
              </Label>
              <Input
                id="sync-secret"
                type="password"
                placeholder={isAr ? "أدخل مفتاح المزامنة..." : "Enter your CV_SYNC_SECRET..."}
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="font-mono text-xs rounded-xl bg-background/50"
                autoComplete="off"
              />
              <p className="text-[11px] text-muted-foreground">
                {isAr
                  ? "يتم حفظ المفتاح محلياً في متصفحك حتى لا تضطر لإعادة كتابته كل مرة."
                  : "Saved locally in your browser so you don't need to re-enter it."}
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {result?.success && (
              <div className="space-y-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{isAr ? "تم تحديث الموقع بنجاح!" : "Website Updated Successfully!"}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px] text-muted-foreground text-center">
                  <div className="p-2 rounded-lg bg-background/40 border border-border/40">
                    <div className="text-foreground font-bold text-sm">
                      {result.data?.counts.experiences ?? 0}
                    </div>
                    <div>{isAr ? "خبرات" : "Experiences"}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-background/40 border border-border/40">
                    <div className="text-foreground font-bold text-sm">
                      {result.data?.counts.skills ?? 0}
                    </div>
                    <div>{isAr ? "مهارات" : "Skills"}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-background/40 border border-border/40">
                    <div className="text-foreground font-bold text-sm">
                      {result.data?.counts.education ?? 0}
                    </div>
                    <div>{isAr ? "تعليم/شهادات" : "Education"}</div>
                  </div>
                </div>
                <div className="text-end pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="text-[11px] text-teal-400 hover:text-teal-300 h-7 px-2"
                  >
                    {isAr ? "تحديث الصفحة لرؤية التغييرات ↺" : "Reload page to view updates ↺"}
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="rounded-xl text-xs"
                disabled={isLoading}
              >
                {isAr ? "إغلاق" : "Close"}
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={isLoading}
                className="rounded-xl text-xs gap-2 bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-500/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{isAr ? "جارٍ التحليل والتحديث..." : "Parsing with Gemini..."}</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isAr ? "بدء المزامنة الآن" : "Sync Now"}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
