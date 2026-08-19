import { describe, expect, it, vi } from "vitest";

import { getMicropostFeed } from "@/app/lib/micropost";
import { prisma } from "@/app/lib/prisma";

vi.mock("@/app/lib/prisma", () => ({
  prisma: {
    micropost: {
      findMany: vi.fn(),
    },
  },
}));

describe("getMicropostFeed", () => {
  it("自分とフォロー中のユーザーのMicropostを取得する", async () => {
    vi.mocked(prisma.micropost.findMany).mockResolvedValue([]);

    await getMicropostFeed("current-user-id");

    expect(prisma.micropost.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          {
            // 自分自身のMicropost
            userId: "current-user-id",
          },
          {
            // 自分がフォローしているUserのMicropost
            user: {
              passiveRelationships: {
                some: {
                  followerId: "current-user-id",
                },
              },
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });
});
