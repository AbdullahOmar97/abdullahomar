import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  uuid,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const contactStatusEnum = pgEnum("contact_status", [
  "unread",
  "read",
  "in_progress",
  "replied",
  "archived",
]);

export const chatRoleEnum = pgEnum("chat_role", ["user", "assistant", "system"]);

export const chatModeEnum = pgEnum("chat_mode", ["text", "voice_live"]);

export const conversationStatusEnum = pgEnum("conversation_status", [
  "active",
  "archived",
  "closed",
]);

export const messageFeedbackEnum = pgEnum("message_feedback", [
  "none",
  "thumbs_up",
  "thumbs_down",
]);

export const projectCategoryEnum = pgEnum("project_category", [
  "ai_agent",
  "fullstack",
  "computer_vision",
  "automation",
  "data_science",
  "other",
]);

export const skillCategoryEnum = pgEnum("skill_category", [
  "languages",
  "ai_ml",
  "web_backend",
  "databases",
  "devops_cloud",
]);

export const analyticsEventTypeEnum = pgEnum("analytics_event_type", [
  "pageview",
  "service_view",
  "project_view",
  "chat_start",
  "cv_download",
  "contact_form_submit",
  "language_switch",
]);

// 1. Contact Submissions
export const contactSubmissions = pgTable(
  "contact_submissions",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    subject: varchar("subject", { length: 200 }),
    message: text("message").notNull(),
    status: contactStatusEnum("status").default("unread").notNull(),
    phone: varchar("phone", { length: 50 }),
    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_contact_status").on(table.status),
    index("idx_contact_created_at").on(table.createdAt),
    index("idx_contact_email").on(table.email),
  ]
);

// 2. Chat Conversations
export const chatConversations = pgTable(
  "chat_conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title"),
    sessionId: varchar("session_id", { length: 100 }),
    language: varchar("language", { length: 10 }).default("en").notNull(),
    mode: chatModeEnum("mode").default("text").notNull(),
    status: conversationStatusEnum("status").default("active").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_chat_conv_session").on(table.sessionId),
    index("idx_chat_conv_created_at").on(table.createdAt),
    index("idx_chat_conv_status").on(table.status),
  ]
);

// 3. Chat Messages
export const chatMessages = pgTable(
  "chat_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id")
      .references(() => chatConversations.id, { onDelete: "cascade" })
      .notNull(),
    role: chatRoleEnum("role").notNull(),
    content: text("content").notNull(),
    latencyMs: integer("latency_ms"),
    tokensUsed: integer("tokens_used"),
    feedback: messageFeedbackEnum("feedback").default("none").notNull(),
    audioUrl: text("audio_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_chat_msg_conv").on(table.conversationId),
    index("idx_chat_msg_created_at").on(table.createdAt),
  ]
);

// Relations for Chat
export const chatConversationsRelations = relations(
  chatConversations,
  ({ many }) => ({
    messages: many(chatMessages),
  })
);

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  conversation: one(chatConversations, {
    fields: [chatMessages.conversationId],
    references: [chatConversations.id],
  }),
}));

// 3.1 Chat Query Cache (Deduplication & Local AI Cache)
export const chatQueryCache = pgTable(
  "chat_query_cache",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    queryHash: varchar("query_hash", { length: 64 }).unique().notNull(),
    normalizedQuery: text("normalized_query").notNull(),
    language: varchar("language", { length: 10 }).default("en").notNull(),
    response: text("response").notNull(),
    hitCount: integer("hit_count").default(1).notNull(),
    source: varchar("source", { length: 50 }).default("gemini").notNull(),
    lastHitAt: timestamp("last_hit_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_chat_cache_hash").on(table.queryHash),
    index("idx_chat_cache_lang").on(table.language),
  ]
);

