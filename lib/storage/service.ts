import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client, DEFAULT_BUCKET } from "./client.ts";

/**
 * Permitted MIME types for storage uploads.
 */
export const ALLOWED_MIME_TYPES = new Set([
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  // Documents
  "application/pdf",
  "text/plain",
  "application/json",
  // Audio
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
]);

/**
 * Validates and sanitizes an object key to prevent path traversal and malformed paths.
 */
export function sanitizeObjectKey(key: string): string {
  if (!key || typeof key !== "string") {
    throw new Error("Invalid object key: Key must be a non-empty string.");
  }

  // Remove leading and trailing whitespace/slashes
  const trimmed = key.trim().replace(/^\/+|\/+$/g, "");

  // Check for path traversal sequences
  if (trimmed.includes("..") || trimmed.includes("./") || trimmed.includes("//")) {
    throw new Error("Invalid object key: Path traversal sequences are forbidden.");
  }

  // Allow only standard alphanumeric characters, dashes, underscores, dots, and single forward slashes
  const keyRegex = /^[a-zA-Z0-9_\-\.\/]+$/;
  if (!keyRegex.test(trimmed)) {
    throw new Error("Invalid object key: Contains unsupported characters.");
  }

  return trimmed;
}

/**
 * Validates whether a given MIME type is allowed.
 */
export function validateContentType(contentType: string): void {
  if (!contentType || !ALLOWED_MIME_TYPES.has(contentType.toLowerCase().trim())) {
    throw new Error(`Unsupported content type: ${contentType}`);
  }
}

export interface UploadOptions {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType: string;
  bucket?: string;
  metadata?: Record<string, string>;
}

/**
 * Server-side direct upload to Neon S3 storage.
 */
export async function uploadObject({
  key,
  body,
  contentType,
  bucket = DEFAULT_BUCKET,
  metadata,
}: UploadOptions) {
  const safeKey = sanitizeObjectKey(key);
  validateContentType(contentType);

  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: safeKey,
    Body: body,
    ContentType: contentType,
    Metadata: metadata,
  });

  return await client.send(command);
}

export interface PresignedUrlOptions {
  key: string;
  bucket?: string;
  expiresIn?: number; // seconds
}

/**
 * Generates a presigned GET URL for securely downloading/viewing an object.
 */
export async function getDownloadUrl({
  key,
  bucket = DEFAULT_BUCKET,
  expiresIn = 3600, // 1 hour default
}: PresignedUrlOptions): Promise<string> {
  const safeKey = sanitizeObjectKey(key);
  const client = getS3Client();

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: safeKey,
  });

  return await getSignedUrl(client, command, { expiresIn });
}

export interface PresignedUploadOptions extends PresignedUrlOptions {
  contentType: string;
}

/**
 * Generates a presigned PUT URL allowing clients to upload directly to Neon S3 storage.
 */
export async function getUploadUrl({
  key,
  contentType,
  bucket = DEFAULT_BUCKET,
  expiresIn = 900, // 15 minutes default
}: PresignedUploadOptions): Promise<string> {
  const safeKey = sanitizeObjectKey(key);
  validateContentType(contentType);

  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: safeKey,
    ContentType: contentType,
  });

  return await getSignedUrl(client, command, { expiresIn });
}

/**
 * Deletes an object from Neon S3 storage.
 */
export async function deleteObject(
  key: string,
  bucket: string = DEFAULT_BUCKET
) {
  const safeKey = sanitizeObjectKey(key);
  const client = getS3Client();

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: safeKey,
  });

  return await client.send(command);
}

/**
 * Checks if an object exists in the bucket.
 */
export async function objectExists(
  key: string,
  bucket: string = DEFAULT_BUCKET
): Promise<boolean> {
  const safeKey = sanitizeObjectKey(key);
  const client = getS3Client();

  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: safeKey,
      })
    );
    return true;
  } catch (error: any) {
    if (error?.$metadata?.httpStatusCode === 404 || error?.name === "NotFound") {
      return false;
    }
    throw error;
  }
}
