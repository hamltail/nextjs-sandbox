import { render } from "@react-email/render";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { sendPasswordResetEmail } from "@/app/lib/mailer/password-reset";
import { resend } from "@/app/lib/resend";
import PasswordResetEmail from "@/components/emails/PasswordResetEmail";

vi.mock("@/app/lib/resend", () => ({
  resend: {
    emails: {
      send: vi.fn(),
    },
  },
}));

describe("sendPasswordResetEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(resend.emails.send).mockResolvedValue({
      data: {
        id: "email-id",
      },
      error: null,
      headers: null,
    });
  });

  it("パスワード再設定メールを送信する", async () => {
    await sendPasswordResetEmail({
      email: "hamru@example.com",
      resetToken: "12345678-1234-1234-1234-123456789abc",
    });

    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Next.js Sandbox <noreply@mail.hamltail.dev>",
        to: "hamru@example.com",
        subject: "Password reset",
      }),
    );
  });

  it("パスワード再設定URLをメール本文に含める", async () => {
    const resetUrl =
      "http://localhost:3000/password-resets/12345678-1234-1234-1234-123456789abc?email=hamru@example.com";

    const html = await render(
      PasswordResetEmail({
        resetUrl,
      }),
    );

    expect(html).toContain(resetUrl);
  });
});
