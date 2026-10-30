import { release, type Release } from "../data/release";
export function parseRelease(value: unknown): Release {
  const fallback = {
    ...release,
    checkedAt: new Date().toISOString().slice(0, 10),
  };
  if (!value || typeof value !== "object") return fallback;
  const r = value as Record<string, unknown>;
  if (
    r.draft !== false ||
    r.prerelease !== false ||
    typeof r.tag_name !== "string" ||
    !/^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(r.tag_name) ||
    !Array.isArray(r.assets)
  )
    return fallback;
  const notes = `${release.releases}/tag/${r.tag_name}`;
  if (r.html_url !== notes) return fallback;
  const name = `Cyra-Setup-${r.tag_name}.exe`;
  const prefix = `${release.releases}/download/${r.tag_name}/`;
  const installers = r.assets.filter(
    (a) =>
      a &&
      a.name === name &&
      a.state === "uploaded" &&
      Number.isSafeInteger(a.size) &&
      a.size > 0 &&
      [
        "application/octet-stream",
        "application/x-msdownload",
        "application/vnd.microsoft.portable-executable",
        "application/x-msdos-program",
      ].includes(a.content_type) &&
      a.browser_download_url === prefix + name,
  );
  if (installers.length !== 1) return fallback;
  const checksum = r.assets.find(
    (a) =>
      a &&
      a.name === "SHA256SUMS.txt" &&
      a.state === "uploaded" &&
      a.size > 0 &&
      a.browser_download_url === prefix + "SHA256SUMS.txt",
  );
  return {
    ...fallback,
    available: true,
    version: r.tag_name,
    installerUrl: installers[0].browser_download_url,
    installerBytes: installers[0].size,
    notesUrl: notes,
    checksumUrl: checksum?.browser_download_url ?? null,
    reason: "",
  };
}
