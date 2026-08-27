import { NextResponse } from "next/server";
import { z } from "zod";
import { createContactSubmission } from "@/lib/db";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().max(50).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(1, "Message is required").max(5000, "Message is too long"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    const userAgent = req.headers.get("user-agent") || undefined;

    const inserted = await createContactSubmission({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone || null,
      subject: validatedData.subject || null,
      message: validatedData.message,
      userAgent: userAgent ? userAgent.substring(0, 500) : null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contact inquiry received successfully",
        id: inserted.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    console.error("Error processing contact submission:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
