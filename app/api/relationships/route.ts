import { NextResponse } from "next/server";

import { currentUser } from "@/app/lib/auth";
import { followUser, unfollowUser } from "@/app/lib/relationship";

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
  const followedId = body.followedId;

  if (!followedId) {
    return NextResponse.json(
      {
        message: "フォロー対象のユーザーIDが必要です",
      },
      {
        status: 400,
      },
    );
  }

  if (current.id === followedId) {
    return NextResponse.json(
      {
        message: "自分自身はフォローできません",
      },
      {
        status: 400,
      },
    );
  }

  const relationship = await followUser(current.id, followedId);

  return NextResponse.json(
    {
      id: relationship.id,
      followerId: relationship.followerId,
      followedId: relationship.followedId,
    },
    {
      status: 201,
    },
  );
}

export async function DELETE(request: Request) {
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
  const followedId = body.followedId;

  if (!followedId) {
    return NextResponse.json(
      {
        message: "フォロー対象のユーザーIDが必要です",
      },
      {
        status: 400,
      },
    );
  }

  const relationship = await unfollowUser(current.id, followedId);

  return NextResponse.json(
    {
      id: relationship.id,
      followerId: relationship.followerId,
      followedId: relationship.followedId,
    },
    {
      status: 200,
    },
  );
}
