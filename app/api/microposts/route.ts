import { NextResponse } from "next/server";

import { currentUser } from "@/app/lib/auth";
import { getTodayRangeInJst } from "@/app/lib/date";
import { prisma } from "@/app/lib/prisma";
import { uploadImage } from "@/app/lib/r2";
import { micropostSchema } from "@/app/lib/validations/micropost";

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

  const formData = await request.formData();

  const content = formData.get("content");
  const image = formData.get("image");

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

  const imageKey =
    image instanceof File && image.size > 0 ? await uploadImage(image) : null;

  const micropost = await prisma.micropost.create({
    data: {
      content: result.data.content,
      imageKey,
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
