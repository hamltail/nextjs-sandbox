import { NextResponse } from "next/server";

import { sendPasswordResetEmail } from "@/app/lib/mailer/password-reset";
import { createPasswordReset } from "@/lib/auth/password-reset";
import { prisma } from "@/app/lib/prisma";
import { passwordResetSchema } from "@/app/lib/validations/password-reset";

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
