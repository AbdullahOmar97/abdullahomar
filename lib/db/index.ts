import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.ts";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres_password@localhost:5432/abdullahomar_db";

const isProduction = process.env.NODE_ENV === "production";
const isLocal =
  connectionString.includes("localhost") ||
  connectionString.includes("127.0.0.1") ||
  connectionString.includes("postgres:5432");

// Global cache for connection pooling across hot-reloads in development
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

export const conn =
  globalForDb.conn ??
  postgres(connectionString, {
    max: isProduction ? 10 : 1,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: isLocal ? false : "prefer",
  });

if (!isProduction) {
  globalForDb.conn = conn;
}

export const db = drizzle(conn, { schema });
export * from "./schema.ts";
export * from "./queries/index.ts";
