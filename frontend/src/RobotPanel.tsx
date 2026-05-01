import { useState } from "react";
import { useRobot } from "@robot/useRobot";
import type { Ceil, GameStatus } from "@minesweeper/Minesweeper/index";

interface Props {
  ceils: Ceil[];
  columns: number;
  rows: number;
  status: GameStatus;
  openCeil: (index: number) => void;
  changeCeilState: (index: number) => void;
}

export default function RobotPanel({
  ceils,
  columns,
  rows,
  status,
  openCeil,
  changeCeilState,
}: Props) {
  const [intervalMs, setIntervalMs] = useState(500);
  const { running, start, pause, step } = useRobot({
    ceils,
    columns,
    rows,
    status,
    openCeil,
    changeCeilState,
    intervalMs,
  });

  const statusLabel =
    status === "won"
      ? "Won"
      : status === "died"
        ? "Died"
        : running
          ? "Running"
          : "Paused";

  return (
    <div className="robot-panel">
      <div className="robot-panel__title">Robot</div>
      <div className="robot-panel__controls">
        <button
          className="robot-panel__btn"
          onClick={running ? pause : start}
          disabled={status === "won" || status === "died"}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          className="robot-panel__btn"
          onClick={step}
          disabled={running || status === "won" || status === "died"}
        >
          Step
        </button>
      </div>
      <div className="robot-panel__speed">
        <label className="robot-panel__speed-label">
          Speed
          <input
            type="range"
            min={50}
            max={2000}
            step={50}
            value={intervalMs}
            onChange={(e) => setIntervalMs(Number(e.target.value))}
            className="robot-panel__slider"
          />
          <span className="robot-panel__speed-value">{intervalMs}ms</span>
        </label>
      </div>
      <div className="robot-panel__status">{statusLabel}</div>
    </div>
  );
}
