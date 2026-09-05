import { beforeEach, describe, expect, it, vi } from "vitest";

import { getHaskellPosts } from "@/lib/sandbox/api-communication/haskell-api";

import { GET } from "./route";

vi.mock("@/lib/sandbox/api-communication/haskell-api", () => ({
  getHaskellPosts: vi.fn(),
}));

const mockedGetHaskellPosts = vi.mocked(getHaskellPosts);

describe("GET /api/sandbox/haskell/posts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Haskell APIのレスポンスを返す", async () => {
    mockedGetHaskellPosts.mockResolvedValue({
      meta: {
        api: {
          name: "haskell-api",
          language: "Haskell",
          category: "public",
        },
        count: 1,
      },
      data: {
        posts: [
          {
            id: 1,
            user: {
              username: "hamru",
              displayName: "はむる",
            },
            content: "HaskellでAPIを作っています。",
            postedOn: "2026-09-05",
            createdAt: "2026-09-05T13:00:00+09:00",
          },
        ],
      },
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.meta.api.language).toBe("Haskell");
    expect(body.data.posts).toHaveLength(1);
    expect(body.data.posts[0].user.username).toBe("hamru");
  });

  it("Haskell APIの取得に失敗した場合は502を返す", async () => {
    mockedGetHaskellPosts.mockRejectedValue(new Error("API error"));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body).toEqual({
      error: {
        code: "HASKELL_API_ERROR",
        message: "Failed to fetch Haskell API posts.",
      },
    });
  });
});
