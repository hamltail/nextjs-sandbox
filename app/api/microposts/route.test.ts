import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/microposts/route";

import { currentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";

vi.mock("@/lib/auth/auth", () => ({
  currentUser: vi.fn(),
}));

vi.mock("@/lib/database/prisma", () => ({
  prisma: {
    micropost: {
      count: vi.fn(),
      create: vi.fn(),
    },
  },
}));

const testUser = {
  id: "user-id",
  name: "Hamru",
  email: "hamru@example.com",
  admin: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function createRequest(content: string, image?: File) {
  const formData = new FormData();
  formData.append("content", content);

  if (image) {
    formData.append("image", image);
  }

  return new Request("http://localhost:3000/api/microposts", {
    method: "POST",
    body: formData,
  });
}

describe("POST /api/microposts", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(currentUser).mockResolvedValue(testUser);
    vi.mocked(prisma.micropost.count).mockResolvedValue(0);
  });

  it("ログインしていなければ401を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue(null);

    const response = await POST(createRequest("Next.js修練中"));

    expect(response.status).toBe(401);
    expect(prisma.micropost.create).not.toHaveBeenCalled();
  });

  it("contentが空文字なら422を返す", async () => {
    const response = await POST(createRequest(""));

    expect(response.status).toBe(422);
    expect(prisma.micropost.create).not.toHaveBeenCalled();
  });

  it("contentが141文字なら422を返す", async () => {
    const response = await POST(createRequest("a".repeat(141)));

    expect(response.status).toBe(422);
    expect(prisma.micropost.create).not.toHaveBeenCalled();
  });

  it("画像なしならimageKeyをnullでMicropostを作成して201を返す", async () => {
    vi.mocked(prisma.micropost.create).mockResolvedValue({
      id: "micropost-id",
      content: "Next.js修練中",
      userId: "user-id",
      imageKey: null,
      createdAt: new Date("2026-08-18T03:00:00.000Z"),
      updatedAt: new Date("2026-08-18T03:00:00.000Z"),
    });

    const response = await POST(createRequest("Next.js修練中"));

    expect(response.status).toBe(201);
    expect(prisma.micropost.create).toHaveBeenCalledWith({
      data: {
        content: "Next.js修練中",
        imageKey: null,
        userId: "user-id",
      },
    });
  });

  it("画像付き投稿なら403を返して登録しない", async () => {
    const image = new File(["image-data"], "test.jpg", {
      type: "image/jpeg",
    });

    const response = await POST(createRequest("画像付き投稿", image));
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body).toEqual({
      message: "画像の新規登録機能は停止しています。",
    });

    expect(prisma.micropost.count).not.toHaveBeenCalled();
    expect(prisma.micropost.create).not.toHaveBeenCalled();
  });

  it("空の画像ファイルでも403を返す", async () => {
    const image = new File([], "empty.jpg", {
      type: "image/jpeg",
    });

    const response = await POST(createRequest("画像付き投稿", image));

    expect(response.status).toBe(403);
    expect(prisma.micropost.create).not.toHaveBeenCalled();
  });

  it("当日の投稿数が4件なら5件目を投稿できる", async () => {
    vi.mocked(prisma.micropost.count).mockResolvedValue(4);

    vi.mocked(prisma.micropost.create).mockResolvedValue({
      id: "micropost-id",
      content: "5件目の投稿",
      userId: "user-id",
      imageKey: null,
      createdAt: new Date("2026-08-21T03:00:00.000Z"),
      updatedAt: new Date("2026-08-21T03:00:00.000Z"),
    });

    const response = await POST(createRequest("5件目の投稿"));

    expect(response.status).toBe(201);
    expect(prisma.micropost.create).toHaveBeenCalledOnce();
  });

  it("当日の投稿数が5件なら429を返す", async () => {
    vi.mocked(prisma.micropost.count).mockResolvedValue(5);

    const response = await POST(createRequest("6件目の投稿"));
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(body).toEqual({
      message:
        "1日の投稿上限（5件）に達しました。明日以降にもう一度お試しください。",
    });

    expect(prisma.micropost.create).not.toHaveBeenCalled();
  });
});
