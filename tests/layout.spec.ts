import { expect, test } from "@playwright/test";

test("トップページが表示される", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/hamltail Web Lab/i);

  await expect(
    page.getByRole("heading", {
      name: /Build.*Test.*Explore/i,
    }),
  ).toBeVisible();
});

test("Aboutページへ遷移できる", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "About" }).click();

  await expect(page).toHaveURL("/about");

  await expect(
    page.getByRole("heading", {
      name: "hamltail Web Lab",
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Prohibited conduct",
    }),
  ).toBeVisible();
});

test("Sign upページへ遷移できる", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Sign up" }).click();

  await expect(page).toHaveURL("/signup");

  await expect(
    page.getByRole("heading", {
      name: "Sign up",
    }),
  ).toBeVisible();
});

test("テーマをDarkに切り替えられる", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Theme" }).click();
  await page.getByRole("button", { name: "Dark" }).click();

  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("選択したテーマがリロード後も維持される", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Theme" }).click();
  await page.getByRole("button", { name: "Dark" }).click();

  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.reload();

  await expect(page.locator("html")).toHaveClass(/dark/);
});
