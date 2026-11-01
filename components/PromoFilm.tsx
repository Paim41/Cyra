"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause, RotateCcw } from "lucide-react";

export function PromoFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const policy = useRef({
    inView: false,
    reduced: true,
    intent: "auto",
    ended: false,
    blocked: false,
    disposed: false,
  });
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const allowed = useCallback(() => {
    const p = policy.current;
    return (
      !p.disposed &&
      p.inView &&
      !document.hidden &&
      !p.ended &&
      p.intent !== "pause" &&
      (p.intent === "play" || (!p.reduced && !p.blocked))
    );
  }, []);
  const syncPlayback = useCallback(async () => {
    const el = video.current;
    if (!el) return;
    if (!allowed()) {
      el.pause();
      return;
    }
    try {
      await el.play();
      // A visibility change or manual pause may happen while play() is pending.
      if (!allowed()) el.pause();
    } catch {
      policy.current.blocked = true;
      setBlocked(true);
      setPlaying(false);
    }
  }, [allowed]);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const p = policy.current;
    p.disposed = false;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    p.reduced = preference.matches;
    const observer = new IntersectionObserver(
      ([entry]) => {
        p.inView = entry.isIntersecting && entry.intersectionRatio >= 0.6;
        void syncPlayback();
      },
      { threshold: [0, 0.6] },
    );
    observer.observe(el);
    const visibility = () => {
      void syncPlayback();
    };
    const motion = () => {
      p.reduced = preference.matches;
      if (p.reduced) p.intent = "pause";
      void syncPlayback();
    };
    document.addEventListener("visibilitychange", visibility);
    preference.addEventListener("change", motion);
    return () => {
      p.disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      preference.removeEventListener("change", motion);
      el.pause();
    };
  }, [syncPlayback]);
  function toggle() {
    const el = video.current;
    if (!el) return;
    if (playing) {
      policy.current.intent = "pause";
      el.pause();
      return;
    }
    if (ended) el.currentTime = 0;
    if (failed) {
      el.load();
      setFailed(false);
    }
    policy.current.intent = "play";
    policy.current.ended = false;
    policy.current.blocked = false;
    setBlocked(false);
    setEnded(false);
    void syncPlayback();
  }
  return (
    <section className="hero-film" id="film" aria-label="Cyra in motion">
      <div className="section-kicker">
        <span>CYRA IN MOTION</span>
        <span>12 SECONDS. A LITTLE MORE CYRA.</span>
      </div>
      <div className="film-stage">
        <video
          ref={video}
          width={1920}
          height={1080}
          muted
          playsInline
          preload="none"
          poster="/assets/promo/cyra-promo-poster.jpg"
          src="/assets/promo/cyra-promo-web-teaser.mp4"
          aria-label="Cyra promotional film"
          aria-describedby="film-description"
          onPlaying={() => {
            if (!allowed()) {
              video.current?.pause();
              return;
            }
            setPlaying(true);
            setStarted(true);
          }}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            policy.current.ended = true;
            setEnded(true);
            setPlaying(false);
          }}
          onError={() => {
            policy.current.blocked = true;
            policy.current.intent = "pause";
            setFailed(true);
            setPlaying(false);
            setStarted(false);
          }}
        />
        {!started && (
          <Image
            className="film-poster"
            src="/assets/promo/cyra-promo-poster.jpg"
            alt=""
            fill
            sizes="(max-width: 700px) 94vw, (max-width: 1300px) 92vw, 1200px"
            preload
          />
        )}
      </div>
      <div className="film-controls">
        <p>
          {failed
            ? "Film unavailable. You can try again."
            : blocked
              ? "Press Play to watch."
              : "A little space. In motion."}
        </p>
        <button
          type="button"
          className="button small film-toggle"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={
            ended
              ? "Replay Cyra film"
              : playing
                ? "Pause Cyra film"
                : failed
                  ? "Try again: play Cyra film"
                  : "Play Cyra film"
          }
        >
          {ended ? (
            <RotateCcw size={16} aria-hidden="true" />
          ) : playing ? (
            <Pause size={16} aria-hidden="true" />
          ) : (
            <Play size={16} aria-hidden="true" />
          )}
          {ended ? "Replay" : playing ? "Pause" : failed ? "Try again" : "Play"}
        </button>
      </div>
      <p className="sr-only" id="film-description">
        Silent Cyra promotional animation. A compact notch expands to show music
        controls, File Tools and university shortcuts. Dark and Light settings
        follow. Titles read: Meet Cyra. Your music. Within reach. Work smarter.
        Study easier. Make it yours. Cyra: Your desktop, reimagined.
      </p>
    </section>
  );
}
