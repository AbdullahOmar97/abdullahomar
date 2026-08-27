import { eq, desc, asc } from "drizzle-orm";
import { db } from "../index.ts";
import {
  chatConversations,
  chatMessages,
  type ChatConversation,
  type NewChatConversation,
  type ChatMessage,
  type NewChatMessage,
} from "../schema.ts";

export async function createConversation(
  data?: Partial<NewChatConversation>
): Promise<ChatConversation> {
  const [result] = await db
    .insert(chatConversations)
    .values({
      title: data?.title || "New Chat",
      sessionId: data?.sessionId,
      language: data?.language || "en",
      mode: data?.mode || "text",
      status: data?.status || "active",
      metadata: data?.metadata,
      updatedAt: new Date(),
    })
    .returning();
  return result;
}

export async function getConversationById(
  id: string
): Promise<ChatConversation | undefined> {
  const [result] = await db
    .select()
    .from(chatConversations)
    .where(eq(chatConversations.id, id))
    .limit(1);
  return result;
}

export async function getConversationWithMessages(
  id: string
): Promise<{ conversation: ChatConversation; messages: ChatMessage[] } | null> {
  const conversation = await getConversationById(id);
  if (!conversation) return null;

  const messages = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.conversationId, id))
    .orderBy(asc(chatMessages.createdAt));

  return { conversation, messages };
}

export async function addMessageToConversation(
  data: NewChatMessage
): Promise<ChatMessage> {
  const [message] = await db.insert(chatMessages).values(data).returning();

  await db
    .update(chatConversations)
    .set({ updatedAt: new Date() })
    .where(eq(chatConversations.id, data.conversationId));

  return message;
}

export async function addMessagesBatch(
  messages: NewChatMessage[]
): Promise<ChatMessage[]> {
  if (messages.length === 0) return [];
  const inserted = await db.insert(chatMessages).values(messages).returning();

  if (messages[0]?.conversationId) {
    await db
      .update(chatConversations)
      .set({ updatedAt: new Date() })
      .where(eq(chatConversations.id, messages[0].conversationId));
  }

  return inserted;
}

export async function updateMessageFeedback(
  messageId: string,
  feedback: "none" | "thumbs_up" | "thumbs_down"
): Promise<ChatMessage | undefined> {
  const [updated] = await db
    .update(chatMessages)
    .set({ feedback })
    .where(eq(chatMessages.id, messageId))
    .returning();
  return updated;
}

export async function deleteConversation(id: string): Promise<boolean> {
  const result = await db
    .delete(chatConversations)
    .where(eq(chatConversations.id, id))
    .returning({ id: chatConversations.id });
  return result.length > 0;
}

export async function getRecentConversations(
  limit = 20
): Promise<ChatConversation[]> {
  return await db
    .select()
    .from(chatConversations)
    .orderBy(desc(chatConversations.updatedAt))
    .limit(limit);
}
