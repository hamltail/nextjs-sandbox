import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/microposts/route";
import { currentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { uploadImage } from "@/lib/integrations/r2";

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

// APIテストではCloudflare R2へ実通信しない。
// uploadImage() が呼ばれたか、返されたimageKeyがDB保存に使われたかだけ確認する。
vi.mock("@/lib/integrations/r2", () => ({
  uploadImage: vi.fn(),
}));

describe("POST /api/microposts", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(prisma.micropost.count).mockResolvedValue(0);
  });

  it("ログインしていなければ401を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue(null);

    const formData = new FormData();
    formData.append("content", "Next.js修練中");

    const request = new Request("http://localhost:3000/api/microposts", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(uploadImage).not.toHaveBeenCalled();
    expect(prisma.micropost.create).not.toHaveBeenCalled();
  });

  it("contentが空文字なら422を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue({
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const formData = new FormData();
    formData.append("content", "");

    const request = new Request("http://localhost:3000/api/microposts", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);

    expect(response.status).toBe(422);
    expect(uploadImage).not.toHaveBeenCalled();
    expect(prisma.micropost.create).not.toHaveBeenCalled();
  });

  it("contentが141文字なら422を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue({
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const formData = new FormData();
    formData.append("content", "a".repeat(141));

    const request = new Request("http://localhost:3000/api/microposts", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);

    expect(response.status).toBe(422);
    expect(uploadImage).not.toHaveBeenCalled();
    expect(prisma.micropost.create).not.toHaveBeenCalled();
  });

  it("画像なしならimageKeyをnullでMicropostを作成して201を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue({
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(prisma.micropost.create).mockResolvedValue({
      id: "micropost-id",
      content: "Next.js修練中",
      userId: "user-id",
      imageKey: null,
      createdAt: new Date("2026-08-18T03:00:00.000Z"),
      updatedAt: new Date("2026-08-18T03:00:00.000Z"),
    });

    const formData = new FormData();
    formData.append("content", "Next.js修練中");

    const request = new Request("http://localhost:3000/api/microposts", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);

    expect(uploadImage).not.toHaveBeenCalled();

    expect(prisma.micropost.create).toHaveBeenCalledWith({
      data: {
        content: "Next.js修練中",
        imageKey: null,
        userId: "user-id",
      },
    });

    expect(response.status).toBe(201);
  });

  it("画像ありならR2へアップロードしてimageKeyを保存する", async () => {
    vi.mocked(currentUser).mockResolvedValue({
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // R2へ実際には送らず、アップロード成功時の戻り値だけ再現する。
    vi.mocked(uploadImage).mockResolvedValue("microposts/test-image.jpg");

    vi.mocked(prisma.micropost.create).mockResolvedValue({
      id: "micropost-id",
      content: "画像付き投稿",
      userId: "user-id",
      imageKey: "microposts/test-image.jpg",
      createdAt: new Date("2026-08-18T03:00:00.000Z"),
      updatedAt: new Date("2026-08-18T03:00:00.000Z"),
    });

    const image = new File(["image-data"], "test.jpg", {
      type: "image/jpeg",
    });

    const formData = new FormData();
    formData.append("content", "画像付き投稿");
    formData.append("image", image);

    const request = new Request("http://localhost:3000/api/microposts", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);

    expect(uploadImage).toHaveBeenCalledOnce();

    // Requestを経由したFileのオブジェクト同一性には依存せず、
    // uploadImage() に渡されたファイルの内容を確認する。
    // そのためオブジェクトそのものではなく、ファイルの中身の特徴を確認する。
    const uploadedFile = vi.mocked(uploadImage).mock.calls[0][0];

    expect(uploadedFile).toBeInstanceOf(File);
    expect(uploadedFile.name).toBe("test.jpg");
    expect(uploadedFile.type).toBe("image/jpeg");
    expect(uploadedFile.size).toBe(image.size);

    // uploadImage() の戻り値がimageKeyとしてDB保存に使われることを確認する。
    expect(prisma.micropost.create).toHaveBeenCalledWith({
      data: {
        content: "画像付き投稿",
        imageKey: "microposts/test-image.jpg",
        userId: "user-id",
      },
    });

    expect(response.status).toBe(201);
  });

  it("当日の投稿数が4件なら5件目を投稿できる", async () => {
    vi.mocked(currentUser).mockResolvedValue({
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(prisma.micropost.count).mockResolvedValue(4);

    vi.mocked(prisma.micropost.create).mockResolvedValue({
      id: "micropost-id",
      content: "5件目の投稿",
      userId: "user-id",
      imageKey: null,
      createdAt: new Date("2026-08-21T03:00:00.000Z"),
      updatedAt: new Date("2026-08-21T03:00:00.000Z"),
    });

    const formData = new FormData();
    formData.append("content", "5件目の投稿");

    const request = new Request("http://localhost:3000/api/microposts", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(prisma.micropost.create).toHaveBeenCalledOnce();
  });

  it("当日の投稿数が5件なら429を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue({
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(prisma.micropost.count).mockResolvedValue(5);

    const formData = new FormData();
    formData.append("content", "6件目の投稿");

    const request = new Request("http://localhost:3000/api/microposts", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(429);

    expect(body).toEqual({
      message:
        "1日の投稿上限（5件）に達しました。明日以降にもう一度お試しください。",
    });

    expect(uploadImage).not.toHaveBeenCalled();
    expect(prisma.micropost.create).not.toHaveBeenCalled();
  });

  it("画像が3000件未満なら画像を投稿できる", async () => {
    vi.mocked(currentUser).mockResolvedValue({
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(prisma.micropost.count)
      // 1回目: 当日の投稿数
      .mockResolvedValueOnce(0)
      // 2回目: 画像付きマイクロポストの総数
      .mockResolvedValueOnce(2999);

    vi.mocked(uploadImage).mockResolvedValue("microposts/test-image.jpg");

    vi.mocked(prisma.micropost.create).mockResolvedValue({
      id: "micropost-id",
      content: "画像付き投稿",
      userId: "user-id",
      imageKey: "microposts/test-image.jpg",
      createdAt: new Date("2026-08-21T03:00:00.000Z"),
      updatedAt: new Date("2026-08-21T03:00:00.000Z"),
    });

    const image = new File(["image-data"], "test.jpg", {
      type: "image/jpeg",
    });

    const formData = new FormData();
    formData.append("content", "画像付き投稿");
    formData.append("image", image);

    const request = new Request("http://localhost:3000/api/microposts", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(uploadImage).toHaveBeenCalledOnce();

    expect(prisma.micropost.create).toHaveBeenCalledWith({
      data: {
        content: "画像付き投稿",
        imageKey: "microposts/test-image.jpg",
        userId: "user-id",
      },
    });
  });

  it("画像が3000件に達している場合は503を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue({
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(prisma.micropost.count)
      // 1回目: 当日の投稿数
      .mockResolvedValueOnce(0)
      // 2回目: 画像付きマイクロポストの総数
      .mockResolvedValueOnce(3000);

    const image = new File(["image-data"], "test.jpg", {
      type: "image/jpeg",
    });

    const formData = new FormData();
    formData.append("content", "画像付き投稿");
    formData.append("image", image);

    const request = new Request("http://localhost:3000/api/microposts", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(503);

    expect(body).toEqual({
      message:
        "画像アップロードの上限に達しているため、現在画像を投稿できません。",
    });

    expect(uploadImage).not.toHaveBeenCalled();
    expect(prisma.micropost.create).not.toHaveBeenCalled();
  });
});
