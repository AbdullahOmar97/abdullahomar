"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import {
  MessageSquare,
  X,
  Send,
  Mic,
  MicOff,
  Bot,
  Loader2,
  Volume2,
  VolumeX,
  Radio,
  Copy,
  Check,
  Square,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { GeminiLiveClient } from "@/lib/gemini-live-client"
import { AudioOrbVisualizer } from "@/components/audio-orb-visualizer"

interface Message {
  role: "user" | "assistant"
  content: string
  id: string
}

type ChatMode = "chat" | "live"
type LiveStatus = "idle" | "connecting" | "connected" | "speaking" | "listening" | "error"

export function AIChatbot() {
  const { language, isRTL } = useLanguage()
  const trans = getTranslation(language)
  const t = trans.chat
  const chatA11y = trans.a11y?.chatAria

  const [isOpen, setIsOpen] = useState(false)
  const [activeMode, setActiveMode] = useState<ChatMode>("chat")
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeakingTTS, setIsSpeakingTTS] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)

  // Live session state
  const [liveStatus, setLiveStatus] = useState<LiveStatus>("idle")
  const [liveTranscript, setLiveTranscript] = useState("")
  const [isLiveMuted, setIsLiveMuted] = useState(false)
  const [liveError, setLiveError] = useState<string | null>(null)
  const [liveInputNode, setLiveInputNode] = useState<AudioNode | null>(null)
  const [liveOutputNode, setLiveOutputNode] = useState<AudioNode | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const liveClientRef = useRef<GeminiLiveClient | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
        stopAllAudio()
      }
    },
    [isOpen],
  )

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
      if (activeMode === "chat") {
        inputRef.current?.focus()
      }
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, activeMode, handleKeyDown])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, liveTranscript])

  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsSpeakingTTS(false)
    if (liveClientRef.current) {
      liveClientRef.current.cleanup()
      liveClientRef.current = null
    }
    setLiveStatus("idle")
    setLiveInputNode(null)
    setLiveOutputNode(null)
  }

  // Speak text via TTS endpoint for text chat mode
  const speakText = (text: string) => {
    if (!autoSpeak) return

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    const cleanText = text.replace(/[*#_`]/g, "").trim()
    if (!cleanText) return

    const langCode = language === "ar" ? "ar" : "en"
    const url = `/api/tts?text=${encodeURIComponent(cleanText)}&lang=${langCode}`

    const audio = new Audio(url)
    audioRef.current = audio
    setIsSpeakingTTS(true)

    audio.play().catch((err) => {
      console.error("Audio Playback Error:", err)
      setIsSpeakingTTS(false)
    })

    audio.onended = () => setIsSpeakingTTS(false)
    audio.onerror = () => setIsSpeakingTTS(false)
  }

  // Handle Standard Text Chat Streaming
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue || "").trim()
    if (!text || isLoading) return

    const userMsg: Message = { role: "user", content: text, id: Date.now().toString() }
    setMessages((prev) => [...prev, userMsg])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          conversationId,
          language,
          persist: true,
        }),
      })

      const returnedConvId = response.headers.get("X-Conversation-Id")
      if (returnedConvId && !conversationId) {
        setConversationId(returnedConvId)
      }

      if (!response.body) throw new Error("No response body")

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
    } catch (err: any) {
      console.error("Chat Error:", err)
      const errorMsg: Message = {
        role: "assistant",
        content:
          language === "ar"
            ? "عذراً، حدث خطأ أثناء معالجة الطلب."
            : "Sorry, an error occurred while processing your request.",
        id: (Date.now() + 1).toString(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  // Start Gemini Live API bidirectional session
  const startLiveSession = async () => {
    try {
      setLiveError(null)
      setLiveStatus("connecting")

      // 1. Fetch ephemeral token from secure server route
      const tokenRes = await fetch("/api/live/token", { method: "POST" })
      const tokenData = await tokenRes.json()

      if (!tokenRes.ok || !tokenData.token) {
        throw new Error(tokenData.error || t.connectionError)
      }

      // 2. Initialize Live client
      const liveClient = new GeminiLiveClient({
        onConnect: () => {
          setLiveStatus("connected")
          setLiveInputNode(liveClient.inputAnalyser)
          setLiveOutputNode(liveClient.outputAnalyser)
        },
        onDisconnect: () => {
          setLiveStatus("idle")
          setLiveInputNode(null)
          setLiveOutputNode(null)
        },
        onError: (err) => {
          console.error("Live Client Error:", err)
          setLiveError(typeof err === "string" ? err : err.message)
          setLiveStatus("error")
        },
        onUserSpeaking: (speaking) => {
          setLiveStatus((prev) => (prev === "speaking" ? prev : speaking ? "listening" : "connected"))
        },
        onAISpeaking: (speaking, chunk) => {
          if (speaking) {
            setLiveStatus("speaking")
            if (chunk) {
              setLiveTranscript((prev) => prev + chunk)
            }
          } else {
            setLiveStatus("connected")
          }
        },
        onTranscription: (text, isFinal, speaker) => {
          if (speaker === "model") {
            setLiveTranscript(text)
            if (isFinal && text.trim()) {
              setMessages((prev) => [
                ...prev,
                { role: "assistant", content: text.trim(), id: Date.now().toString() },
              ])
              setLiveTranscript("")
            }
          } else if (speaker === "user" && isFinal && text.trim()) {
            setMessages((prev) => [
              ...prev,
              { role: "user", content: text.trim(), id: Date.now().toString() },
            ])
          }
        },
        onInterrupted: () => {
          setLiveStatus("listening")
        },
      })

      liveClientRef.current = liveClient
      await liveClient.connect(tokenData.token)
    } catch (err: any) {
      console.error("Failed to start Live session:", err)
      setLiveError(err.message || t.connectionError)
      setLiveStatus("error")
    }
  }

  // Stop Live session
  const stopLiveSession = () => {
    if (liveClientRef.current) {
      liveClientRef.current.cleanup()
      liveClientRef.current = null
    }
    setLiveStatus("idle")
    setLiveTranscript("")
    setLiveInputNode(null)
    setLiveOutputNode(null)
    setIsLiveMuted(false)
  }

  // Toggle Mute on Live session
  const toggleLiveMute = () => {
    if (!liveClientRef.current) return
    const nextMuted = !isLiveMuted
    liveClientRef.current.setMuted(nextMuted)
    setIsLiveMuted(nextMuted)
  }

  // Copy message text to clipboard
  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Switch modes cleanly
  const switchMode = (mode: ChatMode) => {
    if (mode === activeMode) return
    if (activeMode === "live") {
      stopLiveSession()
    }
    setActiveMode(mode)
    if (mode === "live") {
      startLiveSession()
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudio()
    }
  }, [])

  return (
    <>
      {/* Floating Trigger Buttons */}
      <div
        className={`fixed z-50 flex items-center gap-2.5 isolate bottom-6 end-6 transition-all duration-300 ${
          isOpen ? "scale-0 opacity-0 pointer-events-none invisible" : "scale-100 opacity-100 pointer-events-auto visible"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Ambient Glow Aura */}
        <div className="absolute inset-0 -m-2 rounded-full bg-primary/25 blur-xl pointer-events-none animate-aura-breath" aria-hidden="true" />

        {/* Direct Live Voice Trigger */}
        <Button
          onClick={() => {
            setIsOpen(true)
            switchMode("live")
          }}
          aria-label={t.startLive || "Start Live Voice"}
          title={t.startLive || "Start Live Voice"}
          className={`relative h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 bg-gradient-to-tr from-cyan-600 to-primary hover:from-cyan-500 hover:to-primary/90 text-white focus-visible:outline-2 focus-visible:outline-primary ${
            isOpen ? "scale-0 opacity-0 pointer-events-none invisible" : "scale-100 opacity-100 pointer-events-auto visible"
          }`}
        >
          <Mic className="h-6 w-6" aria-hidden="true" />
        </Button>

        {/* Standard Chat Button */}
        <Button
          onClick={() => {
            const nextOpen = !isOpen
            setIsOpen(nextOpen)
            if (nextOpen && activeMode !== "chat") {
              setActiveMode("chat")
            }
            if (!nextOpen) stopAllAudio()
          }}
          aria-label={isOpen ? chatA11y?.close || "Close AI Assistant" : chatA11y?.open || "Open AI Assistant"}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          className={`relative h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 bg-primary hover:bg-primary/90 text-primary-foreground focus-visible:outline-2 focus-visible:outline-primary ${
            isOpen ? "scale-0 opacity-0 pointer-events-none invisible" : "scale-100 opacity-100 pointer-events-auto visible"
          }`}
        >
          <MessageSquare className="h-6 w-6" aria-hidden="true" />
        </Button>
      </div>

      {/* Main Dialog Window */}
      <div
        role="dialog"
        aria-modal="false"
        aria-label={t.title}
        style={{
          transformOrigin: isRTL ? "bottom left" : "bottom right",
        }}
        className={`fixed z-50 flex flex-col rounded-3xl bg-background/95 backdrop-blur-xl border border-border shadow-2xl transition-all duration-300 overflow-hidden isolate
          max-sm:inset-x-4 max-sm:bottom-4 max-sm:w-auto max-sm:max-h-[min(620px,calc(100dvh-4.5rem))]
          sm:bottom-6 sm:end-6 sm:w-[420px] sm:max-w-[calc(100vw-32px)] sm:h-[620px] sm:max-h-[min(620px,calc(100dvh-5rem))]
          ${isOpen ? "scale-100 opacity-100 pointer-events-auto visible" : "scale-0 opacity-0 pointer-events-none invisible"}
        `}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-primary/10 text-primary">
              <Bot className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="font-semibold text-sm leading-none">{t.title}</span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {activeMode === "live" ? t.liveVoiceTitle : "Fast Multi-Turn Chat"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* TTS Mute Toggle (in chat mode) */}
            {activeMode === "chat" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full focus-visible:outline-2 focus-visible:outline-primary"
                aria-label={
                  autoSpeak ? chatA11y?.mute || "Mute voice responses" : chatA11y?.unmute || "Unmute voice responses"
                }
                onClick={() => {
                  setAutoSpeak(!autoSpeak)
                  if (audioRef.current) audioRef.current.pause()
                }}
              >
                {autoSpeak ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
              </Button>
            )}

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full focus-visible:outline-2 focus-visible:outline-primary"
              aria-label={chatA11y?.close || "Close AI Assistant"}
              onClick={() => {
                setIsOpen(false)
                stopAllAudio()
              }}
            >
              <X size={16} aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Mode 1: Gemini Live Voice Interface */}
        {activeMode === "live" && (
          <div className="flex-1 flex flex-col items-center justify-between p-4 bg-gradient-to-b from-background via-background/80 to-muted/30 overflow-hidden">
            {/* Live Status Header */}
            <div className="w-full flex items-center justify-between text-xs px-2">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    liveStatus === "connected" || liveStatus === "listening" || liveStatus === "speaking"
                      ? "bg-emerald-500 animate-ping"
                      : liveStatus === "connecting"
                      ? "bg-amber-500 animate-pulse"
                      : "bg-muted-foreground"
                  }`}
                />
                <span className="font-medium text-muted-foreground">
                  {liveStatus === "connecting" && t.connecting}
                  {liveStatus === "listening" && t.listening}
                  {liveStatus === "speaking" && t.speaking}
                  {liveStatus === "connected" && t.connected}
                  {liveStatus === "idle" && t.disconnected}
                  {liveStatus === "error" && "Error"}
                </span>
              </div>

              {liveStatus !== "idle" && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted font-mono text-muted-foreground">
                  16kHz / 24kHz PCM
                </span>
              )}
            </div>

            {/* 3D Audio Orb Visualizer */}
            <div className="relative w-full h-[260px] flex items-center justify-center my-2">
              <AudioOrbVisualizer
                inputNode={liveInputNode}
                outputNode={liveOutputNode}
                isActive={liveStatus !== "idle"}
                className="w-full h-full"
              />

              {liveStatus === "idle" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-background/60 backdrop-blur-sm rounded-2xl">
                  <Mic className="h-8 w-8 text-primary mb-2" />
                  <p className="text-sm font-semibold mb-1">{t.liveVoiceTitle}</p>
                  <p className="text-xs text-muted-foreground max-w-[240px] mb-4">
                    {t.liveSubtitle}
                  </p>
                  <Button onClick={startLiveSession} className="rounded-full gap-2 px-6 shadow-md">
                    <Radio className="h-4 w-4" />
                    {t.startLive}
                  </Button>
                </div>
              )}
            </div>

            {/* Live Subtitle / Transcription Box */}
            <div className="w-full min-h-[68px] max-h-[88px] overflow-y-auto px-3 py-2 rounded-2xl bg-muted/60 border border-border/50 text-xs text-center flex items-center justify-center">
              {liveTranscript ? (
                <p className="animate-fade-in text-foreground leading-relaxed">{liveTranscript}</p>
              ) : liveStatus === "speaking" ? (
                <p className="text-primary italic animate-pulse">{t.speaking}</p>
              ) : liveStatus === "listening" ? (
                <p className="text-emerald-500 font-medium">{t.listening}</p>
              ) : liveError ? (
                <p className="text-destructive font-medium">{liveError}</p>
              ) : (
                <p className="text-muted-foreground italic">
                  {language === "ar"
                    ? "تحدث بشكل طبيعي، سيجيبك المساعد صوتياً في الحال."
                    : "Speak naturally, the assistant will respond with live voice."}
                </p>
              )}
            </div>

            {/* Bottom Controls with Mode Switcher */}
            <div className="flex items-center justify-between w-full pt-3 px-2 border-t border-border/50">
              {/* Switch back to Chat mode button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => switchMode("chat")}
                className="rounded-full px-3.5 h-10 text-xs font-medium gap-1.5 text-foreground hover:bg-muted"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{t.textMode}</span>
              </Button>

              {/* Live Voice session controls */}
              <div className="flex items-center gap-2">
                {liveStatus !== "idle" ? (
                  <>
                    <Button
                      type="button"
                      variant={isLiveMuted ? "destructive" : "outline"}
                      size="icon"
                      className="h-10 w-10 rounded-full shadow-sm"
                      onClick={toggleLiveMute}
                      aria-label={isLiveMuted ? t.unmuteMic : t.muteMic}
                    >
                      {isLiveMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-10 w-10 rounded-full shadow-md"
                      onClick={stopLiveSession}
                      aria-label={t.endLive}
                    >
                      <Square className="h-4 w-4 fill-current" />
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={startLiveSession}
                    className="rounded-full gap-2 px-5 h-10 shadow-md text-xs font-medium"
                  >
                    <Radio className="h-3.5 w-3.5" />
                    {t.startLive}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mode 2: Standard Text Streaming Interface */}
        {activeMode === "chat" && (
          <>
            {/* Message Log */}
            <div
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
              aria-label={language === "ar" ? "سجل المحادثة" : "Chat conversation log"}
              className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth"
            >
              <div className="bg-muted/70 p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[90%] border border-border/40">
                {t.greeting}
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col group ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[88%] break-words transition-all ${
                      msg.role === "user"
                        ? `bg-primary text-primary-foreground ${isRTL ? "rounded-tl-sm" : "rounded-tr-sm"}`
                        : `bg-muted/70 text-foreground border border-border/40 ${isRTL ? "rounded-tr-sm" : "rounded-tl-sm"} shadow-xs`
                    }`}
                  >
                    {msg.content || (
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        {t.thinking}
                      </span>
                    )}
                  </div>

                  {msg.role === "assistant" && msg.content && (
                    <div className="flex items-center gap-1 mt-1 px-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-md text-muted-foreground hover:text-foreground"
                        aria-label={t.copy}
                        onClick={() => copyMessage(msg.id, msg.content)}
                      >
                        {copiedId === msg.id ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-md text-muted-foreground hover:text-foreground"
                        aria-label="Read aloud"
                        onClick={() => speakText(msg.content)}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {/* Suggestions Pills (shown when few messages) */}
              {messages.length === 0 && t.suggestions && (
                <div className="pt-2 space-y-1.5">
                  <p className="text-[11px] font-medium text-muted-foreground px-1">
                    {t.suggestedTitle}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {t.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(s)}
                        className="text-start px-3 py-2 text-xs rounded-xl bg-muted/40 hover:bg-muted border border-border/40 text-foreground/80 hover:text-foreground transition-colors w-full"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Bar with Mode Switcher Button in place of Mic */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="p-3 border-t border-border/80 bg-background/60 backdrop-blur-sm flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t.placeholder}
                aria-label={chatA11y?.inputLabel || t.placeholder}
                className="flex-1 min-w-0 h-10 bg-muted/70 rounded-full px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 border border-border/40 transition-all placeholder:text-muted-foreground/70 text-start"
              />

              {/* Switch to Live Voice button in place of the old mic STT button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => switchMode("live")}
                aria-label={t.startLive || "Start Live Voice"}
                title={t.startLive || "Start Live Voice"}
                className="h-10 rounded-full px-3 gap-1.5 text-xs font-medium border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all shrink-0"
              >
                <Radio className="h-3.5 w-3.5 animate-pulse" />
                <span>{t.liveMode}</span>
              </Button>

              <Button
                type="submit"
                size="icon"
                disabled={!inputValue.trim() || isLoading}
                aria-label={chatA11y?.send || "Send message"}
                className="h-10 w-10 rounded-full shrink-0 focus-visible:outline-2 focus-visible:outline-primary"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-4 w-4" aria-hidden="true" />
                ) : (
                  <Send className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </>
  )
}
