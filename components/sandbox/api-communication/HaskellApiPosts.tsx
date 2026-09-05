"use client";

import { useState } from "react";

import type { HaskellApiPostsResponse } from "@/lib/sandbox/api-communication/haskell-api.types";

export default function HaskellApiPosts() {
  const [response, setResponse] = useState<HaskellApiPostsResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetch("/api/sandbox/haskell/posts");

      if (!result.ok) {
        throw new Error("Failed to fetch posts.");
      }

      const data = (await result.json()) as HaskellApiPostsResponse;

      setResponse(data);
    } catch {
      setError("APIの取得に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-border bg-surface/90 rounded-2xl border p-6 shadow-sm">
      <div>
        <p className="font-en text-primary text-sm font-semibold tracking-[0.18em] uppercase">
          Haskell API
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight">Posts API</h2>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={fetchPosts}
          disabled={isLoading}
          className="bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "GET /api/v1/posts"}
        </button>
      </div>

      {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

      {response && (
        <div className="mt-6">
          <div className="text-muted mb-4 text-sm">
            <p>
              {response.meta.api.name} / {response.meta.api.language} /{" "}
              {response.meta.api.category}
            </p>
          </div>

          <div className="space-y-4">
            {response.data.posts.map((post) => (
              <article
                key={post.id}
                className="border-border rounded-xl border p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{post.user.displayName}</p>

                    <p className="text-muted text-sm">@{post.user.username}</p>
                  </div>

                  <time className="text-muted text-sm">{post.postedOn}</time>
                </div>

                <p className="mt-4 leading-7">{post.content}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
