import { prisma } from "@/app/lib/prisma";

async function getDatabaseStats() {
  const [users, sessions, microposts, relationships] = await Promise.all([
    prisma.user.count(),
    prisma.session.count(),
    prisma.micropost.count(),
    prisma.relationship.count(),
  ]);

  return {
    users,
    sessions,
    microposts,
    relationships,
  };
}

export async function resetDatabase() {
  const before = await getDatabaseStats();

  console.log("Database stats before reset:", before);

  await prisma.$executeRaw`
    TRUNCATE TABLE
      "Relationship",
      "Micropost",
      "Session",
      "User"
    CASCADE
  `;

  const after = await getDatabaseStats();

  console.log("Database stats after reset:", after);
}
