import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/app/lib/prisma";
import { currentUser } from "@/app/lib/auth";
import UsersPage from "@/app/users/page";

vi.mock("@/app/lib/prisma", () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock("@/app/lib/auth", () => ({
  currentUser: vi.fn(),
}));

describe("UsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(currentUser).mockResolvedValue({
      id: "current-user-id",
      name: "Current User",
      email: "current@example.com",
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(prisma.user.findMany).mockResolvedValue([]);
    vi.mocked(prisma.user.count).mockResolvedValue(0);
  });

  it("有効化済みユーザーだけを取得する", async () => {
    await UsersPage({
      searchParams: Promise.resolve({}),
    });

    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: {
        activated: true,
      },
      skip: 0,
      take: 10,
    });

    expect(prisma.user.count).toHaveBeenCalledWith({
      where: {
        activated: true,
      },
    });
  });
});
