import bcrypt from "bcryptjs";

import { prisma } from "../app/lib/prisma";

async function main() {
  const passwordDigest = await bcrypt.hash("password", 10);

  const users = Array.from({ length: 30 }, (_, index) => {
    const number = index + 1;

    return {
      name: `Test User ${number}`,
      email: `test-user-${number}@example.com`,
      passwordDigest,
      activated: true,
      activatedAt: new Date(),
    };
  });

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

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
