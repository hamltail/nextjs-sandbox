// 実行: npx playwright test tests/accessibility.spec.ts --project=chromium

import { readFile } from "node:fs/promises";

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

type E2EUser = {
  id: string;
  email: string;
  password: string;
};

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

async function readE2EUser(): Promise<E2EUser> {
  return JSON.parse(await readFile(".tmp/e2e-user.json", "utf-8"));
}

async function loginAsE2EUser(page: Page): Promise<E2EUser> {
  const e2eUser = await readE2EUser();

  await page.goto("/login");

  await page.getByLabel("Email").fill(e2eUser.email);
  await page.getByLabel("Password").fill(e2eUser.password);

  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page).toHaveURL("/");

  return e2eUser;
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
  await loginAsE2EUser(page);

  await expect(
    page.getByRole("heading", {
      name: "Micropost Feed",
    }),
  ).toBeVisible();

  await expectNoAccessibilityViolations(page);
});

test("ユーザー一覧ページにアクセシビリティ違反がない", async ({ page }) => {
  await loginAsE2EUser(page);

  await page.goto("/users");

  await expectNoAccessibilityViolations(page);
});

test("ユーザー詳細ページにアクセシビリティ違反がない", async ({ page }) => {
  const e2eUser = await loginAsE2EUser(page);

  await page.goto(`/users/${e2eUser.id}`);

  await expectNoAccessibilityViolations(page);
});

test("ユーザー設定ページにアクセシビリティ違反がない", async ({ page }) => {
  const e2eUser = await loginAsE2EUser(page);

  await page.goto(`/users/${e2eUser.id}/edit`);

  await expectNoAccessibilityViolations(page);
});
