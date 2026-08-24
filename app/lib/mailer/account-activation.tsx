import AccountActivationEmail from "@/components/emails/AccountActivationEmail";
import { resend } from "@/lib/integrations/resend";

type SendAccountActivationEmailParams = {
  name: string;
  email: string;
  activationToken: string;
};

export async function sendAccountActivationEmail({
  name,
  email,
  activationToken,
}: SendAccountActivationEmailParams) {
  const activationUrl = new URL(
    `/account-activations/${activationToken}`,
    process.env.APP_URL,
  );

  activationUrl.searchParams.set("email", email);

  const { data, error } = await resend.emails.send({
    from: "Next.js Sandbox <noreply@mail.hamltail.dev>",
    to: email,
    subject: "Account activation",
    react: AccountActivationEmail({
      name,
      activationUrl: activationUrl.toString(),
    }),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
