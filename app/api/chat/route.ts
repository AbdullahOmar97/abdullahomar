import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { CV_SYSTEM_INSTRUCTION } from "@/lib/ai-cv-context";
import {
  addMessageToConversation,
  createConversation,
  getCachedQuery,
  upsertCachedQuery,
} from "@/lib/db";
import {
  normalizeQuery,
  computeQueryHash,
  matchStaticFaq,
  memoryCache,
  createCachedStreamResponse,
} from "@/lib/chat-cache";

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function POST(req: Request) {
  try {
    const ai = getGenAI();
    const body = await req.json();
    const { messages, conversationId, language } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content || "" }],
    }));

    const lastMessage = messages[messages.length - 1].content || "";

    // Background persistence without blocking AI streaming
    let activeConvId = conversationId;
    const persistPromise = (async () => {
      try {
        if (!activeConvId && body.persist) {
          const conv = await createConversation({
            title: lastMessage.slice(0, 50),
            language: language || "en",
          });
          activeConvId = conv.id;
        }
        if (activeConvId) {
          await addMessageToConversation({
            conversationId: activeConvId,
            role: "user",
            content: lastMessage,
          });
        }
      } catch (e) {
        console.warn("Background message persistence warning:", e);
      }
    })();

    const userLanguage = language || "en";
    const normalized = normalizeQuery(lastMessage);
    const queryHash = computeQueryHash(normalized, userLanguage);

    // 1. Tier 1: Deterministic FAQ Intent Matcher (<1ms)
    const faqResult = matchStaticFaq(lastMessage, userLanguage);
    if (faqResult.matched && faqResult.response) {
      const cachedText = faqResult.response;
      memoryCache.set(queryHash, cachedText, "faq");

      persistPromise
        .then(async () => {
          if (activeConvId) {
            await addMessageToConversation({
              conversationId: activeConvId,
              role: "assistant",
              content: cachedText,
            });
          }
        })
        .catch((e) => console.warn("Failed to persist assistant message:", e));

      return createCachedStreamResponse(cachedText, {
        activeConvId,
        cacheSource: "faq",
      });
    }

    // 2. Tier 2: In-Memory LRU Cache (<1ms)
    const memResult = memoryCache.get(queryHash);
    if (memResult) {
      persistPromise
        .then(async () => {
          if (activeConvId) {
            await addMessageToConversation({
              conversationId: activeConvId,
              role: "assistant",
              content: memResult.response,
            });
          }
        })
        .catch((e) => console.warn("Failed to persist assistant message:", e));

      return createCachedStreamResponse(memResult.response, {
        activeConvId,
        cacheSource: "memory",
      });
    }

    // 3. Tier 3: Persistent PostgreSQL Cache (<5ms)
    const dbResult = await getCachedQuery(queryHash);
    if (dbResult) {
      memoryCache.set(queryHash, dbResult.response, "database");

      persistPromise
        .then(async () => {
          if (activeConvId) {
            await addMessageToConversation({
              conversationId: activeConvId,
              role: "assistant",
              content: dbResult.response,
            });
          }
        })
        .catch((e) => console.warn("Failed to persist assistant message:", e));

      return createCachedStreamResponse(dbResult.response, {
        activeConvId,
        cacheSource: "database",
      });
    }

    // 4. Tier 4: Gemini 3.5 Flash Lite (15 RPM / 500 RPD) with 3.1 fallback
    const contents = [
      ...history,
      {
        role: "user",
        parts: [{ text: lastMessage }],
      },
    ];

    const modelConfig = {
      systemInstruction: CV_SYSTEM_INSTRUCTION,
      temperature: 0.7,
      maxOutputTokens: 1500,
      thinkingConfig: {
        thinkingBudget: 0,
      },
    };

    let streamResponse;
    try {
      streamResponse = await ai.models.generateContentStream({
        model: "gemini-3.5-flash-lite",
        contents,
        config: modelConfig,
      });
    } catch (err) {
      console.warn("Primary model gemini-3.5-flash-lite unavailable, falling back to gemini-3.1-flash-lite:", err);
      streamResponse = await ai.models.generateContentStream({
        model: "gemini-3.1-flash-lite",
        contents,
        config: modelConfig,
      });
    }

    let fullAssistantResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of streamResponse) {
            const chunkText = chunk.text;
            if (chunkText) {
              fullAssistantResponse += chunkText;
              controller.enqueue(encoder.encode(chunkText));
            }
          }

          if (fullAssistantResponse) {
            // Save to memory cache
            memoryCache.set(queryHash, fullAssistantResponse, "gemini");

            // Save to PostgreSQL cache in background
            upsertCachedQuery({
              queryHash,
              normalizedQuery: normalized,
              language: userLanguage,
              response: fullAssistantResponse,
              source: "gemini",
            }).catch((e) => console.warn("Failed to upsert DB cache:", e));

            persistPromise
              .then(async () => {
                if (activeConvId) {
                  await addMessageToConversation({
                    conversationId: activeConvId,
                    role: "assistant",
                    content: fullAssistantResponse,
                  });
                }
              })
              .catch((e) => console.warn("Failed to persist assistant message:", e));
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
        "X-Cache": "MISS",
        ...(activeConvId ? { "X-Conversation-Id": activeConvId } : {}),
      },
    });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while generating response" },
      { status: 500 }
    );
  }
}
