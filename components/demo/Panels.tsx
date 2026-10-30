"use client";
import { useState } from "react";
import {
  Plus,
  Trash2,
  Star,
  Folder,
  ArrowLeft,
  Settings,
} from "lucide-react";
import {
  MusicPanel,
  PomodoroPanel,
  PrayerPanel,
  SystemPanel,
  NotificationsPanel,
  ClipboardPanel,
} from "./CorePanels";
import { SettingsPanel } from "./SettingsPanel";
import { useDemo } from "./DemoState";
import { Segmented } from "@/components/ui/Segmented";
import { fileTools, safeUrl } from "@/lib/product";
import catalog from "@/data/universities.json";
const universities = catalog.universities.filter((u) =>
  [
    "uthm",
    "um",
    "utm",
    "uitm",
    "ukm",
    "upm",
    "monash-malaysia",
    "sunway",
  ].includes(u.id),
);
export function EducationPanel() {
  const d = useDemo(),
    [query, setQuery] = useState(""),
    [choosing, setChoosing] = useState(false),
    [adding, setAdding] = useState(false),
    [editing, setEditing] = useState<string | null>(null),
    [draft, setDraft] = useState({ name: "", url: "https://" }),
    [error, setError] = useState("");
  const {
    setMascotMood,
    tool,
    setTool,
    toolStatus: status,
    setToolStatus: setStatus,
    demoFile: file,
    setDemoFile: setFile,
  } = d;
  const u = universities.find((u) => u.id === d.university) || universities[0];
  const portals = [
    {
      id: "learning",
      name: u.learning_access.label,
      url: u.learning_access.url,
      favorite: false,
    },
    ...(u.other_shortcuts || []).map((l, i) => ({
      id: `portal-${i}`,
      name: l.label,
      url: l.url,
      favorite: false,
    })),
    ...d.custom,
  ].sort(
    (a, b) =>
      Number(d.favorites.includes(b.url)) - Number(d.favorites.includes(a.url)),
  );
  return (
    <div className="education-panel">
      <Segmented
        label="Education subsection"
        options={["File Tools", "University"]}
        value={d.education ? "University" : "File Tools"}
        onChange={(v) => d.setEducation(v === "University" ? 1 : 0)}
      />
      {!d.education ? (
        <>
          {tool === null ? (
            <>
              <h3>File Tools</h3>
              <p className="panel-note">Private, local processing</p>
              <div className="tools-grid">
                {fileTools.map((name, i) => (
                  <button
                    className="pill"
                    key={name}
                    onClick={() => {
                      setTool(i);
                      setStatus("ready");
                    }}
                  >
                    <Folder size={16} />
                    {name}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="panel-heading">
                <h3>{fileTools[tool]}</h3>
                <button onClick={() => setTool(null)}>
                  <ArrowLeft size={15} />
                  All tools
                </button>
              </div>
              <label
                className="file-drop"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files[0])
                    setFile(e.dataTransfer.files[0].name);
                }}
              >
                <Folder />
                <span>{file}</span>
                <small>Choose a file name for this demo</small>
                <input
                  aria-label="Choose demo file"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setFile(e.target.files[0].name);
                  }}
                />
              </label>
              <p className="panel-note">
                No file is uploaded or converted. This previews the desktop
                workflow.
              </p>
              <button
                className="pill accent"
                disabled={status === "working"}
                onClick={() => {
                  setStatus("working");
                  setMascotMood("working");
                }}
              >
                {status === "working" ? "Simulating…" : "Preview processing"}
              </button>
              {status === "working" && (
                <button
                  className="pill"
                  onClick={() => {
                    setStatus("ready");
                    setMascotMood("idle");
                  }}
                >
                  Cancel
                </button>
              )}
              {status === "done" && (
                <p role="status" className="success">
                  Demo complete. Install Cyra to process your files.
                </p>
              )}
            </>
          )}
          <p className="panel-note">
            Drop files to begin · simulated browser workflow
          </p>
        </>
      ) : (
        <>
          <div className="panel-heading">
            <h3>University · {u.abbreviation}</h3>
            <button
              aria-label="Change"
              onClick={() => setChoosing(!choosing)}
              aria-expanded={choosing}
            >
              <Settings size={16} />
            </button>
          </div>
          {choosing ? (
            <div className="university-picker">
              <label>
                Search universities
                <input
                  placeholder="Name or abbreviation"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <div className="university-results">
                {universities
                  .filter((v) =>
                    (v.name + v.abbreviation)
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                  )
                  .map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        d.setUniversity(v.id);
                        setChoosing(false);
                      }}
                    >
                      {v.abbreviation}
                      <small>{v.name}</small>
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            <>
              <button
                className="pill"
                onClick={() => {
                  setEditing(null);
                  setDraft({ name: "", url: "https://" });
                  setAdding(!adding);
                }}
                aria-expanded={adding}
              >
                <Plus size={15} />
                Add shortcut
              </button>
              {adding && (
                <form
                  className="shortcut-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!draft.name.trim() || !safeUrl(draft.url)) {
                      setError("Enter a name and a valid HTTP/HTTPS URL.");
                      return;
                    }
                    d.setCustom(
                      editing
                        ? d.custom.map((c) =>
                            c.id === editing ? { ...c, ...draft } : c,
                          )
                        : [
                            ...d.custom,
                            {
                              ...draft,
                              id: `custom-${Date.now()}`,
                              favorite: false,
                            },
                          ],
                    );
                    setEditing(null);
                    setAdding(false);
                    setDraft({ name: "", url: "https://" });
                    setError("");
                  }}
                >
                  <label>
                    Shortcut name
                    <input
                      maxLength={60}
                      value={draft.name}
                      onChange={(e) =>
                        setDraft({ ...draft, name: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Website URL
                    <input
                      value={draft.url}
                      onChange={(e) =>
                        setDraft({ ...draft, url: e.target.value })
                      }
                    />
                  </label>
                  <p role="alert">{error}</p>
                  <button className="pill accent" type="submit">
                    Save shortcut
                  </button>
                </form>
              )}
              <div className="portal-list">
                {portals.map((p) => (
                  <div className="portal" key={p.id}>
                    <div>
                      <b>{p.name}</b>
                      <small>
                        {p.url.includes("author.")
                          ? "Learning materials, assignments and quizzes"
                          : p.url.includes("smap.")
                            ? "Academic portal and attendance"
                            : p.id === "learning" &&
                                u.learning_access.kind.includes("guidance")
                              ? "Official guide — not a direct login"
                              : "University portal / custom shortcut"}
                      </small>
                    </div>
                    <button
                      aria-label={`Favorite ${p.name}`}
                      aria-pressed={d.favorites.includes(p.url)}
                      onClick={() =>
                        d.setFavorites(
                          d.favorites.includes(p.url)
                            ? d.favorites.filter((f) => f !== p.url)
                            : [...d.favorites, p.url],
                        )
                      }
                    >
                      <Star
                        size={16}
                        fill={
                          d.favorites.includes(p.url) ? "currentColor" : "none"
                        }
                      />
                    </button>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${p.name}`}
                    >
                      Open
                    </a>
                    {p.id.startsWith("custom-") && (
                      <button
                        aria-label={`Edit ${p.name}`}
                        onClick={() => {
                          setEditing(p.id);
                          setDraft({ name: p.name, url: p.url });
                          setAdding(true);
                        }}
                      >
                        Edit
                      </button>
                    )}
                    {p.id.startsWith("custom-") && (
                      <button
                        aria-label={`Delete ${p.name}`}
                        onClick={() =>
                          d.setCustom(d.custom.filter((c) => c.id !== p.id))
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
          <p className="panel-note">
            Curated browser demo. Changes stay in this session.
          </p>
        </>
      )}
    </div>
  );
}
export function Panel({ tab }: { tab: number }) {
  return tab === 0 ? (
    <MusicPanel />
  ) : tab === 1 ? (
    <PomodoroPanel />
  ) : tab === 2 ? (
    <PrayerPanel />
  ) : tab === 3 ? (
    <SystemPanel />
  ) : tab === 4 ? (
    <NotificationsPanel />
  ) : tab === 5 ? (
    <ClipboardPanel />
  ) : tab === 6 ? (
    <EducationPanel />
  ) : (
    <SettingsPanel />
  );
}
