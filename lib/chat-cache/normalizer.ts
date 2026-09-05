import { createHash } from "node:crypto";

/**
 * Normalizes text for cache matching across Arabic and English.
 * Strips diacritics, punctuation, superfluous whitespace, and unifies character variants.
 */
export function normalizeQuery(text: string): string {
  if (!text) return "";

  let cleaned = text.trim().toLowerCase();

  // Arabic normalization:
  // 1. Remove Tashkeel (diacritics: Fatha, Damma, Kasra, Sukun, Tanween, etc.)
  cleaned = cleaned.replace(/[\u064B-\u065F\u0670]/g, "");
  // 2. Remove Tatweel (kashida)
  cleaned = cleaned.replace(/\u0640/g, "");
  // 3. Normalize Alef variants (أ, إ, آ, ٱ -> ا)
  cleaned = cleaned.replace(/[إأآٱ]/g, "ا");
  // 4. Normalize Taa Marbuta (ة -> ه)
  cleaned = cleaned.replace(/ة/g, "ه");
  // 5. Normalize Yaa / Alef Maqsura (ى -> ي)
  cleaned = cleaned.replace(/ى/g, "ي");

  // Remove common punctuation (both Latin and Arabic)
  cleaned = cleaned.replace(/[.,/#!$%^&*;:{}=\-_`~()?'"؟،؛!<>\\|[\]]/g, " ");

  // Collapse multiple whitespaces into a single space
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

/**
 * Computes deterministic SHA-256 hash for query + language.
 */
export function computeQueryHash(normalizedQuery: string, language = "en"): string {
  const payload = `${normalizedQuery.toLowerCase()}::${(language || "en").toLowerCase()}`;
  return createHash("sha256").update(payload).digest("hex");
}
