import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import {
  isStorageConfigured,
  getUploadUrl,
  getDownloadUrl,
  ALLOWED_MIME_TYPES,
  sanitizeObjectKey,
} from "@/lib/storage";

const uploadRequestSchema = z.object({
  action: z.literal("upload"),
  filename: z
    .string()
    .min(1, "Filename is required")
    .max(120, "Filename too long")
    .regex(/^[a-zA-Z0-9_\-\.]+$/, "Filename contains invalid characters"),
  contentType: z
    .string()
    .refine((type) => ALLOWED_MIME_TYPES.has(type.toLowerCase().trim()), {
      message: "Unsupported MIME type",
    }),
  folder: z
    .enum(["uploads", "cv", "projects", "services", "assets"])
    .default("uploads"),
});

const downloadRequestSchema = z.object({
  action: z.literal("download"),
  key: z.string().min(1, "Key is required").max(500, "Key too long"),
});

const storageRequestSchema = z.discriminatedUnion("action", [
  uploadRequestSchema,
  downloadRequestSchema,
]);

export async function POST(req: Request) {
  if (!isStorageConfigured()) {
    return NextResponse.json(
      {
        error: "Storage service is unconfigured. Please configure Neon S3 credentials.",
      },
      { status: 503 }
    );
  }

  try {
    const rawBody = await req.json();
    const parsed = storageRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (data.action === "upload") {
      const extension = data.filename.includes(".")
        ? data.filename.substring(data.filename.lastIndexOf("."))
        : "";
      const randomPrefix = crypto.randomBytes(8).toString("hex");
      const cleanBasename = data.filename
        .replace(extension, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .substring(0, 40);

      const generatedKey = `${data.folder}/${Date.now()}-${randomPrefix}-${cleanBasename}${extension}`;
      const uploadUrl = await getUploadUrl({
        key: generatedKey,
        contentType: data.contentType,
        expiresIn: 900, // 15 minutes
      });

      return NextResponse.json({
        success: true,
        key: generatedKey,
        uploadUrl,
        expiresInSeconds: 900,
      });
    }

    if (data.action === "download") {
      const safeKey = sanitizeObjectKey(data.key);
      const downloadUrl = await getDownloadUrl({
        key: safeKey,
        expiresIn: 3600, // 1 hour
      });

      return NextResponse.json({
        success: true,
        key: safeKey,
        downloadUrl,
        expiresInSeconds: 3600,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal storage error";
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
