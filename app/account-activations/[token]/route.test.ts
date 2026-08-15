import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { hashActivationToken } from "@/app/lib/account-activation";
import { GET } from "@/app/account-activations/[token]/route";

vi.mock("@/app/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("GET /account-activations/[token]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正しいトークンとメールアドレスならアカウントを有効化する", async () => {
    const token = "test-activation-token";
    const email = "hamru@example.com";

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-id",
      name: "Hamru",
      email,
      passwordDigest: "password-digest",
      admin: false,
      activationDigest: hashActivationToken(token),
      activated: false,
      activatedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest(
      `http://localhost:3000/account-activations/${token}?email=${email}`,
    );

    const response = await GET(request, {
      params: Promise.resolve({
        token,
      }),
    });

    // update()の返り値ではなく、
    // route.ts が「activated: true に更新する」という
    // 正しい更新命令をPrismaへ渡したことを検証する。
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: {
        id: "user-id",
      },
      data: {
        activated: true,
        activatedAt: expect.any(Date),
      },
    });

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login",
    );
  });
});
