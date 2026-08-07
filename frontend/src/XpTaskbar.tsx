import { useEffect, useRef, useState } from "react";
import XpStartMenu from "./XpStartMenu";

export interface TaskbarWindow {
  id: string;
  title: string;
  icon: string;
}

interface Props {
  openWindows: TaskbarWindow[];
  activeWindow: string;
  onSelectWindow: (id: string) => void;
  onReadMe: () => void;
  onOpenMyDocuments: () => void;
  onOpenMyComputer: () => void;
  onLogOff: () => void;
  onTurnOff: () => void;
}

export default function XpTaskbar({
  openWindows,
  activeWindow,
  onSelectWindow,
  onReadMe,
  onOpenMyDocuments,
  onOpenMyComputer,
  onLogOff,
  onTurnOff,
}: Props) {
  const [time, setTime] = useState(() => new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onClickAway = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setMenuOpen(false);
    };
    window.addEventListener("mousedown", onClickAway);
    return () => window.removeEventListener("mousedown", onClickAway);
  }, [menuOpen]);

  const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="xp-taskbar" ref={rootRef}>
      {menuOpen && (
        <XpStartMenu
          onReadMe={() => {
            setMenuOpen(false);
            onReadMe();
          }}
          onOpenMyDocuments={() => {
            setMenuOpen(false);
            onOpenMyDocuments();
          }}
          onOpenMyComputer={() => {
            setMenuOpen(false);
            onOpenMyComputer();
          }}
          onLogOff={() => {
            setMenuOpen(false);
            onLogOff();
          }}
          onTurnOff={() => {
            setMenuOpen(false);
            onTurnOff();
          }}
        />
      )}

      <button
        className={`xp-taskbar__start${menuOpen ? " xp-taskbar__start--active" : ""}`}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="xp-taskbar__start-logo">
          <span style={{ background: "#f83030" }} />
          <span style={{ background: "#30c030" }} />
          <span style={{ background: "#3030f8" }} />
          <span style={{ background: "#f8c800" }} />
        </span>
        <span className="xp-taskbar__start-text">start</span>
      </button>

      <div className="xp-taskbar__divider" />

      <div className="xp-taskbar__windows">
        {openWindows.map((w) => (
          <button
            key={w.id}
            className={`xp-taskbar__win-btn${activeWindow === w.id ? " xp-taskbar__win-btn--active" : ""}`}
            onClick={() => onSelectWindow(w.id)}
          >
            <span className="xp-taskbar__win-icon">{w.icon}</span>
            {w.title}
          </button>
        ))}
      </div>

      <div className="xp-taskbar__tray">
        <span className="xp-taskbar__tray-icon" title="Volume">🔊</span>
        <span className="xp-taskbar__tray-icon" title="Network">🌐</span>
        <div className="xp-taskbar__clock">{timeStr}</div>
      </div>
    </div>
  );
}
