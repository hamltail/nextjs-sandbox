import { NextResponse } from "next/server";

import { createPasswordReset } from "@/lib/auth/password-reset";
import { passwordResetSchema } from "@/lib/auth/password-reset-validation";
import { prisma } from "@/lib/database/prisma";
import { sendPasswordResetEmail } from "@/lib/mailer/password-reset";

const passwordResetResponseMessage =
  "登録されているメールアドレスの場合、パスワード再設定メールを送信しました";

export async function POST(request: Request) {
  const json = await request.json();

  const result = passwordResetSchema.safeParse(json);

  if (!result.success) {
    return NextResponse.json(
      {
        message: "メールアドレスが正しくありません",
      },
      {
        status: 422,
      },
    );
  }

  const { email } = result.data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return NextResponse.json({
      message: passwordResetResponseMessage,
    });
  }

  const resetToken = await createPasswordReset(user.id);

  await sendPasswordResetEmail({
    email: user.email,
    resetToken,
  });

  return NextResponse.json({
    message: passwordResetResponseMessage,
  });
}
