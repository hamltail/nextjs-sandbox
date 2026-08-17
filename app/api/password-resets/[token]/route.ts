import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { findValidPasswordResetUser } from "@/app/lib/password-reset";
import { prisma } from "@/app/lib/prisma";

const passwordResetUpdateSchema = z
  .object({
    email: z.email(),
    password: z.string().min(6),
    passwordConfirmation: z.string().min(6),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "パスワードが一致しません",
    path: ["passwordConfirmation"],
  });

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

  const passwordDigest = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordDigest,
    },
  });

  return NextResponse.json({
    message: "パスワードを更新しました",
  });
}
