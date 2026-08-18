import { beforeEach, describe, expect, it, vi } from "vitest";

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("指定したユーザーのMicropostを新しい順で取得する", async () => {
    vi.mocked(prisma.micropost.findMany).mockResolvedValue([]);

    await getMicropostFeed("user-id");

    expect(prisma.micropost.findMany).toHaveBeenCalledWith({
      where: {
        userId: "user-id",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });
});
