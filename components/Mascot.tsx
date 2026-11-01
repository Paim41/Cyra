"use client";
import { useEffect, useState, useRef, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "motion/react";
import manifest from "@/data/mascot.json";
export function Mascot({
  theme = "dark",
  active = true,
  large = false,
}: {
  theme?: "dark" | "light";
  active?: boolean;
  large?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null),
    eye = useRef<HTMLImageElement>(null),
    inView = useInView(ref),
    reduced = useReducedMotion();
  const [visible, setVisible] = useState(true),
    [reaction, setReaction] = useState<
      "idle" | "happy" | "hover" | "blink" | "sleep"
    >("idle");
  active = active && inView && !reduced && visible;
  useEffect(() => {
    const visibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);
  useEffect(() => {
    if (!active) return;
    const tick = setInterval(
      () => setReaction((r) => (r === "idle" ? "blink" : r)),
      7000,
    );
    const sleep = setTimeout(
      () => setReaction((r) => (r === "idle" ? "sleep" : r)),
      45000,
    );
    return () => {
      clearInterval(tick);
      clearTimeout(sleep);
    };
  }, [active]);
  useEffect(() => {
    if (!["blink", "happy"].includes(reaction)) return;
    const timer = setTimeout(
      () => setReaction("idle"),
      reaction === "blink" ? 670 : 1000,
    );
    return () => clearTimeout(timer);
  }, [reaction]);
  const state = reaction,
    sprite = manifest.sprites[state];
  const tracking = state === "hover" && !reduced;
  return (
    <button
      ref={ref}
      type="button"
      className={`mascot ${large ? "large" : ""}`}
      aria-label="Say hello to the Cyra dragon"
      onClick={(e) => {
        e.stopPropagation();
        setReaction("happy");
      }}
      onPointerEnter={() => setReaction("hover")}
      onPointerLeave={() => setReaction("idle")}
      onPointerMove={(e) => {
        if (!eye.current || !active) return;
        const box = e.currentTarget.getBoundingClientRect();
        eye.current.style.transform = `translate(${(Math.max(-1, Math.min(1, (e.clientX - box.x - box.width / 2) / 120)) * box.width) / 64}px,${(Math.max(-1, Math.min(1, (e.clientY - box.y - box.height / 2) / 100)) * box.height) / 64}px)`;
      }}
    >
      {tracking ? (
        <span className="dragon-tracking">
          <img
            src={`/assets/mascot/${theme}/cyra_body_base_no_eye.png`}
            alt="Official Cyra dragon"
          />
          <img
            ref={eye}
            src={`/assets/mascot/${theme}/cyra_eye_overlay.png`}
            alt=""
          />
        </span>
      ) : (
        <span
          key={state}
          role="img"
          aria-label={`Official Cyra dragon · ${state}`}
          style={
            {
              "--frames": sprite.frames,
              "--duration": `${sprite.frames / sprite.fps}s`,
              backgroundImage: `url(/assets/mascot/${theme}/${sprite.file})`,
              animationPlayState: active ? "running" : "paused",
            } as CSSProperties
          }
        />
      )}
    </button>
  );
}
