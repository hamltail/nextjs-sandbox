// Resendのアカウント有効化メールを実際に送信して確認するためのスクリプト
// 実行: npx tsx --env-file=.env.local scripts/test-resend.ts

import { sendAccountActivationEmail } from "../lib/mailer/account-activation";

async function main() {
  const email = process.env.RESEND_TEST_EMAIL;

  if (!email) {
    throw new Error("RESEND_TEST_EMAIL is not set");
  }

  await sendAccountActivationEmail({
    name: "Hamru",
    email,
    activationToken: "test-activation-token",
  });

  console.log("メールを送信しました");
}

main().catch(console.error);
