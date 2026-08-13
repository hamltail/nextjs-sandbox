import { config } from "dotenv";
import { createHash } from "node:crypto";

config({ path: ".env.local" });

async function main() {
  const { prisma } = await import("@/app/lib/prisma");

  const token = "c974dafe-d8a4-4fee-ae47-d310431e77b3";
  const tokenHash = createHash("sha256").update(token).digest("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() - 1);

  const result = await prisma.session.updateMany({
    where: {
      tokenHash,
    },
    data: {
      expiresAt,
    },
  });

  if (result.count === 0) {
    console.log("対象のセッションが見つかりませんでした");
    return;
  }

  console.log("セッション期限を昨日に変更しました");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const { prisma } = await import("@/app/lib/prisma");
    await prisma.$disconnect();
  });
