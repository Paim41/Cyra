import { configure } from "./demo-helpers";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { countdown, safeUrl } from "../lib/product";
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});
async function open(page: import("@playwright/test").Page) {
  const demo = page.locator("#desktop-demo");
  await demo.getByRole("button", { name: /^Expand Cyra/ }).click();
  return demo;
}
test("release is honest, navigation and FAQs work", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Your desktop,",
  );
  const download = page
    .getByRole("link", { name: "Download Cyra for Windows", exact: true })
    .first();
  const href = await download.getAttribute("href");
  if (href === "#download") {
    await download.click();
    await expect(
      page.getByText("Installer temporarily unavailable"),
    ).toBeVisible();
  } else {
    expect(href).toMatch(
      /^https:\/\/github\.com\/Paim41\/CyraInstaller\/releases\/download\/v\d+\.\d+\.\d+\/Cyra-Setup-v\d+\.\d+\.\d+\.exe$/,
    );
  }
  await page
    .locator("summary")
    .filter({ hasText: "Is this demo the real Windows app?" })
    .click();
  await expect(
    page.getByText("This is an interactive browser simulation.", {
      exact: false,
    }),
  ).toBeVisible();
});
test("eight tabs, media state and theme/mode continuity", async ({ page }) => {
  const d = await open(page);
  await expect(d.getByRole("tab")).toHaveCount(8);
  await d.getByRole("button", { name: "Next track", exact: true }).click();
  await expect(d.getByText("Soft focus", { exact: true })).toBeVisible();
  await configure(d, "shape", "Floating Island");
  await expect(d.locator(".cyra-shell")).toHaveClass(/floating/);
  await configure(d, "appearance", "Light");
  await expect(d).toHaveAttribute("data-demo-theme", "light");
  await expect(d.getByText("Soft focus", { exact: true })).toBeVisible();
  await d.getByRole("button", { name: "Lyrics", exact: true }).click();
  await expect(d.getByText("Original demo words · no audio")).toBeVisible();
});
test("notifications dismiss, clear and simulate", async ({ page }) => {
  const d = await open(page);
  await d.getByRole("tab", { name: "Notifications", exact: true }).click();
  await expect(d.locator(".notification")).toHaveCount(2);
  await expect(d.locator(".app-badge").first()).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  await d
    .getByRole("button", { name: "Dismiss WhatsApp notification" })
    .click();
  await expect(d.locator(".notification")).toHaveCount(1);
  await d.getByRole("button", { name: "Clear all" }).click();
  await expect(d.locator(".notification")).toHaveCount(0);
  await d.getByRole("button", { name: "Simulate notification" }).click();
  await expect(d.locator(".notification")).toHaveCount(1);
});
test("File Tools simulate without network uploads", async ({ page }) => {
  const d = await open(page);
  await d.getByRole("tab", { name: "Education", exact: true }).click();
  await expect(d.locator(".tools-grid button")).toHaveCount(8);
  await d.getByRole("button", { name: "Merge PDFs", exact: true }).click();
  await d.getByLabel("Choose demo file").setInputFiles({
    name: "notes.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("demo"),
  });
  await expect(d.getByText("notes.pdf", { exact: true })).toBeVisible();
  await d.getByRole("button", { name: "Preview processing" }).click();
  await expect(d.getByRole("status")).toContainText("Demo complete");
});
test("University search, shortcut validation, favorite and remove", async ({
  page,
}) => {
  const d = await open(page);
  await d.getByRole("tab", { name: "Education", exact: true }).click();
  await d.getByRole("button", { name: "University", exact: true }).click();
  await d.getByRole("button", { name: "Change", exact: true }).click();
  await d.getByPlaceholder("Name or abbreviation").fill("UTHM");
  await d.locator(".university-results button").first().click();
  await d.getByRole("button", { name: "Add shortcut" }).click();
  await d.getByLabel("Shortcut name").fill("My campus");
  await d.getByLabel("Website URL").fill("javascript:alert(1)");
  await d.getByRole("button", { name: "Save shortcut" }).click();
  await expect(d.getByRole("alert")).toContainText("valid HTTP");
  await d.getByLabel("Website URL").fill("https://example.com/study");
  await d.getByRole("button", { name: "Save shortcut" }).click();
  await expect(
    d.getByRole("link", { name: "Open My campus", exact: true }),
  ).toHaveAttribute("rel", "noopener noreferrer");
  await d.getByRole("button", { name: "Favorite My campus" }).click();
  await expect(
    d.getByRole("button", { name: "Favorite My campus" }),
  ).toHaveAttribute("aria-pressed", "true");
  await d.getByRole("button", { name: "Delete My campus" }).click();
  await expect(
    d.getByRole("link", { name: "Open My campus", exact: true }),
  ).toHaveCount(0);
});
test("File Tools swipe handle changes tab while controls remain interactive", async ({
  page,
}) => {
  const d = await open(page);
  await d.getByRole("tab", { name: "Education", exact: true }).click();
  await d.locator(".swipe-handle").scrollIntoViewIfNeeded();
  const b = await d.locator(".swipe-handle").boundingBox();
  if (!b) throw Error("handle missing");
  await page.mouse.move(b.x + b.width * 0.75, b.y + b.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width * 0.25, b.y + b.height / 2, {
    steps: 10,
  });
  await page.mouse.up();
  await expect(
    d.getByRole("tab", { name: "Settings", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await d.getByRole("button", { name: "Unlock & move" }).click();
  const slider = d.getByRole("slider", { name: "Notch horizontal position" });
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveAttribute("aria-valuenow", "10");
  await page.keyboard.press("Home");
  await expect(slider).toHaveAttribute("aria-valuenow", "0");
});
test("Pomodoro controls and reduced motion", async ({ page }) => {
  const d = await open(page);
  await d.getByRole("tab", { name: "Pomodoro", exact: true }).click();
  await d.getByRole("button", { name: "Short break", exact: true }).click();
  await expect(d.locator(".timer-ring strong")).toHaveText("20:00");
  const initialRing = await d.locator(".timer-ring").getAttribute("style");
  await d.getByRole("button", { name: "Start timer" }).click();
  await expect(d.locator(".timer-ring strong")).not.toHaveText("20:00", {
    timeout: 4000,
  });
  await expect(d.locator(".timer-ring")).not.toHaveAttribute(
    "style",
    initialRing!,
  );
  await d.getByRole("button", { name: "Pause timer" }).click();
  await d.getByRole("button", { name: "Reset timer" }).click();
  await expect(d.locator(".timer-ring strong")).toHaveText("20:00");
  await expect(d.locator(".mascot span")).toHaveCSS("animation-name", "none");
});
for (const [width, height] of [
  [1440, 900],
  [1366, 768],
  [768, 1024],
  [390, 844],
])
  test(`responsive ${width}x${height}, dark/light, no overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    const d = await open(page);
    await d.getByRole("tab", { name: "Prayer Times", exact: true }).click();
    for (const size of ["S", "M", "L"]) {
      await configure(d, "size", size);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    }
    await page.screenshot({
      path: `docs/screenshots/${width}-dark.png`,
      fullPage: true,
    });
    await page
      .getByRole("button", { name: "Toggle website appearance" })
      .click();
    await configure(d, "appearance", "Light");
    await page.screenshot({
      path: `docs/screenshots/${width}-light.png`,
      fullPage: true,
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  });
test("accessibility scan dark and light with expanded panels", async ({
  page,
}) => {
  const d = await open(page);
  for (const theme of ["Dark", "Light"]) {
    await configure(d, "appearance", theme);
    if (theme === "Light")
      await page
        .getByRole("button", { name: "Toggle website appearance" })
        .click();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
});
test("countdown boundaries and URL safety", () => {
  expect(countdown(3600)).toBe("1h 00m");
  expect(countdown(59)).toBe("59s");
  expect(countdown(60)).toBe("1m 00s");
  expect(safeUrl("javascript:alert(1)")).toBe(false);
  expect(safeUrl("https://user:pass@example.com")).toBe(false);
  expect(safeUrl("https://example.com/study")).toBe(true);
});

test("compact position dragging, Edge Line, keyboard navigation and narrow bounds", async ({
  page,
}) => {
  const d = await open(page);
  await d.getByRole("tab", { name: "Music", exact: true }).focus();
  await page.keyboard.press("End");
  await expect(
    d.getByRole("tab", { name: "Settings", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await d.getByRole("button", { name: "Unlock & move" }).click();
  await d.getByRole("tab", { selected: true }).press("Escape");
  await d.locator(".compact-grip").scrollIntoViewIfNeeded();
  const box = await d.locator(".compact-grip").boundingBox();
  if (!box) throw Error("Missing compact grip");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 90, box.y + box.height / 2, {
    steps: 8,
  });
  await page.mouse.up();
  await expect(d.locator(".notch-position")).not.toHaveCSS(
    "transform",
    "matrix(1, 0, 0, 1, -180, 0)",
  );
  await d.locator(".compact-grip").dblclick();
  await expect(
    d.getByRole("button", { name: "Restore Cyra from Edge Line" }),
  ).toBeVisible();
  await d.getByRole("button", { name: "Restore Cyra from Edge Line" }).click();
  await expect(d.getByRole("button", { name: /^Expand Cyra/ })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  for (const size of ["S", "M", "L"]) {
    await configure(d, "size", size);
    const inside = await d.evaluate((el) => {
      const a = el.querySelector(".desktop-stage")!.getBoundingClientRect(),
        b = el.querySelector(".cyra-shell")!.getBoundingClientRect();
      return b.left >= a.left - 1 && b.right <= a.right + 1;
    });
    expect(inside).toBeTruthy();
  }
});

test("every panel renders without runtime errors and preserves alignment", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const d = await open(page);
  for (const tab of [
    "Music",
    "Pomodoro",
    "Prayer Times",
    "System Monitor",
    "Notifications",
    "Clipboard",
    "Education",
    "Settings",
  ]) {
    await d.getByRole("tab", { name: tab, exact: true }).click();
    await expect(
      d.getByRole("tabpanel", { name: tab, exact: true }),
    ).toBeVisible();
    expect(
      await d
        .locator(".cyra-panel")
        .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    ).toBeTruthy();
  }
  expect(errors).toEqual([]);
});

test("compact and interactive panel accessibility in both themes", async ({
  page,
}) => {
  test.setTimeout(120000);
  const d = await open(page);
  for (const theme of ["Dark", "Light"]) {
    await configure(d, "appearance", theme);
    for (const tab of [
      "Prayer Times",
      "Notifications",
      "Education",
      "Settings",
    ]) {
      await d.getByRole("tab", { name: tab, exact: true }).click();
      const result = await new AxeBuilder({ page })
        .include("#desktop-demo")
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
    }
    await d.getByRole("tab", { selected: true }).press("Escape");
    const compact = await new AxeBuilder({ page })
      .include("#desktop-demo")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(compact.violations.map((v) => v.id)).toEqual([]);
    await d.getByRole("button", { name: /^Expand Cyra/ }).click();
  }
});
