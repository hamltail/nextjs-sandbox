import { beforeEach, describe, expect, it, vi } from "vitest";

import { render } from "@react-email/render";
import { resend } from "@/app/lib/resend";
import { sendAccountActivationEmail } from "@/app/lib/mailer/account-activation";

vi.mock("@/app/lib/resend", () => ({
  resend: {
    emails: {
      send: vi.fn(),
    },
  },
}));

describe("sendAccountActivationEmail", () => {
  beforeEach(() => {
    vi.mocked(resend.emails.send).mockResolvedValue({
      data: {
        id: "test-email-id",
      },
      error: null,
      headers: null,
    });
  });

  it("アカウント有効化メールを送信する", async () => {
    await sendAccountActivationEmail({
      name: "Hamru",
      email: "hamru@example.com",
      activationToken: "test-activation-token",
    });

    expect(resend.emails.send).toHaveBeenCalledOnce();

    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Next.js Sandbox <onboarding@resend.dev>",
        to: "hamru@example.com",
        subject: "Account activation",
      }),
    );

    const sendMock = vi.mocked(resend.emails.send);
    const sendOptions = sendMock.mock.calls[0][0];

    // 有効化URLに必要なトークンとメールアドレスが、実際のメール本文に含まれることを確認する。
    const html = await render(sendOptions.react);

    expect(html).toContain("Hamru");
    expect(html).toContain("test-activation-token");
    expect(html).toContain("hamru%40example.com");
  });
});
