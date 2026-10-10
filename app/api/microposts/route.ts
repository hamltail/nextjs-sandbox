import { NextResponse } from "next/server";

import { currentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { micropostSchema } from "@/lib/microposts/validation";
import { getTodayRangeInJst } from "@/lib/shared/date";

export async function POST(request: Request) {
  const current = await currentUser();

  if (!current) {
    return NextResponse.json(
      {
        message: "ログインが必要です",
      },
      {
        status: 401,
      },
    );
  }

  const formData = await request.formData();
  const image = formData.get("image");

  if (image instanceof File) {
    return NextResponse.json(
      {
        message: "画像の新規登録機能は停止しています。",
      },
      {
        status: 403,
      },
    );
  }

  const { start, end } = getTodayRangeInJst();

  const todayMicropostCount = await prisma.micropost.count({
    where: {
      userId: current.id,
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });

  if (todayMicropostCount >= 5) {
    return NextResponse.json(
      {
        message:
          "1日の投稿上限（5件）に達しました。明日以降にもう一度お試しください。",
      },
      {
        status: 429,
      },
    );
  }

  const content = formData.get("content");

  const result = micropostSchema.safeParse({
    content,
  });

  if (!result.success) {
    return NextResponse.json(
      {
        errors: result.error.issues,
      },
      {
        status: 422,
      },
    );
  }

  const micropost = await prisma.micropost.create({
    data: {
      content: result.data.content,
      imageKey: null,
      userId: current.id,
    },
  });

  return NextResponse.json(
    {
      id: micropost.id,
      content: micropost.content,
      createdAt: micropost.createdAt,
    },
    {
      status: 201,
    },
  );
}
