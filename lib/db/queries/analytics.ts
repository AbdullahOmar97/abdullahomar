import { eq, desc, gte, sql } from "drizzle-orm";
import { db } from "../index.ts";
import {
  analyticsEvents,
  type AnalyticsEvent,
  type NewAnalyticsEvent,
} from "../schema.ts";

export async function logAnalyticsEvent(
  data: NewAnalyticsEvent
): Promise<AnalyticsEvent> {
  const [result] = await db.insert(analyticsEvents).values(data).returning();
  return result;
}

export async function getRecentEvents(limit = 100): Promise<AnalyticsEvent[]> {
  return await db
    .select()
    .from(analyticsEvents)
    .orderBy(desc(analyticsEvents.createdAt))
    .limit(limit);
}

export async function getEventsSummary(from?: Date) {
  const query = db
    .select({
      eventType: analyticsEvents.eventType,
      count: sql<number>`count(*)::int`,
    })
    .from(analyticsEvents);

  if (from) {
    return await query
      .where(gte(analyticsEvents.createdAt, from))
      .groupBy(analyticsEvents.eventType);
  }

  return await query.groupBy(analyticsEvents.eventType);
}
