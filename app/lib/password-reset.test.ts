import { describe, expect, it } from "vitest";

import { createResetToken, hashResetToken } from "./password-reset";

describe("password reset", () => {
  it("reset token を生成できる", () => {
    const token = createResetToken();

    expect(token).toBeTruthy();
  });

  it("reset token をハッシュ化できる", () => {
    const token = "test-token";

    expect(hashResetToken(token)).toBe(hashResetToken(token));
  });

  it("異なる reset token から異なる digest を生成する", () => {
    expect(hashResetToken("token-a")).not.toBe(hashResetToken("token-b"));
  });
});
