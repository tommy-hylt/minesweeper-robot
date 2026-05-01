import { useEffect, useState } from "react";

export default function XpTaskbar() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="xp-taskbar">
      <button className="xp-taskbar__start">
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
        <button className="xp-taskbar__win-btn">
          <span className="xp-taskbar__win-icon">💣</span>
          Minesweeper
        </button>
        <button className="xp-taskbar__win-btn">
          <span className="xp-taskbar__win-icon">🤖</span>
          Robot Console
        </button>
      </div>

      <div className="xp-taskbar__tray">
        <span className="xp-taskbar__tray-icon" title="Volume">🔊</span>
        <span className="xp-taskbar__tray-icon" title="Network">🌐</span>
        <div className="xp-taskbar__clock">{timeStr}</div>
      </div>
    </div>
  );
}
