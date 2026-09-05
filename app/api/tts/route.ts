// app/api/tts/route.ts
import { NextResponse } from "next/server";

/**
 * Encapsulates raw 16-bit linear PCM into a standard WAV container
 * for universal HTML5 browser playback.
 */
function pcmToWav(pcmData: Buffer, sampleRate = 24000, channels = 1): Buffer {
  const byteRate = sampleRate * channels * 2;
  const blockAlign = channels * 2;
  const header = Buffer.alloc(44);

  // "RIFF" chunk descriptor
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcmData.length, 4);
  header.write("WAVE", 8);

  // "fmt " sub-chunk
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  header.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  header.writeUInt16LE(channels, 22); // NumChannels
  header.writeUInt32LE(sampleRate, 24); // SampleRate
  header.writeUInt32LE(byteRate, 28); // ByteRate
  header.writeUInt16LE(blockAlign, 32); // BlockAlign
  header.writeUInt16LE(16, 34); // BitsPerSample

  // "data" sub-chunk
  header.write("data", 36);
  header.writeUInt32LE(pcmData.length, 40);

  return Buffer.concat([header, pcmData]);
}

function cleanTtsText(raw: string): string {
  return raw
    // Remove emojis and unicode symbols
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, "")
    // Remove markdown formatting
    .replace(/[*_~`#>•-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Gemini 3.1 Flash TTS Native Audio Generator
 */
async function generateGeminiTTS(text: string, voice = "Aoede"): Promise<Buffer | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
        "Api-Revision": "2026-05-20",
      },
      body: JSON.stringify({
        model: "gemini-3.1-flash-tts-preview",
        input: text,
        response_format: { type: "audio" },
        generation_config: {
          speech_config: [{ voice }],
        },
      }),
    });

    if (!res.ok) {
      console.warn(`Gemini 3.1 TTS responded with status ${res.status}`);
      return null;
    }

    const data = await res.json();
    const audioItem = data.steps?.[0]?.content?.find((c: any) => c.type === "audio");
    if (!audioItem || !audioItem.data) {
      return null;
    }

    const rawPcm = Buffer.from(audioItem.data, "base64");
    const sampleRate = audioItem.sample_rate || 24000;
    const channels = audioItem.channels || 1;

    return pcmToWav(rawPcm, sampleRate, channels);
  } catch (error) {
    console.warn("Gemini 3.1 Flash TTS error, using fallback:", error);
    return null;
  }
}

/**
 * Fallback: Chunked Google TTS (for quota overages or network failures)
 */
function chunkText(text: string, maxLen = 140): string[] {
  if (text.length <= maxLen) return [text];

  const delimiters = /([.!؟?\n،,;؛]+)/g;
  const rawParts = text.split(delimiters);
  const parts: string[] = [];

  for (let i = 0; i < rawParts.length; i += 2) {
    const textPart = rawParts[i] || "";
    const delimPart = rawParts[i + 1] || "";
    const combined = (textPart + delimPart).trim();
    if (combined) parts.push(combined);
  }

  const chunks: string[] = [];
  let current = "";

  for (const part of parts) {
    if ((current + " " + part).trim().length <= maxLen) {
      current = (current ? current + " " : "") + part;
    } else {
      if (current.trim()) chunks.push(current.trim());
      if (part.length > maxLen) {
        const words = part.split(" ");
        let sub = "";
        for (const w of words) {
          if ((sub + " " + w).trim().length <= maxLen) {
            sub = (sub ? sub + " " : "") + w;
          } else {
            if (sub.trim()) chunks.push(sub.trim());
            sub = w;
          }
        }
        current = sub;
      } else {
        current = part;
      }
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text];
}

async function generateFallbackTTS(text: string, lang = "ar"): Promise<Buffer> {
  const chunks = chunkText(text, 140);
  const buffers = await Promise.all(
    chunks.map(async (chunk) => {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        chunk
      )}&tl=${encodeURIComponent(lang)}&client=tw-ob`;

      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (!res.ok) {
        throw new Error(`Fallback TTS failed with status ${res.status}`);
      }

      return Buffer.from(await res.arrayBuffer());
    })
  );

  return Buffer.concat(buffers);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text");
  const lang = searchParams.get("lang") || "ar";

  if (!text) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  const sanitized = cleanTtsText(text);
  if (!sanitized) {
    return NextResponse.json({ error: "No readable speech text found" }, { status: 400 });
  }

  try {
    // 1. Primary Engine: Gemini 3.1 Flash TTS
    const geminiWav = await generateGeminiTTS(sanitized, "Aoede");
    if (geminiWav) {
      return new NextResponse(new Uint8Array(geminiWav), {
        headers: {
          "Content-Type": "audio/wav",
          "Content-Length": String(geminiWav.length),
          "X-TTS-Engine": "gemini-3.1-flash-tts-preview",
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      });
    }

    // 2. Secondary Engine: Chunked Fallback
    const fallbackMp3 = await generateFallbackTTS(sanitized, lang);
    return new NextResponse(new Uint8Array(fallbackMp3), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(fallbackMp3.length),
        "X-TTS-Engine": "fallback-chunked",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error: any) {
    console.error("TTS generation error:", error);
    return NextResponse.json(
      { error: "TTS failed", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
