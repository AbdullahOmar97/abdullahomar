import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { CV_SYSTEM_INSTRUCTION } from "@/lib/ai-cv-context";
import { addMessageToConversation, createConversation } from "@/lib/db";

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

    const contents = [
      ...history,
      {
        role: "user",
        parts: [{ text: lastMessage }],
      },
    ];

    const streamResponse = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: CV_SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 1500,
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

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
