import { describe, expect, it } from "vitest";

import { loginSchema } from "./session";

const validLogin = (overrides: Record<string, unknown> = {}) => ({
  email: "user@example.com",
  password: "password",
  ...overrides,
});

describe("loginSchema", () => {
  it("正常なログイン情報はバリデーションに成功する", () => {
    const result = loginSchema.safeParse(validLogin());

    expect(result.success).toBe(true);
  });

  it("メールアドレスが空なら失敗する", () => {
    const result = loginSchema.safeParse(
      validLogin({
        email: "",
      }),
    );

    expect(result.success).toBe(false);
  });

  it("メールアドレスが空白のみなら失敗する", () => {
    const result = loginSchema.safeParse(
      validLogin({
        email: "     ",
      }),
    );

    expect(result.success).toBe(false);
  });

  it("メール形式が不正なら失敗する", () => {
    const result = loginSchema.safeParse(
      validLogin({
        email: "abc",
      }),
    );

    expect(result.success).toBe(false);
  });

  it("メールアドレスが256文字なら失敗する", () => {
    const email = `${"a".repeat(244)}@example.com`;

    const result = loginSchema.safeParse(
      validLogin({
        email,
      }),
    );

    expect(result.success).toBe(false);
  });

  it("パスワードが空なら失敗する", () => {
    const result = loginSchema.safeParse(
      validLogin({
        password: "",
      }),
    );

    expect(result.success).toBe(false);
  });

  it("パスワードが72文字なら成功する", () => {
    const password = "a".repeat(72);

    const result = loginSchema.safeParse(
      validLogin({
        password,
      }),
    );

    expect(result.success).toBe(true);
  });

  it("パスワードが73文字なら失敗する", () => {
    const password = "a".repeat(73);

    const result = loginSchema.safeParse(
      validLogin({
        password,
      }),
    );

    expect(result.success).toBe(false);
  });
});
