// 実行: npx playwright test tests/auth.spec.ts --project=chromium

import { expect, test } from "@playwright/test";

import { loginAsE2EUser } from "./helpers/auth";

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
    await loginAsE2EUser(page);

    await expect(page).toHaveURL("/");

    await expect(
      page.getByRole("heading", {
        name: "Post feed",
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
