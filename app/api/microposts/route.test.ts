import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/microposts/route";
import { currentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { uploadImage } from "@/app/lib/r2";

vi.mock("@/app/lib/auth", () => ({
  currentUser: vi.fn(),
}));

vi.mock("@/app/lib/prisma", () => ({
  prisma: {
    micropost: {
      create: vi.fn(),
    },
  },
}));

// APIテストではCloudflare R2へ実通信しない。
// uploadImage() が呼ばれたか、返されたimageKeyがDB保存に使われたかだけ確認する。
vi.mock("@/app/lib/r2", () => ({
  uploadImage: vi.fn(),
}));

describe("POST /api/microposts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});
