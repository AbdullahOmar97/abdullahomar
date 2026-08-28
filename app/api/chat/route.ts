import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { CV_SYSTEM_INSTRUCTION } from "@/lib/ai-cv-context";
import { addMessageToConversation, createConversation } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
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

    // Optional background persistence
    let activeConvId = conversationId;
    if (!activeConvId && body.persist) {
      try {
        const conv = await createConversation({
          title: lastMessage.slice(0, 50),
          language: language || "en",
        });
        activeConvId = conv.id;
      } catch (e) {
        console.warn("Could not create conversation record:", e);
      }
    }

    if (activeConvId) {
      addMessageToConversation({
        conversationId: activeConvId,
        role: "user",
        content: lastMessage,
      }).catch((e) => console.warn("Failed to persist user message:", e));
    }

    const chat = ai.chats.create({
      model: "gemini-3.6-flash",
      history: history,
      config: {
        systemInstruction: CV_SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    });

    const streamResponse = await chat.sendMessageStream({
      message: lastMessage,
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

          if (activeConvId && fullAssistantResponse) {
            addMessageToConversation({
              conversationId: activeConvId,
              role: "assistant",
              content: fullAssistantResponse,
            }).catch((e) => console.warn("Failed to persist assistant message:", e));
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
        "Cache-Control": "no-cache",
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
