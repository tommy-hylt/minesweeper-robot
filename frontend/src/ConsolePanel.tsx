import { useEffect, useRef, useState } from "react";
import type { Ceil, Difficulty, GameStatus } from "@minesweeper/Minesweeper/types";
import type { Move } from "@robot/types";
import { useRobot } from "@robot/useRobot";

interface Props {
  ceils: Ceil[];
  columns: number;
  rows: number;
  status: GameStatus;
  openCeil: (index: number) => void;
  changeCeilState: (index: number) => void;
  onReset: (d?: Difficulty) => void;
  onReady?: () => void;
}

export default function ConsolePanel({
  ceils,
  columns,
  rows,
  status,
  openCeil,
  changeCeilState,
  onReset,
  onReady,
}: Props) {
  const [log, setLog] = useState<string[]>(["Robot Console ready."]);
  const logRef = useRef<HTMLDivElement>(null);
  const prevStatus = useRef<GameStatus>(status);
  const currentStatusRef = useRef<GameStatus>(status);
  const lastCertainMoveRef = useRef<Move | null>(null);

  // Keep currentStatusRef in sync so persistent handlers read the latest status
  useEffect(() => { currentStatusRef.current = status; }, [status]);

  const onMove = (move: Move) => {
    const col = move.index % columns;
    const row = Math.floor(move.index / columns);
    const action = move.action === "flag" ? "Flag" : "Open";
    const suffix = move.confidence >= 1
      ? " 100% certainty"
      : ` ${Math.round(move.confidence * 100)}% guess`;
    lastCertainMoveRef.current = move.confidence >= 1 ? move : null;
    addLog(`[${move.strategy}] ${action} (${col}, ${row})${suffix}`);
  };

  const { start, pause } = useRobot({
    ceils,
    columns,
    rows,
    status,
    openCeil,
    changeCeilState,
    intervalMs: 10,
    onMove,
  });

  const addLog = (msg: string) =>
    setLog(prev => [...prev, msg]);

  const startCountdown = () => {
    addLog("Starting...");
    onReady?.();
    start();
  };

  // Mount-only effect: start countdown + register persistent Enter listener.
  // The persistent listener avoids the React Strict Mode bug where the per-win
  // addEventListener is added in run-1, removed by cleanup, then skipped in
  // run-2 because prevStatus.current already equals 'won'.
  useEffect(() => {
    startCountdown();

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && currentStatusRef.current === "won") {
        onReset();
        startCountdown();
      }
    };
    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to status changes: log outcomes, auto-reset on died
  useEffect(() => {
    const prev = prevStatus.current;
    prevStatus.current = status;

    if (prev === status) return;

    if (status === "died" && (prev === "started" || prev === "new")) {
      const bad = lastCertainMoveRef.current;
      if (bad) {
        const col = bad.index % columns;
        const row = Math.floor(bad.index / columns);
        const action = bad.action === "flag" ? "Flag" : "Open";
        addLog(`⚠ DIED on 100% certainty: [${bad.strategy}] ${action} (${col}, ${row})`);
      }
      addLog("Game over. Restarting in 1s...");
      const t = setTimeout(() => {
        onReset();
        startCountdown();
      }, 1000);
      return () => clearTimeout(t);
    }

    if (status === "won" && (prev === "started" || prev === "new")) {
      pause();
      addLog("You won! \uD83C\uDF89  Press Enter for another round.");
      // Enter handling is done by the persistent listener above — no addEventListener here
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Auto-scroll log to bottom
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  return (
    <div style={{ fontFamily: "'Consolas', 'Lucida Console', 'Courier New', monospace" }}>
      <div
        ref={logRef}
        style={{
          background: "#000",
          color: "#00ff00",
          fontFamily: "'Consolas', 'Lucida Console', 'Courier New', monospace",
          fontSize: 13,
          lineHeight: "1.5",
          padding: "6px 8px",
          width: "120ch",
          height: "calc(24 * 1.5em)",
          overflowY: "auto",
          boxSizing: "border-box",
          border: "1px inset #333",
        }}
      >
        {log.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}
