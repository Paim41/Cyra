import { test, expect } from "@playwright/test";
import { configure } from "./demo-helpers";
test("one demo, internal controls and personalization in Settings", async ({
  page,
}) => {
  await page.goto("/");
  const d = page.locator("#desktop-demo");
  await expect(page.locator(".desktop-experience")).toHaveCount(1);
  await expect(
    page.locator(".demo-toolbar,.demo-footnote,.gesture-note,#custom-demo"),
  ).toHaveCount(0);
  await expect(
    page.getByText("Good ideas deserve a place.", { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Keep it close." }),
  ).toBeVisible();
  await expect(
    page.locator('#customize,.personalize-invitation,a[href="#customize"]'),
  ).toHaveCount(0);
  await expect(
    page.getByText("PERSONAL BY NATURE", { exact: true }),
  ).toHaveCount(0);
  await d.getByRole("button", { name: /^Expand Cyra/ }).click();
  await d.getByRole("tab", { name: "Settings", exact: true }).click();
  await d.getByRole("button", { name: "Personalization", exact: true }).click();
  await expect(
    d.getByRole("heading", { name: "Personalization" }),
  ).toBeVisible();
  await d.getByLabel("Your name", { exact: true }).fill("Nora");
  await d.getByRole("button", { name: "Save", exact: true }).click();
  await expect(
    d.getByRole("group", { name: "Panel appearance", exact: true }),
  ).toBeVisible();
});
test("350ms hover intent, cancellation, leave delay, Click mode and editing guard", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const d = page.locator("#desktop-demo");
  await d.scrollIntoViewIfNeeded();
  await page.mouse.move(1, 1);
  const box = await d.locator(".compact-open").boundingBox();
  if (!box) throw Error("Missing compact");
  await page.mouse.move(box.x + 15, box.y + 20);
  await page.waitForTimeout(100);
  await page.mouse.move(1, 1);
  await page.waitForTimeout(400);
  await expect(d.locator(".cyra-shell")).toHaveClass(/compact/);
  await page.mouse.move(box.x + 15, box.y + 20);
  await expect(d.locator(".cyra-shell")).toHaveClass(/expanded/);
  await page.mouse.move(1, 1);
  await page.waitForTimeout(100);
  await expect(d.locator(".cyra-shell")).toHaveClass(/expanded/);
  await expect(d.locator(".cyra-shell")).toHaveClass(/compact/);
  await d.getByRole("button", { name: /^Expand Cyra/ }).click();
  await d.getByRole("tab", { name: "Settings", exact: true }).click();
  await d
    .getByRole("group", { name: "Open panel", exact: true })
    .getByRole("button", { name: "Click", exact: true })
    .click();
  await d.getByRole("tab", { selected: true }).press("Escape");
  await d.locator(".compact-open").hover();
  await page.waitForTimeout(450);
  await expect(d.locator(".cyra-shell")).toHaveClass(/compact/);
  await d.getByRole("button", { name: /^Expand Cyra/ }).click();
  await d.getByRole("button", { name: "Personalization", exact: true }).click();
  await d.getByLabel("Your name", { exact: true }).fill("Editing");
  await page.mouse.move(1, 1);
  await page.waitForTimeout(450);
  await expect(d.getByLabel("Your name", { exact: true })).toBeVisible();
  await expect(d.getByLabel("Your name", { exact: true })).toBeFocused();
});
for (const width of [1440, 390])
  test(`stable frame, all tabs, tall scrolling, battery ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const d = page.locator("#desktop-demo");
    const height = await d
      .locator(".desktop-stage")
      .evaluate((e) => e.getBoundingClientRect().height);
    await d.getByRole("button", { name: /^Expand Cyra/ }).click();
    for (const mode of ["Notch", "Floating Island"])
      for (const theme of ["Dark", "Light"]) {
        await configure(d, "shape", mode);
        await configure(d, "appearance", theme);
        for (const label of [
          "Music",
          "Pomodoro",
          "Prayer Times",
          "System Monitor",
          "Notifications",
          "Clipboard",
          "Education",
          "Settings",
        ]) {
          await d.getByRole("tab", { name: label, exact: true }).click();
          await d.getByRole("tab", { name: label, exact: true }).focus();
          expect(
            await d
              .locator(".desktop-stage")
              .evaluate((e) => e.getBoundingClientRect().height),
          ).toBe(height);
          expect(
            await d
              .locator(".cyra-panel")
              .evaluate((e) => e.scrollWidth <= e.clientWidth + 1),
          ).toBeTruthy();
        }
        await d
          .getByRole("switch", { name: /Startup/ })
          .scrollIntoViewIfNeeded();
        await expect(d.getByRole("switch", { name: /Startup/ })).toBeVisible();
        await expect(
          d.getByRole("link", { name: "Paim on GitHub" }),
        ).toBeVisible();
        await d.locator(".desktop-stage").screenshot({
          path: `docs/screenshots/refinement/frame-${width}-${mode}-${theme}.png`,
        });
      }
    await d
      .getByRole("button", { name: "Battery status: 93%, charging" })
      .click();
    await expect(
      d.getByRole("tab", { name: "System Monitor", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(d.locator(".native-battery rect").first()).toHaveAttribute(
      "rx",
      "3.2",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  });
