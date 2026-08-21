// Sandboxのデータを初期状態にリセットするスクリプト
// 実行: npx tsx --env-file=.env.local scripts/reset-sandbox.ts

import { prisma } from "../app/lib/prisma";
import { resetDatabase } from "../app/lib/sandbox-reset";
import { seedDatabase } from "../prisma/seed-database";

async function main() {
  await resetDatabase();

  console.log("Starting seed...");
  await seedDatabase();
  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error("Sandbox reset failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
