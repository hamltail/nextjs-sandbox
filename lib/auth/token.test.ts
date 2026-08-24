import { describe, expect, it } from "vitest";

import { createToken, hashToken } from "./token";

describe("token", () => {
  it("token を生成できる", () => {
    const token = createToken();

    expect(token).toBeTruthy();
  });

  it("token をハッシュ化できる", () => {
    const token = "test-token";

    expect(hashToken(token)).toBe(hashToken(token));
  });

  it("異なる token から異なる digest を生成する", () => {
    expect(hashToken("token-a")).not.toBe(hashToken("token-b"));
  });
});
