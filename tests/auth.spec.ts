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
});
