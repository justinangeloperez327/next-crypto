import { expect, test } from "@playwright/test";

test("overview and market navigation render without fabricated live quotes", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Market overview" })).toBeVisible();
  await expect(page.getByText("No prices or simulated chart series are shown.")).toBeVisible();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Markets" }).click();
  await expect(page).toHaveURL(/\/markets$/);
  await expect(page.getByRole("heading", { name: "Explore crypto markets" })).toBeVisible();
  await page.getByRole("searchbox", { name: "Search Asset catalog preview" }).fill("Ethereum");
  await expect(page.getByRole("table", { name: "Asset catalog preview" }).getByText("Ethereum")).toBeVisible();
  await expect(page.getByRole("table", { name: "Asset catalog preview" }).getByText("Bitcoin")).toHaveCount(0);
});

test("theme toggle updates the root class and visible icon", async ({ page }) => {
  await page.goto("/");
  const root = page.locator("html");
  const isDark = await root.evaluate((element) => element.classList.contains("dark"));
  const toggle = page.getByRole("button", { name: "Toggle color theme" });
  const sunIcon = toggle.locator("svg").first();
  const moonIcon = toggle.locator("svg").last();
  await expect(sunIcon).toHaveCSS("display", isDark ? "block" : "none");
  await expect(moonIcon).toHaveCSS("display", isDark ? "none" : "block");
  await toggle.click();
  await expect(root).toHaveClass(isDark ? /(^|\s)light(\s|$)/ : /(^|\s)dark(\s|$)/);
  await expect(sunIcon).toHaveCSS("display", isDark ? "none" : "block");
  await expect(moonIcon).toHaveCSS("display", isDark ? "block" : "none");
});

test("mobile navigation is keyboard and screen-reader accessible", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const dialog = page.getByRole("dialog", { name: "Navigation" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("link", { name: "Portfolio" }).click();
  await expect(page).toHaveURL(/\/portfolio$/);
  await expect(page.getByRole("heading", { name: "Portfolio tracker" })).toBeVisible();
  await expect(dialog).toHaveCount(0);
});
