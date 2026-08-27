CREATE TYPE "public"."analytics_event_type" AS ENUM('pageview', 'service_view', 'project_view', 'chat_start', 'cv_download', 'contact_form_submit', 'language_switch');--> statement-breakpoint
CREATE TYPE "public"."chat_mode" AS ENUM('text', 'voice_live');--> statement-breakpoint
CREATE TYPE "public"."chat_role" AS ENUM('user', 'assistant', 'system');--> statement-breakpoint
CREATE TYPE "public"."contact_status" AS ENUM('unread', 'read', 'in_progress', 'replied', 'archived');--> statement-breakpoint
CREATE TYPE "public"."conversation_status" AS ENUM('active', 'archived', 'closed');--> statement-breakpoint
CREATE TYPE "public"."message_feedback" AS ENUM('none', 'thumbs_up', 'thumbs_down');--> statement-breakpoint
CREATE TYPE "public"."project_category" AS ENUM('ai_agent', 'fullstack', 'computer_vision', 'automation', 'data_science', 'other');--> statement-breakpoint
CREATE TYPE "public"."skill_category" AS ENUM('languages', 'ai_ml', 'web_backend', 'databases', 'devops_cloud');--> statement-breakpoint
CREATE TABLE "analytics_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" "analytics_event_type" NOT NULL,
	"path" varchar(255) NOT NULL,
	"referrer" text,
	"language" varchar(10),
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text,
	"session_id" varchar(100),
	"language" varchar(10) DEFAULT 'en' NOT NULL,
	"mode" "chat_mode" DEFAULT 'text' NOT NULL,
	"status" "conversation_status" DEFAULT 'active' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" "chat_role" NOT NULL,
	"content" text NOT NULL,
	"latency_ms" integer,
	"tokens_used" integer,
	"feedback" "message_feedback" DEFAULT 'none' NOT NULL,
	"audio_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subject" varchar(200),
	"message" text NOT NULL,
	"status" "contact_status" DEFAULT 'unread' NOT NULL,
	"phone" varchar(50),
	"ip_hash" varchar(64),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_en" varchar(200) NOT NULL,
	"institution_ar" varchar(200) NOT NULL,
	"degree_en" varchar(200) NOT NULL,
	"degree_ar" varchar(200) NOT NULL,
	"field_en" varchar(200),
	"field_ar" varchar(200),
	"year_en" varchar(50) NOT NULL,
	"year_ar" varchar(50) NOT NULL,
	"description_en" text,
	"description_ar" text,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_en" varchar(200) NOT NULL,
	"company_ar" varchar(200) NOT NULL,
	"role_en" varchar(200) NOT NULL,
	"role_ar" varchar(200) NOT NULL,
	"location_en" varchar(100),
	"location_ar" varchar(100),
	"period_en" varchar(100) NOT NULL,
	"period_ar" varchar(100) NOT NULL,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"is_current" boolean DEFAULT false NOT NULL,
	"description_en" text,
	"description_ar" text,
	"highlights_en" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"highlights_ar" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title_en" varchar(200) NOT NULL,
	"title_ar" varchar(200) NOT NULL,
	"summary_en" text NOT NULL,
	"summary_ar" text NOT NULL,
	"description_en" text,
	"description_ar" text,
	"category" "project_category" NOT NULL,
	"technologies" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"demo_url" text,
	"github_url" text,
	"image_url" text,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"title_key" varchar(100) NOT NULL,
	"title_en" varchar(200) NOT NULL,
	"title_ar" varchar(200) NOT NULL,
	"description_en" text NOT NULL,
	"description_ar" text NOT NULL,
	"details_en" text,
	"details_ar" text,
	"features_en" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"features_ar" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"price" varchar(50),
	"image_src" text,
	"active" boolean DEFAULT true NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"category" "skill_category" NOT NULL,
	"proficiency" integer DEFAULT 90 NOT NULL,
	"icon" varchar(50),
	"featured" boolean DEFAULT true NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_conversation_id_chat_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."chat_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_analytics_type" ON "analytics_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "idx_analytics_created_at" ON "analytics_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_analytics_path" ON "analytics_events" USING btree ("path");--> statement-breakpoint
CREATE INDEX "idx_chat_conv_session" ON "chat_conversations" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "idx_chat_conv_created_at" ON "chat_conversations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_chat_conv_status" ON "chat_conversations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_chat_msg_conv" ON "chat_messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "idx_chat_msg_created_at" ON "chat_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_contact_status" ON "contact_submissions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_contact_created_at" ON "contact_submissions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_contact_email" ON "contact_submissions" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_projects_slug" ON "projects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_projects_category" ON "projects" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_projects_featured" ON "projects" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "idx_skills_category" ON "skills" USING btree ("category");