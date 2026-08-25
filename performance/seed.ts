import { hashPassword } from "../lib/auth/password";
import { prisma } from "../lib/database/prisma";

const PERFORMANCE_USER_COUNT = 100;
const PERFORMANCE_USER_PASSWORD = "password";

async function seedPerformanceUsers() {
  const passwordDigest = await hashPassword(PERFORMANCE_USER_PASSWORD);

  for (let index = 1; index <= PERFORMANCE_USER_COUNT; index++) {
    await prisma.user.upsert({
      where: {
        email: `performance-user-${index}@example.com`,
      },
      update: {},
      create: {
        name: `Performance User ${index}`,
        email: `performance-user-${index}@example.com`,
        passwordDigest,
        activated: true,
        activatedAt: new Date(),
      },
    });
  }

  console.log(`Seeded ${PERFORMANCE_USER_COUNT} performance test users.`);
}

seedPerformanceUsers()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
