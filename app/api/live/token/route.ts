import { GoogleGenAI, Modality } from "@google/genai";
import { NextResponse } from "next/server";
import { CV_SYSTEM_INSTRUCTION } from "@/lib/ai-cv-context";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on server" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { apiVersion: "v1alpha" },
    });

    const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const newSessionExpireTime = new Date(Date.now() + 3 * 60 * 1000).toISOString();

    const tokenResponse = await ai.authTokens.create({
      config: {
        uses: 5,
        expireTime,
        newSessionExpireTime,
        liveConnectConstraints: {
          model: "gemini-3.6-flash",
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: "Aoede",
                },
              },
            },
            systemInstruction: {
              parts: [{ text: CV_SYSTEM_INSTRUCTION }],
            },
            temperature: 0.7,
          },
        },
      },
    });

    return NextResponse.json({
      token: tokenResponse.name,
      model: "gemini-3.6-flash",
      expireTime,
    });
  } catch (error: any) {
    console.error("Gemini Live Token Minting Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to mint Live API ephemeral token",
        fallback: true,
      },
      { status: 500 }
    );
  }
}
