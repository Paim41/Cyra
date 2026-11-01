import { test, expect } from "@playwright/test";
test("navigation follows scroll, hashes and clicks; social links and root theme", async ({
  page,
}) => {
  await page.goto("/#installation");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav.getByRole("link", { name: "Installation" })).toHaveAttribute(
    "aria-current",
    "location",
  );
  for (const [id, label] of [
    ["film", "Watch Cyra"],
    ["features", "Features"],
    ["installation", "Installation"],
  ]) {
    await page.locator("#" + id).scrollIntoViewIfNeeded();
    await page.evaluate(
      (id) => document.getElementById(id)?.scrollIntoView(),
      id,
    );
    await expect(
      nav.getByRole("link", { name: label, exact: true }),
    ).toHaveAttribute("aria-current", "location");
  }
  await nav.getByRole("link", { name: "Watch Cyra" }).click();
  await expect(page).toHaveURL(/#film$/);
  const social = page
    .locator("header")
    .getByRole("link", { name: "Website on GitHub" });
  await social.focus();
  await expect(social.locator(".social-tooltip")).toBeVisible();
  await expect(social).toHaveAttribute(
    "href",
    "https://github.com/Paim41/Cyra",
  );
  await page.getByRole("button", { name: "Toggle website appearance" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollbarColor,
    ),
  ).not.toBe("auto");
});
test("FAQ reserves page height for every answer and supports keyboard selection", async ({
  page,
}) => {
  await page.goto("/");
  const questions = page.locator(".faq-questions button");
  await expect(questions).toHaveCount(9);
  await questions.first().scrollIntoViewIfNeeded();
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  for (let i = 0; i < 9; i++) {
    await questions.nth(i).focus();
    await page.keyboard.press("Enter");
    await expect(questions.nth(i)).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".faq-answer h3")).toHaveText(
      await questions.nth(i).innerText(),
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollHeight),
    ).toBe(height);
  }
  await expect(page.locator("details")).toHaveCount(0);
});
test("mobile FAQ dialog has full copy, Escape and focus restoration", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const q = page.locator(".faq-questions button").nth(1);
  await q.click();
  await expect(
    page.getByRole("dialog", { name: "Which Windows versions are supported?" }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText(".NET Framework 4.8");
  await page.keyboard.press("Escape");
  await expect(q).toBeFocused();
  await q.click();
  await page.getByRole("button", { name: "Close answer" }).click();
  await expect(q).toBeFocused();
});
test("one control-free film, reduced motion poster, no old demo and valid anchors", async ({
  page,
}) => {
  await page.goto("/#film");
  await expect(page.locator("video")).toHaveCount(1);
  await expect(
    page.locator("#film button,#film [tabindex],#demo,.desktop-experience"),
  ).toHaveCount(0);
  await expect(page.locator(".film-poster")).toBeVisible();
  expect(
    await page
      .locator("video")
      .evaluate(
        (v: HTMLVideoElement) => v.paused && !v.controls && v.playsInline,
      ),
  ).toBe(true);
  expect(
    (await page.locator("body").innerText()).replaceAll("©", ""),
  ).not.toMatch(/[\p{Extended_Pictographic}\u2190-\u21ff]/u);
  expect(
    await page
      .locator('a[href^="#"]')
      .evaluateAll((as) =>
        as
          .map((a) => a.getAttribute("href")!)
          .filter((h) => h.length > 1 && !document.getElementById(h.slice(1))),
      ),
  ).toEqual([]);
});
test("film autoplay, offscreen and hidden pause, reduced motion change", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#film");
  const video = page.locator("video");
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused))
    .toBe(true);
  await page.locator("#installation").scrollIntoViewIfNeeded();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(true);
  await page.locator("#film").scrollIntoViewIfNeeded();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused))
    .toBe(true);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(true);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".film-poster")).toBeVisible();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(true);
});
test("blocked autoplay and failed media retain the official poster", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () =>
      Promise.reject(new DOMException("blocked", "NotAllowedError"));
  });
  await page.goto("/#film");
  await expect(page.locator(".film-poster")).toBeVisible();
  await expect(page.locator("#film button")).toHaveCount(0);
});
test("media network failure is readable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.route("**/*.mp4", (r) => r.abort());
  await page.goto("/#film");
  await expect(page.getByRole("status")).toContainText("film is unavailable");
  await expect(page.locator(".film-poster")).toBeVisible();
});
test("release cards keep verified resource destinations", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator(".release-card");
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toHaveAttribute(
    "href",
    "https://github.com/Paim41/CyraInstaller/releases",
  );
  for (const i of [1, 2]) {
    const href = await cards.nth(i).getAttribute("href");
    if (href)
      expect(href).toMatch(
        /^https:\/\/github.com\/Paim41\/CyraInstaller\/releases\//,
      );
    else await expect(cards.nth(i)).toContainText("Not provided");
  }
});
