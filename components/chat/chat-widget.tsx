"use client"

import * as React from "react"
import { Loader2, MessageCircle, Send, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type Role = "user" | "assistant"

interface ChatMessage {
  id: string
  role: Role
  content: string
}

const INITIAL_ASSISTANT_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hi! I'm the Flow Experiments Lab assistant. Ask me anything about building and shipping.",
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function ChatWidget() {
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<ChatMessage[]>([INITIAL_ASSISTANT_MESSAGE])
  const [input, setInput] = React.useState("")
  const [isStreaming, setIsStreaming] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  // Keep the newest message in view as content streams in.
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, open])

  // Move focus to the input when the panel opens.
  React.useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  async function sendMessage() {
    const trimmed = input.trim()
    if (!trimmed || isStreaming) return

    const userMessage: ChatMessage = { id: createId(), role: "user", content: trimmed }
    const assistantId = createId()

    const history = [...messages, userMessage]
    setMessages([...history, { id: assistantId, role: "assistant", content: "" }])
    setInput("")
    setError(null)
    setIsStreaming(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: history
            .filter((message) => message.id !== "welcome")
            .map(({ role, content }) => ({ role, content })),
        }),
      })

      if (!response.ok || !response.body) {
        let message = "Something went wrong. Please try again."
        try {
          const data = await response.json()
          if (data?.error) message = data.error
        } catch {
          // Response wasn't JSON; keep the default message.
        }
        throw new Error(message)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        if (!chunk) continue
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, content: message.content + chunk }
              : message,
          ),
        )
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Something went wrong."
      setError(message)
      // Drop the empty assistant placeholder so the UI doesn't show a blank bubble.
      setMessages((current) =>
        current.filter((message) => !(message.id === assistantId && message.content === "")),
      )
    } finally {
      setIsStreaming(false)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  return (
    <>
      {/* Launcher */}
      <Button
        type="button"
        size="icon-lg"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="AI chat"
          className="fixed bottom-24 right-6 z-50 flex h-[32rem] max-h-[calc(100vh-8rem)] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
        >
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium tracking-tight">Lab Assistant</p>
              <p className="text-xs text-muted-foreground">Powered by Anthropic Claude</p>
            </div>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-3 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-relaxed",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                    )}
                  >
                    {message.content ||
                      (isStreaming ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-label="Thinking" />
                      ) : null)}
                  </div>
                </div>
              ))}
              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-border p-3">
            <div className="flex items-end gap-2">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message…"
                rows={1}
                className="max-h-32 min-h-9 flex-1 resize-none"
                disabled={isStreaming}
              />
              <Button
                type="button"
                size="icon"
                onClick={() => void sendMessage()}
                disabled={isStreaming || input.trim().length === 0}
                aria-label="Send message"
              >
                {isStreaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
