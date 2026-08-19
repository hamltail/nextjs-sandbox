"use client";

import { useState } from "react";

type FollowButtonProps = {
  userId: string;
  initialIsFollowing: boolean;
};

export default function FollowButton({
  userId,
  initialIsFollowing,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/relationships", {
        // フォロー中なら解除、未フォローなら新しくフォローする
        method: isFollowing ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // userId はフォローされる側のUser ID
          followedId: userId,
        }),
      });

      if (!response.ok) {
        return;
      }

      // APIが成功した場合だけ、画面上のフォロー状態を反転する
      setIsFollowing((current) => !current);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="font-en rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
