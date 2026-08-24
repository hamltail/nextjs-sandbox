import { NextResponse } from "next/server";

import { getTodayRangeInJst } from "@/app/lib/date";
import { prisma } from "@/lib/database/prisma";
import { micropostSchema } from "@/app/lib/validations/micropost";
import { currentUser } from "@/lib/auth/auth";
import { uploadImage } from "@/lib/integrations/r2";

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

  const hasImage = image instanceof File && image.size > 0;

  if (hasImage) {
    const imageCount = await prisma.micropost.count({
      where: {
        imageKey: {
          not: null,
        },
      },
    });

    if (imageCount >= 3000) {
      return NextResponse.json(
        {
          message:
            "画像アップロードの上限に達しているため、現在画像を投稿できません。",
        },
        {
          status: 503,
        },
      );
    }
  }

  let imageKey = null;

  if (hasImage) {
    try {
      imageKey = await uploadImage(image);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Image must be 1MB or smaller"
      ) {
        return NextResponse.json(
          {
            message: "画像サイズは1MB以下にしてください。",
          },
          {
            status: 413,
          },
        );
      }

      throw error;
    }
  }

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
