import PasswordResetEmail from "@/components/emails/PasswordResetEmail";
import { resend } from "@/app/lib/resend";

type SendPasswordResetEmailParams = {
  email: string;
  resetToken: string;
};

export async function sendPasswordResetEmail({
  email,
  resetToken,
}: SendPasswordResetEmailParams) {
  const resetUrl = new URL(
    `/password-resets/${resetToken}`,
    process.env.APP_URL,
  );

  resetUrl.searchParams.set("email", email);

  const { data, error } = await resend.emails.send({
    from: "Next.js Sandbox <noreply@mail.hamltail.dev>",
    to: email,
    subject: "Password reset",
    react: PasswordResetEmail({
      resetUrl: resetUrl.toString(),
    }),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
