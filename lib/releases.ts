import { parseRelease } from "./release-parser";
export async function getLatestRelease() {
  try {
    const response = await fetch(
      "https://api.github.com/repos/Paim41/CyraInstaller/releases/latest",
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(8000),
      },
    );
    return parseRelease(response.ok ? await response.json() : null);
  } catch {
    return parseRelease(null);
  }
}
