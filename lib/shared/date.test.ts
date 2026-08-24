import { describe, expect, test } from "vitest";

import { getTodayRangeInJst } from "./date";

describe("getTodayRangeInJst", () => {
  test("JSTの1日の開始・終了時刻をUTCで返す", () => {
    const now = new Date("2026-08-21T03:00:00.000Z");

    const { start, end } = getTodayRangeInJst(now);

    expect(start.toISOString()).toBe("2026-08-20T15:00:00.000Z");
    expect(end.toISOString()).toBe("2026-08-21T15:00:00.000Z");
  });

  test("JSTの日付が変わると範囲も翌日に切り替わる", () => {
    const now = new Date("2026-08-21T15:00:00.000Z");

    const { start, end } = getTodayRangeInJst(now);

    expect(start.toISOString()).toBe("2026-08-21T15:00:00.000Z");
    expect(end.toISOString()).toBe("2026-08-22T15:00:00.000Z");
  });
});
