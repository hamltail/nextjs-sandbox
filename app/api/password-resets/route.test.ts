import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/app/lib/prisma";
import { createPasswordReset } from "@/app/lib/password-reset";
import { POST } from "@/app/api/password-resets/route";

vi.mock("@/app/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/app/lib/password-reset", () => ({
  createPasswordReset: vi.fn(),
}));

describe("POST /api/password-resets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ユーザーが存在すればパスワード再設定処理を実行する", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      passwordDigest: "password-digest",
      admin: false,
      activationDigest: null,
      activated: true,
      activatedAt: new Date(),
      resetDigest: null,
      resetSentAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const resetToken = "12345678-1234-1234-1234-123456789abc";

    vi.mocked(createPasswordReset).mockResolvedValue(resetToken);

    const request = new Request("http://localhost:3000/api/password-resets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "hamru@example.com",
      }),
    });

    await POST(request);

    expect(createPasswordReset).toHaveBeenCalledWith("user-id");
  });

  it("ユーザーが存在しなければ404を返す", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const request = new Request("http://localhost:3000/api/password-resets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "unknown@example.com",
      }),
    });

    const response = await POST(request);

    expect(createPasswordReset).not.toHaveBeenCalled();
    expect(response.status).toBe(404);
  });

  it("メールアドレスが不正なら422を返す", async () => {
    const request = new Request("http://localhost:3000/api/password-resets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "invalid-email",
      }),
    });

    const response = await POST(request);

    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(createPasswordReset).not.toHaveBeenCalled();
    expect(response.status).toBe(422);
  });
});
