import { test, expect } from "@playwright/test";
import { parseRelease } from "../lib/release-parser";
const prefix = "https://github.com/Paim41/CyraInstaller/releases";
const valid = {
  draft: false,
  prerelease: false,
  tag_name: "v1.2.3",
  html_url: `${prefix}/tag/v1.2.3`,
  assets: [
    {
      name: "Cyra-Setup-v1.2.3.exe",
      state: "uploaded",
      size: 1234,
      content_type: "application/x-msdownload",
      browser_download_url: `${prefix}/download/v1.2.3/Cyra-Setup-v1.2.3.exe`,
    },
  ],
};
test("only the exact stable official installer is accepted", () => {
  expect(parseRelease(valid)).toMatchObject({
    available: true,
    version: "v1.2.3",
    installerBytes: 1234,
  });
  for (const input of [
    null,
    {},
    { ...valid, draft: true },
    { ...valid, prerelease: true },
    { ...valid, tag_name: "v1.2.3-beta" },
    { ...valid, assets: [] },
    { ...valid, html_url: "https://example.com" },
    { ...valid, assets: [...valid.assets, ...valid.assets] },
  ])
    expect(parseRelease(input).available).toBe(false);
  for (const patch of [
    { name: "unrelated.exe" },
    { size: 0 },
    { content_type: "text/html" },
    { state: "new" },
    { browser_download_url: "https://example.com/installer.exe" },
  ])
    expect(
      parseRelease({ ...valid, assets: [{ ...valid.assets[0], ...patch }] })
        .available,
    ).toBe(false);
});
