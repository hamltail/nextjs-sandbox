import { beforeEach, describe, expect, it, vi } from "vitest";

import { getGoPosts } from "@/lib/sandbox/api-communication/go-api";

import { GET } from "./route";

vi.mock("@/lib/sandbox/api-communication/go-api", () => ({
  getGoPosts: vi.fn(),
}));

const mockedGetGoPosts = vi.mocked(getGoPosts);

describe("GET /api/sandbox/go/posts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Go APIのレスポンスを返す", async () => {
    mockedGetGoPosts.mockResolvedValue({
      meta: {
        api: {
          name: "go-api",
          language: "Go",
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
            content: "GoでAPIを作っています。",
            postedOn: "2026-09-06",
            createdAt: "2026-09-06T10:00:00+09:00",
          },
        ],
      },
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.meta.api.language).toBe("Go");
    expect(body.data.posts).toHaveLength(1);
    expect(body.data.posts[0].user.username).toBe("hamru");
  });

  it("Go APIの取得に失敗した場合は502を返す", async () => {
    mockedGetGoPosts.mockRejectedValue(new Error("API error"));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body).toEqual({
      error: {
        code: "GO_API_ERROR",
        message: "Failed to fetch Go API posts.",
      },
    });
  });
});
