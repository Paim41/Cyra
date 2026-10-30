"use client";
import { useState } from "react";
import { Settings, ArrowLeft } from "lucide-react";
import { useDemo } from "./DemoState";
import { Segmented } from "@/components/ui/Segmented";
function Footer() {
  return (
    <footer className="product-footer">
      <div>
        Designed by Paim<small>Cyra for Windows</small>
      </div>
      <a
        href="https://github.com/Paim41/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Paim on GitHub"
      >
        <svg
          viewBox="0 0 24 24"
          width="17"
          height="17"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.6 9.6 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2" />
        </svg>
      </a>
      <a
        href="https://www.linkedin.com/in/paim41/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Paim on LinkedIn"
      >
        <svg
          viewBox="0 0 24 24"
          width="17"
          height="17"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4M2 9h4v13H2zm7 0h4v2c1-2 7-4 8 3v8h-4v-7c0-4-4-4-4 0v7H9z" />
        </svg>
      </a>
    </footer>
  );
}
export function SettingsPanel() {
  const d = useDemo(),
    [draft, setDraft] = useState(d.name),
    [preview, setPreview] = useState(0),
    [saved, setSaved] = useState(false);
  function toggle(key: keyof typeof d.preferences) {
    d.setPreferences((p) => ({ ...p, [key]: !p[key] }));
  }
  if (d.personalizing)
    return (
      <div className="personalization-panel">
        <div className="panel-heading">
          <h3>Personalization</h3>
          <button onClick={() => d.setPersonalizing(false)}>
            <ArrowLeft size={14} />
            Back
          </button>
        </div>
        <p>
          Choose a name Cyra can use to greet you.
          <br />
          Optional · up to 32 characters · change it anytime
        </p>
        <label className="name-field">
          Your name
          <input
            maxLength={32}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setSaved(false);
            }}
          />
        </label>
        <div className="setting">
          <span>Startup greeting</span>
          <button
            className="pill"
            title="Windows login is simulated in this browser"
            onClick={() =>
              d.setGreetingFrequency((d.greetingFrequency + 1) % 3)
            }
          >
            {
              ["Once per Windows login", "Every Cyra launch", "Off"][
                d.greetingFrequency
              ]
            }
          </button>
        </div>
        <button
          className="setting-toggle"
          role="switch"
          aria-checked={d.preferences.signature}
          onClick={() => toggle("signature")}
        >
          <i />
          Signature animation
        </button>
        <div
          key={preview}
          className={`signature-preview ${d.preferences.signature ? "" : "still"}`}
        >
          Welcome, {draft || "friend"}
        </div>
        <div className="personal-actions">
          <button className="pill" onClick={() => setPreview((n) => n + 1)}>
            Preview
          </button>
          <button
            className="pill"
            onClick={() => {
              d.setName(draft.trim());
              setSaved(true);
              d.setPersonalizing(false);
            }}
          >
            Save
          </button>
        </div>
        <p role="status" className="panel-note">
          {saved
            ? "Saved for this browser session."
            : "Greeting previews are simulated; no Windows login integration."}
        </p>
        <Footer />
      </div>
    );
  const prefs: [keyof typeof d.preferences, string][] = [
    ["visualizer", "Visualizer"],
    ["lyrics", "Lyrics"],
    ["prayer", "Prayer alerts"],
    ["weather", "Weather"],
    ["clipboard", "Clipboard"],
  ];
  return (
    <div className="settings-panel" data-size={d.size}>
      <button
        className="personalization-gear"
        aria-label="Personalization"
        onClick={() => {
          setDraft(d.name);
          d.setPersonalizing(true);
        }}
      >
        <Settings size={16} />
      </button>
      <div className="setting">
        <span>Appearance</span>
        <Segmented
          label="Panel appearance"
          options={["Dark", "Light"]}
          value={d.theme === "dark" ? "Dark" : "Light"}
          onChange={(v) => d.setTheme(v === "Dark" ? "dark" : "light")}
        />
      </div>
      <div className="setting">
        <span>Visibility</span>
        <Segmented
          label="Panel visibility"
          options={["Normal", "Edge line"]}
          value={d.edge ? "Edge line" : "Normal"}
          onChange={(v) => {
            d.setEdge(v === "Edge line");
          }}
        />
      </div>
      <div className="setting">
        <span>Open panel</span>
        <Segmented
          label="Open panel"
          options={["Hover", "Click"]}
          value={d.hoverOpen ? "Hover" : "Click"}
          onChange={(v) => d.setHoverOpen(v === "Hover")}
        />
      </div>
      <div className="setting">
        <span>Notch size</span>
        <Segmented
          label="Panel size"
          options={["S", "M", "L"]}
          value={d.size.toUpperCase()}
          onChange={(v) => d.setSize(v.toLowerCase() as "s" | "m" | "l")}
        />
      </div>
      <div className="setting">
        <span>Window mode</span>
        <Segmented
          label="Panel window mode"
          options={["Notch", "Floating"]}
          value={d.mode === "notch" ? "Notch" : "Floating"}
          onChange={(v) => d.setMode(v === "Notch" ? "notch" : "floating")}
        />
      </div>
      <div className="setting position-setting">
        <span>Position</span>
        <div>
          <button className="pill" onClick={() => d.setLocked(!d.locked)}>
            {d.locked ? "Unlock & move" : "Lock position"}
          </button>
          <button className="pill" onClick={() => d.setPosition(0)}>
            Reset to Center
          </button>
        </div>
      </div>
      <div className="settings-toggles">
        {prefs.map(([key, label]) => (
          <button
            key={key}
            className="setting-toggle"
            role="switch"
            aria-checked={d.preferences[key]}
            onClick={() => toggle(key)}
          >
            <i />
            {label}
          </button>
        ))}
        <button
          className="setting-toggle"
          role="switch"
          aria-checked={d.mascot}
          onClick={() => d.setMascot(!d.mascot)}
        >
          <i />
          Dragon
        </button>
        {(
          [
            ["notifications", "Notifications"],
            ["content", "Content"],
            ["allApps", "All apps"],
            ["edgeHint", "Edge hint"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            className="setting-toggle"
            role="switch"
            aria-checked={d.preferences[key]}
            onClick={() => toggle(key)}
          >
            <i />
            {label}
          </button>
        ))}
      </div>
      <button
        className="setting-toggle startup"
        role="switch"
        aria-checked={d.preferences.startup}
        onClick={() => toggle("startup")}
      >
        <i />
        Startup <small>(simulated)</small>
      </button>
      <button
        className="pill university-settings"
        onClick={() => {
          d.setEducation(1);
          d.setTab(6);
        }}
      >
        University settings
      </button>
      <Footer />
    </div>
  );
}
