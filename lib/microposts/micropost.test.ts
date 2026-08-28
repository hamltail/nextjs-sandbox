import { describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/database/prisma";
import { getMicropostFeed } from "@/lib/microposts/micropost";

vi.mock("@/lib/database/prisma", () => ({
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
            userId: "current-user-id",
          },
          {
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
  });
});
