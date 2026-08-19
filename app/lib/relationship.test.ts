import { beforeEach, describe, expect, it, vi } from "vitest";

import { followUser, unfollowUser, isFollowing } from "@/app/lib/relationship";
import { prisma } from "@/app/lib/prisma";

vi.mock("@/app/lib/prisma", () => ({
  prisma: {
    relationship: {
      create: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe("followUser", () => {
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
});
