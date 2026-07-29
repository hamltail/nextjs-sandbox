import { randomUUID } from "node:crypto";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

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

  const { email, password } = result.data;

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

  const isPasswordValid = await bcrypt.compare(
    password,
    user.passwordDigest,
  );

  if (!isPasswordValid) {
    return NextResponse.json(
      {
        message: "メールアドレスまたはパスワードが正しくありません",
      },
      {
        status: 401,
      },
    );
  }

  const token = randomUUID();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.session.create({
    data: {
      token,
      expiresAt,
      userId: user.id,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return NextResponse.json({
    message: "OK",
  });
}

export async function DELETE() {
  const cookieStore = await cookies();

  const token = cookieStore.get("session_token")?.value;

  if (token) {
    await prisma.session.deleteMany({
      where: {
        token,
      },
    });
  }

  cookieStore.delete("session_token");

  return NextResponse.json({
    message: "ログアウトしました",
  });
}
