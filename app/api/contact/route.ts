import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { createContactSubmission } from "@/lib/db";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().max(50).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(1, "Message is required").max(5000, "Message is too long"),
});

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

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

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const toEmail = (process.env.CONTACT_NOTIFICATION_EMAIL || "abdullahomar@outlook.com").trim().toLowerCase();
        const fromEmail = process.env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

        const { error: resendError } = await resend.emails.send({
          from: fromEmail,
          to: [toEmail],
          replyTo: validatedData.email,
          subject: `[Portfolio Inquiry] ${validatedData.name} - ${validatedData.subject || "New Message"}`,
          text: `Name: ${validatedData.name}\nEmail: ${validatedData.email}\nPhone: ${validatedData.phone || "Not provided"}\nSubject: ${validatedData.subject || "Portfolio Inquiry"}\n\nMessage:\n${validatedData.message}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6; color: #1e293b;">
              <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 0;">New Contact Form Message</h2>
              <p><strong>Name:</strong> ${escapeHtml(validatedData.name)}</p>
              <p><strong>Email:</strong> <a href="mailto:${escapeHtml(validatedData.email)}">${escapeHtml(validatedData.email)}</a></p>
              <p><strong>Phone:</strong> ${escapeHtml(validatedData.phone || "Not provided")}</p>
              <p><strong>Subject:</strong> ${escapeHtml(validatedData.subject || "Portfolio Inquiry")}</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p><strong>Message:</strong></p>
              <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; white-space: pre-wrap; border: 1px solid #e2e8f0; font-size: 15px;">${escapeHtml(validatedData.message)}</div>
            </div>
          `,
        });

        if (resendError) {
          console.error("Resend API error sending email notification:", resendError);
        }
      } catch (emailErr) {
        console.error("Exception sending email notification via Resend:", emailErr);
      }
    } else {
      console.warn("RESEND_API_KEY is not configured; email notification was not sent.");
    }

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
