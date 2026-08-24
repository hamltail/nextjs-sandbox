import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  followUser,
  getFollowers,
  getFollowersCount,
  getFollowing,
  getFollowingCount,
  isFollowing,
  unfollowUser,
} from "@/lib/microposts/relationship";
import { prisma } from "@/lib/database/prisma";

vi.mock("@/lib/database/prisma", () => ({
  prisma: {
    relationship: {
      create: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe("relationship", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("フォロー関係を作成できる", async () => {
    vi.mocked(prisma.relationship.create).mockResolvedValue({
      id: "relationship-id",
      followerId: "follower-id",
      followedId: "followed-id",
      createdAt: new Date(),
    });

    await followUser("follower-id", "followed-id");

    expect(prisma.relationship.create).toHaveBeenCalledWith({
      data: {
        followerId: "follower-id",
        followedId: "followed-id",
      },
    });
  });

  it("フォロー関係を削除できる", async () => {
    vi.mocked(prisma.relationship.delete).mockResolvedValue({
      id: "relationship-id",
      followerId: "follower-id",
      followedId: "followed-id",
      createdAt: new Date(),
    });

    await unfollowUser("follower-id", "followed-id");

    expect(prisma.relationship.delete).toHaveBeenCalledWith({
      where: {
        followerId_followedId: {
          followerId: "follower-id",
          followedId: "followed-id",
        },
      },
    });
  });

  it("フォローしている場合はtrueを返す", async () => {
    vi.mocked(prisma.relationship.findUnique).mockResolvedValue({
      id: "relationship-id",
      followerId: "follower-id",
      followedId: "followed-id",
      createdAt: new Date(),
    });

    const result = await isFollowing("follower-id", "followed-id");

    expect(result).toBe(true);
  });

  it("フォローしていない場合はfalseを返す", async () => {
    vi.mocked(prisma.relationship.findUnique).mockResolvedValue(null);

    const result = await isFollowing("follower-id", "followed-id");

    expect(result).toBe(false);
  });

  it("フォローしているUserのみ返す", async () => {
    const followed = {
      id: "followed-id",
      name: "Followed",
      email: "followed@example.com",
      passwordDigest: "password",
      admin: false,
      activationDigest: null,
      activated: true,
      activatedAt: null,
      resetDigest: null,
      resetSentAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Prismaのselectによる返り値の型をVitestのモックが推論できないため、
    // テストデータの型チェックのみ回避する
    vi.mocked(prisma.relationship.findMany).mockResolvedValue([
      {
        followed,
      },
    ] as never);

    const result = await getFollowing("user-id");

    expect(result).toEqual([followed]);

    expect(prisma.relationship.findMany).toHaveBeenCalledWith({
      where: {
        followerId: "user-id",
      },
      select: {
        followed: true,
      },
    });
  });

  it("フォロワーのUserのみ返す", async () => {
    const follower = {
      id: "follower-id",
      name: "Follower",
      email: "follower@example.com",
      passwordDigest: "password",
      admin: false,
      activationDigest: null,
      activated: true,
      activatedAt: null,
      resetDigest: null,
      resetSentAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Prismaのselectによる返り値の型をVitestのモックが推論できないため、
    // テストデータの型チェックのみ回避する
    vi.mocked(prisma.relationship.findMany).mockResolvedValue([
      {
        follower,
      },
    ] as never);

    const result = await getFollowers("user-id");

    expect(result).toEqual([follower]);

    expect(prisma.relationship.findMany).toHaveBeenCalledWith({
      where: {
        followedId: "user-id",
      },
      select: {
        follower: true,
      },
    });
  });

  it("フォローしているユーザー数を取得できる", async () => {
    vi.mocked(prisma.relationship.count).mockResolvedValue(3);

    const result = await getFollowingCount("user-id");

    expect(result).toBe(3);

    expect(prisma.relationship.count).toHaveBeenCalledWith({
      where: {
        followerId: "user-id",
      },
    });
  });

  it("フォロワー数を取得できる", async () => {
    vi.mocked(prisma.relationship.count).mockResolvedValue(5);

    const result = await getFollowersCount("user-id");

    expect(result).toBe(5);

    expect(prisma.relationship.count).toHaveBeenCalledWith({
      where: {
        followedId: "user-id",
      },
    });
  });
});
