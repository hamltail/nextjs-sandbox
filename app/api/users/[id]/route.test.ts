import { beforeEach, describe, expect, it, vi } from "vitest";

import { currentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

import { DELETE, PATCH } from "./route";

vi.mock("@/app/lib/auth", () => ({
  currentUser: vi.fn(),
}));

vi.mock("@/app/lib/prisma", () => ({
  prisma: {
    user: {
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
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

  it("別のユーザーを更新しようとすると403を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue({
      id: "user-1",
      name: "Example User",
      email: "user@example.com",
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new Request("http://localhost/api/users/user-2", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Other User",
        email: "other@example.com",
      }),
    });

    const response = await PATCH(request, {
      params: Promise.resolve({
        id: "user-2",
      }),
    });

    expect(response.status).toBe(403);

    const data = await response.json();

    expect(data).toEqual({
      message: "このユーザーは更新できません",
    });
  });

  it("入力値が不正なら422を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue({
      id: "user-1",
      name: "Example User",
      email: "user@example.com",
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new Request("http://localhost/api/users/user-1", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "",
        email: "abc",
      }),
    });

    const response = await PATCH(request, {
      params: Promise.resolve({
        id: "user-1",
      }),
    });

    expect(response.status).toBe(422);

    const data = await response.json();

    expect(Array.isArray(data.errors)).toBe(true);
    expect(data.errors.length).toBeGreaterThan(0);
  });

  it("正常な入力ならユーザーを更新して200を返す", async () => {
    // ログイン中のユーザーを再現する
    // currentUser() が呼ばれたら、このユーザーを返す
    vi.mocked(currentUser).mockResolvedValue({
      id: "user-1",
      name: "Example User",
      email: "user@example.com",
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // DB更新が成功した状態を再現する
    // prisma.user.update() が呼ばれたら、この更新済みユーザーを返す
    vi.mocked(prisma.user.update).mockResolvedValue({
      id: "user-1",
      name: "Updated User",
      email: "updated@example.com",
      passwordDigest: "hashed-password",
      admin: false,
      activationDigest: null,
      activated: false,
      activatedAt: null,
      resetDigest: null,
      resetSentAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // PATCHリクエストを作成する
    const request = new Request("http://localhost/api/users/user-1", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Updated User",
        email: "updated@example.com",
      }),
    });

    // PATCH処理を実行する
    const response = await PATCH(request, {
      params: Promise.resolve({
        id: "user-1",
      }),
    });

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toEqual({
      id: "user-1",
      name: "Updated User",
      email: "updated@example.com",
    });
  });
});

describe("DELETE /api/users/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("未ログインなら401を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue(null);

    const request = new Request("http://localhost/api/users/user-2", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({
        id: "user-2",
      }),
    });

    expect(response.status).toBe(401);

    const data = await response.json();

    expect(data).toEqual({
      message: "ログインが必要です",
    });
  });

  it("管理者でなければ403を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue({
      id: "user-1",
      name: "Example User",
      email: "user@example.com",
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new Request("http://localhost/api/users/user-2", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({
        id: "user-2",
      }),
    });

    expect(response.status).toBe(403);

    const data = await response.json();

    expect(data).toEqual({
      message: "この操作を実行する権限がありません",
    });
  });

  it("管理者でも自分自身は削除できない", async () => {
    vi.mocked(currentUser).mockResolvedValue({
      id: "user-1",
      name: "Admin User",
      email: "admin@example.com",
      admin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new Request("http://localhost/api/users/user-1", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({
        id: "user-1",
      }),
    });

    expect(response.status).toBe(403);

    const data = await response.json();

    expect(data).toEqual({
      message: "自分自身は削除できません",
    });
  });

  it("管理者なら別のユーザーを削除して200を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue({
      id: "admin-1",
      name: "Admin User",
      email: "admin@example.com",
      admin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 実際のDBは操作せず、prisma.user.delete() が成功したことにする
    vi.mocked(prisma.user.delete).mockResolvedValue({
      id: "user-2",
      name: "Delete User",
      email: "delete@example.com",
      passwordDigest: "hashed-password",
      admin: false,
      activationDigest: null,
      activated: false,
      activatedAt: null,
      resetDigest: null,
      resetSentAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new Request("http://localhost/api/users/user-2", {
      method: "DELETE",
    });

    // ここでDELETE処理を実行する
    const response = await DELETE(request, {
      params: Promise.resolve({
        id: "user-2",
      }),
    });

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toEqual({
      message: "ユーザーを削除しました",
    });
  });
});
