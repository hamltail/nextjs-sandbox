import { beforeEach, describe, expect, it, vi } from "vitest";

import { DELETE } from "@/app/api/microposts/[id]/route";
import { currentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

vi.mock("@/app/lib/auth", () => ({
  currentUser: vi.fn(),
}));

vi.mock("@/app/lib/prisma", () => ({
  prisma: {
    micropost: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("DELETE /api/microposts/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ログインしていなければ401を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue(null);

    const request = new Request(
      "http://localhost:3000/api/microposts/micropost-id",
      {
        method: "DELETE",
      },
    );

    const response = await DELETE(request, {
      params: Promise.resolve({
        id: "micropost-id",
      }),
    });

    expect(response.status).toBe(401);
    expect(prisma.micropost.findUnique).not.toHaveBeenCalled();
    expect(prisma.micropost.delete).not.toHaveBeenCalled();
  });

  it("Micropostが存在しなければ404を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue({
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(prisma.micropost.findUnique).mockResolvedValue(null);

    const request = new Request(
      "http://localhost:3000/api/microposts/micropost-id",
      {
        method: "DELETE",
      },
    );

    const response = await DELETE(request, {
      params: Promise.resolve({
        id: "micropost-id",
      }),
    });

    expect(response.status).toBe(404);
    expect(prisma.micropost.delete).not.toHaveBeenCalled();
  });

  it("他人のMicropostなら403を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue({
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(prisma.micropost.findUnique).mockResolvedValue({
      id: "micropost-id",
      content: "他人の投稿",
      userId: "other-user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new Request(
      "http://localhost:3000/api/microposts/micropost-id",
      {
        method: "DELETE",
      },
    );

    const response = await DELETE(request, {
      params: Promise.resolve({
        id: "micropost-id",
      }),
    });

    expect(response.status).toBe(403);
    expect(prisma.micropost.delete).not.toHaveBeenCalled();
  });

  it("自分のMicropostなら削除して204を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue({
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(prisma.micropost.findUnique).mockResolvedValue({
      id: "micropost-id",
      content: "自分の投稿",
      userId: "user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(prisma.micropost.delete).mockResolvedValue({
      id: "micropost-id",
      content: "自分の投稿",
      userId: "user-id",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new Request(
      "http://localhost:3000/api/microposts/micropost-id",
      {
        method: "DELETE",
      },
    );

    const response = await DELETE(request, {
      params: Promise.resolve({
        id: "micropost-id",
      }),
    });

    expect(prisma.micropost.delete).toHaveBeenCalledWith({
      where: {
        id: "micropost-id",
      },
    });

    expect(response.status).toBe(204);
  });
});
