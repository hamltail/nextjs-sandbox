import { prisma } from "@/app/lib/prisma";

export async function getMicropostFeed(userId: string) {
  return prisma.micropost.findMany({
    where: {
      OR: [
        {
          // 自分自身のMicropost
          userId,
        },
        {
          // 自分がフォローしているUserのMicropost
          user: {
            passiveRelationships: {
              some: {
                followerId: userId,
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      content: true,
      imageKey: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
