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
  const relationships = await prisma.relationship.findMany({
    where: {
      followerId: userId,
    },
    select: {
      followed: true,
    },
  });

  return relationships.map((relationship) => relationship.followed);
}

export async function getFollowers(userId: string) {
  const relationships = await prisma.relationship.findMany({
    where: {
      followedId: userId,
    },
    select: {
      follower: true,
    },
  });

  return relationships.map((relationship) => relationship.follower);
}
