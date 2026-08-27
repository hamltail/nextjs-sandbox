// 実行: npx playwright test tests/accessibility.spec.ts --project=chromium

import { readFile } from "node:fs/promises";

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

test("ユーザー登録ページにアクセシビリティ違反がない", async ({ page }) => {
  await page.goto("/signup");

  await expectNoAccessibilityViolations(page);
});

test("パスワード再設定申請ページにアクセシビリティ違反がない", async ({
  page,
}) => {
  await page.goto("/password-resets");

  await expectNoAccessibilityViolations(page);
});

test("ログイン後トップページにアクセシビリティ違反がない", async ({ page }) => {
  const e2eUser = JSON.parse(await readFile(".tmp/e2e-user.json", "utf-8"));

  await page.goto("/login");

  await page.getByLabel("Email").fill(e2eUser.email);
  await page.getByLabel("Password").fill(e2eUser.password);

  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page).toHaveURL("/");

  await expect(
    page.getByRole("heading", {
      name: "Micropost Feed",
    }),
  ).toBeVisible();

  await expectNoAccessibilityViolations(page);
});
