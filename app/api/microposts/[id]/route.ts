import { NextResponse } from "next/server";

import { currentUser } from "@/lib/auth/auth";
import { prisma } from "@/app/lib/prisma";
import { deleteImage } from "@/app/lib/r2";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, { params }: RouteContext) {
  const current = await currentUser();

  if (!current) {
    return NextResponse.json(
      { message: "ログインが必要です" },
      { status: 401 },
    );
  }

  const { id } = await params;

  const micropost = await prisma.micropost.findUnique({
    where: {
      id,
    },
  });

  if (!micropost) {
    return NextResponse.json(
      { message: "Micropostが見つかりません" },
      { status: 404 },
    );
  }

  if (micropost.userId !== current.id) {
    return NextResponse.json(
      { message: "このMicropostは削除できません" },
      { status: 403 },
    );
  }

  await prisma.micropost.delete({
    where: {
      id,
    },
  });

  if (micropost.imageKey) {
    await deleteImage(micropost.imageKey);
  }

  return new NextResponse(null, {
    status: 204,
  });
}
