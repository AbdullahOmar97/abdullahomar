import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, conn } from "./index.ts";

export async function runMigrations() {
  console.log("⏳ Running database migrations...");
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

if (process.argv[1]?.includes("migrate")) {
  runMigrations()
    .then(async () => {
      await conn.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error(err);
      await conn.end();
      process.exit(1);
    });
}
