import { describe, expect, it } from "vitest";

import { createUserSchema, updateUserSchema } from "@/lib/users/validation";

function validCreateUser() {
  return {
    name: "Example User",
    email: "user@example.com",
    password: "password123",
    passwordConfirmation: "password123",
  };
}

function validUpdateUser() {
  return {
    name: "Example User",
  };
}

describe("createUserSchema", () => {
  it("正常なユーザー情報はバリデーションに成功する", () => {
    const result = createUserSchema.safeParse(validCreateUser());

    expect(result.success).toBe(true);
  });

  it("名前が空ならバリデーションに失敗する", () => {
    const result = createUserSchema.safeParse({
      ...validCreateUser(),
      name: "",
    });

    expect(result.success).toBe(false);
  });

  it("名前が50文字を超える場合はバリデーションに失敗する", () => {
    const result = createUserSchema.safeParse({
      ...validCreateUser(),
      name: "a".repeat(51),
    });

    expect(result.success).toBe(false);
  });

  it("メールアドレスが空ならバリデーションに失敗する", () => {
    const result = createUserSchema.safeParse({
      ...validCreateUser(),
      email: "",
    });

    expect(result.success).toBe(false);
  });

  it("メールアドレスの形式が不正ならバリデーションに失敗する", () => {
    const result = createUserSchema.safeParse({
      ...validCreateUser(),
      email: "invalid-email",
    });

    expect(result.success).toBe(false);
  });

  it("メールアドレスが255文字を超える場合はバリデーションに失敗する", () => {
    const result = createUserSchema.safeParse({
      ...validCreateUser(),
      email: `${"a".repeat(244)}@example.com`,
    });

    expect(result.success).toBe(false);
  });

  it("パスワードと確認用パスワードが一致しない場合は失敗する", () => {
    const result = createUserSchema.safeParse({
      ...validCreateUser(),
      passwordConfirmation: "different-password",
    });

    expect(result.success).toBe(false);
  });
});

describe("updateUserSchema", () => {
  it("正常なユーザー情報はバリデーションに成功する", () => {
    const result = updateUserSchema.safeParse(validUpdateUser());

    expect(result.success).toBe(true);
  });

  it("名前が空ならバリデーションに失敗する", () => {
    const result = updateUserSchema.safeParse({
      ...validUpdateUser(),
      name: "",
    });

    expect(result.success).toBe(false);
  });

  it("名前が50文字を超える場合はバリデーションに失敗する", () => {
    const result = updateUserSchema.safeParse({
      ...validUpdateUser(),
      name: "a".repeat(51),
    });

    expect(result.success).toBe(false);
  });

  it("emailが含まれている場合はバリデーションに失敗する", () => {
    const result = updateUserSchema.safeParse({
      name: "Example User",
      email: "user@example.com",
    });

    expect(result.success).toBe(false);
  });
});
