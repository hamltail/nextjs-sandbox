import { NextResponse } from "next/server";

import { currentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
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

  const body = await request.json();
  const result = micropostSchema.safeParse(body);

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
