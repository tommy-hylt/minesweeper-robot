import { type ReactNode, useEffect, useRef, useState } from "react";

interface Props {
  title: string;
  children: ReactNode;
  initialX?: number;
  initialY?: number;
  variant?: "default" | "console";
  controls?: "all" | "close-only";
  zIndex?: number;
  onFocus?: () => void;
}

export default function XpWindow({
  title,
  children,
  initialX = 0,
  initialY = 0,
  variant = "default",
  controls = "all",
  zIndex,
  onFocus,
}: Props) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const offset = useRef({ ox: 0, oy: 0 });
  const dragging = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({ x: e.clientX - offset.current.ox, y: e.clientY - offset.current.oy });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const onRootMouseDown = (e: React.MouseEvent) => {
    onFocus?.();
    // Don't interfere with titlebar or button handlers
    const target = e.target as HTMLElement;
    if (target.closest(".xp-window__titlebar")) return;
  };

  const onTitlebarMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    offset.current = { ox: e.clientX - pos.x, oy: e.clientY - pos.y };
  };

  return (
    <div
      className={`xp-window${variant === "console" ? " xp-window--console" : ""}`}
      style={{ position: "absolute", left: pos.x, top: pos.y, zIndex }}
      onMouseDown={onRootMouseDown}
    >
      <div
        className="xp-window__titlebar"
        onMouseDown={onTitlebarMouseDown}
        style={{ cursor: "move" }}
      >
        <span className="xp-window__title">{title}</span>
        <div className="xp-window__controls">
          {controls === "all" && <>
            <button
              className="xp-window__btn xp-window__btn--min"
              aria-label="Minimize"
              onMouseDown={e => e.stopPropagation()}
            >_</button>
            <button
              className="xp-window__btn xp-window__btn--max"
              aria-label="Maximize"
              onMouseDown={e => e.stopPropagation()}
            >□</button>
          </>}
          <button
            className="xp-window__btn xp-window__btn--close"
            aria-label="Close"
            onMouseDown={e => e.stopPropagation()}
          >✕</button>
        </div>
      </div>
      <div className="xp-window__body">{children}</div>
    </div>
  );
}
