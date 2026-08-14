import { beforeEach, describe, expect, it, vi } from "vitest";

import { currentUser } from "@/app/lib/auth";

import { PATCH } from "./route";

vi.mock("@/app/lib/auth", () => ({
  currentUser: vi.fn(),
}));

describe("PATCH /api/users/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("未ログインなら401を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue(null);

    const request = new Request("http://localhost/api/users/user-1", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Example User",
        email: "user@example.com",
      }),
    });

    const response = await PATCH(request, {
      params: Promise.resolve({
        id: "user-1",
      }),
    });

    expect(response.status).toBe(401);

    const data = await response.json();

    expect(data).toEqual({
      message: "ログインが必要です",
    });
  });
});
