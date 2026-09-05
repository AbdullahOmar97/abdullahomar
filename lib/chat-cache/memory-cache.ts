interface CacheEntry {
  response: string;
  source: string;
  expiresAt: number;
}

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const MAX_ENTRIES = 500;

class MemoryLruCache {
  private cache = new Map<string, CacheEntry>();

  get(key: string): { response: string; source: string } | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Refresh LRU order (re-insert)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return { response: entry.response, source: entry.source };
  }

  set(key: string, response: string, source = "memory", ttlMs = DEFAULT_TTL_MS): void {
    if (this.cache.size >= MAX_ENTRIES) {
      // Evict oldest item (first key)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      response,
      source,
      expiresAt: Date.now() + ttlMs,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

// Preserve memory cache during Next.js hot-reloads
const globalForMemoryCache = globalThis as unknown as {
  chatMemoryCache?: MemoryLruCache;
};

export const memoryCache =
  globalForMemoryCache.chatMemoryCache ?? new MemoryLruCache();

if (process.env.NODE_ENV !== "production") {
  globalForMemoryCache.chatMemoryCache = memoryCache;
}
