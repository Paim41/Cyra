"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";
const links = [
  ["features", "Features"],
  ["film", "Watch Cyra"],
  ["installation", "Installation"],
] as const;
export function SocialLink({
  kind,
  href,
}: {
  kind: "github" | "linkedin";
  href: string;
}) {
  const label = kind === "github" ? "Website on GitHub" : "LinkedIn";
  return (
    <a
      className="social-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
      >
        {kind === "github" ? (
          <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.08c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.71 2.63 1.22 3.27.93.1-.72.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.57 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.43.11-2.98 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.61 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.55.23 2.69.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.33-2.63 5.28-5.14 5.56.4.35.76 1.03.76 2.08v3.09c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8Z" />
        ) : (
          <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.45 7.89a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.3 10.86H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.4-.75 1.36-1.55 2.79-1.55 2.98 0 3.58 1.96 3.58 4.5v5.3Z" />
        )}
      </svg>
      <span className="social-tooltip" aria-hidden="true">
        {label}
      </span>
    </a>
  );
}
export function SiteHeader({
  light,
  onTheme,
  repository,
}: {
  light: boolean;
  onTheme: () => void;
  repository: string;
}) {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    document.documentElement.dataset.theme = light ? "light" : "dark";
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [light]);
  useEffect(() => {
    const nodes = links
      .map(([id]) => document.getElementById(id))
      .filter((n): n is HTMLElement => !!n);
    const update = () => {
      const line = Math.max(
        (header.current?.offsetHeight || 84) + 120,
        innerHeight * 0.35,
      );
      const match = nodes.find((n) => {
        const r = n.getBoundingClientRect();
        return r.top <= line && r.bottom > line;
      });
      setActive(match?.id || "");
    };
    let observer: IntersectionObserver;
    const observe = () => {
      observer?.disconnect();
      const top = Math.max(
        (header.current?.offsetHeight || 84) + 120,
        innerHeight * 0.35,
      );
      observer = new IntersectionObserver(update, {
        rootMargin: `-${top}px 0px -${Math.max(0, innerHeight - top - 1)}px 0px`,
      });
      nodes.forEach((n) => observer.observe(n));
      update();
    };
    const resize = new ResizeObserver(observe);
    if (header.current) resize.observe(header.current);
    window.addEventListener("resize", observe);
    const hash = () => {
      const id = location.hash.slice(1);
      if (links.some(([key]) => key === id)) setActive(id);
    };
    const sentinel = document.getElementById("header-sentinel");
    const frost = new IntersectionObserver(([e]) =>
      setScrolled(!e.isIntersecting),
    );
    if (sentinel) frost.observe(sentinel);
    observe();
    hash();
    window.addEventListener("hashchange", hash);
    return () => {
      observer.disconnect();
      frost.disconnect();
      resize.disconnect();
      window.removeEventListener("resize", observe);
      window.removeEventListener("hashchange", hash);
    };
  }, []);
  return (
    <>
      <div id="header-sentinel" aria-hidden="true" />
      <header
        ref={header}
        className={`header ${scrolled ? "is-scrolled" : ""}`}
        onKeyDown={(e) => {
          if (e.key === "Escape" && menu) {
            setMenu(false);
            toggle.current?.focus();
          }
        }}
      >
        <a className="brand" href="#">
          <Image
            src="/assets/branding/cyra.png"
            alt=""
            width={28}
            height={30}
          />
          cyra <span>FOR WINDOWS</span>
        </a>
        <nav
          id="primary-navigation"
          aria-label="Main navigation"
          className={menu ? "open" : ""}
        >
          {links.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              onClick={() => {
                setActive(id);
                setMenu(false);
              }}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <SocialLink kind="github" href={repository} />
          <SocialLink
            kind="linkedin"
            href="https://www.linkedin.com/in/paim41/"
          />
          <button aria-label="Toggle website appearance" onClick={onTheme}>
            {light ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <a className="button small" href="#download">
            Get Cyra <ArrowUpRight size={15} />
          </a>
          <button
            ref={toggle}
            className="mobile-menu"
            aria-label="Toggle navigation"
            aria-controls="primary-navigation"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  );
}
