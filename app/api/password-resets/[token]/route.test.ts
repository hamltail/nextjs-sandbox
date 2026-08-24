import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PATCH } from "@/app/api/password-resets/[token]/route";
import { findValidPasswordResetUser } from "@/lib/auth/password-reset";
import { prisma } from "@/app/lib/prisma";

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("new-password-digest"),
  },
}));

vi.mock("@/lib/auth/password-reset", () => ({
  findValidPasswordResetUser: vi.fn(),
}));

vi.mock("@/app/lib/prisma", () => ({
  prisma: {
    user: {
      update: vi.fn(),
    },
    session: {
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

describe("PATCH /api/password-resets/[token]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("有効なリセットトークンならパスワードを更新する", async () => {
    vi.mocked(findValidPasswordResetUser).mockResolvedValue({
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      passwordDigest: "old-password-digest",
      admin: false,
      activationDigest: null,
      activated: true,
      activatedAt: new Date(),
      resetDigest: "reset-digest",
      resetSentAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new Request(
      "http://localhost:3000/api/password-resets/test-reset-token",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "hamru@example.com",
          password: "password123",
          passwordConfirmation: "password123",
        }),
      },
    );

    const response = await PATCH(request, {
      params: Promise.resolve({
        token: "test-reset-token",
      }),
    });

    expect(findValidPasswordResetUser).toHaveBeenCalledWith(
      "hamru@example.com",
      "test-reset-token",
    );

    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: {
        id: "user-id",
      },
      data: {
        passwordDigest: "new-password-digest",
        resetDigest: null,
        resetSentAt: null,
      },
    });

    expect(prisma.session.deleteMany).toHaveBeenCalledWith({
      where: {
        userId: "user-id",
      },
    });

    expect(prisma.$transaction).toHaveBeenCalled();

    expect(response.status).toBe(200);
  });

  it("パスワードが一致しなければ422を返す", async () => {
    const request = new Request(
      "http://localhost:3000/api/password-resets/test-reset-token",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "hamru@example.com",
          password: "password123",
          passwordConfirmation: "different-password",
        }),
      },
    );

    const response = await PATCH(request, {
      params: Promise.resolve({
        token: "test-reset-token",
      }),
    });

    expect(findValidPasswordResetUser).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.session.deleteMany).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();

    expect(response.status).toBe(422);
  });

  it("リセットトークンが無効なら400を返す", async () => {
    vi.mocked(findValidPasswordResetUser).mockResolvedValue(null);

    const request = new Request(
      "http://localhost:3000/api/password-resets/invalid-reset-token",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "hamru@example.com",
          password: "password123",
          passwordConfirmation: "password123",
        }),
      },
    );

    const response = await PATCH(request, {
      params: Promise.resolve({
        token: "invalid-reset-token",
      }),
    });

    expect(findValidPasswordResetUser).toHaveBeenCalledWith(
      "hamru@example.com",
      "invalid-reset-token",
    );

    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.session.deleteMany).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();

    expect(response.status).toBe(400);
  });
});
