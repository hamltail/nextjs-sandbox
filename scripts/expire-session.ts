import "dotenv/config";

import { prisma } from "@/app/lib/prisma";

async function main() {
  const token = "aba50cf6-1bed-43d0-a1dc-ebcd6d765a62";

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() - 1);

  await prisma.session.update({
    where: {
      token,
    },
    data: {
      expiresAt,
    },
  });

  console.log("セッション期限を昨日に変更しました");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
