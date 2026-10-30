"use client";
import { createContext, useContext, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ArrowDown, Sun, Moon, Menu, Check } from "lucide-react";
import { DemoProvider } from "@/components/demo/DemoState";
import { CyraDesktop } from "@/components/demo/CyraDesktop";
import { Mascot } from "@/components/demo/Mascot";
import { InstallerShowcase } from "@/components/InstallerShowcase";
import { motion } from "motion/react";
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
      Download Cyra for Windows <ArrowUpRight size={18} />
    </a>
  );
}
function Content() {
  const release = useContext(ReleaseContext);
  const [light, setLight] = useState(false),
    [menu, setMenu] = useState(false);
  return (
    <div className={`site ${light ? "site-light" : ""}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header">
        <a className="brand" href="#" aria-label="Cyra home">
          <Image
            src="/assets/branding/cyra.png"
            alt=""
            width={28}
            height={30}
            sizes="28px"
          />
          cyra<span>FOR WINDOWS</span>
        </a>
        <nav
          className={menu ? "open" : ""}
          aria-label="Main navigation"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setMenu(false);
          }}
        >
          <a href="#features">Features</a>
          <a href="#demo">Try Cyra</a>
          <a
            href={release.websiteRepository}
            target="_blank"
            rel="noopener noreferrer"
          >
            Website on GitHub <ArrowUpRight size={13} />
          </a>
        </nav>
        <div className="header-actions">
          <button
            aria-label="Toggle website appearance"
            onClick={() => setLight(!light)}
          >
            {light ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <a className="button small" href="#download">
            Get Cyra <ArrowUpRight size={15} />
          </a>
          <button
            className="mobile-menu"
            aria-label="Toggle navigation"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            <Menu />
          </button>
        </div>
      </header>
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
              <p>
                Your everyday essentials.
                <br />
                One quiet little space.
              </p>
              <p className="muted">
                Meet Cyra — a personal companion that brings music, focus and
                the moments that matter to the edge of your Windows desktop.
              </p>
              <DownloadLink />
              <a className="text-link" href="#demo">
                Try it right here <ArrowDown size={15} />
              </a>
            </div>
          </div>
          <div className="hero-demo" id="demo">
            <div className="section-kicker">
              <span>01 / MEET YOUR NEW LITTLE SPACE</span>
              <span>TRY CYRA ↘</span>
            </div>
            <CyraDesktop />
          </div>
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
              <p className="eyebrow">LESS SWITCHING. MORE LIVING.</p>
              <h2>
                Small on your screen.
                <br />
                Big on the everyday.
              </h2>
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
                transition={{ duration: 0.3 }}
              >
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </motion.article>
            ))}
          </div>
          <div className="feature-cards">
            <article>
              <span className="eyebrow">A LITTLE MORE AWARE</span>
              <h3>Your system. At a glance.</h3>
              <p>
                CPU, memory, disk and network activity — without losing your
                place.
              </p>
              <div className="stat-art" aria-hidden="true">
                <div>
                  <b>
                    28<small>%</small>
                  </b>
                  <span>CPU</span>
                </div>
                <div>
                  <b>
                    48<small>%</small>
                  </b>
                  <span>RAM</span>
                </div>
                <div>
                  <b>
                    36<small>%</small>
                  </b>
                  <span>DISK</span>
                </div>
              </div>
              <small>Illustrative values</small>
            </article>
            <article className="clipboard-story">
              <span className="eyebrow">CLIPBOARD</span>
              <h3>Keep it close.</h3>
              <p>Copy once. Pick it up when you need it.</p>
              <div className="clipboard-composition" aria-hidden="true">
                <span className="clip-sheet back" />
                <span className="clip-sheet front">
                  <i />
                  <i />
                  <i />
                  <Check size={18} />
                </span>
              </div>
            </article>
          </div>
        </section>
        <InstallerShowcase />
        <section className="download section" id="download">
          <div className="wrap download-inner">
            <Mascot large theme={light ? "light" : "dark"} />
            <p className="eyebrow">YOUR DESKTOP. A LITTLE MORE CONSIDERED.</p>
            <h2>
              Make room
              <br />
              for a better <em>flow.</em>
            </h2>
            <p>Cyra for Windows 10 & 11 · x64</p>
            {release.available && release.installerUrl ? (
              <div className="release-actions">
                <DownloadLink />
                <a className="text-link" href={release.releases}>
                  View All Releases
                </a>
                {release.checksumUrl && (
                  <a className="text-link" href={release.checksumUrl}>
                    SHA-256 checksum
                  </a>
                )}
                {release.portableUrl && (
                  <a className="button" href={release.portableUrl}>
                    Portable ZIP <ArrowUpRight size={16} />
                  </a>
                )}
                {release.notesUrl && (
                  <a className="text-link" href={release.notesUrl}>
                    Release notes <ArrowUpRight size={14} />
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
                  View All Releases <ArrowUpRight size={18} />
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
        <section className="faq wrap section">
          <div>
            <p className="eyebrow">A FEW GOOD QUESTIONS</p>
            <h2>
              Little details.
              <br />
              Clear answers.
            </h2>
          </div>
          <div>
            {[
              [
                "Can I move the notch?",
                "Yes. Unlock the position in the demo Settings, then drag the small grip horizontally. Use Center to reset it.",
              ],
              [
                "What is the difference between Notch and Floating Island?",
                "Notch meets the top edge of the desktop. Floating Island sits slightly below it with a fully rounded outline. Both share the same features and state.",
              ],
              [
                "Is Cyra free and lightweight?",
                "Cyra builds on MIT-licensed Gili. The native application avoids a browser engine for its main interface. Resource use depends on active features; this page makes no unmeasured performance claims.",
              ],
              [
                "How do I uninstall Cyra?",
                "Use Windows Settings → Apps → Installed apps, select Cyra and choose Uninstall.",
              ],
              [
                "What is Cyra?",
                "Cyra is a Windows desktop companion developed from Gili. It brings media, focus, prayer times, system information, notifications, clipboard and Education into one compact space.",
              ],
              [
                "Is this demo the real Windows app?",
                "This is an interactive browser simulation. It uses sample data and never reads your notifications, hardware, media sessions or clipboard history.",
              ],
              [
                "Which Windows versions are supported?",
                "The installer targets x64 Windows 10 build 17763 or newer, including Windows 11. Individual devices and Windows configurations still need real-world testing.",
              ],
              [
                "Do I need an account?",
                "Cyra does not require a Cyra account. University portals and other external services may require their own sign-in.",
              ],
              [
                "Does the demo upload or convert my files?",
                "No. The demo only displays a selected file name and simulates processing. Real file operations happen in the Windows application.",
              ],
              [
                "Can I personalize it?",
                "Yes. Explore Dark and Light themes, Small/Medium/Large sizes, notch or floating mode, and your personal name in the demo.",
              ],
              [
                "Does Cyra work offline?",
                "Local functions can work offline. Live prayer data, university websites and other network-dependent services require an internet connection.",
              ],
              [
                "Where can I download Cyra?",
                "Download the latest verified stable installer from Official Releases. The button updates automatically; if release metadata is unavailable, use the releases-page link.",
              ],
              [
                "Who makes Cyra?",
                "Cyra is developed by Paim, building on Gili. Original MIT license and author notices are preserved.",
              ],
              [
                "Does the page respect reduced motion?",
                "Yes. Reduced-motion preferences disable decorative animation. Demo timers pause when their panel is not visible.",
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
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
          A little space. A better flow.
          <br />
          <small>Designed by Paim.</small>
        </p>
        <div>
          <a href={release.websiteRepository}>Website on GitHub</a>
          <a href={release.repository}>Official Installer Repository</a>
          <a href="https://www.linkedin.com/in/paim41/">LinkedIn</a>
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
      <DemoProvider>
        <Content />
      </DemoProvider>
    </ReleaseContext.Provider>
  );
}
