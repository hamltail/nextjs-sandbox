import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { hashToken } from "@/lib/auth/token";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { token } = await context.params;
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { message: "メールアドレスが必要です" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || !user.activationDigest) {
    return NextResponse.json(
      { message: "無効な有効化リンクです" },
      { status: 400 },
    );
  }

  const activationDigest = hashToken(token);

  if (activationDigest !== user.activationDigest) {
    return NextResponse.json(
      { message: "無効な有効化リンクです" },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      activated: true,
      activatedAt: new Date(),
    },
  });

  return NextResponse.redirect(new URL("/login", request.url));
}
