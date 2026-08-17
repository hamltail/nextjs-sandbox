import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/app/lib/prisma";
import { createPasswordReset } from "@/app/lib/password-reset";
import { hashToken } from "@/app/lib/token";

vi.mock("@/app/lib/prisma", () => ({
  prisma: {
    user: {
      update: vi.fn(),
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
