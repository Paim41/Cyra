"use client";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  Music2,
  Timer,
  Moon,
  Activity,
  Bell,
  Clipboard,
  GraduationCap,
  Settings,
  GripHorizontal,
  Volume2,
  Wifi,
} from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import { useDemo } from "./DemoState";
import { Mascot } from "./Mascot";
import { Panel } from "./Panels";
import { Battery, PowerBolt } from "./Battery";
import { tabs, widths, compactWidths } from "@/lib/product";
const icons = [
  Music2,
  Timer,
  Moon,
  Activity,
  Bell,
  Clipboard,
  GraduationCap,
  Settings,
];
export function CyraDesktop() {
  const id = "desktop-demo";
  const d = useDemo(),
    stage = useRef<HTMLDivElement>(null),
    shell = useRef<HTMLDivElement>(null),
    inView = useInView(stage, { amount: 0.1 }),
    reduced = useReducedMotion();
  const [stageWidth, setStageWidth] = useState(1000),
    [visible, setVisible] = useState(true),
    [height, setHeight] = useState(40),
    [dragging, setDragging] = useState(false);
  const pointer = useRef<{
      x: number;
      y: number;
      position: number;
      kind: "move" | "swipe";
    } | null>(null),
    hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null),
    leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  };
  useEffect(() => () => clearHover(), []);
  const expanded = d.expanded,
    tab = d.tab,
    edge = d.edge;
  const fit = 1;
  const naturalWidth = expanded ? widths[d.size] : compactWidths[d.size],
    width = edge ? 100 : Math.min(stageWidth - 24, naturalWidth);
  useEffect(() => {
    const fn = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", fn);
    return () => document.removeEventListener("visibilitychange", fn);
  }, []);
  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const observer = new ResizeObserver(() => {
      setStageWidth(node.clientWidth);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [d.size]);
  useEffect(() => {
    const node = shell.current;
    if (!node) return;
    const observer = new ResizeObserver(() => setHeight(node.offsetHeight));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const active = inView && visible;
  const { setActivity } = d;
  useEffect(() => {
    setActivity((a) => ({ ...a, [id]: active }));
    return () => setActivity((a) => ({ ...a, [id]: false }));
  }, [id, active, setActivity]);
  function start(e: PointerEvent<HTMLDivElement>) {
    clearHover();
    if (e.button !== 0) return;
    const el = e.target as HTMLElement;
    // Preserve native scrollbar dragging inside long Education/settings panels.
    const bounds = el.getBoundingClientRect();
    if (el.scrollHeight > el.clientHeight && e.clientX >= bounds.right - 14)
      return;
    if (el.closest("button,input,a,label,select,form,[data-no-swipe]")) return;
    const move = !!el.closest("[data-move]");
    if (move && d.locked) return;
    if (!move && !expanded) return;
    pointer.current = {
      x: e.clientX,
      y: e.clientY,
      position: d.position,
      kind: move ? "move" : "swipe",
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  }
  function drag(e: PointerEvent<HTMLDivElement>) {
    const p = pointer.current;
    if (!p) return;
    const dx = e.clientX - p.x,
      dy = e.clientY - p.y;
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 14) {
      pointer.current = null;
      setDragging(false);
      return;
    }
    if (p.kind === "move") {
      const max = Math.max(
        0,
        ((stage.current?.clientWidth ?? 0) - width * fit) / 2 - 16,
      );
      d.setPosition(Math.max(-max, Math.min(max, p.position + dx)));
    }
  }
  function end(e: PointerEvent<HTMLDivElement>) {
    const p = pointer.current;
    pointer.current = null;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
    if (!p || p.kind === "move") return;
    const dx = e.clientX - p.x,
      dy = e.clientY - p.y;
    if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.3)
      d.setTab((d.tab + (dx < 0 ? 1 : 7)) % 8);
  }
  const h = edge ? 6 : height,
    r = expanded ? 30 : 13;
  const shape = `M -11 0 H ${width + 11} Q ${width} 0 ${width} 11 V ${h - r} Q ${width} ${h} ${width - r} ${h} H ${r} Q 0 ${h} 0 ${h - r} V 11 Q 0 0 -11 0 Z`;
  return (
    <div className="desktop-experience" data-demo-theme={d.theme} id={id}>
      <div className="desktop-stage" ref={stage}>
        <div className="desktop-wallpaper" aria-hidden="true">
          <div className="wallpaper-orbit orbit-one" />
          <div className="wallpaper-orbit orbit-two" />
          <div className="wallpaper-orbit orbit-three" />
        </div>
        <div
          className="notch-position"
          style={{
            transform: `translateX(calc(-50% + ${Math.max(-Math.max(0, (stageWidth - width * fit) / 2 - 16), Math.min(Math.max(0, (stageWidth - width * fit) / 2 - 16), d.position))}px))`,
            top: d.mode === "floating" ? 10 : 0,
            width: width * fit,
          }}
        >
          <div
            ref={shell}
            className={`cyra-shell ${expanded ? "expanded" : "compact"} ${d.mode} ${edge ? "edge-line" : ""} ${dragging ? "dragging" : ""}`}
            style={{ width }}
            data-size={d.size}
            data-signature-motion={d.preferences.signature}
            data-edge-hint={d.preferences.edgeHint}
            onPointerDown={start}
            onPointerMove={drag}
            onPointerUp={end}
            onPointerCancel={() => {
              pointer.current = null;
              setDragging(false);
            }}
            onLostPointerCapture={() => {
              pointer.current = null;
              setDragging(false);
            }}
            onDoubleClick={(e) => {
              if (!(e.target as HTMLElement).closest("button,input,a")) {
                d.setEdge(true);
                d.setExpanded(false);
              }
            }}
            onPointerEnter={(e) => {
              clearHover();
              if (
                e.pointerType !== "touch" &&
                d.hoverOpen &&
                !edge &&
                !expanded
              )
                hoverTimer.current = setTimeout(() => d.setExpanded(true), 350);
            }}
            onPointerLeave={(e) => {
              clearHover();
              if (e.pointerType === "touch") return;
              leaveTimer.current = setTimeout(() => {
                const el = shell.current;
                if (
                  !pointer.current &&
                  el &&
                  !(
                    el.contains(document.activeElement) &&
                    document.activeElement?.matches(
                      "input,textarea,select,:focus-visible",
                    )
                  )
                )
                  d.setExpanded(false);
              }, 320);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                clearHover();
                d.setExpanded(false);
                requestAnimationFrame(() =>
                  shell.current
                    ?.querySelector<HTMLButtonElement>(".compact-open")
                    ?.focus(),
                );
              }
            }}
            onBlur={(e) => {
              if (
                !e.currentTarget.contains(e.relatedTarget as Node | null) &&
                !e.currentTarget.matches(":hover")
              ) {
                clearHover();
                leaveTimer.current = setTimeout(
                  () => d.setExpanded(false),
                  320,
                );
              }
            }}
          >
            {d.mode === "notch" && !edge && (
              <svg
                className="notch-shape"
                viewBox={`-11 0 ${width + 22} ${h}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d={shape} />
              </svg>
            )}
            {edge ? (
              <button
                aria-label="Restore Cyra from Edge Line"
                className="edge-restore"
                onClick={() => d.setEdge(false)}
              />
            ) : expanded ? (
              <>
                <div
                  className="cyra-nav"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      clearHover();
                      d.setExpanded(false);
                    }
                  }}
                >
                  <div
                    className="nav-tabs"
                    role="tablist"
                    aria-label="Cyra features"
                  >
                    <span
                      className="nav-indicator"
                      style={{ transform: `translateX(${tab * 100}%)` }}
                    />
                    {tabs.map((label, i) => {
                      const Icon = icons[i];
                      return (
                        <button
                          key={label}
                          role="tab"
                          tabIndex={tab === i ? 0 : -1}
                          onKeyDown={(e) => {
                            const next =
                              e.key === "ArrowRight"
                                ? (i + 1) % 8
                                : e.key === "ArrowLeft"
                                  ? (i + 7) % 8
                                  : e.key === "Home"
                                    ? 0
                                    : e.key === "End"
                                      ? 7
                                      : null;
                            if (next !== null) {
                              e.preventDefault();
                              d.setTab(next);
                              (
                                e.currentTarget.parentElement?.querySelectorAll(
                                  "button",
                                )[next] as HTMLButtonElement
                              )?.focus();
                            }
                          }}
                          aria-label={label}
                          aria-selected={tab === i}
                          title={label}
                          onClick={() => {
                            clearHover();
                            d.setTab(i);
                          }}
                        >
                          <Icon size={14} />
                          {i === 4 &&
                            d.preferences.notifications &&
                            d.notifications.length > 0 && (
                              <i className="unread-dot" />
                            )}
                        </button>
                      );
                    })}
                  </div>
                  {d.mascot && (
                    <Mascot theme={d.theme} active={active && !reduced} />
                  )}
                  <span className="nav-time">
                    22:33{" "}
                    <button
                      className="power-status"
                      aria-label="Battery status: 93%, charging"
                      onClick={() => d.setTab(3)}
                    >
                      <PowerBolt />
                    </button>
                  </span>
                </div>
                {
                  <div
                    className={`move-handle ${d.locked ? "locked" : ""}`}
                    data-move="true"
                    role="slider"
                    tabIndex={d.locked ? -1 : 0}
                    aria-disabled={d.locked}
                    aria-label="Notch horizontal position"
                    aria-valuenow={Math.round(d.position)}
                    aria-valuemin={-200}
                    aria-valuemax={200}
                    onKeyDown={(e) => {
                      if (d.locked) return;
                      if (e.key === "ArrowLeft")
                        d.setPosition(Math.max(-200, d.position - 10));
                      if (e.key === "ArrowRight")
                        d.setPosition(Math.min(200, d.position + 10));
                      if (e.key === "Home") d.setPosition(0);
                    }}
                  >
                    <GripHorizontal size={20} />
                  </div>
                }
                <div
                  key={tab}
                  className="cyra-panel"
                  role="tabpanel"
                  aria-label={tabs[tab]}
                >
                  <Panel tab={tab} />
                </div>
                <div
                  className={`swipe-handle ${tab === 6 ? "" : "subtle"}`}
                  aria-hidden="true"
                >
                  <span />
                </div>
              </>
            ) : (
              <div
                className="compact-content"
                data-move={!d.locked ? "true" : undefined}
              >
                {!d.locked && (
                  <div
                    className="compact-grip"
                    data-move="true"
                    title="Drag to move Cyra"
                  >
                    <GripHorizontal size={14} />
                  </div>
                )}
                <button
                  className="compact-open"
                  onClick={() => {
                    clearHover();
                    d.setExpanded(true);
                  }}
                >
                  <span className="sr-only">Expand Cyra </span>
                  <b>10:09</b>
                  <span
                    className={`battery-group ${d.size === "s" ? "small-hidden" : ""}`}
                  >
                    <Battery level={93} />
                    {d.size !== "s" && <small>93%</small>}
                  </span>
                  <span className="compact-prayer">
                    <em>Subuh</em>
                    <span>7h 34m</span>
                  </span>
                  {d.size !== "s" && (
                    <span className="signature">{d.name}</span>
                  )}
                </button>
                {d.mascot && (
                  <Mascot theme={d.theme} active={active && !reduced} />
                )}{" "}
                {d.playing && d.size !== "s" && (
                  <span className="equalizer" aria-label="Demo music playing">
                    <i />
                    <i />
                    <i />
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="desktop-taskbar" aria-hidden="true">
          <div className="windows-mark">
            <i />
            <i />
            <i />
            <i />
          </div>
          <span className="taskbar-search">Search your world</span>
          <FolderIcon />
          <Music2 size={19} />
          <span className="taskbar-right">
            <Wifi size={16} />
            <Volume2 size={16} />
            10:09
          </span>
        </div>
      </div>
    </div>
  );
}
function FolderIcon() {
  return <span className="taskbar-folder" aria-hidden="true" />;
}
