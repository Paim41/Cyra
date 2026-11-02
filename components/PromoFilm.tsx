"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
export function PromoFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const previousTime = useRef(0);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    let visible = false,
      disposed = false,
      blocked = false;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const allowed = () =>
      !disposed && visible && !document.hidden && !motion.matches && !blocked;
    const sync = () => {
      if (!allowed()) {
        el.pause();
        if (motion.matches) setStarted(false);
        return;
      }
      void el
        .play()
        .then(() => {
          if (!allowed()) el.pause();
          else setStarted(true);
        })
        .catch((error: unknown) => {
          // A visibility-driven pause may abort an outstanding play request.
          // This is transient, not an autoplay permission failure.
          if (error instanceof DOMException && error.name === "AbortError")
            return;
          blocked = true;
          setStarted(false);
        });
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.6;
        sync();
      },
      { threshold: [0, 0.6] },
    );
    observer.observe(el);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      el.pause();
    };
  }, []);
  return (
    <section className="hero-film" id="film" aria-label="Cyra in motion">
      <div className="section-kicker">
        <span>CYRA IN MOTION</span>
      </div>
      <div className="film-stage">
        <video
          ref={video}
          width={1920}
          height={1080}
          muted
          loop
          playsInline
          preload="none"
          poster="/assets/promo/cyra-promo-poster.jpg"
          src="/assets/promo/cyra-promo-web-teaser.mp4"
          aria-label="Cyra promotional film"
          aria-describedby="film-description"
          onTimeUpdate={(event) => {
            const el = event.currentTarget;
            if (
              previousTime.current > el.duration - 0.7 &&
              el.currentTime < 0.7 &&
              !matchMedia("(prefers-reduced-motion: reduce)").matches
            ) {
              el.animate([{ opacity: 0.65 }, { opacity: 1 }], {
                duration: 220,
                easing: "ease-out",
              });
            }
            previousTime.current = el.currentTime;
          }}
          onError={() => {
            setFailed(true);
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
      {failed && (
        <p className="film-error" role="status">
          The film is unavailable. The official Cyra poster is shown instead.
        </p>
      )}
      <p className="sr-only" id="film-description">
        Silent Cyra promotional animation. A compact notch expands to show music
        controls, File Tools and university shortcuts. Dark and Light settings
        follow. Titles read: Meet Cyra. Your music. Within reach. Work smarter.
        Study easier. Make it yours. Cyra: Your desktop, reimagined.
      </p>
    </section>
  );
}
