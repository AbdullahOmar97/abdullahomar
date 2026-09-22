import { S3Client } from "@aws-sdk/client-s3";

export const DEFAULT_BUCKET = process.env.NEON_STORAGE_BUCKET || "assets";

/**
 * Checks whether the required environment variables for Neon S3 storage are present.
 */
export function isStorageConfigured(): boolean {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_ENDPOINT_URL_S3
  );
}

// Global cache for S3 client across serverless/dev hot-reloads
const globalForS3 = globalThis as unknown as {
  s3Client: S3Client | undefined;
};

/**
 * Returns a singleton instance of the S3Client configured for Neon S3-compatible storage.
 */
export function getS3Client(): S3Client {
  if (globalForS3.s3Client) {
    return globalForS3.s3Client;
  }

  const endpoint = process.env.AWS_ENDPOINT_URL_S3;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || "us-east-1";

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Neon S3 storage is not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_ENDPOINT_URL_S3."
    );
  }

  const client = new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });

  if (process.env.NODE_ENV !== "production") {
    globalForS3.s3Client = client;
  }

  return client;
}
