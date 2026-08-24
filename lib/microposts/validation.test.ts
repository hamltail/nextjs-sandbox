import { describe, expect, it } from "vitest";

import { micropostSchema } from "@/lib/microposts/validation";

describe("micropostSchema", () => {
  it("1文字なら成功する", () => {
    const result = micropostSchema.safeParse({
      content: "a",
    });

    expect(result.success).toBe(true);
  });

  it("140文字なら成功する", () => {
    const result = micropostSchema.safeParse({
      content: "a".repeat(140),
    });

    expect(result.success).toBe(true);
  });

  it("空文字なら失敗する", () => {
    const result = micropostSchema.safeParse({
      content: "",
    });

    expect(result.success).toBe(false);
  });

  it("141文字なら失敗する", () => {
    const result = micropostSchema.safeParse({
      content: "a".repeat(141),
    });

    expect(result.success).toBe(false);
  });
});
