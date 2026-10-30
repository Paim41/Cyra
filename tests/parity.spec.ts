import { configure } from "./demo-helpers";
import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import fs from "node:fs";
test("touch emulation, shortcut editing and file selection continuity", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    hasTouch: true,
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const d = await demo(page);
  await d.getByRole("button", { name: /^Expand Cyra/ }).tap();
  await d.getByRole("tab", { name: "Education", exact: true }).tap();
  await d.getByRole("button", { name: "Create ZIP", exact: true }).tap();
  await d.getByRole("tab", { name: "Music", exact: true }).tap();
  await d.getByRole("tab", { name: "Education", exact: true }).tap();
  await expect(d.getByRole("heading", { name: "Create ZIP" })).toBeVisible();
  await d.getByRole("button", { name: "University", exact: true }).tap();
  await d.getByRole("button", { name: "Add shortcut" }).tap();
  await d.getByLabel("Shortcut name").fill("Campus");
  await d.getByLabel("Website URL").fill("https://example.com");
  await d.getByRole("button", { name: "Save shortcut" }).tap();
  await d.getByRole("button", { name: "Edit Campus", exact: true }).tap();
  await d.getByLabel("Shortcut name").fill("Reading room");
  await d.getByRole("button", { name: "Save shortcut" }).tap();
  await expect(
    d.getByRole("link", { name: "Open Reading room" }),
  ).toBeVisible();
  await expect(
    d.getByRole("link", { name: "Open Campus", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Enlarge installer screenshot" })
    .tap();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close enlarged screenshot" }).tap();
  await context.close();
});
async function demo(page: Page) {
  await page.goto("/");
  const d = page.locator("#desktop-demo");
  await configure(d, "size", "S");
  return d;
}
test("twelve corresponding reference states, geometry and navigation", async ({
  page,
}) => {
  const d = await demo(page);
  fs.mkdirSync("docs/screenshots/parity", { recursive: true });
  await d
    .locator(".cyra-shell")
    .screenshot({ path: "docs/screenshots/parity/01-compact-notch-dark.png" });
  await expect(d.locator(".cyra-shell")).toHaveCSS("width", "220px");
  await d.getByRole("button", { name: /^Expand Cyra/ }).click();
  await configure(d, "shape", "Floating Island");
  await expect(d.locator(".notch-position")).toHaveCSS("top", "10px");
  const labels = [
    "Music",
    "Pomodoro",
    "Prayer Times",
    "System Monitor",
    "Notifications",
    "Clipboard",
    "Education",
    "Settings",
  ];
  expect(
    await d
      .getByRole("tab")
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("aria-label"))),
  ).toEqual(labels);
  const states = [
    ["02-music-player-dark", 0],
    ["03-pomodoro-dark", 1],
    ["04-prayer-times-dark", 2],
    ["05-system-monitor-dark", 3],
    ["06-notifications-dark", 4],
    ["07-clipboard-dark", 5],
    ["08-education-file-tools-dark", 6],
    ["09-education-university-dark", 6],
    ["10-settings-dark", 7],
    ["11-personalization-dark", 7],
    ["12-settings-light-floating", 7],
  ] as const;
  for (const [name, tab] of states) {
    await d.getByRole("tab", { name: labels[tab], exact: true }).click();
    if (name.startsWith("09"))
      await d.getByRole("button", { name: "University", exact: true }).click();
    if (name.startsWith("11"))
      await d
        .getByRole("button", { name: "Personalization", exact: true })
        .click();
    if (name.startsWith("12")) {
      await d.getByRole("button", { name: "Back", exact: true }).click();
      await d
        .getByRole("group", { name: "Panel appearance", exact: true })
        .getByRole("button", { name: "Light", exact: true })
        .click();
    }
    await expect(d.locator(".nav-time")).toBeVisible();
    await expect(d.locator(".cyra-shell")).toHaveCSS("transform", "none");
    await d
      .locator(".cyra-shell")
      .screenshot({ path: `docs/screenshots/parity/${name}.png` });
    expect(
      await d
        .locator(".cyra-panel")
        .evaluate((e) => e.scrollWidth <= e.clientWidth + 1),
    ).toBeTruthy();
  }
});
test("personalization, preferences, persistent timer and clipboard actions", async ({
  page,
}) => {
  const d = await demo(page);
  await d.getByRole("button", { name: /^Expand Cyra/ }).click();
  await d.getByRole("tab", { name: "Settings", exact: true }).click();
  await d.getByRole("button", { name: "Personalization", exact: true }).click();
  await d.getByLabel("Your name", { exact: true }).fill("Alya");
  await expect(d.getByLabel("Your name", { exact: true })).toHaveAttribute(
    "maxlength",
    "32",
  );
  await d.getByRole("button", { name: "Once per Windows login" }).click();
  await expect(
    d.getByRole("button", { name: "Every Cyra launch" }),
  ).toBeVisible();
  await d.getByRole("button", { name: "Preview", exact: true }).click();
  await d.getByRole("button", { name: "Save", exact: true }).click();
  await d.getByRole("button", { name: "Personalization", exact: true }).click();
  await expect(d.getByLabel("Your name", { exact: true })).toHaveValue("Alya");
  await d.getByRole("button", { name: "Back", exact: true }).click();
  await d.getByRole("switch", { name: "Visualizer", exact: true }).click();
  await d.getByRole("tab", { name: "Music", exact: true }).click();
  await expect(d.locator(".music-spectrum")).toHaveCount(0);
  await d.getByRole("tab", { name: "Pomodoro", exact: true }).click();
  await d.getByRole("spinbutton").focus();
  await page.keyboard.press("ArrowUp");
  await expect(d.locator(".timer-ring strong")).toHaveText("21:00");
  await d.getByRole("button", { name: "Start timer" }).click();
  await d.getByRole("tab", { name: "Clipboard", exact: true }).click();
  await expect(d.locator(".clip-item")).toHaveCount(4);
  await d.locator(".clipboard-row").first().click();
  await expect(d.locator(".clipboard-row").first()).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await d
    .getByRole("button", { name: /^Dismiss Image/ })
    .first()
    .click();
  await expect(d.locator(".clip-item")).toHaveCount(3);
  await d.getByRole("button", { name: "Clear all" }).click();
  await expect(d.locator(".clip-item")).toHaveCount(0);
  await page.waitForTimeout(1100);
  await d.getByRole("tab", { name: "Pomodoro", exact: true }).click();
  await expect(d.locator(".timer-ring strong")).not.toHaveText("21:00");
});
test("seven genuine installer images, keyboard, enlargement and exact editorial copy", async ({
  page,
}) => {
  await page.goto("/");
  const s = page.getByRole("region", { name: "Cyra installer walkthrough" });
  await expect(s.locator(".setup-steps button")).toHaveCount(7);
  for (let i = 0; i < 7; i++) {
    await s.locator(".setup-steps button").nth(i).click();
    await expect(s.locator(".setup-image img")).toHaveAttribute(
      "src",
      new RegExp(`0${i + 1}-`),
    );
    await expect(s.locator(".setup-controls span")).toHaveText(`${i + 1} / 7`);
    await s
      .locator(".setup-preview")
      .screenshot({ path: `docs/screenshots/parity/installer-0${i + 1}.png` });
  }
  await s.getByRole("button", { name: "Previous", exact: true }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(s.locator(".setup-controls span")).toHaveText("6 / 7");
  await page.keyboard.press("ArrowRight");
  await expect(s.locator(".setup-controls span")).toHaveText("7 / 7");
  await s.getByRole("button", { name: "Enlarge installer screenshot" }).click();
  await expect(s.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(s.getByRole("dialog")).not.toBeVisible();
  await expect(
    s.getByRole("button", { name: "Enlarge installer screenshot" }),
  ).toBeFocused();
  const editorial = page.locator("#features");
  await expect(editorial.locator(".desktop-experience")).toHaveCount(0);
  await expect(editorial.locator(".editorial-rows article")).toHaveCount(3);
  const expected = [
    [
      "Your music. Within reach.",
      "Keep the soundtrack close. Playback, track details and lyrics live in one considered space.",
    ],
    [
      "Less noise. More presence.",
      "A clear place for notifications, with readable previews and recognizable app badges.",
    ],
    [
      "A moment to reconnect.",
      "Prayer times and a calm, green countdown. A gentle rhythm for your day.",
    ],
  ];
  for (let i = 0; i < 3; i++) {
    await expect(editorial.locator(".editorial-rows h3").nth(i)).toHaveText(
      expected[i][0],
    );
    await expect(editorial.locator(".editorial-rows p").nth(i)).toHaveText(
      expected[i][1],
    );
  }
  await expect(page.locator("#desktop-demo")).toHaveCount(1);
  await expect(page.locator(".desktop-experience")).toHaveCount(1);
  await expect(page.locator("#custom-demo")).toHaveCount(0);
});
for (const [width, height] of [
  [1440, 900],
  [1366, 768],
  [768, 1024],
  [390, 844],
])
  test(`tall Settings all sizes and themes ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    const d = await demo(page);
    await d.getByRole("button", { name: /^Expand Cyra/ }).click();
    await d.getByRole("tab", { name: "Settings", exact: true }).click();
    for (const theme of ["Dark", "Light"])
      for (const size of ["S", "M", "L"]) {
        await configure(d, "appearance", theme);
        await configure(d, "size", size);
        expect(
          await d
            .locator(".cyra-panel")
            .evaluate((e) => e.scrollWidth <= e.clientWidth + 1),
        ).toBeTruthy();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBeTruthy();
        await d.locator(".cyra-shell").screenshot({
          path: `docs/screenshots/parity/settings-${width}-${theme}-${size}.png`,
        });
      }
    await page.locator(".setup-image").scrollIntoViewIfNeeded();
    expect(
      await page
        .locator(".setup-image img")
        .evaluate(
          (e) =>
            Math.abs(
              e.getBoundingClientRect().width /
                e.getBoundingClientRect().height -
                598 / 464,
            ) < 0.01,
        ),
    ).toBeTruthy();
  });
