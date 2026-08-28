import { readFile } from "node:fs/promises";

import { expect, type Page } from "@playwright/test";

export type E2EUser = {
  id: string;
  email: string;
  password: string;
};

async function readE2EUser(): Promise<E2EUser> {
  return JSON.parse(await readFile(".tmp/e2e-user.json", "utf-8"));
}

export async function loginAsE2EUser(page: Page): Promise<E2EUser> {
  const e2eUser = await readE2EUser();

  await page.goto("/login");

  await page.getByLabel("Email").fill(e2eUser.email);
  await page.getByLabel("Password").fill(e2eUser.password);

  await Promise.all([
    page.waitForURL("/", {
      waitUntil: "load",
    }),
    page.getByRole("button", { name: "Log in" }).click(),
  ]);

  await expect(
    page.getByRole("heading", {
      name: "Micropost Feed",
    }),
  ).toBeVisible();

  return e2eUser;
}
