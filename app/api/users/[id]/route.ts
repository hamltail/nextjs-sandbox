import { NextResponse } from "next/server";

import { currentUser } from "@/lib/auth/auth";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/app/lib/prisma";
import { updateUserSchema } from "@/lib/users/validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;

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

  if (current.id !== id) {
    return NextResponse.json(
      {
        message: "このユーザーは更新できません",
      },
      {
        status: 403,
      },
    );
  }

  const body = await request.json();
  const result = updateUserSchema.safeParse(body);

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

  const { name } = result.data;

  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  return NextResponse.json({
    id: user.id,
    name: user.name,
  });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;

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

  if (!current.admin) {
    return NextResponse.json(
      {
        message: "この操作を実行する権限がありません",
      },
      {
        status: 403,
      },
    );
  }

  if (current.id === id) {
    return NextResponse.json(
      {
        message: "自分自身は削除できません",
      },
      {
        status: 403,
      },
    );
  }

  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        {
          message: "ユーザーが見つかりません",
        },
        {
          status: 404,
        },
      );
    }

    throw error;
  }

  return NextResponse.json({
    message: "ユーザーを削除しました",
  });
}
