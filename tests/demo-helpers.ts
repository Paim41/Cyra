import type { Locator } from "@playwright/test";
export async function configure(
  d: Locator,
  kind: "shape" | "size" | "appearance",
  value: string,
) {
  const compact = (await d.locator(".cyra-shell.compact").count()) > 0;
  if (compact) await d.getByRole("button", { name: /^Expand Cyra/ }).click();
  const previous = await d
    .getByRole("tab", { selected: true })
    .getAttribute("aria-label");
  await d.getByRole("tab", { name: "Settings", exact: true }).click();
  const label = {
    shape: "Panel window mode",
    size: "Panel size",
    appearance: "Panel appearance",
  }[kind];
  await d
    .getByRole("group", { name: label, exact: true })
    .getByRole("button", {
      name: value === "Floating Island" ? "Floating" : value,
      exact: true,
    })
    .click();
  if (previous !== "Settings")
    await d.getByRole("tab", { name: previous!, exact: true }).click();
  if (compact) await d.getByRole("tab", { selected: true }).press("Escape");
}
