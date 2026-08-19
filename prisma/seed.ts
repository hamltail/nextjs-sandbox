import bcrypt from "bcryptjs";

import { prisma } from "../app/lib/prisma";

async function main() {
  const passwordDigest = await bcrypt.hash("password", 10);

  for (let index = 1; index <= 30; index++) {
    const user = await prisma.user.upsert({
      where: {
        email: `test-user-${index}@example.com`,
      },
      update: {},
      create: {
        name: `Test User ${index}`,
        email: `test-user-${index}@example.com`,
        passwordDigest,
        activated: true,
        activatedAt: new Date(),
      },
    });

    const micropostCount = await prisma.micropost.count({
      where: {
        userId: user.id,
      },
    });

    if (micropostCount === 0) {
      await prisma.micropost.createMany({
        data: Array.from({ length: 30 }, (_, postIndex) => ({
          userId: user.id,
          content: `Test User ${index} の投稿 ${postIndex + 1}`,
        })),
      });
    }
  }

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
