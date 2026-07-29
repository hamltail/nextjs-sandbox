import { z } from "zod";
import { NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { loginSchema } from "@/app/lib/validations/session";

export async function POST(request: Request) {
  const json = await request.json();

  const result = loginSchema.safeParse(json);

  if (!result.success) {
    const errors = z.flattenError(result.error);

    return NextResponse.json(
      {
        errors: errors.fieldErrors,
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
    return NextResponse.json(
      {
        message: "メールアドレスまたはパスワードが正しくありません",
      },
      {
        status: 401,
      },
    );
  }

  return NextResponse.json({
    message: "OK",
  });
}
