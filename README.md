# Cyra Web

The official Cyra landing page and promotional film. Designed by Paim.

This repository contains **website source only**, not the Windows application's private C# source. Windows installers and release notes are distributed separately through [CyraInstaller](https://github.com/Paim41/CyraInstaller/releases).

## Development

Requires Node.js 24 and npm.

```sh
npm ci
npm run dev
```

## Verification and production

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run start
```

Stack: Next.js App Router, React, TypeScript, CSS, Motion, Lucide, locally bundled Lato fonts. Playwright checks the responsive film player and accessible interactions. The supplied 12-second silent promotional animation plays locally in a native video element. Reduced-motion users see the poster; playback pauses offscreen or in a hidden tab. The cinematic film has no playback controls and does not loop. The page includes active section navigation, theme-aware scrollbars, release resource cards, and a stable desktop FAQ with native answer dialogs on mobile.

## Repository structure

- `app/`: routes, metadata and styles
- `sections/`: landing page
- `components/`: film player, shared dragon and authentic installer walkthrough
- `data/`, `lib/`: brand data and strict release resolver
- `public/assets/`: approved branding, fonts, sprites and sanitized installer images
- `tests/`: browser regression and release-selection tests

Private references, local reports, build outputs, executable files and credentials are excluded. Do not add Windows application source to this repository.

## Official downloads

The server requests the public GitHub `/repos/Paim41/CyraInstaller/releases/latest` endpoint. The page and fetch revalidate after 300 seconds, on subsequent traffic, without a new deployment. Only a non-draft, non-prerelease `vX.Y.Z` release with the exact uploaded `Cyra-Setup-vX.Y.Z.exe` filename, approved EXE MIME type, positive size and official download URL enables the direct download. Missing/invalid metadata, timeouts and API errors show a releases-page fallback. No GitHub token is required or exposed.

Release metadata validates the download's identity, not its cryptographic authenticity. The published SHA256SUMS.txt provides byte verification. The website does not host installer binaries. To release a future version, build/test the Windows application privately, publish a stable versioned installer and checksum in CyraInstaller, and allow the website's revalidation interval to elapse.

## Vercel

Connect `Paim41/Cyra`, production branch `main`, repository root, Next.js framework. Install with `npm ci`; build with `npm run build`. Git integration deploys future pushes. Do not connect CyraInstaller as the website project.

Optional environment: `NEXT_PUBLIC_SITE_URL` is the actual public HTTPS site URL for canonical/social metadata. Set it only after deployment confirms the domain. `NEXT_PUBLIC_FIGMA_CAPTURE=1` is a local development-only design capture toggle; it is never loaded in production. No secret variables are required.

## Licensing

No blanket license for the original website code or branding has been selected; do not infer one. Preserve upstream notices in `public/assets/UPSTREAM-LICENSE.txt` and the bundled font notices. Cyra derives from Gili by Maulana (MIT); distribution notices accompany the Windows installer. Third-party packages retain their own licenses. Brand and mascot assets are supplied for Cyra.
