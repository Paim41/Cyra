"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Sun,
  Moon,
  Menu,
  X,
  Download,
  Play,
  Layers,
  Package,
  CircleHelp,
} from "lucide-react";
import { sections } from "@/data/sections";
import { motion } from "motion/react";
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
}: {
  light: boolean;
  onTheme: () => void;
}) {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    document.documentElement.dataset.theme = light ? "light" : "dark";
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [light]);
  useEffect(() => {
    const nodes = sections
      .map(({ id }) => document.getElementById(id))
      .filter((n): n is HTMLElement => !!n);
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = (header.current?.offsetHeight || 84) + 32;
      let next = "";
      for (const n of nodes) {
        if (n.getBoundingClientRect().top <= line) next = n.id;
        else break;
      }
      if (
        scrollY > 0 &&
        scrollY + innerHeight >= document.documentElement.scrollHeight - 3
      )
        next = "faq";
      setActive((previous) => (previous === next ? previous : next));
      setScrolled((previous) =>
        previous === scrollY > 4 ? previous : scrollY > 4,
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const hash = () => {
      const id = location.hash.slice(1);
      if (sections.some((s) => s.id === id)) setActive(id);
      schedule();
    };
    const resize = new ResizeObserver(schedule);
    nodes.forEach((n) => resize.observe(n));
    if (header.current) resize.observe(header.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", hash);
    hash();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", hash);
    };
  }, []);
  useEffect(() => {
    const wide = matchMedia("(min-width: 701px)");
    const close = () => {
      if (wide.matches) panel.current?.close();
    };
    wide.addEventListener("change", close);
    return () => wide.removeEventListener("change", close);
  }, []);
  const icons = [Play, Layers, Package, Download, CircleHelp];
  function close() {
    panel.current?.close();
  }
  function select(id: string) {
    setActive(id);
    close();
  }
  return (
    <>
      <header
        ref={header}
        className={`header ${scrolled ? "is-scrolled" : ""}`}
      >
        <a className="brand" href="#" aria-label="Cyra for Windows home">
          <Image
            src="/assets/branding/cyra.png"
            alt=""
            width={28}
            height={30}
          />
          cyra <span>FOR WINDOWS</span>
        </a>
        <nav className="desktop-navigation" aria-label="Main navigation">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              onClick={() => setActive(id)}
            >
              {label}
              {active === id && (
                <motion.span
                  className="liquid-underline"
                  layoutId="section-underline"
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  aria-hidden="true"
                />
              )}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button aria-label="Toggle website appearance" onClick={onTheme}>
            {light ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <a className="button small header-download" href="#download">
            Get Cyra
          </a>
          <button
            ref={toggle}
            className="mobile-menu"
            aria-label="Toggle navigation"
            aria-haspopup="dialog"
            aria-controls="mobile-navigation"
            aria-expanded={menu}
            onClick={() => {
              if (panel.current?.open) close();
              else {
                const pageTop = window.scrollY;
                setMenu(true);
                panel.current?.showModal();
                window.scrollTo({ top: pageTop, behavior: "instant" });
              }
            }}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <dialog
        ref={panel}
        id="mobile-navigation"
        className="mobile-nav-panel"
        aria-label="Navigation"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled])",
          );
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
        onClose={() => {
          setMenu(false);
          toggle.current?.focus({ preventScroll: true });
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            const r = e.currentTarget.getBoundingClientRect();
            if (
              e.clientX < r.left ||
              e.clientX > r.right ||
              e.clientY < r.top ||
              e.clientY > r.bottom
            )
              close();
          }
        }}
      >
        <button
          className="dialog-close"
          aria-label="Close navigation"
          onClick={close}
          autoFocus
        >
          <X size={20} />
        </button>
        <nav aria-label="Mobile navigation">
          {sections.map(({ id, label }, i) => {
            const Icon = icons[i];
            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active === id ? "location" : undefined}
                onClick={() => select(id)}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
                <span className="nav-dot" aria-hidden="true" />
              </a>
            );
          })}
        </nav>
        <a
          className="button primary"
          href="#download"
          onClick={() => select("download")}
        >
          <Download size={17} aria-hidden="true" />
          Get Cyra for Windows
        </a>
      </dialog>
    </>
  );
}
