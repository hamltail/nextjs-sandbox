import { prisma } from "@/app/lib/prisma";
import { createToken, hashToken } from "@/app/lib/token";

export async function createPasswordReset(userId: string) {
  const resetToken = createToken();
  const resetDigest = hashToken(resetToken);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      resetDigest,
      resetSentAt: new Date(),
    },
  });

  return resetToken;
}

export function isPasswordResetExpired(resetSentAt: Date) {
  const twoHoursInMilliseconds = 2 * 60 * 60 * 1000;

  return Date.now() - resetSentAt.getTime() > twoHoursInMilliseconds;
}

export async function findValidPasswordResetUser(
  email: string,
  resetToken: string,
) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || !user.resetDigest || !user.resetSentAt) {
    return null;
  }

  if (hashToken(resetToken) !== user.resetDigest) {
    return null;
  }

  if (isPasswordResetExpired(user.resetSentAt)) {
    return null;
  }

  return user;
}
