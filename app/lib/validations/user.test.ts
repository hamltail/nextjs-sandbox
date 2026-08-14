import { describe, expect, it } from "vitest";

import { createUserSchema, updateUserSchema } from "./user";

const validUser = (overrides: Record<string, unknown> = {}) => ({
  name: "Example User",
  email: "user@example.com",
  password: "password",
  passwordConfirmation: "password",
  ...overrides,
});

const validUpdateUser = (overrides: Record<string, unknown> = {}) => ({
  name: "Example User",
  email: "user@example.com",
  ...overrides,
});

describe("createUserSchema", () => {
  it("正常なユーザーはバリデーションに成功する", () => {
    const result = createUserSchema.safeParse(validUser());

    expect(result.success).toBe(true);
  });

  it("名前が空なら失敗する", () => {
    const result = createUserSchema.safeParse(
      validUser({
        name: "",
      }),
    );

    expect(result.success).toBe(false);
  });

  it("名前が空白のみなら失敗する", () => {
    const result = createUserSchema.safeParse(
      validUser({
        name: "     ",
      }),
    );

    expect(result.success).toBe(false);
  });

  it("名前が51文字なら失敗する", () => {
    const result = createUserSchema.safeParse(
      validUser({
        name: "a".repeat(51),
      }),
    );

    expect(result.success).toBe(false);
  });

  it("メール形式が不正なら失敗する", () => {
    const result = createUserSchema.safeParse(
      validUser({
        email: "abc",
      }),
    );

    expect(result.success).toBe(false);
  });

  it("パスワードが8文字なら成功する", () => {
    const password = "a".repeat(8);

    const result = createUserSchema.safeParse(
      validUser({
        password,
        passwordConfirmation: password,
      }),
    );

    expect(result.success).toBe(true);
  });

  it("パスワードが7文字なら失敗する", () => {
    const password = "a".repeat(7);

    const result = createUserSchema.safeParse(
      validUser({
        password,
        passwordConfirmation: password,
      }),
    );

    expect(result.success).toBe(false);
  });

  it("パスワードが72文字なら成功する", () => {
    const password = "a".repeat(72);

    const result = createUserSchema.safeParse(
      validUser({
        password,
        passwordConfirmation: password,
      }),
    );

    expect(result.success).toBe(true);
  });

  it("パスワードが73文字なら失敗する", () => {
    const password = "a".repeat(73);

    const result = createUserSchema.safeParse(
      validUser({
        password,
        passwordConfirmation: password,
      }),
    );

    expect(result.success).toBe(false);
  });

  it("パスワードが一致しない場合は失敗する", () => {
    const result = createUserSchema.safeParse(
      validUser({
        password: "password123",
        passwordConfirmation: "password456",
      }),
    );

    expect(result.success).toBe(false);
  });

  it("パスワードが一致する場合は成功する", () => {
    const password = "password123";

    const result = createUserSchema.safeParse(
      validUser({
        password,
        passwordConfirmation: password,
      }),
    );

    expect(result.success).toBe(true);
  });
});

describe("updateUserSchema", () => {
  it("正常なユーザー情報はバリデーションに成功する", () => {
    const result = updateUserSchema.safeParse(validUpdateUser());

    expect(result.success).toBe(true);
  });

  it("名前が空なら失敗する", () => {
    const result = updateUserSchema.safeParse(
      validUpdateUser({
        name: "",
      }),
    );

    expect(result.success).toBe(false);
  });

  it("名前が空白のみなら失敗する", () => {
    const result = updateUserSchema.safeParse(
      validUpdateUser({
        name: "     ",
      }),
    );

    expect(result.success).toBe(false);
  });

  it("名前が51文字なら失敗する", () => {
    const result = updateUserSchema.safeParse(
      validUpdateUser({
        name: "a".repeat(51),
      }),
    );

    expect(result.success).toBe(false);
  });

  it("メール形式が不正なら失敗する", () => {
    const result = updateUserSchema.safeParse(
      validUpdateUser({
        email: "abc",
      }),
    );

    expect(result.success).toBe(false);
  });
});
