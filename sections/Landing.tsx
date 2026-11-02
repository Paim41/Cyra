"use client";
import { createContext, useContext, useState } from "react";
import Image from "next/image";
import { Download, Check, FileText, ImageIcon, Link } from "lucide-react";
import { FAQ } from "@/components/FAQ";
import { SectionReveals } from "@/components/SectionReveals";
import { SiteHeader, SocialLink } from "@/components/SiteHeader";
import { ReleaseCards } from "@/components/ReleaseCards";
import { PromoFilm } from "@/components/PromoFilm";
import { Mascot } from "@/components/Mascot";
import { InstallerShowcase } from "@/components/InstallerShowcase";
import { motion, MotionConfig } from "motion/react";
import { release as fallbackRelease, type Release } from "@/data/release";
const ReleaseContext = createContext(fallbackRelease);
const features = [
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
] as const;
function DownloadLink() {
  const release = useContext(ReleaseContext);
  return (
    <a
      className="button primary"
      href={
        release.available && release.installerUrl
          ? release.installerUrl
          : "#download"
      }
    >
      <Download size={18} aria-hidden="true" /> Download Cyra for Windows
    </a>
  );
}
function Content() {
  const release = useContext(ReleaseContext);
  const [light, setLight] = useState(false);
  return (
    <div className={`site ${light ? "site-light" : ""}`}>
      <SectionReveals />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader light={light} onTheme={() => setLight(!light)} />
      <main id="main">
        <section className="hero wrap">
          <div className="eyebrow">
            <span />
            INTRODUCING CYRA
          </div>
          <div className="hero-heading">
            <h1>
              Your desktop,
              <br />
              <em>reimagined.</em>
            </h1>
            <div className="hero-aside">
              <p>Music, focus and everyday tools.</p>
              <p className="muted">Right at the top of Windows.</p>
              <DownloadLink />
              <a className="text-link" href="#film">
                See Cyra in motion
              </a>
            </div>
          </div>
          <PromoFilm />
          <div className="trust-line">
            <span>
              <Check size={14} />
              Windows 10 & 11
            </span>
            <span>
              <Check size={14} />
              No account needed
            </span>
            <span>
              <Check size={14} />
              Made to feel like yours
            </span>
          </div>
        </section>
        <section className="features wrap section" id="features">
          <div className="section-heading">
            <div>
              <p className="eyebrow">BUILT FOR YOUR ROUTINE</p>
              <h2>Everything within reach.</h2>
            </div>
            <p>
              Not another dashboard to manage.
              <br />
              Just the things you reach for, right where you need them.
            </p>
          </div>
          <div className="editorial-rows">
            {features.map(([title, description], i) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </motion.article>
            ))}
          </div>
          <div className="feature-cards">
            <article>
              <span className="eyebrow">SYSTEM MONITOR</span>
              <h3>Know your system.</h3>
              <p>
                CPU, memory, disk and network activity — without losing your
                place.
              </p>
              <div className="system-illustration" aria-hidden="true">
                {[
                  ["CPU", 28],
                  ["RAM", 48],
                  ["DISK", 36],
                ].map(([label, value]) => (
                  <div className="system-gauge" key={label}>
                    <div>
                      <svg viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          className="gauge-track"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          className="gauge-value"
                          pathLength="100"
                          strokeDasharray={`${value} 100`}
                        />
                      </svg>
                      <b>
                        {value}
                        <small>%</small>
                      </b>
                    </div>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <small>Illustrative values</small>
            </article>
            <article className="clipboard-story">
              <span className="eyebrow">CLIPBOARD</span>
              <h3>Pick up where you left off.</h3>
              <p>Copy once. Pick it up when you need it.</p>
              <div
                className="clipboard-preview"
                aria-label="Illustrative clipboard entries"
              >
                <div>
                  <span className="clip-thumbnail">
                    <FileText size={18} aria-hidden="true" />
                  </span>
                  <span>
                    Ideas for tomorrow<small>Text · Just copied</small>
                  </span>
                </div>
                <div>
                  <span className="clip-thumbnail image">
                    <ImageIcon size={18} aria-hidden="true" />
                  </span>
                  <span>
                    A moment worth keeping<small>Image · Earlier</small>
                  </span>
                </div>
                <div>
                  <span className="clip-thumbnail">
                    <Link size={18} aria-hidden="true" />
                  </span>
                  <span>
                    Back to that good read<small>Link · Earlier</small>
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>
        <InstallerShowcase />
        <section className="download section" id="download">
          <div className="wrap download-inner">
            <Mascot large theme={light ? "light" : "dark"} />
            <p className="eyebrow">AVAILABLE FOR WINDOWS</p>
            <h2>
              Ready to meet <em>Cyra?</em>
            </h2>
            <p>Cyra for Windows 10 & 11 · x64</p>
            {release.available && release.installerUrl ? (
              <div className="release-actions">
                <DownloadLink />
                <ReleaseCards release={release} />
                {release.portableUrl && (
                  <a className="button" href={release.portableUrl}>
                    Portable ZIP
                  </a>
                )}
              </div>
            ) : (
              <>
                <span className="release-status">
                  Installer temporarily unavailable
                </span>
                <a
                  className="button primary"
                  href={release.releases}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View All Releases
                </a>
              </>
            )}
            <small>
              {release.available && release.installerUrl ? (
                <>
                  {release.version && `Cyra ${release.version}`}
                  {release.installerBytes &&
                    ` · ${(release.installerBytes / 1048576).toFixed(1)} MB installer`}
                </>
              ) : (
                <>
                  The latest installer could not be verified on{" "}
                  {release.checkedAt}.<br />
                  Please check Official Releases for current availability.
                </>
              )}
            </small>
          </div>
        </section>
        <FAQ />
      </main>
      <footer className="footer wrap">
        <a className="brand" href="#">
          <Image
            src="/assets/branding/cyra.png"
            alt=""
            width={28}
            height={30}
            sizes="28px"
          />
          cyra
        </a>
        <p>
          A companion for Windows.
          <br />
          <small>Designed by Paim.</small>
        </p>
        <div>
          <SocialLink kind="github" href={release.websiteRepository} />
          <a href={release.repository}>Official Installer Repository</a>
          <SocialLink
            kind="linkedin"
            href="https://www.linkedin.com/in/paim41/"
          />
          <a href="/assets/UPSTREAM-LICENSE.txt">Gili · MIT notices</a>
        </div>
        <small>© {new Date().getFullYear()} Paim. Cyra.</small>
      </footer>
    </div>
  );
}
export function Landing({
  latestRelease = fallbackRelease,
}: {
  latestRelease?: Release;
}) {
  return (
    <ReleaseContext.Provider value={latestRelease}>
      <MotionConfig reducedMotion="user">
        <Content />
      </MotionConfig>
    </ReleaseContext.Provider>
  );
}
