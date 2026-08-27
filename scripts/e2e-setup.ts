import { mkdir, rm, writeFile } from "node:fs/promises";

import { hashPassword } from "../lib/auth/password";
import { prisma } from "../lib/database/prisma";

const timestamp = Date.now();

const e2eUser = {
  name: "E2E User",
  email: `e2e-user-${timestamp}@example.com`,
  password: "password",
};

async function main() {
  await mkdir(".tmp", { recursive: true });
  await rm(".tmp/e2e-user.json", { force: true });

  const passwordDigest = await hashPassword(e2eUser.password);

  const user = await prisma.user.create({
    data: {
      name: e2eUser.name,
      email: e2eUser.email,
      passwordDigest,
      activated: true,
      activatedAt: new Date(),
    },
  });

  await writeFile(
    ".tmp/e2e-user.json",
    JSON.stringify({
      id: user.id,
      email: user.email,
      password: e2eUser.password,
    }),
  );

  console.log(`E2E user created: ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
