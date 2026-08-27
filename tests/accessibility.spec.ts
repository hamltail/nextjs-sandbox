// 実行: npx playwright test tests/accessibility.spec.ts --project=chromium

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function expectNoAccessibilityViolations(page: Page) {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  const violationMessages = accessibilityScanResults.violations.flatMap(
    (violation) =>
      violation.nodes.map((node) =>
        [
          `[${violation.impact}] ${violation.id}`,
          `  ${violation.help}`,
          `  target: ${node.target.join(", ")}`,
          `  html: ${node.html}`,
          `  ${node.failureSummary}`,
        ].join("\n"),
      ),
  );

  expect(violationMessages, violationMessages.join("\n\n")).toEqual([]);
}

test("トップページにアクセシビリティ違反がない", async ({ page }) => {
  await page.goto("/");

  // TODO: prefers-reduced-motion対応後は固定時間の待機を削除する。
  await page.waitForTimeout(4500);

  await expectNoAccessibilityViolations(page);
});

test("Aboutページにアクセシビリティ違反がない", async ({ page }) => {
  await page.goto("/about");

  // TODO: prefers-reduced-motion対応後は固定時間の待機を削除する。
  await page.waitForTimeout(2000);

  await expectNoAccessibilityViolations(page);
});

test("ログインページにアクセシビリティ違反がない", async ({ page }) => {
  await page.goto("/login");

  await expectNoAccessibilityViolations(page);
});
