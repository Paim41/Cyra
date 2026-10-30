"use client";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Trash2,
  Plus,
  Phone,
  Send,
  ShoppingBag,
} from "lucide-react";
import { useDemo } from "./DemoState";
import { Battery } from "./Battery";
import { tracks } from "@/lib/product";
function time(n: number) {
  return `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;
}
export function MusicPanel() {
  const d = useDemo(),
    t = tracks[d.track];
  return (
    <div className="music-panel">
      <div
        className={`album ${t.color}`}
        role="img"
        aria-label={`Original abstract artwork for ${t.title}`}
      >
        <i />
        <i />
        <i />
      </div>
      <div className="music-info">
        <h3>{t.title}</h3>
        <p>{t.artist}</p>
      </div>
      {d.preferences.lyrics && (
        <button
          className="pill lyrics-toggle"
          aria-pressed={d.lyrics}
          onClick={() => d.setLyrics(!d.lyrics)}
        >
          Lyrics
        </button>
      )}
      <div className="seek">
        <input
          aria-label="Track progress"
          type="range"
          min="0"
          max={t.duration}
          value={d.progress}
          onChange={(e) => d.setProgress(+e.target.value)}
        />
        <span>{time(d.progress)}</span>
        <span>−{time(t.duration - d.progress)}</span>
      </div>
      <div className="music-controls">
        <button
          aria-label="Previous track"
          onClick={() => {
            d.setTrack((d.track + 2) % 3);
            d.setProgress(0);
          }}
        >
          <SkipBack />
        </button>
        <button
          className="play-button"
          aria-label={d.playing ? "Pause music" : "Play music"}
          onClick={() => d.setPlaying(!d.playing)}
        >
          {d.playing ? (
            <Pause fill="currentColor" />
          ) : (
            <Play fill="currentColor" />
          )}
        </button>
        <button
          aria-label="Next track"
          onClick={() => {
            d.setTrack((d.track + 1) % 3);
            d.setProgress(0);
          }}
        >
          <SkipForward />
        </button>
      </div>
      {d.preferences.visualizer && (
        <div
          className={`music-spectrum ${d.playing ? "playing" : ""}`}
          aria-hidden="true"
        >
          {Array.from({ length: 32 }, (_, i) => (
            <i
              key={i}
              style={{
                height: 2 + ((i * 7) % 13),
                animationDelay: `${i * 0.04}s`,
              }}
            />
          ))}
        </div>
      )}
      {d.lyrics && d.preferences.lyrics && (
        <div className="lyrics">
          <p>The city slows, the colors stay.</p>
          <strong>A little room to find your way.</strong>
          <small>Original demo words · no audio</small>
        </div>
      )}
    </div>
  );
}
export function PomodoroPanel() {
  const d = useDemo(),
    modes = ["Focus", "Short break", "Long break"],
    index = modes.indexOf(d.focusMode),
    duration = d.durations[index] * 60;
  function mode(i: number) {
    d.setFocusMode(modes[i]);
    d.setFocusSeconds(d.durations[i] * 60);
    d.setFocusRunning(false);
  }
  function adjust(delta: number) {
    if (d.focusRunning) return;
    const next = Math.min(120, Math.max(1, d.durations[index] + delta));
    d.setDurations(d.durations.map((n, i) => (i === index ? next : n)));
    d.setFocusSeconds(next * 60);
  }
  return (
    <div className="focus-panel">
      <div
        className="timer-ring"
        role="spinbutton"
        tabIndex={0}
        aria-label="Timer duration in minutes"
        aria-valuemin={1}
        aria-valuemax={120}
        aria-valuenow={d.durations[index]}
        data-no-swipe
        onWheel={(e) => {
          if (!d.focusRunning) {
            e.stopPropagation();
            adjust(e.deltaY < 0 ? 1 : -1);
          }
        }}
        onKeyDown={(e) => {
          if (["ArrowUp", "ArrowDown"].includes(e.key)) {
            e.preventDefault();
            adjust(e.key === "ArrowUp" ? 1 : -1);
          }
        }}
        style={{
          background: `conic-gradient(#fa873e ${Math.max(0, d.focusSeconds / duration) * 360}deg,var(--product-line) 0)`,
        }}
      >
        <div>
          <strong>{time(d.focusSeconds)}</strong>
          <small>{d.focusMode === "Focus" ? "Focus" : d.focusMode}</small>
        </div>
      </div>
      <div className="focus-detail">
        <div className="focus-modes" role="group" aria-label="Timer mode">
          {modes.map((m, i) => (
            <button
              key={m}
              className="pill"
              aria-label={m}
              aria-pressed={index === i}
              onClick={() => mode(i)}
            >
              {["Focus", "Short", "Long"][i]} {d.durations[i]}
            </button>
          ))}
        </div>
        <div className="session-dots">
          <span aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <i key={i} className={i < d.sessions % 5 ? "done" : ""} />
            ))}
          </span>
          {d.sessions} sessions
        </div>
        <div className="center-actions">
          <button
            className="pill"
            aria-label={d.focusRunning ? "Pause timer" : "Start timer"}
            onClick={() => d.setFocusRunning(!d.focusRunning)}
          >
            {d.focusRunning ? "Pause" : "Start"}
          </button>
          <button
            className="pill"
            aria-label="Reset timer"
            onClick={() => {
              d.setFocusSeconds(duration);
              d.setFocusRunning(false);
            }}
          >
            <RotateCcw size={14} />
          </button>
          <button
            className="pill"
            aria-label="Skip session"
            onClick={() => {
              if (index === 0) d.setSessions((n) => n + 1);
              mode((index + 1) % 3);
            }}
          >
            <SkipForward size={14} />
          </button>
        </div>
      </div>
      <p className="panel-note">
        Scroll on ring or use ↑ ↓ to adjust duration · sample session
      </p>
    </div>
  );
}
export function PrayerPanel() {
  const d = useDemo();
  return (
    <div className="prayer-panel">
      <div className="prayer-date">
        <span>Rabu, 28 Okt · 17 Jamadilawal 1448H</span>
        {d.preferences.weather && <span>☂ Hujan · 25°</span>}
      </div>
      <div className="prayer-body">
        <div className="prayer-next">
          <h3>Subuh</h3>
          <strong>05:42</strong>
          <span>in 7 hours 6 minutes</span>
        </div>
        <div className="prayer-grid">
          {[
            ["Subuh", "05:42"],
            ["Syuruk", "06:53"],
            ["Zohor", "12:53"],
            ["Asar", "16:13"],
            ["Maghrib", "18:53"],
            ["Isyak", "20:03"],
          ].map(([n, t]) => (
            <div key={n} className={n === "Subuh" ? "next" : ""}>
              <span>{n}</span>
              <b>{t}</b>
            </div>
          ))}
        </div>
      </div>
      <div className="prayer-source">
        <span>JHR04</span>
        <span>JAKIM e-Solat · MYT · Open-Meteo</span>
      </div>
      <p className="panel-note">
        Illustrative schedule and weather · not live local readings.
      </p>
    </div>
  );
}
export function SystemPanel() {
  return (
    <div className="system-panel">
      <div className="system-body">
        <div className="gauges">
          {[
            ["CPU", 14, "#b290f5", "4.2 GHz"],
            ["RAM", 88, "#e1ab65", "14.0 / 15.8 GB"],
            ["Disk", 0, "#72c49e", "C: 58%"],
          ].map(([label, n, color, caption]) => (
            <div key={label}>
              <div
                className="gauge"
                style={{
                  background: `conic-gradient(${color} ${Number(n) * 3.6}deg,var(--product-line) 0)`,
                }}
              >
                <div>
                  <b>
                    {n}
                    <small>%</small>
                  </b>
                  <span>{label}</span>
                </div>
              </div>
              <small>{caption}</small>
            </div>
          ))}
        </div>
        <div className="network">
          <span>
            ↓ <b>0.1</b> KB/s
          </span>
          <span>
            ↑ <b>0.5</b> KB/s
          </span>
          <svg viewBox="0 0 120 26" aria-label="Illustrative network activity">
            <path
              d="M0 23 10 23 20 21 28 23 39 5 43 23 60 23 68 15 72 23 85 23 98 18 102 23 120 23"
              fill="none"
              stroke="#8aafff"
              strokeWidth="1"
            />
          </svg>
          <small>Last 60 seconds</small>
        </div>
      </div>
      <p className="system-battery">
        <Battery level={97} />
        97%
      </p>
      <p className="panel-note">Sample values · no hardware access.</p>
    </div>
  );
}
export function NotificationsPanel() {
  const d = useDemo();
  return (
    <div className="notification-panel">
      <div className="panel-heading">
        <span>Notifications · {d.notifications.length}</span>
        <button onClick={() => d.setNotifications([])}>Clear all</button>
      </div>
      {!d.preferences.notifications ? (
        <p className="empty-state">Notifications are off in demo Settings.</p>
      ) : (
        d.notifications.map((n) => (
          <div className="notification" key={n.id}>
            <span className="app-badge" style={{ color: n.color }}>
              {n.app === "WhatsApp" ? (
                <Phone size={25} />
              ) : n.app === "Telegram" ? (
                <Send size={25} />
              ) : (
                <ShoppingBag size={25} />
              )}
            </span>
            <div>
              <b>{n.app}</b>
              <p>
                {d.preferences.content ? n.body : "Notification content hidden"}
              </p>
            </div>
            <small>{n.time}</small>
            <button
              aria-label={`Dismiss ${n.app} notification`}
              onClick={() =>
                d.setNotifications(d.notifications.filter((v) => v.id !== n.id))
              }
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))
      )}
      {!d.notifications.length && (
        <p className="empty-state">All caught up. A little quieter now.</p>
      )}
      <button
        className="pill"
        disabled={!d.preferences.notifications}
        onClick={() => {
          d.setMascotMood("notification");
          d.setNotifications([
            ...d.notifications,
            {
              id: Date.now(),
              app: d.preferences.allApps ? "ShopeePay" : "Telegram",
              letter: "➤",
              color: d.preferences.allApps ? "#d74c24" : "#1685b6",
              body: "Your next chapter starts here 👋🏽 ✨",
              time: "now",
            },
          ]);
        }}
      >
        <Plus size={14} />
        Simulate notification
      </button>
    </div>
  );
}
export function ClipboardPanel() {
  const d = useDemo();
  return (
    <div className="clipboard-panel">
      <div className="panel-heading">
        <span>Clipboard · {d.clipboard.length}</span>
        <button
          onClick={() => {
            d.setClipboard([]);
            d.setSelectedClip(null);
          }}
        >
          Clear all
        </button>
      </div>
      {!d.preferences.clipboard ? (
        <p className="empty-state">Clipboard is off in demo Settings.</p>
      ) : (
        d.clipboard.map((c) => (
          <div className="clip-item" key={c.id}>
            <button
              className="clipboard-row"
              aria-pressed={d.selectedClip === c.id}
              onClick={() => d.setSelectedClip(c.id)}
            >
              <span className={`clip-thumb clip-${c.id}`} aria-hidden="true" />
              <span>{c.text}</span>
              <small>now</small>
            </button>
            <button
              aria-label={`Dismiss ${c.text}`}
              onClick={() => {
                d.setClipboard(d.clipboard.filter((v) => v.id !== c.id));
                if (d.selectedClip === c.id) d.setSelectedClip(null);
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))
      )}
      <p className="panel-note" role="status">
        {d.selectedClip ? "Sample selected. " : ""}Illustrative history · your
        clipboard is never read.
      </p>
    </div>
  );
}
