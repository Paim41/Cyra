"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  sampleNotifications,
  tracks,
  type Theme,
  type Mode,
  type Size,
} from "@/lib/product";
export type Shortcut = {
  id: string;
  name: string;
  url: string;
  favorite: boolean;
};
function useDemoState() {
  const [tool, setTool] = useState<number | null>(null);
  const [toolStatus, setToolStatus] = useState<"ready" | "working" | "done">(
    "ready",
  );
  const [demoFile, setDemoFile] = useState("Course notes.pdf");
  const [greetingFrequency, setGreetingFrequency] = useState(0);
  const [activity, setActivity] = useState<Record<string, boolean>>({});
  const [personalizing, setPersonalizing] = useState(false);
  const [preferences, setPreferences] = useState({
    visualizer: true,
    lyrics: true,
    prayer: true,
    weather: true,
    clipboard: true,
    notifications: true,
    content: true,
    allApps: false,
    edgeHint: true,
    startup: false,
    signature: true,
  });
  const [clipboard, setClipboard] = useState(
    [1, 2, 3, 4].map((id) => ({
      id,
      text: `Image ${[464, 487, 510, 493][id - 1]} × ${[290, 267, 242, 410][id - 1]}`,
    })),
  );
  const [selectedClip, setSelectedClip] = useState<number | null>(null);
  const [durations, setDurations] = useState([20, 20, 15]);
  const [sessions, setSessions] = useState(0);
  const [mascotMood, setMascotMood] = useState<
    "idle" | "notification" | "working"
  >("idle");
  const [theme, setTheme] = useState<Theme>("dark"),
    [mode, setMode] = useState<Mode>("notch"),
    [size, setSize] = useState<Size>("m");
  const [expanded, setExpanded] = useState(false),
    [edge, setEdge] = useState(false),
    [tab, setTab] = useState(0),
    [locked, setLocked] = useState(true),
    [position, setPosition] = useState(0),
    [name, setName] = useState("Paim");
  const [track, setTrack] = useState(0),
    [playing, setPlaying] = useState(false),
    [progress, setProgress] = useState(36),
    [lyrics, setLyrics] = useState(false);
  const [notifications, setNotifications] = useState(sampleNotifications),
    [education, setEducation] = useState(0),
    [university, setUniversity] = useState("uthm"),
    [custom, setCustom] = useState<Shortcut[]>([]),
    [favorites, setFavorites] = useState<string[]>([]);
  const [focusSeconds, setFocusSeconds] = useState(1200),
    [focusRunning, setFocusRunning] = useState(false),
    [focusMode, setFocusMode] = useState("Focus");
  const [mascot, setMascot] = useState(true),
    [hoverOpen, setHoverOpen] = useState(true);
  const active = Object.values(activity).some(Boolean);
  useEffect(() => {
    if (mascotMood !== "notification") return;
    const timer = setTimeout(
      () => setMascotMood((m) => (m === "notification" ? "idle" : m)),
      800,
    );
    return () => clearTimeout(timer);
  }, [mascotMood]);
  useEffect(() => {
    if (toolStatus !== "working") return;
    const timer = setTimeout(() => {
      setToolStatus("done");
      setMascotMood("idle");
    }, 1500);
    return () => clearTimeout(timer);
  }, [toolStatus]);
  useEffect(() => {
    if (!active || (!playing && !focusRunning)) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      if (playing) setProgress((p) => (p + 1) % tracks[track].duration);
      if (focusRunning) {
        setFocusSeconds((n) => Math.max(0, n - 1));
        if (focusSeconds <= 1) {
          setFocusRunning(false);
          if (focusMode === "Focus") setSessions((n) => n + 1);
        }
      }
    }, 1000);
    return () => clearInterval(id);
  }, [active, playing, focusRunning, track, focusSeconds, focusMode]);
  return {
    tool,
    setTool,
    toolStatus,
    setToolStatus,
    demoFile,
    setDemoFile,
    greetingFrequency,
    setGreetingFrequency,
    setActivity,
    personalizing,
    setPersonalizing,
    preferences,
    setPreferences,
    clipboard,
    setClipboard,
    selectedClip,
    setSelectedClip,
    durations,
    setDurations,
    sessions,
    setSessions,
    mascotMood,
    setMascotMood,
    theme,
    setTheme,
    mode,
    setMode,
    size,
    setSize,
    expanded,
    setExpanded,
    edge,
    setEdge,
    tab,
    setTab,
    locked,
    setLocked,
    position,
    setPosition,
    name,
    setName,
    track,
    setTrack,
    playing,
    setPlaying,
    progress,
    setProgress,
    lyrics,
    setLyrics,
    notifications,
    setNotifications,
    education,
    setEducation,
    university,
    setUniversity,
    custom,
    setCustom,
    favorites,
    setFavorites,
    focusSeconds,
    setFocusSeconds,
    focusRunning,
    setFocusRunning,
    focusMode,
    setFocusMode,
    mascot,
    setMascot,
    hoverOpen,
    setHoverOpen,
  };
}
type DemoState = ReturnType<typeof useDemoState>;
const Context = createContext<DemoState | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const state = useDemoState();
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
export function useDemo() {
  const value = useContext(Context);
  if (!value) throw new Error("DemoProvider missing");
  return value;
}
