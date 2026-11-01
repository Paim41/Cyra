import { test, expect } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ReleaseCards } from "../components/ReleaseCards";
import { parseRelease } from "../lib/release-parser";
test("unavailable metadata never produces fake checksum or release-note links", async ({
  page,
}) => {
  const html = renderToStaticMarkup(
    createElement(ReleaseCards, { release: parseRelease(null) }),
  );
  await page.setContent(html);
  await expect(page.locator("a")).toHaveCount(1);
  await expect(page.locator("a")).toHaveAttribute(
    "href",
    "https://github.com/Paim41/CyraInstaller/releases",
  );
  await expect(page.getByText("Not provided for this release")).toHaveCount(2);
});
