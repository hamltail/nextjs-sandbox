import { randomUUID } from "node:crypto";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/app/lib/prisma";
import { hashSessionToken } from "@/app/lib/session";
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

  const isPasswordValid = await bcrypt.compare(password, user.passwordDigest);

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

  if (!user.activated) {
    return NextResponse.json(
      {
        message: "アカウントを有効化してください",
      },
      {
        status: 403,
      },
    );
  }

  await prisma.session.deleteMany({
    where: {
      userId: user.id,
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  const token = randomUUID();
  const tokenHash = hashSessionToken(token);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.session.create({
    data: {
      tokenHash,
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
    const tokenHash = hashSessionToken(token);

    await prisma.session.deleteMany({
      where: {
        tokenHash,
      },
    });
  }

  cookieStore.delete("session_token");

  return NextResponse.json({
    message: "ログアウトしました",
  });
}
