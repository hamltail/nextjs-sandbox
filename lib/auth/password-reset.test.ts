import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createPasswordReset,
  findValidPasswordResetUser,
} from "@/lib/auth/password-reset";
import { hashToken } from "@/lib/auth/token";
import { prisma } from "@/lib/database/prisma";

vi.mock("@/lib/database/prisma", () => ({
  prisma: {
    user: {
      update: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe("createPasswordReset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("パスワード再設定用のdigestと送信時刻を保存する", async () => {
    const resetToken = await createPasswordReset("user-id");

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: {
        id: "user-id",
      },
      data: {
        resetDigest: hashToken(resetToken),
        resetSentAt: expect.any(Date),
      },
    });
  });

  it("生のreset tokenを返す", async () => {
    const resetToken = await createPasswordReset("user-id");

    expect(resetToken).toBeTruthy();
  });
});

describe("findValidPasswordResetUser", () => {
  it("トークンが正しく有効期限内ならユーザーを返す", async () => {
    const resetToken = "test-reset-token";

    const user = {
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      passwordDigest: "password-digest",
      admin: false,
      activationDigest: null,
      activated: true,
      activatedAt: new Date(),
      resetDigest: hashToken(resetToken),
      resetSentAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(user);

    const result = await findValidPasswordResetUser(
      "hamru@example.com",
      resetToken,
    );

    expect(result).toEqual(user);
  });

  it("ユーザーが存在しなければnullを返す", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const result = await findValidPasswordResetUser(
      "unknown@example.com",
      "test-reset-token",
    );

    expect(result).toBeNull();
  });

  it("トークンが不正ならnullを返す", async () => {
    const user = {
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      passwordDigest: "password-digest",
      admin: false,
      activationDigest: null,
      activated: true,
      activatedAt: new Date(),
      resetDigest: hashToken("valid-reset-token"),
      resetSentAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(user);

    const result = await findValidPasswordResetUser(
      "hamru@example.com",
      "invalid-reset-token",
    );

    expect(result).toBeNull();
  });

  it("パスワード再設定の有効期限が切れていればnullを返す", async () => {
    const resetToken = "test-reset-token";

    const user = {
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      passwordDigest: "password-digest",
      admin: false,
      activationDigest: null,
      activated: true,
      activatedAt: new Date(),
      resetDigest: hashToken(resetToken),
      // 2時間より前にリセットを要求した状態
      resetSentAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(user);

    const result = await findValidPasswordResetUser(
      "hamru@example.com",
      resetToken,
    );

    expect(result).toBeNull();
  });
});
