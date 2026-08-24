import { beforeEach, describe, expect, it, vi } from "vitest";

import { sendPasswordResetEmail } from "@/lib/mailer/password-reset";
import { prisma } from "@/lib/database/prisma";
import { createPasswordReset } from "@/lib/auth/password-reset";
import { POST } from "@/app/api/password-resets/route";

vi.mock("@/lib/database/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth/password-reset", () => ({
  createPasswordReset: vi.fn(),
}));

vi.mock("@/lib/mailer/password-reset", () => ({
  sendPasswordResetEmail: vi.fn(),
}));

describe("POST /api/password-resets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ユーザーが存在すればパスワード再設定メールを送信する", async () => {
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

    const response = await POST(request);
    const data = await response.json();

    expect(createPasswordReset).toHaveBeenCalledWith("user-id");

    expect(sendPasswordResetEmail).toHaveBeenCalledWith({
      email: "hamru@example.com",
      resetToken,
    });

    expect(response.status).toBe(200);
    expect(data).toEqual({
      message:
        "登録されているメールアドレスの場合、パスワード再設定メールを送信しました",
    });
  });

  it("ユーザーが存在しなくても成功レスポンスを返す", async () => {
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
    const data = await response.json();

    expect(createPasswordReset).not.toHaveBeenCalled();
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      message:
        "登録されているメールアドレスの場合、パスワード再設定メールを送信しました",
    });
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
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();

    expect(response.status).toBe(422);
  });
});
