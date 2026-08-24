import { cookies } from "next/headers";

import { prisma } from "@/lib/database/prisma";
import { hashSessionToken } from "@/lib/auth/session";

export async function currentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return null;
  }

  const tokenHash = hashSessionToken(token);

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
          admin: true,
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
