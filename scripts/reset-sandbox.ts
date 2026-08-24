// Sandboxのデータを初期状態にリセットするスクリプト
// 実行: npx tsx --env-file=.env.local scripts/reset-sandbox.ts

import { prisma } from "../lib/database/prisma";
import { resetSandbox } from "../lib/sandbox/reset";

async function main() {
  await resetSandbox();
}

main()
  .catch((error) => {
    console.error("Sandbox reset failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
