import { redirect } from "next/navigation";
import { describe, expect, it, vi } from "vitest";

import PasswordResetPage from "@/app/password-resets/[token]/page";
import { findValidPasswordResetUser } from "@/lib/auth/password-reset";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

vi.mock("@/lib/auth/password-reset", () => ({
  findValidPasswordResetUser: vi.fn(),
}));

describe("PasswordResetPage", () => {
  it("有効なパスワード再設定リンクならフォームを表示する", async () => {
    vi.mocked(findValidPasswordResetUser).mockResolvedValue({
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      passwordDigest: "password-digest",
      admin: false,
      activationDigest: null,
      activated: true,
      activatedAt: new Date(),
      resetDigest: "reset-digest",
      resetSentAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await PasswordResetPage({
      params: Promise.resolve({
        token: "test-reset-token",
      }),
      searchParams: Promise.resolve({
        email: "hamru@example.com",
      }),
    });

    expect(findValidPasswordResetUser).toHaveBeenCalledWith(
      "hamru@example.com",
      "test-reset-token",
    );

    expect(result).toBeTruthy();
  });

  it("メールアドレスがなければパスワード再設定ページへリダイレクトする", async () => {
    await expect(
      PasswordResetPage({
        params: Promise.resolve({
          token: "test-reset-token",
        }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(redirect).toHaveBeenCalledWith("/password-resets");
    expect(findValidPasswordResetUser).not.toHaveBeenCalled();
  });

  it("パスワード再設定リンクが無効ならパスワード再設定ページへリダイレクトする", async () => {
    vi.mocked(findValidPasswordResetUser).mockResolvedValue(null);

    await expect(
      PasswordResetPage({
        params: Promise.resolve({
          token: "invalid-reset-token",
        }),
        searchParams: Promise.resolve({
          email: "hamru@example.com",
        }),
      }),
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(findValidPasswordResetUser).toHaveBeenCalledWith(
      "hamru@example.com",
      "invalid-reset-token",
    );

    expect(redirect).toHaveBeenCalledWith("/password-resets");
  });
});
