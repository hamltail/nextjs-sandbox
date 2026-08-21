import { prisma } from "../app/lib/prisma";
import { seedDatabase } from "./seed-database";

async function main() {
  await seedDatabase();
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
