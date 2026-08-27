import { eq, desc } from "drizzle-orm";
import { db } from "../index.ts";
import {
  contactSubmissions,
  type ContactSubmission,
  type NewContactSubmission,
} from "../schema.ts";

export async function createContactSubmission(
  data: NewContactSubmission
): Promise<ContactSubmission> {
  const [result] = await db
    .insert(contactSubmissions)
    .values({
      ...data,
      updatedAt: new Date(),
    })
    .returning();
  return result;
}

export async function getContactSubmissions(options?: {
  status?: "unread" | "read" | "in_progress" | "replied" | "archived";
  limit?: number;
  offset?: number;
}): Promise<ContactSubmission[]> {
  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;

  if (options?.status) {
    return await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.status, options.status))
      .orderBy(desc(contactSubmissions.createdAt))
      .limit(limit)
      .offset(offset);
  }

  return await db
    .select()
    .from(contactSubmissions)
    .orderBy(desc(contactSubmissions.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getContactSubmissionById(
  id: number
): Promise<ContactSubmission | undefined> {
  const [result] = await db
    .select()
    .from(contactSubmissions)
    .where(eq(contactSubmissions.id, id))
    .limit(1);
  return result;
}

export async function updateContactSubmissionStatus(
  id: number,
  status: "unread" | "read" | "in_progress" | "replied" | "archived"
): Promise<ContactSubmission | undefined> {
  const [result] = await db
    .update(contactSubmissions)
    .set({ status, updatedAt: new Date() })
    .where(eq(contactSubmissions.id, id))
    .returning();
  return result;
}

export async function deleteContactSubmission(
  id: number
): Promise<boolean> {
  const result = await db
    .delete(contactSubmissions)
    .where(eq(contactSubmissions.id, id))
    .returning({ id: contactSubmissions.id });
  return result.length > 0;
}
