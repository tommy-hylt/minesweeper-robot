import { useCallback, useEffect, useRef, useState } from "react";
import type { Ceil, GameStatus, Move } from "./types";
import { pickMove } from "./robot";

interface Options {
  ceils: Ceil[];
  columns: number;
  rows: number;
  status: GameStatus;
  openCeil: (index: number) => void;
  changeCeilState: (index: number) => void;
  intervalMs?: number;
  onMove?: (move: Move) => void;
}

interface RobotControls {
  running: boolean;
  start: () => void;
  pause: () => void;
  step: () => void;
}

export function useRobot({
  ceils,
  columns,
  rows,
  status,
  openCeil,
  changeCeilState,
  intervalMs = 500,
  onMove,
}: Options): RobotControls {
  const [running, setRunning] = useState(false);

  const ceilsRef = useRef(ceils);
  const statusRef = useRef(status);
  const openCeilRef = useRef(openCeil);
  const changeCeilStateRef = useRef(changeCeilState);
  const onMoveRef = useRef(onMove);

  useEffect(() => { ceilsRef.current = ceils; }, [ceils]);
  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { openCeilRef.current = openCeil; }, [openCeil]);
  useEffect(() => { changeCeilStateRef.current = changeCeilState; }, [changeCeilState]);
  useEffect(() => { onMoveRef.current = onMove; }, [onMove]);

  useEffect(() => {
    if (status === "won" || status === "died") {
      setRunning(false);
    }
  }, [status]);

  const executeStep = useCallback(() => {
    const currentStatus = statusRef.current;
    if (currentStatus === "won" || currentStatus === "died") return;

    const move = pickMove(ceilsRef.current, columns, rows);
    if (!move) return;

    onMoveRef.current?.(move);

    if (move.action === "flag") {
      changeCeilStateRef.current(move.index);
    } else {
      openCeilRef.current(move.index);
    }
  }, [columns, rows]);

  useEffect(() => {
    if (!running) return;

    const clampedInterval = Math.max(50, intervalMs);
    const timer = setInterval(executeStep, clampedInterval);
    return () => clearInterval(timer);
  }, [running, intervalMs, executeStep]);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const step = useCallback(() => {
    setRunning(false);
    executeStep();
  }, [executeStep]);

  return { running, start, pause, step };
}
