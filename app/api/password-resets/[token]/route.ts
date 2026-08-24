import { NextResponse } from "next/server";

import { findValidPasswordResetUser } from "@/lib/auth/password-reset";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/database/prisma";
import { passwordResetUpdateSchema } from "@/app/lib/validations/password-reset";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { token } = await context.params;
  const json = await request.json();

  const result = passwordResetUpdateSchema.safeParse(json);

  if (!result.success) {
    return NextResponse.json(
      {
        message: "パスワードが正しくありません",
      },
      {
        status: 422,
      },
    );
  }

  const { email, password } = result.data;

  const user = await findValidPasswordResetUser(email, token);

  if (!user) {
    return NextResponse.json(
      {
        message: "無効なパスワード再設定リンクです",
      },
      {
        status: 400,
      },
    );
  }

  const passwordDigest = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordDigest,
        resetDigest: null,
        resetSentAt: null,
      },
    }),

    prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    }),
  ]);

  return NextResponse.json({
    message: "パスワードを更新しました",
  });
}
