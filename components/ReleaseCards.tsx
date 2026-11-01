import { Package, ShieldCheck, ScrollText, ArrowUpRight } from "lucide-react";
import type { Release } from "@/data/release";
export function ReleaseCards({ release }: { release: Release }) {
  return (
    <div className="release-cards">
      {[
        {
          title: "All Releases",
          description: "Browse versions",
          href: release.releases,
          Icon: Package,
        },
        {
          title: "SHA-256",
          description: "Verify download",
          href: release.checksumUrl,
          Icon: ShieldCheck,
        },
        {
          title: "Release Notes",
          description: "See what's new",
          href: release.notesUrl,
          Icon: ScrollText,
        },
      ].map(({ title, description, href, Icon }) =>
        href ? (
          <a className="release-card" key={title} href={href}>
            <Icon size={20} aria-hidden="true" />
            <span>
              <strong>{title}</strong>
              <span>{description}</span>
            </span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        ) : (
          <div className="release-card unavailable" key={title}>
            <Icon size={20} aria-hidden="true" />
            <span>
              <strong>{title}</strong>
              <span>Not provided for this release</span>
            </span>
          </div>
        ),
      )}
    </div>
  );
}
