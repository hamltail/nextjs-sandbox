import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { hashToken } from "@/lib/auth/token";
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
      activationDigest: hashToken(token),
      activated: false,
      activatedAt: null,
      resetDigest: null,
      resetSentAt: null,
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

  it("トークンが不正ならアカウントを有効化しない", async () => {
    const token = "invalid-token";
    const email = "hamru@example.com";

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-id",
      name: "Hamru",
      email,
      passwordDigest: "password-digest",
      admin: false,

      // DBには「正しいトークン」から作ったdigestが保存されている
      activationDigest: hashToken("valid-token"),

      activated: false,
      activatedAt: null,
      resetDigest: null,
      resetSentAt: null,
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

    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
  });

  it("メールアドレスに一致するユーザーが存在しなければアカウントを有効化しない", async () => {
    const token = "test-activation-token";
    const email = "unknown@example.com";

    // findUnique() でユーザーが見つからなかった状況を再現する。
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const request = new NextRequest(
      `http://localhost:3000/account-activations/${token}?email=${email}`,
    );

    const response = await GET(request, {
      params: Promise.resolve({
        token,
      }),
    });

    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
  });
});
