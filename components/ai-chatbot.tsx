"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { MessageSquare, X, Send, Mic, Bot, Loader2, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"

interface Message {
  role: "user" | "assistant"
  content: string
  id: string
}

export function AIChatbot() {
  const { language } = useLanguage()
  const fullTrans = getTranslation(language)
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(true)
  const [speechSupported, setSpeechSupported] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
        if (audioRef.current) audioRef.current.pause()
      }
    },
    [isOpen],
  )

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
      inputRef.current?.focus()
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  useEffect(() => {
    const API = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    setSpeechSupported(!!API)
    if (API) {
      const rec = new API()
      rec.continuous = false
      rec.onresult = (e: any) => setInputValue(e.results[0][0].transcript)
      rec.onstart = () => setIsListening(true)
      rec.onend = () => setIsListening(false)
      recognitionRef.current = rec
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const speakText = (text: string) => {
    if (!autoSpeak) return

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    const cleanText = text.replace(/[*#_]/g, "").trim()
    if (!cleanText) return

    const langCode = language === "ar" ? "ar" : "en"
    const url = `/api/tts?text=${encodeURIComponent(cleanText)}&lang=${langCode}`

    const audio = new Audio(url)
    audioRef.current = audio

    setIsSpeaking(true)

    audio.play().catch((err) => {
      console.error("Audio Playback Error:", err)
      setIsSpeaking(false)
    })

    audio.onended = () => setIsSpeaking(false)
    audio.onerror = () => setIsSpeaking(false)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanInput = (inputValue || "").trim()
    if (!cleanInput || isLoading) return

    const userMsg: Message = { role: "user", content: cleanInput, id: Date.now().toString() }
    setMessages((prev) => [...prev, userMsg])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })

      if (!response.body) throw new Error("No body")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ""

      const assistantId = (Date.now() + 1).toString()
      setMessages((prev) => [...prev, { role: "assistant", content: "", id: assistantId }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        assistantText += chunk

        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantId ? { ...msg, content: assistantText } : msg)),
        )
      }

      if (autoSpeak) speakText(assistantText)
    } catch (err) {
      console.error("Chat Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const t = {
    en: { title: "AI Assistant", placeholder: "Ask anything...", greeting: "Hello! How can I help you today?" },
    ar: { title: "المساعد الذكي", placeholder: "اسأل عن أي شيء...", greeting: "مرحباً! كيف يمكنني مساعدتك اليوم؟" },
  }[language]

  const chatA11y = fullTrans.a11y?.chatAria

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? (chatA11y?.close || "Close AI Assistant") : (chatA11y?.open || "Open AI Assistant")}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-transform focus-visible:outline-2 focus-visible:outline-primary ${isOpen ? "scale-0" : "scale-100"}`}
      >
        <MessageSquare className="h-6 w-6" aria-hidden="true" />
      </Button>

      <div
        role="dialog"
        aria-modal="false"
        aria-label={t.title}
        className={`fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] h-[550px] flex flex-col rounded-2xl bg-background border shadow-2xl transition-all duration-300 ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"}`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-between p-4 border-b bg-primary/5 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="font-bold text-sm">{t.title}</span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 focus-visible:outline-2 focus-visible:outline-primary"
              aria-label={autoSpeak ? (chatA11y?.mute || "Mute voice responses") : (chatA11y?.unmute || "Unmute voice responses")}
              onClick={() => {
                setAutoSpeak(!autoSpeak)
                if (audioRef.current) audioRef.current.pause()
              }}
            >
              {autoSpeak ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 focus-visible:outline-2 focus-visible:outline-primary"
              aria-label={chatA11y?.close || "Close AI Assistant"}
              onClick={() => {
                setIsOpen(false)
                if (audioRef.current) audioRef.current.pause()
              }}
            >
              <X size={16} aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
          aria-label={language === "ar" ? "سجل المحادثة" : "Chat conversation log"}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          <div className="bg-muted p-3 rounded-2xl text-sm max-w-[85%]">{t.greeting}</div>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`p-3 rounded-2xl text-sm max-w-[85%] ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.placeholder}
            aria-label={chatA11y?.inputLabel || t.placeholder}
            className="flex-1 h-10 bg-muted rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {speechSupported && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={isListening ? (chatA11y?.voiceStop || "Stop voice input") : (chatA11y?.voiceStart || "Start voice input")}
              onClick={() =>
                isListening
                  ? recognitionRef.current.stop()
                  : ((recognitionRef.current.lang = language === "ar" ? "ar-SA" : "en-US"),
                    recognitionRef.current.start())
              }
              className="focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Mic
                className={`h-4 w-4 ${isListening ? "text-destructive animate-pulse" : ""}`}
                aria-hidden="true"
              />
            </Button>
          )}
          <Button
            type="submit"
            size="icon"
            disabled={!inputValue.trim() || isLoading}
            aria-label={chatA11y?.send || "Send message"}
            className="focus-visible:outline-2 focus-visible:outline-primary"
          >
            {isLoading ? <Loader2 className="animate-spin h-4 w-4" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
          </Button>
        </form>
      </div>
    </>
  )
}
