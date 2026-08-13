import { createHash } from "node:crypto";
import { cookies } from "next/headers";

import { prisma } from "@/app/lib/prisma";

export async function currentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return null;
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");

  const session = await prisma.session.findUnique({
    where: {
      tokenHash,
    },
    select: {
      expiresAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    return null;
  }

  return session.user;
}
