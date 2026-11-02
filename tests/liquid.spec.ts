import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { sections } from "../data/sections";
test("shared navigation order, direct hashes, bottom and boundary stability", async ({
  page,
}) => {
  await page.goto("/#features");
  const nav = page.getByRole("navigation", {
    name: "Main navigation",
    exact: true,
  });
  await expect(nav.locator("a")).toHaveText(sections.map((s) => s.label));
  await expect(nav.locator("[aria-current]")).toHaveText("Features");
  await page.goto("/#faq");
  await page.reload();
  await expect(nav.locator("[aria-current]")).toHaveText("FAQ");
  for (const { id, label } of sections) {
    await page.evaluate(
      (id) => document.getElementById(id)?.scrollIntoView(),
      id,
    );
    await expect(nav.locator("[aria-current]")).toHaveText(label);
    const top = await page
      .locator("#" + id)
      .evaluate((n) => n.getBoundingClientRect().top);
    expect(top).toBeGreaterThanOrEqual(80);
  }
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect(nav.locator("[aria-current]")).toHaveText("FAQ");
  await expect(page.locator("header .social-link")).toHaveCount(0);
  await expect(page.locator("footer .social-link")).toHaveCount(2);
  await expect(
    page.locator("svg.lucide-arrow-up-right,svg.lucide-arrow-down"),
  ).toHaveCount(0);
});
for (const width of [390, 360])
  test(`mobile glass navigation at ${width}: modal focus, dismiss, anchor, themes`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width, height: 844 },
      hasTouch: true,
      isMobile: true,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(test.info().project.use.baseURL + "/");
    const toggle = page.getByRole("button", { name: "Toggle navigation" });
    // Tap the visible sticky control without Playwright's automatic scroll-into-view.
    const openMenu = async () => {
      const box = await toggle.boundingBox();
      if (!box) throw new Error("Navigation toggle is not visible");
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    };
    const dialog = page.getByRole("dialog", {
      name: "Navigation",
      exact: true,
    });
    for (const theme of ["dark", "light"]) {
      if (theme === "light")
        await page
          .getByRole("button", { name: "Toggle website appearance" })
          .tap();
      await openMenu();
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole("navigation").locator("a")).toHaveText(
        sections.map((s) => s.label),
      );
      await expect(
        dialog.getByRole("button", { name: "Close navigation" }),
      ).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await expect(
        dialog.getByRole("link", { name: "Get Cyra for Windows" }),
      ).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(
        dialog.getByRole("button", { name: "Close navigation" }),
      ).toBeFocused();
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({
        path: `docs/liquid-glass/menu-${width}-${theme}.png`,
      });
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(toggle).toBeFocused();
      await openMenu();
      await page.mouse.click(4, 700);
      await expect(dialog).not.toBeVisible();
      await openMenu();
      await dialog.getByRole("link", { name: "FAQ", exact: true }).tap();
      await expect(page).toHaveURL(/#faq$/);
      await expect(dialog).not.toBeVisible();
      expect(
        await page.evaluate(() => getComputedStyle(document.body).overflow),
      ).not.toBe("hidden");
      await openMenu();
      await expect(dialog.locator("[aria-current]")).toHaveText("FAQ");
      await dialog.getByRole("button", { name: "Close navigation" }).tap();
    }
    await context.close();
  });
test("film loops past end twice and resumes after leaving viewport", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#film");
  const video = page.locator("video");
  await expect
    .poll(() =>
      video.evaluate((v: HTMLVideoElement) => !v.paused && v.readyState >= 2),
    )
    .toBe(true);
  expect(await video.evaluate((v: HTMLVideoElement) => v.loop)).toBe(true);
  for (let i = 0; i < 2; i++) {
    await video.evaluate((v: HTMLVideoElement) => {
      v.currentTime = v.duration - 0.15;
    });
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
      .toBeLessThan(2);
    expect(
      await video.evaluate((v: HTMLVideoElement) => v.paused || v.ended),
    ).toBe(false);
  }
  await page.locator("#faq").scrollIntoViewIfNeeded();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(true);
  await video.scrollIntoViewIfNeeded();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused))
    .toBe(true);
});
