// 実行: npx playwright test tests/auth.spec.ts --project=chromium

import { readFile } from "node:fs/promises";

import { expect, test } from "@playwright/test";

test.describe("認証機能", () => {
  test("ログインページへ遷移できる", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Log in" }).click();

    await expect(page).toHaveURL("/login");

    await expect(
      page.getByRole("heading", {
        name: "Log in",
      }),
    ).toBeVisible();
  });

  test("ログインできる", async ({ page }) => {
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
  });

  test("未ログインでユーザーページへアクセスするとログインページへリダイレクトされる", async ({
    page,
  }) => {
    await page.goto("/users/test-user-id");

    await expect(page).toHaveURL("/login");

    await expect(
      page.getByRole("heading", {
        name: "Log in",
      }),
    ).toBeVisible();
  });

  test("未ログインでユーザー一覧へアクセスするとログインページへリダイレクトされる", async ({
    page,
  }) => {
    await page.goto("/users");

    await expect(page).toHaveURL("/login");

    await expect(
      page.getByRole("heading", {
        name: "Log in",
      }),
    ).toBeVisible();
  });
});
