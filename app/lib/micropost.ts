import { prisma } from "@/app/lib/prisma";

export async function getMicropostFeed(userId: string) {
  return prisma.micropost.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
