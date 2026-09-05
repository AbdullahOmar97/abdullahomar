CREATE TABLE "chat_query_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"query_hash" varchar(64) NOT NULL,
	"normalized_query" text NOT NULL,
	"language" varchar(10) DEFAULT 'en' NOT NULL,
	"response" text NOT NULL,
	"hit_count" integer DEFAULT 1 NOT NULL,
	"source" varchar(50) DEFAULT 'gemini' NOT NULL,
	"last_hit_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chat_query_cache_query_hash_unique" UNIQUE("query_hash")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "idx_chat_cache_hash" ON "chat_query_cache" USING btree ("query_hash");--> statement-breakpoint
CREATE INDEX "idx_chat_cache_lang" ON "chat_query_cache" USING btree ("language");