import { eq, sql } from "drizzle-orm";
import { db } from "../index.ts";
import { chatQueryCache, type ChatQueryCache } from "../schema.ts";

/**
 * Retrieves a cached AI response by its deterministic SHA-256 query hash.
 * Increments hitCount asynchronously if a hit occurs.
 */
export async function getCachedQuery(
  queryHash: string
): Promise<ChatQueryCache | null> {
  try {
    const [result] = await db
      .select()
      .from(chatQueryCache)
      .where(eq(chatQueryCache.queryHash, queryHash))
      .limit(1);

    if (result) {
      // Increment hit count asynchronously without blocking
      db.update(chatQueryCache)
        .set({
          hitCount: sql`${chatQueryCache.hitCount} + 1`,
          lastHitAt: new Date(),
        })
        .where(eq(chatQueryCache.id, result.id))
        .catch((err) => console.warn("Failed to increment cache hit count:", err));

      return result;
    }

    return null;
  } catch (error) {
    console.warn("Database cache lookup warning:", error);
    return null;
  }
}

/**
 * Persists an AI response into the database cache for deduplication.
 */
export async function upsertCachedQuery(data: {
  queryHash: string;
  normalizedQuery: string;
  language: string;
  response: string;
  source?: string;
}): Promise<void> {
  try {
    await db
      .insert(chatQueryCache)
      .values({
        queryHash: data.queryHash,
        normalizedQuery: data.normalizedQuery,
        language: data.language || "en",
        response: data.response,
        source: data.source || "gemini",
        hitCount: 1,
        lastHitAt: new Date(),
      })
      .onConflictDoUpdate({
        target: chatQueryCache.queryHash,
        set: {
          response: data.response,
          lastHitAt: new Date(),
          hitCount: sql`${chatQueryCache.hitCount} + 1`,
        },
      });
  } catch (error) {
    console.warn("Failed to persist query to database cache:", error);
  }
}
