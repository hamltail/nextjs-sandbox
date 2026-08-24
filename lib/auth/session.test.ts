import { describe, expect, it } from "vitest";

import { hashSessionToken } from "./session";

describe("hashSessionToken", () => {
  it("同じトークンから同じハッシュ値を生成する", () => {
    const token = "test-session-token";

    expect(hashSessionToken(token)).toBe(hashSessionToken(token));
  });

  it("生のトークンとは異なる値を返す", () => {
    const token = "test-session-token";

    expect(hashSessionToken(token)).not.toBe(token);
  });

  it("異なるトークンから異なるハッシュ値を生成する", () => {
    const tokenA = "test-session-token-a";
    const tokenB = "test-session-token-b";

    expect(hashSessionToken(tokenA)).not.toBe(hashSessionToken(tokenB));
  });

  it("64文字の16進数のハッシュ値を生成する", () => {
    const token = "test-session-token";

    const tokenHash = hashSessionToken(token);

    expect(tokenHash).toMatch(/^[0-9a-f]{64}$/);
  });
});
