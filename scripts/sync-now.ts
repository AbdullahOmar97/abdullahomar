import { executeCvSync } from "../lib/cv-sync/sync-service.ts";

async function main() {
  console.log("🔄 Starting Google Doc CV synchronization...");
  try {
    const result = await executeCvSync();
    console.log("✅ Sync successfully executed!");
    console.log("📊 Results:", JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error("❌ Sync failed:", error);
    process.exit(1);
  }
}

main();
