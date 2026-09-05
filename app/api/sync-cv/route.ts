import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { z } from "zod";
import { executeCvSync } from "@/lib/cv-sync/sync-service";

const RequestBodySchema = z
  .object({
    docId: z
      .string()
      .regex(/^[a-zA-Z0-9_-]{20,100}$/, "Invalid Google Doc ID format")
      .optional(),
    rawText: z.string().max(200000, "Text payload too large").optional(),
  })
  .optional();

function verifyAuthHeader(req: Request): boolean {
  const configuredSecret = process.env.CV_SYNC_SECRET;
  if (!configuredSecret) {
    console.error("CV_SYNC_SECRET is not configured on server");
    return false;
  }

  const authHeader = req.headers.get("authorization");
  const customHeader = req.headers.get("x-sync-secret");

  let providedToken = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    providedToken = authHeader.substring(7).trim();
  } else if (customHeader) {
    providedToken = customHeader.trim();
  }

  if (!providedToken) {
    return false;
  }

  try {
    const providedBuffer = Buffer.from(providedToken, "utf8");
    const configuredBuffer = Buffer.from(configuredSecret, "utf8");

    if (providedBuffer.length !== configuredBuffer.length) {
      return false;
    }

    return timingSafeEqual(providedBuffer, configuredBuffer);
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  // 1. Verify Authentication
  if (!verifyAuthHeader(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Invalid or missing sync secret." },
      { status: 401 }
    );
  }

  // 2. Validate Request Body
  let parsedBody: z.infer<typeof RequestBodySchema> = {};
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const rawBody = await req.json();
      const validation = RequestBodySchema.safeParse(rawBody);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid request payload",
            errors: validation.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }
      parsedBody = validation.data;
    }
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Malformed JSON payload" },
      { status: 400 }
    );
  }

  // 3. Execute Synchronization
  try {
    const startTime = Date.now();
    const result = await executeCvSync({
      docId: parsedBody?.docId,
      rawText: parsedBody?.rawText,
    });
    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: "CV synchronized successfully with website database",
      data: {
        ...result,
        durationMs,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Sync failed";
    console.error("CV Sync error:", error);
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Optional GET handler to check sync endpoint status
export async function GET(req: Request) {
  if (!verifyAuthHeader(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    status: "healthy",
    configuredDocId: process.env.GOOGLE_DOC_ID || "12xqyy8FcXRNRNAFbrTG0OrNwciBWKp4C1o6pOP3JzPo",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
}
