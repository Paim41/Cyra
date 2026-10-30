export const release = {
  repository: "https://github.com/Paim41/CyraInstaller",
  releases: "https://github.com/Paim41/CyraInstaller/releases",
  websiteRepository: "https://github.com/Paim41/Cyra",
  available: false,
  version: null as string | null,
  installerUrl: null as string | null,
  portableUrl: null as string | null,
  notesUrl: null as string | null,
  installerBytes: null as number | null,
  checksumUrl: null as string | null,
  checkedAt: "",
  reason:
    "The latest installer could not be verified. Please check Official Releases.",
};
export type Release = typeof release;
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
