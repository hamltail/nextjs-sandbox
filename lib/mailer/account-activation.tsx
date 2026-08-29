import AccountActivationEmail from "@/components/emails/AccountActivationEmail";
import { resend } from "@/lib/integrations/resend";

import type { SendAccountActivationEmail } from "./account-activation.types";

export const sendAccountActivationEmail: SendAccountActivationEmail = async ({
  name,
  email,
  activationToken,
}) => {
  const activationUrl = new URL(
    `/account-activations/${activationToken}`,
    process.env.APP_URL,
  );

  activationUrl.searchParams.set("email", email);

  const { error } = await resend.emails.send({
    from: "hamltail Web Lab <noreply@mail.hamltail.dev>",
    to: email,
    subject: "アカウントを有効化してください",
    react: AccountActivationEmail({
      name,
      activationUrl: activationUrl.toString(),
    }),
  });

  if (error) {
    throw new Error(error.message);
  }
};
