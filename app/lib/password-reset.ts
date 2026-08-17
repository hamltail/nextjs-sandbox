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
