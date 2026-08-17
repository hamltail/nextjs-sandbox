import { beforeEach, describe, expect, it, vi } from "vitest";

import bcrypt from "bcryptjs";

import { prisma } from "@/app/lib/prisma";
import { POST } from "@/app/api/session/route";

vi.mock("@/app/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    session: {
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  })),
}));

describe("POST /api/session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("未有効ユーザーはログインできない", async () => {
    const password = "password";
    const passwordDigest = await bcrypt.hash(password, 10);

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      passwordDigest,
      admin: false,
      activationDigest: "activation-digest",
      activated: false,
      activatedAt: null,
      resetDigest: null,
      resetSentAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new Request("http://localhost:3000/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "hamru@example.com",
        password,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.message).toBe("アカウントを有効化してください");

    expect(prisma.session.create).not.toHaveBeenCalled();
  });

  it("有効化済みユーザーはログインできる", async () => {
    const password = "password";
    const passwordDigest = await bcrypt.hash(password, 10);

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-id",
      name: "Hamru",
      email: "hamru@example.com",
      passwordDigest,
      admin: false,
      activationDigest: "activation-digest",
      activated: true,
      activatedAt: new Date(),
      resetDigest: null,
      resetSentAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new Request("http://localhost:3000/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "hamru@example.com",
        password,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("OK");

    expect(prisma.session.create).toHaveBeenCalledWith({
      data: {
        tokenHash: expect.any(String),
        expiresAt: expect.any(Date),
        userId: "user-id",
      },
    });
  });
});
