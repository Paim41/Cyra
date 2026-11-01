import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
test("one film, valid anchors, original editorial, useful FAQs and SVG icons", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("video")).toHaveCount(1);
  await expect(
    page.locator(
      '#demo,#desktop-demo,.desktop-experience,[role="tab"],.clip-sheet',
    ),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "Watch Cyra", exact: true }).click();
  await expect(page).toHaveURL(/#film$/);
  await expect(page.locator(".faq details")).toHaveCount(9);
  await expect(page.locator(".editorial-rows h3")).toHaveText([
    "Your music. Within reach.",
    "Less noise. More presence.",
    "A moment to reconnect.",
  ]);
  await expect(page.locator("#features video")).toHaveCount(0);
  expect(
    (await page.locator("body").innerText()).replaceAll("©", ""),
  ).not.toMatch(
    /browser (demo|simulation)|PERSONAL BY NATURE|Try Cyra|[\p{Extended_Pictographic}\u2190-\u21ff]/u,
  );
  expect(
    await page
      .locator('a[href^="#"]')
      .evaluateAll((links) =>
        links
          .map((a) => a.getAttribute("href")!)
          .filter((h) => h.length > 1 && !document.getElementById(h.slice(1))),
      ),
  ).toEqual([]);
  const download = await page
    .getByRole("link", { name: "Download Cyra for Windows", exact: true })
    .first()
    .getAttribute("href");
  expect(download).toMatch(
    /^(#download|https:\/\/github.com\/Paim41\/CyraInstaller\/releases\/download\/v\d+\.\d+\.\d+\/Cyra-Setup-v\d+\.\d+\.\d+\.exe)$/,
  );
  await page
    .getByText("Which Windows versions are supported?", { exact: true })
    .click();
  await expect(page.getByText(/with .NET Framework 4.8/)).toBeVisible();
});
test("reduced motion poster, explicit keyboard play, pause and natural replay", async ({
  page,
}) => {
  await page.goto("/#film");
  const video = page.locator("video");
  await expect(page.locator(".film-poster")).toBeVisible();
  expect(await video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(
    true,
  );
  const button = page.getByRole("button", { name: "Play Cyra film" });
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Pause Cyra film" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime))
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "Pause Cyra film" }).click();
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused))
    .toBe(true);
  await page.getByRole("button", { name: "Play Cyra film" }).click();
  await video.evaluate((v) => {
    (v as HTMLVideoElement).currentTime = 11.8;
  });
  await expect(
    page.getByRole("button", { name: "Replay Cyra film" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Replay Cyra film" }).click();
  await expect(
    page.getByRole("button", { name: "Pause Cyra film" }),
  ).toBeVisible();
  expect(
    await video.evaluate((v) => (v as HTMLVideoElement).currentTime),
  ).toBeLessThan(3);
});
test("viewport autoplay, offscreen pause, manual pause survives reentry and visibility", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#film");
  const v = page.locator("video");
  await expect
    .poll(() => v.evaluate((v) => (v as HTMLVideoElement).paused))
    .toBe(false);
  await page.locator(".footer").scrollIntoViewIfNeeded();
  await expect
    .poll(() => v.evaluate((v) => (v as HTMLVideoElement).paused))
    .toBe(true);
  await v.scrollIntoViewIfNeeded();
  await expect
    .poll(() => v.evaluate((v) => (v as HTMLVideoElement).paused))
    .toBe(false);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() => v.evaluate((v) => (v as HTMLVideoElement).paused))
    .toBe(true);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() => v.evaluate((v) => (v as HTMLVideoElement).paused))
    .toBe(false);
  await page.getByRole("button", { name: "Pause Cyra film" }).click();
  await page.locator(".footer").scrollIntoViewIfNeeded();
  await v.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  expect(await v.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(true);
});
test("blocked autoplay keeps poster and permits manual playback", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    let first = true;
    HTMLMediaElement.prototype.play = function () {
      if (first) {
        first = false;
        return Promise.reject(new DOMException("Blocked", "NotAllowedError"));
      }
      return play.call(this);
    };
  });
  await page.goto("/#film");
  await expect(page.getByText("Press Play to watch.")).toBeVisible();
  await expect(page.locator(".film-poster")).toBeVisible();
  await page.getByRole("button", { name: "Play Cyra film" }).click();
  await expect(
    page.getByRole("button", { name: "Pause Cyra film" }),
  ).toBeVisible();
});
test("media failure retains the poster and readable retry", async ({
  page,
}) => {
  await page.route("**/cyra-promo-web-teaser.mp4", (r) => r.abort());
  await page.goto("/#film");
  await page.getByRole("button", { name: "Play Cyra film" }).click();
  await expect(
    page.getByText("Film unavailable. You can try again."),
  ).toBeVisible();
  await expect(page.locator(".film-poster")).toBeVisible();
});
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
      await page
        .locator("#film")
        .screenshot({
          path: `docs/video-refresh/film-${width}-${theme}.png`,
          style: ".header { visibility: hidden !important; }",
        });
      await page
        .locator(".feature-cards")
        .screenshot({
          path: `docs/video-refresh/cards-${width}-${theme}.png`,
          style: ".header { visibility: hidden !important; }",
        });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.screenshot({
        path: `docs/video-refresh/page-${width}-${theme}.png`,
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
test("touch playback uses the same inline film", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(test.info().project.use.baseURL + "/#film");
  await page.getByRole("button", { name: "Play Cyra film" }).tap();
  await expect(
    page.getByRole("button", { name: "Pause Cyra film" }),
  ).toBeVisible();
  await context.close();
});
