import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

import { PrismaClient } from "../app/generated/prisma/client";

config({ path: ".env.local" });

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = `hamru-${Date.now()}@example.com`;
  const passwordDigest = await bcrypt.hash("password", 10);

  const user = await prisma.user.create({
    data: {
      name: "Hamru",
      email,
      passwordDigest,
    },
  });

  console.log("作成:", user);

  const users = await prisma.user.findMany();
  console.log("一覧:", users);

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: "Hamru Updated",
    },
  });

  console.log("更新:", updatedUser);

  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });

  const remainingUsers = await prisma.user.findMany();
  console.log("削除後:", remainingUsers);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