// 4. Portfolio Projects
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 100 }).unique().notNull(),
    titleEn: varchar("title_en", { length: 200 }).notNull(),
    titleAr: varchar("title_ar", { length: 200 }).notNull(),
    summaryEn: text("summary_en").notNull(),
    summaryAr: text("summary_ar").notNull(),
    descriptionEn: text("description_en"),
    descriptionAr: text("description_ar"),
    category: projectCategoryEnum("category").notNull(),
    technologies: jsonb("technologies").$type<string[]>().default([]).notNull(),
    featured: boolean("featured").default(false).notNull(),
    orderIndex: integer("order_index").default(0).notNull(),
    demoUrl: text("demo_url"),
    githubUrl: text("github_url"),
    imageUrl: text("image_url"),
    published: boolean("published").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_projects_slug").on(table.slug),
    index("idx_projects_category").on(table.category),
    index("idx_projects_featured").on(table.featured),
  ]
);

// 5. Technical Skills
export const skills = pgTable(
  "skills",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    category: skillCategoryEnum("category").notNull(),
    proficiency: integer("proficiency").default(90).notNull(),
    icon: varchar("icon", { length: 50 }),
    featured: boolean("featured").default(true).notNull(),
    orderIndex: integer("order_index").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_skills_category").on(table.category)]
);

// 6. Work Experience
export const experiences = pgTable("experiences", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyEn: varchar("company_en", { length: 200 }).notNull(),
  companyAr: varchar("company_ar", { length: 200 }).notNull(),
  roleEn: varchar("role_en", { length: 200 }).notNull(),
  roleAr: varchar("role_ar", { length: 200 }).notNull(),
  locationEn: varchar("location_en", { length: 100 }),
  locationAr: varchar("location_ar", { length: 100 }),
  periodEn: varchar("period_en", { length: 100 }).notNull(),
  periodAr: varchar("period_ar", { length: 100 }).notNull(),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  isCurrent: boolean("is_current").default(false).notNull(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  highlightsEn: jsonb("highlights_en").$type<string[]>().default([]).notNull(),
  highlightsAr: jsonb("highlights_ar").$type<string[]>().default([]).notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 7. Education & Credentials
export const education = pgTable("education", {
  id: uuid("id").defaultRandom().primaryKey(),
  institutionEn: varchar("institution_en", { length: 200 }).notNull(),
  institutionAr: varchar("institution_ar", { length: 200 }).notNull(),
  degreeEn: varchar("degree_en", { length: 200 }).notNull(),
  degreeAr: varchar("degree_ar", { length: 200 }).notNull(),
  fieldEn: varchar("field_en", { length: 200 }),
  fieldAr: varchar("field_ar", { length: 200 }),
  yearEn: varchar("year_en", { length: 50 }).notNull(),
  yearAr: varchar("year_ar", { length: 50 }).notNull(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 8. Services
export const services = pgTable("services", {
  id: varchar("id", { length: 100 }).primaryKey(),
  titleKey: varchar("title_key", { length: 100 }).notNull(),
  titleEn: varchar("title_en", { length: 200 }).notNull(),
  titleAr: varchar("title_ar", { length: 200 }).notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionAr: text("description_ar").notNull(),
  detailsEn: text("details_en"),
  detailsAr: text("details_ar"),
  featuresEn: jsonb("features_en").$type<string[]>().default([]).notNull(),
  featuresAr: jsonb("features_ar").$type<string[]>().default([]).notNull(),
  price: varchar("price", { length: 50 }),
  imageSrc: text("image_src"),
  active: boolean("active").default(true).notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 9. Analytics & Telemetry
export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    eventType: analyticsEventTypeEnum("event_type").notNull(),
    path: varchar("path", { length: 255 }).notNull(),
    referrer: text("referrer"),
    language: varchar("language", { length: 10 }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_analytics_type").on(table.eventType),
    index("idx_analytics_created_at").on(table.createdAt),
    index("idx_analytics_path").on(table.path),
  ]
);

// Inferred TypeScript Types
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;

export type ChatConversation = typeof chatConversations.$inferSelect;
export type NewChatConversation = typeof chatConversations.$inferInsert;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;

export type ChatQueryCache = typeof chatQueryCache.$inferSelect;
export type NewChatQueryCache = typeof chatQueryCache.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;

export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;

export type Education = typeof education.$inferSelect;
export type NewEducation = typeof education.$inferInsert;

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert;
