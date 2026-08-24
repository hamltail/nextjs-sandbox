import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/database/prisma";
import { currentUser } from "@/lib/auth/auth";
import UserPage from "@/app/users/[id]/page";

vi.mock("@/lib/database/prisma", () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth/auth", () => ({
  currentUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

describe("UserPage", () => {
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

    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
  });

  it("有効化済みユーザーだけを検索する", async () => {
    await UserPage({
      params: Promise.resolve({
        id: "user-id",
      }),
      searchParams: Promise.resolve({}),
    });

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        id: "user-id",
        activated: true,
      },
    });
  });
});
