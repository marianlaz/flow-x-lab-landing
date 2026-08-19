import Anthropic from "@anthropic-ai/sdk"

// The Anthropic SDK needs Node APIs, so opt out of the Edge runtime.
export const runtime = "nodejs"
// Allow enough time for a streamed completion.
export const maxDuration = 30

const DEFAULT_MODEL = "claude-3-5-haiku-latest"
const MAX_TOKENS = 1024
const MAX_MESSAGES = 50
const MAX_CONTENT_LENGTH = 8000

const SYSTEM_PROMPT =
  "You are the assistant for Flow Experiments Lab, a minimal workspace for indie builders, " +
  "founders, and technical entrepreneurs who ship. Be concise, practical, and friendly. " +
  "Favor concrete, actionable answers over hype. Reply in the language the user writes in."

type Role = "user" | "assistant"

interface IncomingMessage {
  role: Role
  content: string
}

function isValidMessage(value: unknown): value is IncomingMessage {
  if (typeof value !== "object" || value === null) return false
  const message = value as Record<string, unknown>
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0
  )
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  })
}

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return jsonError(
      "The chat is not configured yet. Set the ANTHROPIC_API_KEY environment variable to enable it.",
      500,
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonError("Request body must be valid JSON.", 400)
  }

  const rawMessages = (body as { messages?: unknown })?.messages
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return jsonError("Provide a non-empty `messages` array.", 400)
  }
  if (rawMessages.length > MAX_MESSAGES) {
    return jsonError(`Too many messages (max ${MAX_MESSAGES}).`, 400)
  }
  if (!rawMessages.every(isValidMessage)) {
    return jsonError(
      "Each message needs a `role` of 'user' or 'assistant' and non-empty string `content`.",
      400,
    )
  }

  const messages = (rawMessages as IncomingMessage[]).map((message) => ({
    role: message.role,
    content: message.content.slice(0, MAX_CONTENT_LENGTH),
  }))

  const anthropic = new Anthropic({ apiKey })
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL

  let anthropicStream: Awaited<ReturnType<typeof anthropic.messages.create>>
  try {
    anthropicStream = await anthropic.messages.create({
      model,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages,
      stream: true,
    })
  } catch (error) {
    const status =
      error instanceof Anthropic.APIError && typeof error.status === "number" ? error.status : 502
    const message =
      error instanceof Anthropic.APIError
        ? `Anthropic API error: ${error.message}`
        : "Failed to reach the Anthropic API."
    return jsonError(message, status)
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of anthropicStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
      } catch {
        controller.enqueue(encoder.encode("\n\n[The response was interrupted. Please try again.]"))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  })
}
