import { NextResponse } from "next/server";
import { z } from "zod";
import { logAnalyticsEvent } from "@/lib/db";

const analyticsSchema = z.object({
  eventType: z.enum([
    "pageview",
    "service_view",
    "project_view",
    "chat_start",
    "cv_download",
    "contact_form_submit",
    "language_switch",
  ]),
  path: z.string().min(1).max(255),
  referrer: z.string().max(1000).optional(),
  language: z.string().max(10).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = analyticsSchema.parse(body);

    const event = await logAnalyticsEvent({
      eventType: validatedData.eventType,
      path: validatedData.path,
      referrer: validatedData.referrer || null,
      language: validatedData.language || null,
      metadata: validatedData.metadata || null,
    });

    return NextResponse.json({ success: true, id: event.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    console.error("Analytics logging error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
