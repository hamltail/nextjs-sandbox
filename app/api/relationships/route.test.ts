import { beforeEach, describe, expect, it, vi } from "vitest";

import { DELETE, POST } from "@/app/api/relationships/route";
import { currentUser } from "@/lib/auth/auth";
import { followUser, unfollowUser } from "@/app/lib/relationship";

vi.mock("@/lib/auth/auth", () => ({
  currentUser: vi.fn(),
}));

vi.mock("@/app/lib/relationship", () => ({
  followUser: vi.fn(),
  unfollowUser: vi.fn(),
}));

describe("POST /api/relationships", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("未ログインの場合は401を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue(null);

    const request = new Request("http://localhost/api/relationships", {
      method: "POST",
      body: JSON.stringify({
        followedId: "followed-id",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
  });

  it("自分自身をフォローする場合は400を返す", async () => {
    // currentUser() は本来User全体を返すが、
    // このテストではidしか使用しないため、モックの型チェックのみ回避する
    vi.mocked(currentUser).mockResolvedValue({
      id: "current-user-id",
    } as never);

    const request = new Request("http://localhost/api/relationships", {
      method: "POST",
      body: JSON.stringify({
        followedId: "current-user-id",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(followUser).not.toHaveBeenCalled();
  });

  it("ユーザーをフォローできる", async () => {
    vi.mocked(currentUser).mockResolvedValue({
      id: "current-user-id",
    } as never);

    vi.mocked(followUser).mockResolvedValue({
      id: "relationship-id",
      followerId: "current-user-id",
      followedId: "followed-user-id",
      createdAt: new Date(),
    });

    const request = new Request("http://localhost/api/relationships", {
      method: "POST",
      body: JSON.stringify({
        followedId: "followed-user-id",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);

    // 第1引数はフォローする側（ログイン中のUser）、
    // 第2引数はフォローされる側（リクエストで指定されたUser）
    expect(followUser).toHaveBeenCalledWith(
      "current-user-id",
      "followed-user-id",
    );

    // 作成されたRelationshipのうち、
    // APIがクライアントへ返す項目を確認する
    expect(body).toEqual({
      id: "relationship-id",
      followerId: "current-user-id",
      followedId: "followed-user-id",
    });
  });
});

describe("DELETE /api/relationships", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("未ログインの場合は401を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue(null);

    const request = new Request("http://localhost/api/relationships", {
      method: "DELETE",
      body: JSON.stringify({
        followedId: "followed-user-id",
      }),
    });

    const response = await DELETE(request);

    expect(response.status).toBe(401);
  });

  it("フォロー対象のユーザーIDがない場合は400を返す", async () => {
    // currentUser() は本来User全体を返すが、
    // このテストではidしか使用しないため、モックの型チェックのみ回避する
    vi.mocked(currentUser).mockResolvedValue({
      id: "current-user-id",
    } as never);

    const request = new Request("http://localhost/api/relationships", {
      method: "DELETE",
      body: JSON.stringify({}),
    });

    const response = await DELETE(request);

    expect(response.status).toBe(400);
    expect(unfollowUser).not.toHaveBeenCalled();
  });

  it("ユーザーのフォローを解除できる", async () => {
    vi.mocked(currentUser).mockResolvedValue({
      id: "current-user-id",
    } as never);

    vi.mocked(unfollowUser).mockResolvedValue({
      id: "relationship-id",
      followerId: "current-user-id",
      followedId: "followed-user-id",
      createdAt: new Date(),
    });

    const request = new Request("http://localhost/api/relationships", {
      method: "DELETE",
      body: JSON.stringify({
        followedId: "followed-user-id",
      }),
    });

    const response = await DELETE(request);
    const body = await response.json();

    expect(response.status).toBe(200);

    expect(unfollowUser).toHaveBeenCalledWith(
      "current-user-id",
      "followed-user-id",
    );

    expect(body).toEqual({
      id: "relationship-id",
      followerId: "current-user-id",
      followedId: "followed-user-id",
    });
  });
});
