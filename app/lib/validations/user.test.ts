import { describe, expect, it } from "vitest";
import { createUserSchema } from "./user";

describe("createUserSchema", () => {
  it("正常なユーザーはバリデーションに成功する", () => {
    const result = createUserSchema.safeParse({
      name: "Example User",
      email: "user@example.com",
    });

    expect(result.success).toBe(true);
  });

  it("名前が空なら失敗する", () => {
    const result = createUserSchema.safeParse({
      name: "",
      email: "user@example.com",
    });

    expect(result.success).toBe(false);
  });

  it("名前が空白のみなら失敗する", () => {
    const result = createUserSchema.safeParse({
      name: "     ",
      email: "user@example.com",
    });

    expect(result.success).toBe(false);
  });

  it("名前が51文字なら失敗する", () => {
    const result = createUserSchema.safeParse({
      name: "a".repeat(51),
      email: "user@example.com",
    });

    expect(result.success).toBe(false);
  });

  it("メール形式が不正なら失敗する", () => {
    const result = createUserSchema.safeParse({
      name: "Example User",
      email: "abc",
    });

    expect(result.success).toBe(false);
  });
});
