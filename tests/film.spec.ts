import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
test("all seven authentic installer files preserved; gallery, keyboard and zoom work", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const gallery = page.locator(".installer");
  await expect(gallery.locator(".setup-steps button")).toHaveCount(7);
  for (let i = 0; i < 7; i++) {
    await gallery.locator(".setup-steps button").nth(i).click();
    const img = gallery.locator(".setup-image img");
    await img.evaluate((img) => (img as HTMLImageElement).decode());
    const path = (await img.getAttribute("src"))!.split("?")[0];
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(
      createHash("sha256")
        .update(await response.body())
        .digest("hex"),
    ).toBe(
      createHash("sha256")
        .update(await readFile("public" + path))
        .digest("hex"),
    );
    await expect(gallery.locator(".setup-controls span")).toHaveText(
      `${i + 1} / 7`,
    );
  }
  await gallery.getByRole("button", { name: "Previous", exact: true }).click();
  await expect(gallery.locator(".setup-controls span")).toHaveText("6 / 7");
  await page.keyboard.press("ArrowRight");
  await expect(gallery.locator(".setup-controls span")).toHaveText("7 / 7");
  await gallery
    .getByRole("button", { name: "Enlarge installer screenshot" })
    .click();
  await expect(gallery.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    gallery.getByRole("button", { name: "Enlarge installer screenshot" }),
  ).toBeFocused();
});
for (const [width, height] of [
  [1440, 900],
  [1366, 768],
  [768, 1024],
  [390, 844],
])
  test(`responsive film and both themes ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    for (const theme of ["dark", "light"]) {
      if (theme === "light")
        await page
          .getByRole("button", { name: "Toggle website appearance" })
          .click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const box = await page.locator(".film-stage").boundingBox();
      expect(box!.width / box!.height).toBeCloseTo(16 / 9, 1);
      await page.locator("#film").scrollIntoViewIfNeeded();
      await page.locator("#film").screenshot({
        path: `docs/interface-polish/film-${width}-${theme}.png`,
        style: ".header { visibility: hidden !important; }",
      });
      await page.locator(".feature-cards").screenshot({
        path: `docs/interface-polish/cards-${width}-${theme}.png`,
        style: ".header { visibility: hidden !important; }",
      });
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      await page.screenshot({
        path: `docs/interface-polish/page-${width}-${theme}.png`,
        fullPage: true,
      });
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    }
    if (width === 390) {
      await page.getByRole("button", { name: "Toggle navigation" }).click();
      await page.getByRole("link", { name: "Watch Cyra", exact: true }).click();
      await expect(
        page.getByRole("button", { name: "Toggle navigation" }),
      ).toHaveAttribute("aria-expanded", "false");
    }
  });
