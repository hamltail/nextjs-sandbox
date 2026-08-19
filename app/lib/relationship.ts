import { prisma } from "@/app/lib/prisma";

export async function followUser(followerId: string, followedId: string) {
  return prisma.relationship.create({
    data: {
      followerId,
      followedId,
    },
  });
}

export async function unfollowUser(followerId: string, followedId: string) {
  return prisma.relationship.delete({
    where: {
      followerId_followedId: {
        followerId,
        followedId,
      },
    },
  });
}

export async function isFollowing(followerId: string, followedId: string) {
  const relationship = await prisma.relationship.findUnique({
    where: {
      followerId_followedId: {
        followerId,
        followedId,
      },
    },
  });

  return relationship !== null;
}

export async function getFollowing(userId: string) {
  return prisma.relationship.findMany({
    where: {
      followerId: userId,
    },
    select: {
      followed: true,
    },
  });
}

export async function getFollowers(userId: string) {
  return prisma.relationship.findMany({
    where: {
      followedId: userId,
    },
    select: {
      follower: true,
    },
  });
}
