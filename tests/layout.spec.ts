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

test("Helpページへ遷移できる", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Help" }).click();

  await expect(page).toHaveURL("/help");

  await expect(
    page.getByRole("heading", {
      name: "Help",
    }),
  ).toBeVisible();
});

test("Aboutページへ遷移できる", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "About" }).click();

  await expect(page).toHaveURL("/about");

  await expect(
    page.getByRole("heading", {
      name: "About",
    }),
  ).toBeVisible();
});

test("Contactページへ遷移できる", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Contact" }).click();

  await expect(page).toHaveURL("/contact");

  await expect(
    page.getByRole("heading", {
      name: "Contact",
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
