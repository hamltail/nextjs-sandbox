import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/microposts/route";
import { currentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

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

describe("POST /api/microposts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ログインしていなければ401を返す", async () => {
    vi.mocked(currentUser).mockResolvedValue(null);

    const request = new Request("http://localhost:3000/api/microposts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: "Next.js修練中",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
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

    const request = new Request("http://localhost:3000/api/microposts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: "",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(422);
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

    const request = new Request("http://localhost:3000/api/microposts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: "a".repeat(141),
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(422);
    expect(prisma.micropost.create).not.toHaveBeenCalled();
  });

  it("有効なcontentならログインユーザーのMicropostを作成して201を返す", async () => {
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

    const request = new Request("http://localhost:3000/api/microposts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: "Next.js修練中",
      }),
    });

    const response = await POST(request);

    expect(prisma.micropost.create).toHaveBeenCalledWith({
      data: {
        content: "Next.js修練中",
        userId: "user-id",
      },
    });

    expect(response.status).toBe(201);
  });
});
